import { describe, expect, it, beforeEach } from "vitest";
import { users, ORG_ID, calls, deals } from "@/lib/demo/seed";
import {
  getCallById,
  getOverviewKpis,
  getVisibleCalls,
  getVisibleCoaching,
  getVisibleDeals,
  type AccessContext,
} from "@/lib/demo/queries";
import { can } from "@/lib/demo/rbac";
import { createCoaching, listCoaching } from "@/lib/demo/operations";
import { assertSeedCoherent, validateSeedCoherence } from "@/lib/demo/coherence";
import { loginWithEmail, inviteUser, requestPasswordReset } from "@/lib/auth/demo-auth";
import { TenantIsolationError, assertSameOrganisation, redactForLogs } from "@/lib/security/tenant";
import { clearAuditLogsForTests, listAuditLogs } from "@/lib/security/audit";
import { saveLead } from "@/lib/leads/store";
import { defaultOnboardingState, validateOnboardingStep } from "@/lib/onboarding/state";
import { INTEGRATIONS } from "@/lib/integrations/catalog";
import { getAiProvider } from "@/lib/ai";
import { recommendPlan } from "@/lib/pricing/plans";

function ctxFor(userId: string, role?: AccessContext["role"]): AccessContext {
  const user = users.find((u) => u.id === userId)!;
  return {
    organisationId: ORG_ID,
    user,
    role: role ?? user.role,
    filters: { dateRange: "quarter", teamId: "all" },
  };
}

describe("seed coherence", () => {
  it("passes central coherence checks", () => {
    expect(validateSeedCoherence()).toEqual([]);
    expect(() => assertSeedCoherent()).not.toThrow();
  });

  it("has required demo volumes", () => {
    expect(
      users.filter((u) => u.role === "representative" && u.status === "active").length,
    ).toBeGreaterThanOrEqual(10);
    expect(calls.length).toBeGreaterThanOrEqual(30);
    expect(deals.length).toBeGreaterThanOrEqual(25);
  });
});

describe("tenant isolation", () => {
  beforeEach(() => clearAuditLogsForTests());

  it("rejects cross-organisation entity access", () => {
    expect(() => assertSameOrganisation(ORG_ID, "org-intruder")).toThrow(TenantIsolationError);
  });

  it("blocks call detail when organisation does not match", () => {
    const intruder: AccessContext = {
      ...ctxFor("u-exec"),
      organisationId: "org-intruder",
    };
    expect(() => getCallById(intruder, "c-1841")).toThrow(/TENANT_ISOLATION|TenantIsolation/);
  });

  it("does not accept a foreign organisation id from the session blindly for coaching store", () => {
    expect(() => listCoaching("org-intruder")).toThrow(/TENANT_ISOLATION/);
  });
});

describe("role permissions", () => {
  it("gives representatives own coaching but not org reports", () => {
    expect(can("representative", "coaching:own")).toBe(true);
    expect(can("representative", "reports:org")).toBe(false);
    expect(can("admin", "integrations:manage")).toBe(true);
    expect(can("manager", "pipeline:team")).toBe(true);
  });

  it("scopes calls for representatives to their own", () => {
    const callsVisible = getVisibleCalls(ctxFor("u-05", "representative"));
    expect(callsVisible.every((c) => c.representativeId === "u-05")).toBe(true);
  });

  it("allows executives to see org pipeline", () => {
    const pipeline = getVisibleDeals(ctxFor("u-exec", "executive"));
    expect(pipeline.length).toBeGreaterThan(0);
    expect(pipeline.every((d) => d.organisationId === ORG_ID)).toBe(true);
  });
});

describe("dashboard aggregation", () => {
  it("matches high-risk pipeline to high-risk deals", () => {
    const access = ctxFor("u-exec", "executive");
    const kpis = getOverviewKpis(access);
    const open = getVisibleDeals(access).filter(
      (d) => d.stage !== "Closed won" && d.stage !== "Lost",
    );
    const high = open.filter((d) => d.riskLevel === "High").reduce((s, d) => s + d.value, 0);
    expect(kpis.pipelineAtRisk).toBe(high);
  });

  it("counts analysed calls in KPI scope", () => {
    const access = ctxFor("u-exec", "executive");
    const kpis = getOverviewKpis(access);
    const analysed = getVisibleCalls(access).filter((c) => c.analysisStatus === "Analyzed").length;
    expect(kpis.callsAnalysed).toBe(analysed);
  });
});

