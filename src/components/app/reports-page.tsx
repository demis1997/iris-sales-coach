import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useSession } from "@/components/app/session";
import {
  formatEur,
  getCoachingImpact,
  getOverviewKpis,
  getRiskDistribution,
  getTeamPerformanceTrend,
  getVisibleCalls,
  getVisibleDeals,
  getVisibleUsers,
  userById,
} from "@/lib/demo/queries";
import { analysisByCallId, DEMO_LABEL, teams } from "@/lib/demo/seed";
import { getSkillProfile, listCoaching, listPlaybooks } from "@/lib/demo/operations";
import type { Call, CoachingItem, Deal, Playbook } from "@/lib/demo/types";
import {
  downloadCsv,
  listSavedViews,
  openPrintableReport,
  saveReportView,
} from "@/lib/reports/export";
import { track } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { chartTooltip } from "@/components/artemis/chart-bits";
import { toast } from "sonner";

type ReportId =
  | "executive"
  | "team"
  | "rep-dev"
  | "pipeline"
  | "conversation"
  | "objections"
  | "competitors"
  | "product"
  | "coaching"
  | "playbooks"
  | "compliance";

type ReportData = {
  kpis: ReturnType<typeof getOverviewKpis>;
  teamTrend: ReturnType<typeof getTeamPerformanceTrend>;
  risk: ReturnType<typeof getRiskDistribution>;
  coachingImpact: ReturnType<typeof getCoachingImpact>;
  coaching: CoachingItem[];
  playbooks: Playbook[];
  calls: Call[];
  deals: Deal[];
  objections: [string, number][];
  competitors: [string, number][];
  products: [string, number][];
  complianceMentions: number;
  reps: {
    id: string;
    name: string;
    overall: number;
    conversion: number;
    coachingOpen: number;
    coachingDone: number;
  }[];
  dateRange: string;
};

const REPORTS: { id: ReportId; title: string; description: string }[] = [
  {
    id: "executive",
    title: "Executive summary",
    description: "High-level score, revenue influence, and risk.",
  },
  { id: "team", title: "Team performance", description: "Score trends across the visible team." },
  {
    id: "rep-dev",
    title: "Representative development",
    description: "Skill scores and coaching load per rep.",
  },
  { id: "pipeline", title: "Pipeline risk", description: "Risk distribution and at-risk value." },
  {
    id: "conversation",
    title: "Conversation trends",
    description: "Call volume and average scores over time.",
  },
  {
    id: "objections",
    title: "Objection trends",
    description: "Most common objections in analysed calls.",
  },
  {
    id: "competitors",
    title: "Competitor intelligence",
    description: "Competitor mentions across conversations.",
  },
  { id: "product", title: "Product feedback", description: "Buyer needs and feature themes." },
  {
    id: "coaching",
    title: "Coaching impact",
    description: "Completion and behaviour improvement signals.",
  },
  { id: "playbooks", title: "Playbook adoption", description: "Adoption scores and status mix." },
  {
    id: "compliance",
    title: "Compliance-related monitoring",
    description: "Disclosure and compliance markers — not a legal determination.",
  },
];

