/**
 * Seed coherence validators — keep dashboard / team / pipeline / coaching in sync.
 */

import {
  analysisByCallId,
  calls,
  coachingItems,
  deals,
  ORG_ID,
  organisation,
  playbooks,
  teams,
  users,
} from "@/lib/demo/seed";
import {
  getSkillProfile,
  listCoaching,
  trainingAssignments,
  trainingModules,
} from "@/lib/demo/operations";
import { getOverviewKpis, getVisibleDeals, type AccessContext } from "@/lib/demo/queries";

export type CoherenceIssue = { code: string; message: string };

export function validateSeedCoherence(): CoherenceIssue[] {
  const issues: CoherenceIssue[] = [];

  if (organisation.id !== ORG_ID) {
    issues.push({ code: "org", message: "Organisation id mismatch" });
  }

  const reps = users.filter((u) => u.role === "representative" && u.status === "active");
  if (reps.length < 10) {
    issues.push({
      code: "reps",
      message: `Expected ≥10 active representatives, found ${reps.length}`,
    });
  }
  if (teams.length < 3) {
    issues.push({ code: "teams", message: `Expected ≥3 teams, found ${teams.length}` });
  }
  if (deals.length < 25) {
    issues.push({ code: "deals", message: `Expected ≥25 deals, found ${deals.length}` });
  }
  if (calls.length < 30) {
    issues.push({ code: "calls", message: `Expected ≥30 calls, found ${calls.length}` });
  }

  for (const u of users) {
    if (u.organisationId !== ORG_ID) {
      issues.push({ code: "user-org", message: `User ${u.id} has foreign organisation` });
    }
    if (!teams.some((t) => t.id === u.teamId)) {
      issues.push({
        code: "user-team",
        message: `User ${u.id} references missing team ${u.teamId}`,
      });
    }
  }

  for (const d of deals) {
    if (d.currency !== "EUR") {
      issues.push({ code: "currency", message: `Deal ${d.id} currency ${d.currency}` });
    }
    if (!users.some((u) => u.id === d.representativeId)) {
      issues.push({ code: "deal-rep", message: `Deal ${d.id} missing representative` });
    }
    if (!teams.some((t) => t.id === d.teamId)) {
      issues.push({ code: "deal-team", message: `Deal ${d.id} missing team` });
    }
  }

  for (const c of calls) {
    if (!users.some((u) => u.id === c.representativeId)) {
      issues.push({ code: "call-rep", message: `Call ${c.id} missing representative` });
    }
    if (c.dealId && !deals.some((d) => d.id === c.dealId)) {
      issues.push({
        code: "call-deal",
        message: `Call ${c.id} references missing deal ${c.dealId}`,
      });
    }
    if (c.analysisStatus === "Analyzed" && !analysisByCallId[c.id]) {
      issues.push({ code: "call-analysis", message: `Analyzed call ${c.id} missing analysis` });
    }
  }

  for (const item of coachingItems) {
    for (const callId of item.relatedCallIds) {
      if (!calls.some((c) => c.id === callId)) {
        issues.push({
          code: "coach-call",
          message: `Coaching ${item.id} references missing call ${callId}`,
        });
      }
    }
    if (!users.some((u) => u.id === item.userId)) {
      issues.push({ code: "coach-user", message: `Coaching ${item.id} missing user` });
    }
  }

  for (const pb of playbooks) {
    for (const callId of pb.exampleCallIds) {
      if (!calls.some((c) => c.id === callId)) {
        issues.push({
          code: "playbook-call",
          message: `Playbook ${pb.id} example missing call ${callId}`,
        });
      }
    }
  }

  for (const a of trainingAssignments) {
    if (!trainingModules.some((m) => m.id === a.moduleId)) {
      issues.push({ code: "training-mod", message: `Assignment ${a.id} missing module` });
    }
  }

  // Pipeline total coherence for org executive context
  const exec = users.find((u) => u.role === "executive")!;
  const ctx: AccessContext = {
    organisationId: ORG_ID,
    user: exec,
    role: "executive",
    filters: { dateRange: "quarter", teamId: "all" },
  };
  const visibleDeals = getVisibleDeals(ctx).filter(
    (d) => d.stage !== "Closed won" && d.stage !== "Lost",
  );
  const highRisk = visibleDeals.filter((d) => d.riskLevel === "High");
  const kpis = getOverviewKpis(ctx);
  const highRiskSum = highRisk.reduce((s, d) => s + d.value, 0);
  if (kpis.pipelineAtRisk !== highRiskSum) {
    issues.push({
      code: "pipeline-risk",
      message: `High-risk pipeline KPI ${kpis.pipelineAtRisk} != sum ${highRiskSum}`,
    });
  }

  // Skill profile matches analysed call average for a sample rep
  const sample = reps[0]!;
  const profile = getSkillProfile(ORG_ID, sample.id);
  const mine = calls.filter(
    (c) => c.representativeId === sample.id && c.analysisStatus === "Analyzed",
  );
  const scores = mine.map((c) => analysisByCallId[c.id]?.overallScore ?? 0);
  const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  if (profile.overallScore !== avg) {
    issues.push({
      code: "rep-score",
      message: `Profile score ${profile.overallScore} != call avg ${avg} for ${sample.id}`,
    });
  }

  const coaching = listCoaching(ORG_ID);
  if (coaching.length === 0) {
    issues.push({ code: "coaching", message: "No coaching items in store" });
  }

  return issues;
}

export function assertSeedCoherent() {
  const issues = validateSeedCoherence();
  if (issues.length) {
    throw new Error(
      `Seed coherence failed:\n${issues.map((i) => `- ${i.code}: ${i.message}`).join("\n")}`,
    );
  }
}