describe("coaching assignment", () => {
  it("creates coaching for a representative in-tenant", () => {
    const before = listCoaching(ORG_ID).length;
    createCoaching(ORG_ID, {
      userId: "u-05",
      managerId: "u-01",
      skill: "Listening",
      evidence: "Test evidence",
      recommendation: "Practise pause",
      suggestedExercise: "Silence drill",
      status: "assigned",
      dueDate: "2026-08-15",
      completedAt: null,
      impactEstimate: "Medium",
      relatedCallIds: ["c-1826"],
      progress: 0,
      notes: "",
      behaviourImproved: null,
      planId: "plan-omar",
    });
    expect(listCoaching(ORG_ID).length).toBe(before + 1);
    const access = ctxFor("u-05", "representative");
    const mine = getVisibleCoaching(access);
    expect(mine.every((c) => c.userId === "u-05")).toBe(true);
  });
});

describe("authentication", () => {
  it("logs in known demo users and rejects disabled", () => {
    expect(loginWithEmail("maya.okonkwo@apexmarkets.demo").ok).toBe(true);
    expect(loginWithEmail("disabled@apexmarkets.demo").ok).toBe(false);
    expect(loginWithEmail("unknown@example.com").ok).toBe(false);
  });

  it("records invites under organisation and blocks foreign org", () => {
    const invite = inviteUser({
      organisationId: ORG_ID,
      actorId: "u-admin",
      email: "new.hire@apexmarkets.demo",
      role: "representative",
      name: "New Hire",
    });
    expect(invite.status).toBe("invited");
    expect(() =>
      inviteUser({
        organisationId: "org-other",
        actorId: "u-admin",
        email: "x@y.com",
        role: "representative",
        name: "X",
      }),
    ).toThrow(/TENANT/);
  });

  it("does not pretend password reset works", () => {
    expect(requestPasswordReset("a@b.com").ok).toBe(false);
  });
});

describe("security helpers", () => {
  it("redacts secrets and emails in logs", () => {
    const redacted = redactForLogs({
      email: "person@company.com",
      apiKey: "sk-live-secret",
      note: "token=abc123",
    }) as Record<string, unknown>;
    expect(String(redacted.email)).toContain("redacted");
    expect(redacted.apiKey).toBe("[redacted]");
  });
});

describe("onboarding progression", () => {
  it("validates required steps", () => {
    const state = defaultOnboardingState();
    expect(validateOnboardingStep(state, 0)).toBeTruthy();
    state.organisationName = "Acme";
    expect(validateOnboardingStep(state, 0)).toBeNull();
    state.industry = "Forex / CFDs";
    expect(validateOnboardingStep(state, 1)).toBeNull();
    expect(validateOnboardingStep(state, 3)).toBeNull(); // optional call source
  });
});

describe("lead submission", () => {
  it("stores demo leads when window is unavailable as failure", async () => {
    // Node test env has no window — store should fail gracefully
    const result = await saveLead({
      name: "Test Lead",
      email: "lead@example.com",
      company: "Example",
      title: "VP Sales",
      teamSize: "11-25",
      industry: "Forex",
      monthlyCalls: "500-1000",
      crm: "HubSpot",
      dialer: "Aircall",
      challenge: "Need better coaching visibility across desks",
      contactMethod: "Email",
    });
    expect(result.ok).toBe(false);
  });
});

describe("integrations honesty", () => {
  it("never ships Connected as the catalog default status", () => {
    for (const i of INTEGRATIONS) {
      expect(["Available", "In development", "Planned", "Requires configuration"]).toContain(
        i.status,
      );
    }
    expect(INTEGRATIONS.some((i) => i.id === "webhooks" && i.status === "Available")).toBe(true);
  });
});

describe("AI abstraction", () => {
  it("uses demo provider by default", async () => {
    const provider = getAiProvider();
    expect(provider.name).toBe("demo");
    const feedback = await provider.roleplayFeedback({
      scenario: "Pricing objection",
      difficulty: "Intermediate",
      objection: "Too expensive",
      transcript: "Hello",
    });
    expect(feedback.overallScore).toBeGreaterThan(0);
  });
});

describe("pricing config", () => {
  it("recommends plans from usage inputs", () => {
    expect(
      recommendPlan({ representatives: 4, monthlyCallsPerRep: 40, averageCallMinutes: 10 }).planId,
    ).toBe("starter");
    expect(
      recommendPlan({ representatives: 80, monthlyCallsPerRep: 100, averageCallMinutes: 15 })
        .planId,
    ).toBe("enterprise");
  });
});

describe("call filters and audit", () => {
  it("returns call analysis for permitted users and writes audit", () => {
    clearAuditLogsForTests();
    const call = getCallById(ctxFor("u-exec", "executive"), "c-1841");
    expect(call?.id).toBe("c-1841");
    expect(listAuditLogs(ORG_ID).some((a) => a.action === "call.view")).toBe(true);
  });
});
