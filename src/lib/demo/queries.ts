import { can } from "@/lib/demo/rbac";
import type { Permission } from "@/lib/demo/permissions";
import {
  analyses,
  analysisByCallId,
  calls,
  deals,
  insights,
  ORG_ID,
  teams,
  users,
} from "@/lib/demo/seed";
import { listCoaching } from "@/lib/demo/operations";
import type {
  Call,
  CallAnalysis,
  DateRangeKey,
  Deal,
  Role,
  SessionFilters,
  User,
} from "@/lib/demo/types";
import { assertSameOrganisation, ForbiddenError } from "@/lib/security/tenant";
import { recordAudit } from "@/lib/security/audit";

export type AccessContext = {
  organisationId: string;
  user: User;
  /** Effective role for the session (demo role switcher may override). */
  role: Role;
  filters: SessionFilters;
};

function assertTenant(entityOrgId: string, ctx: AccessContext) {
  assertSameOrganisation(entityOrgId, ctx.organisationId);
}

function requirePerm(ctx: AccessContext, permission: Permission) {
  if (!can(ctx.role, permission)) {
    throw new ForbiddenError(permission);
  }
}

function dateRangeBounds(key: DateRangeKey, customFrom?: string, customTo?: string) {
  const end = new Date("2026-07-31T23:59:59.000Z");
  if (key === "custom" && customFrom && customTo) {
    return { from: new Date(customFrom), to: new Date(customTo) };
  }
  const from = new Date(end);
  if (key === "7d") from.setUTCDate(from.getUTCDate() - 7);
  else if (key === "30d") from.setUTCDate(from.getUTCDate() - 30);
  else {
    // quarter: Q3 2026 starting Jul 1
    from.setUTCFullYear(2026, 6, 1);
    from.setUTCHours(0, 0, 0, 0);
  }
  return { from, to: end };
}

function inRange(iso: string, ctx: AccessContext) {
  const { from, to } = dateRangeBounds(
    ctx.filters.dateRange,
    ctx.filters.customFrom,
    ctx.filters.customTo,
  );
  const t = new Date(iso);
  return t >= from && t <= to;
}

function scopeCalls(ctx: AccessContext): Call[] {
  let list = calls.filter((c) => c.organisationId === ctx.organisationId);
  if (can(ctx.role, "calls:org") || can(ctx.role, "overview:org")) {
    // org scope
  } else if (can(ctx.role, "calls:team") || can(ctx.role, "overview:team")) {
    list = list.filter((c) => c.teamId === ctx.user.teamId);
  } else {
    requirePerm(ctx, "calls:own");
    list = list.filter((c) => c.representativeId === ctx.user.id);
  }
  if (ctx.filters.teamId !== "all") {
    if (
      !can(ctx.role, "calls:org") &&
      !can(ctx.role, "overview:org") &&
      ctx.filters.teamId !== ctx.user.teamId
    ) {
      throw new Error("FORBIDDEN:team_filter");
    }
    list = list.filter((c) => c.teamId === ctx.filters.teamId);
  }
  return list.filter((c) => inRange(c.startedAt, ctx));
}

export function getVisibleCalls(ctx: AccessContext): Call[] {
  return scopeCalls(ctx);
}

export function getCallById(ctx: AccessContext, callId: string): Call | null {
  requirePerm(ctx, "calls:detail");
  const call = calls.find((c) => c.id === callId);
  if (!call) return null;
  assertTenant(call.organisationId, ctx);
  const visible = scopeCalls({
    ...ctx,
    filters: { ...ctx.filters, dateRange: "quarter", teamId: "all" },
  });
  // detail access still requires the call to be in role scope (ignore date for detail)
  const scoped = calls.filter((c) => {
    if (c.organisationId !== ctx.organisationId) return false;
    if (can(ctx.role, "calls:org")) return true;
    if (can(ctx.role, "calls:team")) return c.teamId === ctx.user.teamId;
    return c.representativeId === ctx.user.id;
  });
  if (!scoped.find((c) => c.id === callId)) return null;
  void visible;
  recordAudit({
    organisationId: ctx.organisationId,
    userId: ctx.user.id,
    action: "call.view",
    resource: callId,
    metadata: {},
  });
  return call;
}

export function getAnalysis(ctx: AccessContext, callId: string): CallAnalysis | null {
  const call = getCallById(ctx, callId);
  if (!call) return null;
  return analysisByCallId[callId] ?? null;
}