export function ReportsPage() {
  const { access, allowed } = useSession();
  if (!allowed("reports:team") && !allowed("reports:org")) {
    return (
      <div className="rounded-xl border border-dashed border-border px-6 py-16 text-center">
        <p className="font-medium">Reports unavailable</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Switch to a manager or leadership role to view reports.
        </p>
      </div>
    );
  }

  const [reportId, setReportId] = useState<ReportId>("executive");
  const [teamId, setTeamId] = useState("all");
  const [repId, setRepId] = useState("all");
  const [dateRange, setDateRange] = useState("30d");
  const [loading, setLoading] = useState(false);
  const [views, setViews] = useState(listSavedViews);

  const users = getVisibleUsers(access).filter(
    (u) => u.role === "representative" || u.role === "manager",
  );

  const data = useMemo(() => {
    const scopedAccess = {
      ...access,
      filters: {
        ...access.filters,
        teamId: teamId === "all" ? access.filters.teamId : teamId,
      },
    };
    let calls = getVisibleCalls(scopedAccess);
    if (repId !== "all") calls = calls.filter((c) => c.representativeId === repId);
    const deals = getVisibleDeals(scopedAccess).filter((d) =>
      repId === "all" ? true : d.representativeId === repId,
    );
    const kpis = getOverviewKpis(scopedAccess);
    const teamTrend = getTeamPerformanceTrend(scopedAccess);
    const risk = getRiskDistribution(scopedAccess);
    const coachingImpact = getCoachingImpact(scopedAccess);
    const coaching = listCoaching(access.organisationId);
    const playbooks = listPlaybooks(access.organisationId);

    const objectionMap = new Map<string, number>();
    const competitorMap = new Map<string, number>();
    const productMap = new Map<string, number>();
    let complianceMentions = 0;

    for (const c of calls) {
      const a = analysisByCallId[c.id];
      if (!a) continue;
      for (const o of a.objections) objectionMap.set(o, (objectionMap.get(o) ?? 0) + 1);
      for (const x of a.competitors) competitorMap.set(x, (competitorMap.get(x) ?? 0) + 1);
      for (const n of a.dealIntel.buyerNeeds) productMap.set(n, (productMap.get(n) ?? 0) + 1);
      if (
        a.risks.some((r) => /compliance|disclosure/i.test(r)) ||
        a.topics.some((t) => /compliance|disclosure/i.test(t))
      ) {
        complianceMentions += 1;
      }
    }

    const reps = users.map((u) => {
      const profile = getSkillProfile(access.organisationId, u.id);
      const mine = coaching.filter((c) => c.userId === u.id);
      return {
        id: u.id,
        name: u.name,
        overall: profile.overallScore,
        conversion: profile.conversionRate,
        coachingOpen: mine.filter((c) => !["completed", "dismissed"].includes(c.status)).length,
        coachingDone: mine.filter((c) => c.status === "completed").length,
      };
    });

    return {
      kpis,
      teamTrend,
      risk,
      coachingImpact,
      coaching,
      playbooks,
      calls,
      deals,
      objections: [...objectionMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8),
      competitors: [...competitorMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8),
      products: [...productMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8),
      complianceMentions,
      reps,
      dateRange,
    };
  }, [access, teamId, repId, dateRange, users]);

  async function refresh() {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    setLoading(false);
  }

  function exportCsv() {
    const rows = buildExportRows(reportId, data);
    downloadCsv(`artemis-${reportId}-${dateRange}.csv`, rows);
    track("report_exported", { reportId, format: "csv" });
    toast.success("CSV downloaded (illustrative demo data)");
  }

  function exportPdf() {
    const rows = buildExportRows(reportId, data);
    const table = `<table><thead><tr>${Object.keys(rows[0] ?? { message: "" })
      .map((h) => `<th>${h}</th>`)
      .join("")}</tr></thead><tbody>${rows
      .map(
        (r) =>
          `<tr>${Object.values(r)
            .map((v) => `<td>${v ?? ""}</td>`)
            .join("")}</tr>`,
      )
      .join("")}</tbody></table>`;
    const ok = openPrintableReport(
      REPORTS.find((r) => r.id === reportId)?.title ?? "Report",
      table,
    );
    if (ok) {
      track("report_exported", { reportId, format: "pdf_print" });
      toast.success("Printable PDF view opened");
    } else {
      toast.error("Pop-up blocked — allow pop-ups to export PDF.");
    }
  }

  function saveView() {
    const view = saveReportView({
      name: `${REPORTS.find((r) => r.id === reportId)?.title} · ${dateRange}`,
      reportId,
      teamId,
      representativeId: repId,
      dateRange,
    });
    setViews(listSavedViews());
    toast.success(`Saved view “${view.name}”`);
  }

  const active = REPORTS.find((r) => r.id === reportId)!;

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Reports</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Operational reporting from the same demo seed as Overview, Team, and Pipeline.
      </p>
      <p className="mt-2 text-xs text-muted-foreground">
        {DEMO_LABEL} · Figures are illustrative — not statistical certainty.
      </p>

      <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {REPORTS.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => {
              setReportId(r.id);
              void refresh();
            }}
            className={`rounded-xl border p-4 text-left transition-colors ${
              reportId === r.id
                ? "border-primary/40 bg-primary/5"
                : "border-border bg-card hover:border-primary/25"
            }`}
          >
            <p className="font-medium">{r.title}</p>
            <p className="mt-1 text-xs text-muted-foreground">{r.description}</p>
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-end gap-3 rounded-xl border border-border bg-card p-4">
        <Filter label="Date range">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </Filter>
        <Filter label="Team">
          <Select value={teamId} onValueChange={setTeamId}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All teams</SelectItem>
              {teams.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Filter>
        <Filter label="Representative">
          <Select value={repId} onValueChange={setRepId}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All representatives</SelectItem>
              {users.map((u) => (
                <SelectItem key={u.id} value={u.id}>
                  {u.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Filter>
        <div className="ml-auto flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={saveView}>
            Save view
          </Button>
          <Button size="sm" variant="outline" onClick={exportCsv}>
            Export CSV
          </Button>
          <Button size="sm" variant="outline" onClick={exportPdf}>
            Export PDF
          </Button>
        </div>
      </div>

      {views.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {views.slice(0, 5).map((v) => (
            <Button
              key={v.id}
              size="sm"
              variant="ghost"
              onClick={() => {
                setReportId(v.reportId as ReportId);
                setTeamId(v.teamId);
                setRepId(v.representativeId);
                setDateRange(v.dateRange);
              }}
            >
              {v.name}
            </Button>
          ))}
        </div>
      ) : null}

      <div className="mt-6 rounded-xl border border-border bg-card p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold">{active.title}</h2>
            <p className="text-xs text-muted-foreground">{active.description}</p>
          </div>
          {loading ? <span className="text-xs text-muted-foreground">Refreshing…</span> : null}
        </div>

        {data.calls.length === 0 ? (
          <div className="mt-8 py-10 text-center text-sm text-muted-foreground">
            No calls in this filter scope. Broaden team or representative filters.
          </div>
        ) : (
          <div className="mt-4">
            <ReportBody reportId={reportId} data={data} />
          </div>
        )}
      </div>
    </div>
  );
}

function Filter({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-xs text-muted-foreground">
      <span className="mb-1 block">{label}</span>
      {children}
    </label>
  );
}

function ReportBody({ reportId, data }: { reportId: ReportId; data: ReportData }) {
  switch (reportId) {
    case "executive":
      return (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Team score" value={`${data.kpis.teamScore}`} />
          <Stat label="Revenue influenced" value={formatEur(data.kpis.revenueInfluenced)} />
          <Stat label="Pipeline at risk" value={formatEur(data.kpis.pipelineAtRisk)} />
          <Stat label="Calls analysed" value={`${data.kpis.callsAnalysed}`} />
        </div>
      );
    case "team":
      return (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.teamTrend}>
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <YAxis domain={[40, 100]} tick={{ fontSize: 11 }} />
              <Tooltip {...chartTooltip} />
              <Line type="monotone" dataKey="score" stroke="var(--primary)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      );
    case "rep-dev":
      return (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-muted-foreground">
              <th className="py-2">Representative</th>
              <th>Score</th>
              <th>Conversion</th>
              <th>Open coaching</th>
              <th>Completed</th>
            </tr>
          </thead>
          <tbody>
            {data.reps.map((r) => (
              <tr key={r.id} className="border-t border-border">
                <td className="py-2">{r.name}</td>
                <td className="font-mono tabular-nums">{r.overall}</td>
                <td className="font-mono tabular-nums">{r.conversion}%</td>
                <td className="font-mono tabular-nums">{r.coachingOpen}</td>
                <td className="font-mono tabular-nums">{r.coachingDone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    case "pipeline":
      return (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.risk}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip {...chartTooltip} />
                <Bar dataKey="value" fill="var(--primary)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 text-sm">
            <p>
              Open deals in scope:{" "}
              {data.deals.filter((d) => d.stage !== "Closed won" && d.stage !== "Lost").length}
            </p>
            <p>High-risk value: {formatEur(data.kpis.pipelineAtRisk)}</p>
            <p className="text-xs text-muted-foreground">
              Risk labels come from conversation + CRM signals in the demo seed.
            </p>
          </div>
        </div>
      );
    case "conversation":
      return (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.teamTrend}>
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip {...chartTooltip} />
              <Line
                type="monotone"
                dataKey="calls"
                name="Calls"
                stroke="var(--cyan)"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="score"
                name="Score"
                stroke="var(--primary)"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      );
    case "objections":
      return <CountList rows={data.objections} empty="No objections tagged in this scope." />;
    case "competitors":
      return <CountList rows={data.competitors} empty="No competitor mentions in this scope." />;
    case "product":
      return <CountList rows={data.products} empty="No product feedback themes in this scope." />;
    case "coaching":
      return (
        <div className="grid gap-3 sm:grid-cols-3">
          <Stat
            label="Open items"
            value={`${data.coaching.filter((c) => !["completed", "dismissed"].includes(c.status)).length}`}
          />
          <Stat
            label="Completed"
            value={`${data.coaching.filter((c) => c.status === "completed").length}`}
          />
          <Stat
            label="Behaviour improved"
            value={`${data.coaching.filter((c) => c.behaviourImproved).length}`}
          />
          <p className="sm:col-span-3 text-xs text-muted-foreground">
            Coaching impact signal (demo): {JSON.stringify(data.coachingImpact)}
          </p>
        </div>
      );
    case "playbooks":
      return (
        <ul className="space-y-2 text-sm">
          {data.playbooks.map((p) => (
            <li key={p.id} className="flex justify-between border-b border-border py-2">
              <span>{p.name}</span>
              <span className="text-muted-foreground">
                {p.status} · adoption {p.adoptionScore}%
              </span>
            </li>
          ))}
        </ul>
      );
    case "compliance":
      return (
        <div className="space-y-3 text-sm">
          <Stat
            label="Calls with compliance-related markers"
            value={`${data.complianceMentions}`}
          />
          <p className="text-muted-foreground">
            This monitors script and disclosure markers you configure. It is not a legal or
            regulatory determination.
          </p>
        </div>
      );
    default:
      return null;
  }
}

function CountList({ rows, empty }: { rows: [string, number][]; empty: string }) {
  if (!rows.length) return <p className="text-sm text-muted-foreground">{empty}</p>;
  return (
    <ul className="space-y-2 text-sm">
      {rows.map(([label, count]) => (
        <li key={label} className="flex justify-between border-b border-border py-2">
          <span>{label}</span>
          <span className="font-mono tabular-nums">{count}</span>
        </li>
      ))}
    </ul>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-secondary/20 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-mono text-lg font-semibold tabular-nums">{value}</p>
    </div>
  );
}

function buildExportRows(reportId: ReportId, data: ReportData) {
  switch (reportId) {
    case "executive":
      return [
        {
          teamScore: data.kpis.teamScore,
          revenueInfluenced: data.kpis.revenueInfluenced,
          pipelineAtRisk: data.kpis.pipelineAtRisk,
          callsAnalysed: data.kpis.callsAnalysed,
        },
      ];
    case "rep-dev":
      return data.reps.map((r) => ({
        representative: r.name,
        score: r.overall,
        conversion: r.conversion,
        coachingOpen: r.coachingOpen,
        coachingDone: r.coachingDone,
      }));
    case "objections":
      return data.objections.map(([name, count]) => ({ objection: name, count }));
    case "competitors":
      return data.competitors.map(([name, count]) => ({ competitor: name, count }));
    case "product":
      return data.products.map(([name, count]) => ({ theme: name, count }));
    case "playbooks":
      return data.playbooks.map((p) => ({
        playbook: p.name,
        status: p.status,
        adoption: p.adoptionScore,
      }));
    case "pipeline":
      return data.deals.map((d) => ({
        opportunity: d.title,
        account: d.accountName,
        representative: userById(d.representativeId)?.name,
        stage: d.stage,
        amount: d.value,
        risk: d.riskLevel,
      }));
    default:
      return data.calls.map((c) => ({
        callId: c.id,
        prospect: c.prospect,
        representative: userById(c.representativeId)?.name,
        score: analysisByCallId[c.id]?.overallScore ?? "",
        outcome: c.outcome,
        date: c.startedAt.slice(0, 10),
      }));
  }
}
