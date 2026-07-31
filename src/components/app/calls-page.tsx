import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Download, Search, Sparkles } from "lucide-react";
import { useSession } from "@/components/app/session";
import {
  formatDuration,
  formatEur,
  getVisibleCalls,
  teamById,
  userById,
  deals,
} from "@/lib/demo/queries";
import { analysisByCallId, users as allUsers, teams } from "@/lib/demo/seed";
import type { Call, CallOutcome, CallType, RiskLevel } from "@/lib/demo/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type SortKey = "date" | "score" | "duration" | "risk";

const SEMANTIC_HINTS = [
  "Calls where prospects objected to pricing",
  "Calls mentioning competitors",
  "Calls with no clear next step",
  "Best discovery calls this month",
];

export function CallsPage() {
  const { access } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [repId, setRepId] = useState<string>("all");
  const [teamId, setTeamId] = useState<string>("all");
  const [outcome, setOutcome] = useState<string>("all");
  const [callType, setCallType] = useState<string>("all");
  const [risk, setRisk] = useState<string>("all");
  const [language, setLanguage] = useState<string>("all");
  const [reviewed, setReviewed] = useState<string>("all");
  const [scoreMin, setScoreMin] = useState<string>("all");
  const [durationBucket, setDurationBucket] = useState<string>("all");
  const [sort, setSort] = useState<SortKey>("date");
  const [page, setPage] = useState(1);
  const [savedName, setSavedName] = useState("");
  const [savedFilters, setSavedFilters] = useState<{ name: string; snapshot: string }[]>([]);
  const pageSize = 10;

  useEffect(() => {
    setLoading(true);
    setError(null);
    const t = setTimeout(() => setLoading(false), 280);
    return () => clearTimeout(t);
  }, [access]);

  const base = useMemo(() => {
    try {
      return getVisibleCalls(access);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to load calls");
      return [] as Call[];
    }
  }, [access]);

  const filtered = useMemo(() => {
    let list = [...base];

    if (repId !== "all") list = list.filter((c) => c.representativeId === repId);
    if (teamId !== "all") list = list.filter((c) => c.teamId === teamId);
    if (outcome !== "all") list = list.filter((c) => c.outcome === (outcome as CallOutcome));
    if (callType !== "all") list = list.filter((c) => c.callType === (callType as CallType));
    if (language !== "all") list = list.filter((c) => c.language === language);
    if (reviewed === "reviewed") list = list.filter((c) => c.reviewed);
    if (reviewed === "unreviewed") list = list.filter((c) => !c.reviewed);

    list = list.filter((c) => {
      const a = analysisByCallId[c.id];
      if (risk !== "all") {
        if (!a || a.dealIntel.riskLevel !== (risk as RiskLevel)) return false;
      }
      if (scoreMin !== "all") {
        const min = Number(scoreMin);
        if (!a || a.overallScore < min) return false;
      }
      if (durationBucket === "short" && c.durationSec >= 600) return false;
      if (durationBucket === "medium" && (c.durationSec < 600 || c.durationSec > 900)) return false;
      if (durationBucket === "long" && c.durationSec <= 900) return false;
      return true;
    });

    const q = query.trim().toLowerCase();
    if (q) {
      list = applySearch(list, q);
    }

    list.sort((a, b) => {
      const aa = analysisByCallId[a.id];
      const bb = analysisByCallId[b.id];
      if (sort === "score") return (bb?.overallScore ?? 0) - (aa?.overallScore ?? 0);
      if (sort === "duration") return b.durationSec - a.durationSec;
      if (sort === "risk") {
        const rank = { High: 3, Medium: 2, Low: 1 } as const;
        return (
          (rank[bb?.dealIntel.riskLevel ?? "Low"] ?? 0) -
          (rank[aa?.dealIntel.riskLevel ?? "Low"] ?? 0)
        );
      }
      return b.startedAt.localeCompare(a.startedAt);
    });

    return list;
  }, [
    base,
    repId,
    teamId,
    outcome,
    callType,
    risk,
    language,
    reviewed,
    scoreMin,
    durationBucket,
    query,
    sort,
  ]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    setPage(1);
  }, [
    query,
    repId,
    teamId,
    outcome,
    callType,
    risk,
    language,
    reviewed,
    scoreMin,
    durationBucket,
    sort,
    access,
  ]);

  function exportCsv() {
    const header = [
      "id",
      "prospect",
      "company",
      "representative",
      "date",
      "duration",
      "type",
      "outcome",
      "score",
      "sentiment",
      "risk",
      "coaching",
    ];
    const lines = filtered.map((c) => {
      const a = analysisByCallId[c.id];
      const rep = userById(c.representativeId)?.name ?? "";
      return [
        c.id,
        c.prospect,
        c.company,
        rep,
        c.startedAt,
        formatDuration(c.durationSec),
        c.callType,
        c.outcome,
        a?.overallScore ?? "",
        a?.sentiment ?? "",
        a?.dealIntel.riskLevel ?? "",
        c.coachingStatus,
      ]
        .map((x) => `"${String(x).replaceAll('"', '""')}"`)
        .join(",");
    });
    const blob = new Blob([[header.join(","), ...lines].join("\n")], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "iris-calls.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-8 text-center">
        <p className="font-medium">Could not load calls</p>
        <p className="mt-1 text-sm text-muted-foreground">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Calls</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {filtered.length} calls in scope · totals reconcile with overview analysed counts when
            filters are cleared
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={exportCsv}>
            <Download className="size-3.5" /> Export CSV
          </Button>
        </div>
      </div>

      <div className="mb-4 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="relative">
          <Search className="pointer-events-none absolute top-2.5 left-3 size-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search prospect, company, transcript themes…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search calls"
          />
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
            <Sparkles className="size-3" /> Semantic search (interface ready):
          </span>
          {SEMANTIC_HINTS.map((h) => (
            <button
              key={h}
              type="button"
              className="rounded-md border border-border px-2 py-0.5 text-[11px] text-muted-foreground hover:bg-secondary hover:text-foreground"
              onClick={() => setQuery(h)}
            >
              {h}
            </button>
          ))}
        </div>

        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          <FilterSelect
            label="Representative"
            value={repId}
            onChange={setRepId}
            options={[
              { value: "all", label: "All reps" },
              ...allUsers
                .filter((u) => u.role === "representative" || u.role === "manager")
                .map((u) => ({ value: u.id, label: u.name })),
            ]}
          />
          <FilterSelect
            label="Team"
            value={teamId}
            onChange={setTeamId}
            options={[
              { value: "all", label: "All teams" },
              ...teams.map((t) => ({ value: t.id, label: t.name })),
            ]}
          />
          <FilterSelect
            label="Outcome"
            value={outcome}
            onChange={setOutcome}
            options={["all", "Closed", "Follow-up", "Lost", "No answer", "Qualified"].map((v) => ({
              value: v,
              label: v === "all" ? "All outcomes" : v,
            }))}
          />
          <FilterSelect
            label="Call type"
            value={callType}
            onChange={setCallType}
            options={["all", "Outbound", "Inbound", "Follow-up", "Discovery"].map((v) => ({
              value: v,
              label: v === "all" ? "All types" : v,
            }))}
          />
          <FilterSelect
            label="Risk"
            value={risk}
            onChange={setRisk}
            options={["all", "Low", "Medium", "High"].map((v) => ({
              value: v,
              label: v === "all" ? "All risk" : v,
            }))}
          />
          <FilterSelect
            label="Language"
            value={language}
            onChange={setLanguage}
            options={["all", "en", "el"].map((v) => ({
              value: v,
              label: v === "all" ? "All languages" : v,
            }))}
          />
          <FilterSelect
            label="Reviewed"
            value={reviewed}
            onChange={setReviewed}
            options={[
              { value: "all", label: "All" },
              { value: "reviewed", label: "Reviewed" },
              { value: "unreviewed", label: "Unreviewed" },
            ]}
          />
          <FilterSelect
            label="Min score"
            value={scoreMin}
            onChange={setScoreMin}
            options={[
              { value: "all", label: "Any score" },
              { value: "80", label: "80+" },
              { value: "70", label: "70+" },
              { value: "60", label: "60+" },
            ]}
          />
          <FilterSelect
            label="Duration"
            value={durationBucket}
            onChange={setDurationBucket}
            options={[
              { value: "all", label: "Any length" },
              { value: "short", label: "< 10m" },
              { value: "medium", label: "10–15m" },
              { value: "long", label: "> 15m" },
            ]}
          />
          <FilterSelect
            label="Sort"
            value={sort}
            onChange={(v) => setSort(v as SortKey)}
            options={[
              { value: "date", label: "Date" },
              { value: "score", label: "Score" },
              { value: "duration", label: "Duration" },
              { value: "risk", label: "Risk" },
            ]}
          />
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Input
            className="h-8 max-w-[180px]"
            placeholder="Save filter as…"
            value={savedName}
            onChange={(e) => setSavedName(e.target.value)}
          />
          <Button
            size="sm"
            variant="outline"
            type="button"
            onClick={() => {
              if (!savedName.trim()) return;
              const snapshot = JSON.stringify({
                query,
                repId,
                teamId,
                outcome,
                callType,
                risk,
                language,
                reviewed,
                scoreMin,
                durationBucket,
                sort,
              });
              setSavedFilters((s) => [...s, { name: savedName.trim(), snapshot }]);
              setSavedName("");
            }}
          >
            Save filter
          </Button>
          {savedFilters.map((s) => (
            <Button
              key={s.name}
              size="sm"
              variant="secondary"
              type="button"
              onClick={() => {
                const snap = JSON.parse(s.snapshot);
                setQuery(snap.query);
                setRepId(snap.repId);
                setTeamId(snap.teamId);
                setOutcome(snap.outcome);
                setCallType(snap.callType);
                setRisk(snap.risk);
                setLanguage(snap.language);
                setReviewed(snap.reviewed);
                setScoreMin(snap.scoreMin);
                setDurationBucket(snap.durationBucket);
                setSort(snap.sort);
              }}
            >
              {s.name}
            </Button>
          ))}
        </div>
      </div>

      {pageRows.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border px-6 py-16 text-center">
          <p className="font-medium">No calls match these filters</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Clear filters or broaden the date range.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead className="border-b border-border bg-secondary/40 text-xs text-muted-foreground">
              <tr>
                {[
                  "Prospect / company",
                  "Representative",
                  "Date",
                  "Duration",
                  "Type",
                  "Outcome",
                  "Score",
                  "Sentiment",
                  "Deal value",
                  "Risk",
                  "Coaching",
                ].map((h) => (
                  <th key={h} className="px-3 py-3 font-medium whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageRows.map((c) => {
                const a = analysisByCallId[c.id];
                const deal = c.dealId ? deals.find((d) => d.id === c.dealId) : null;
                return (
                  <tr
                    key={c.id}
                    className="border-b border-border last:border-0 hover:bg-secondary/20"
                  >
                    <td className="px-3 py-3">
                      <Link
                        to="/app/calls/$callId"
                        params={{ callId: c.id }}
                        className="font-medium hover:text-primary"
                      >
                        {c.prospect}
                      </Link>
                      <p className="text-xs text-muted-foreground">{c.company}</p>
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">
                      {userById(c.representativeId)?.name}
                      <p className="text-[11px]">{teamById(c.teamId)?.name}</p>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-muted-foreground">
                      {c.startedAt.slice(0, 10)}
                      <p className="text-[11px]">{c.startedAt.slice(11, 16)}</p>
                    </td>
                    <td className="px-3 py-3 font-mono tabular-nums">
                      {formatDuration(c.durationSec)}
                    </td>
                    <td className="px-3 py-3">{c.callType}</td>
                    <td className="px-3 py-3">{c.outcome}</td>
                    <td className="px-3 py-3 font-mono tabular-nums">
                      {c.analysisStatus === "Analyzed" ? (a?.overallScore ?? "—") : "…"}
                    </td>
                    <td className="px-3 py-3">{a?.sentiment ?? "—"}</td>
                    <td className="px-3 py-3 font-mono tabular-nums">
                      {deal ? formatEur(deal.value) : "—"}
                    </td>
                    <td className="px-3 py-3">
                      <RiskPill level={a?.dealIntel.riskLevel} />
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">{c.coachingStatus}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          Page {page} of {pageCount}
        </p>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={page >= pageCount}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

function applySearch(list: Call[], q: string): Call[] {
  // Semantic-style heuristics until a vector index exists
  if (q.includes("objected to pricing") || q.includes("pricing")) {
    return list.filter((c) => {
      const a = analysisByCallId[c.id];
      return a?.objections.some((o) => /pric|spread/i.test(o)) || a?.topics.includes("pricing");
    });
  }
  if (q.includes("competitor")) {
    return list.filter((c) => (analysisByCallId[c.id]?.competitors.length ?? 0) > 0);
  }
  if (q.includes("no clear next step") || q.includes("no next step")) {
    return list.filter((c) => {
      const a = analysisByCallId[c.id];
      return a && a.nextSteps.length === 0 && c.analysisStatus === "Analyzed";
    });
  }
  if (q.includes("best discovery")) {
    return list
      .filter((c) => (analysisByCallId[c.id]?.discoveryScore ?? 0) >= 85)
      .sort(
        (a, b) =>
          (analysisByCallId[b.id]?.discoveryScore ?? 0) -
          (analysisByCallId[a.id]?.discoveryScore ?? 0),
      );
  }

  return list.filter((c) => {
    const rep = userById(c.representativeId)?.name ?? "";
    const a = analysisByCallId[c.id];
    const hay = [
      c.prospect,
      c.company,
      rep,
      c.outcome,
      c.callType,
      ...(a?.topics ?? []),
      ...(a?.objections ?? []),
      ...(a?.competitors ?? []),
    ]
      .join(" ")
      .toLowerCase();
    return hay.includes(q);
  });
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block text-[11px] text-muted-foreground">
      {label}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="mt-1 h-8" aria-label={label}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </label>
  );
}

function RiskPill({ level }: { level?: RiskLevel }) {
  if (!level) return <span className="text-muted-foreground">—</span>;
  return (
    <span
      className={cn(
        "rounded-md px-2 py-0.5 text-[11px] font-medium",
        level === "High" && "bg-destructive/15 text-destructive",
        level === "Medium" && "bg-warning/15 text-warning",
        level === "Low" && "bg-success/15 text-success",
      )}
    >
      {level}
    </span>
  );
}