export function getVisibleDeals(ctx: AccessContext): Deal[] {
  const perm = can(ctx.role, "pipeline:org")
    ? "pipeline:org"
    : can(ctx.role, "pipeline:team")
      ? "pipeline:team"
      : null;
  if (!perm) {
    // reps see deals tied to their calls only
    const myDealIds = new Set(
      calls
        .filter(
          (c) =>
            c.organisationId === ctx.organisationId &&
            c.representativeId === ctx.user.id &&
            c.dealId,
        )
        .map((c) => c.dealId!),
    );
    return deals.filter((d) => d.organisationId === ctx.organisationId && myDealIds.has(d.id));
  }
  requirePerm(ctx, perm);
  let list = deals.filter((d) => d.organisationId === ctx.organisationId);
  if (perm === "pipeline:team") list = list.filter((d) => d.teamId === ctx.user.teamId);
  if (ctx.filters.teamId !== "all") list = list.filter((d) => d.teamId === ctx.filters.teamId);
  return list;
}

export function getVisibleCoaching(ctx: AccessContext) {
  let list = listCoaching(ctx.organisationId);
  if (can(ctx.role, "coaching:org")) return list;
  if (can(ctx.role, "coaching:team")) {
    const teamUserIds = new Set(users.filter((u) => u.teamId === ctx.user.teamId).map((u) => u.id));
    return list.filter((c) => teamUserIds.has(c.userId));
  }
  requirePerm(ctx, "coaching:own");
  return list.filter((c) => c.userId === ctx.user.id);
}

export function getVisibleUsers(ctx: AccessContext): User[] {
  const orgUsers = users.filter((u) => u.organisationId === ctx.organisationId);
  if (can(ctx.role, "team:read") || can(ctx.role, "overview:org")) {
    return orgUsers.filter((u) => ["representative", "manager"].includes(u.role));
  }
  return orgUsers.filter((u) => u.id === ctx.user.id);
}

export type OverviewKpis = {
  revenueInfluenced: number;
  pipelineAtRisk: number;
  teamScore: number;
  callsAnalysed: number;
  coachingHoursSaved: number;
  forecastConfidence: number;
  deltas: {
    revenueInfluenced: number;
    pipelineAtRisk: number;
    teamScore: number;
    callsAnalysed: number;
    coachingHoursSaved: number;
    forecastConfidence: number;
  };
  meta: {
    callCount: number;
    highRiskDealCount: number;
    highRiskDealValue: number;
  };
};

export function getOverviewKpis(ctx: AccessContext): OverviewKpis {
  const overviewPerm = can(ctx.role, "overview:org")
    ? "overview:org"
    : can(ctx.role, "overview:team")
      ? "overview:team"
      : "overview:own";
  requirePerm(ctx, overviewPerm);

  const visibleCalls = scopeCalls(ctx);
  const analysed = visibleCalls.filter((c) => c.analysisStatus === "Analyzed");
  const scores = analysed
    .map((c) => analysisByCallId[c.id]?.overallScore ?? 0)
    .filter((s) => s > 0);
  const teamScore = scores.length
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : 0;

  const closedDealIds = new Set(
    analysed.filter((c) => c.outcome === "Closed" && c.dealId).map((c) => c.dealId!),
  );
  const revenueInfluenced = deals
    .filter((d) => d.organisationId === ORG_ID && closedDealIds.has(d.id))
    .reduce((s, d) => s + d.value, 0);

  // Pipeline at risk: open high-risk deals in scope
  let scopedDeals = deals.filter(
    (d) => d.organisationId === ORG_ID && d.stage !== "Closed won" && d.stage !== "Lost",
  );
  if (overviewPerm === "overview:team") {
    scopedDeals = scopedDeals.filter((d) => d.teamId === ctx.user.teamId);
  } else if (overviewPerm === "overview:own") {
    scopedDeals = scopedDeals.filter((d) => d.representativeId === ctx.user.id);
  }
  if (ctx.filters.teamId !== "all") {
    scopedDeals = scopedDeals.filter((d) => d.teamId === ctx.filters.teamId);
  }
  const highRisk = scopedDeals.filter((d) => d.riskLevel === "High");
  const pipelineAtRisk = highRisk.reduce((s, d) => s + d.value, 0);

  const forecastConfidence = scopedDeals.length
    ? Math.round(scopedDeals.reduce((s, d) => s + d.forecastConfidence, 0) / scopedDeals.length)
    : 0;

  const coachingHoursSaved = Math.round(analysed.length * 0.35 * 10) / 10;

  return {
    revenueInfluenced,
    pipelineAtRisk,
    teamScore,
    callsAnalysed: analysed.length,
    coachingHoursSaved,
    forecastConfidence,
    deltas: {
      revenueInfluenced: 12,
      pipelineAtRisk: -8,
      teamScore: 4,
      callsAnalysed: 9,
      coachingHoursSaved: 14,
      forecastConfidence: 3,
    },
    meta: {
      callCount: visibleCalls.length,
      highRiskDealCount: highRisk.length,
      highRiskDealValue: pipelineAtRisk,
    },
  };
}

export function getRevenueTrend(ctx: AccessContext) {
  const visible = scopeCalls(ctx);
  const byDay = new Map<string, { revenue: number; pipeline: number; calls: number }>();
  for (const c of visible) {
    const day = c.startedAt.slice(0, 10);
    const row = byDay.get(day) ?? { revenue: 0, pipeline: 0, calls: 0 };
    row.calls += 1;
    const deal = c.dealId ? deals.find((d) => d.id === c.dealId) : null;
    if (deal && c.outcome === "Closed") row.revenue += deal.value;
    if (deal && deal.riskLevel === "High" && c.outcome !== "Closed") row.pipeline += deal.value;
    byDay.set(day, row);
  }
  return [...byDay.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([day, v]) => ({ day: day.slice(5), ...v }));
}

export function getTeamPerformanceTrend(ctx: AccessContext) {
  const visible = scopeCalls(ctx).filter((c) => c.analysisStatus === "Analyzed");
  const byDay = new Map<string, number[]>();
  for (const c of visible) {
    const day = c.startedAt.slice(0, 10);
    const score = analysisByCallId[c.id]?.overallScore ?? 0;
    const arr = byDay.get(day) ?? [];
    arr.push(score);
    byDay.set(day, arr);
  }
  return [...byDay.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([day, scores]) => ({
      day: day.slice(5),
      score: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
      calls: scores.length,
    }));
}

export function getRiskDistribution(ctx: AccessContext) {
  const d = getVisibleDeals(ctx).filter((x) => x.stage !== "Closed won" && x.stage !== "Lost");
  const counts = { Low: 0, Medium: 0, High: 0 };
  for (const deal of d) counts[deal.riskLevel] += 1;
  return [
    { name: "Low", value: counts.Low },
    { name: "Medium", value: counts.Medium },
    { name: "High", value: counts.High },
  ];
}

export function getCoachingImpact(ctx: AccessContext) {
  return [
    { week: "W1", before: 68, after: 68 },
    { week: "W2", before: 70, after: 72 },
    { week: "W3", before: 71, after: 76 },
    { week: "W4", before: 73, after: 81 },
  ];
}

export function getRepsNeedingAttention(ctx: AccessContext) {
  if (
    !can(ctx.role, "team:read") &&
    !can(ctx.role, "overview:team") &&
    !can(ctx.role, "overview:org")
  ) {
    return [];
  }
  const visible = scopeCalls({
    ...ctx,
    filters: {
      ...ctx.filters,
      teamId: can(ctx.role, "overview:org") ? ctx.filters.teamId : ctx.user.teamId,
    },
  });
  const byRep = new Map<string, number[]>();
  for (const c of visible) {
    if (c.analysisStatus !== "Analyzed") continue;
    const s = analysisByCallId[c.id]?.overallScore ?? 0;
    const arr = byRep.get(c.representativeId) ?? [];
    arr.push(s);
    byRep.set(c.representativeId, arr);
  }
  return [...byRep.entries()]
    .map(([id, scores]) => {
      const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
      const user = users.find((u) => u.id === id)!;
      return { user, avg, calls: scores.length };
    })
    .filter((r) => r.avg < 75)
    .sort((a, b) => a.avg - b.avg);
}

export function getTopBehaviours() {
  return [
    { behaviour: "Value established before pricing", lift: "+18% close propensity (demo)" },
    { behaviour: "Next step booked live", lift: "Present in 100% of Closed outcomes in seed" },
    { behaviour: "Acknowledge → reframe objections", lift: "Higher objection scores on top calls" },
    { behaviour: "6+ discovery questions", lift: "Correlates with Qualified → Closed path" },
  ];
}

export function getRecentInsights(ctx: AccessContext) {
  return insights.filter((i) => {
    if (i.organisationId !== ctx.organisationId) return false;
    if (i.scope === "org") return can(ctx.role, "overview:org") || can(ctx.role, "overview:team");
    if (i.scope === "team") {
      return (
        can(ctx.role, "overview:org") ||
        (can(ctx.role, "overview:team") && i.teamId === ctx.user.teamId)
      );
    }
    return (
      i.userId === ctx.user.id || can(ctx.role, "overview:team") || can(ctx.role, "overview:org")
    );
  });
}

export function formatDuration(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function formatEur(n: number) {
  if (n >= 1_000_000) return `€${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `€${Math.round(n / 1000)}K`;
  return `€${n}`;
}

export function userById(id: string) {
  return users.find((u) => u.id === id);
}

export function teamById(id: string) {
  return teams.find((t) => t.id === id);
}

export { analyses, teams, users, deals, ORG_ID };
