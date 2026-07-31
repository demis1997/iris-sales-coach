import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useSession } from "@/components/app/session";
import {
  formatEur,
  getVisibleDeals,
  getVisibleCalls,
  userById,
  teamById,
} from "@/lib/demo/queries";
import type { Deal, RiskLevel } from "@/lib/demo/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Chip } from "@/components/iris/primitives";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

type View = "table" | "kanban" | "risk";

export function PipelinePage() {
  const { access } = useSession();
  let deals: Deal[] = [];
  try {
    deals = getVisibleDeals(access);
  } catch {
    return <Forbidden />;
  }

  const calls = getVisibleCalls({
    ...access,
    filters: { ...access.filters, dateRange: "quarter", teamId: "all" },
  });

  const [view, setView] = useState<View>("table");
  const [teamId, setTeamId] = useState("all");
  const [repId, setRepId] = useState("all");
  const [stage, setStage] = useState("all");
  const [risk, setRisk] = useState("all");
  const [health, setHealth] = useState("all");
  const [minValue, setMinValue] = useState("");
  const [selected, setSelected] = useState<Deal | null>(null);

  const open = deals.filter((d) => d.stage !== "Closed won" && d.stage !== "Lost");

  const filtered = useMemo(() => {
    return open.filter((d) => {
      if (teamId !== "all" && d.teamId !== teamId) return false;
      if (repId !== "all" && d.representativeId !== repId) return false;
      if (stage !== "all" && d.stage !== stage) return false;
      if (risk !== "all" && d.riskLevel !== risk) return false;
      if (health !== "all" && d.conversationHealth !== health) return false;
      if (minValue && d.value < Number(minValue)) return false;
      return true;
    });
  }, [open, teamId, repId, stage, risk, health, minValue]);

  const total = filtered.reduce((s, d) => s + d.value, 0);
  const highRisk = filtered.filter((d) => d.riskLevel === "High");
  const highRiskVal = highRisk.reduce((s, d) => s + d.value, 0);
  const forecasted = Math.round(
    filtered.reduce((s, d) => s + (d.value * d.forecastConfidence) / 100, 0),
  );
  const withNext = filtered.filter((d) => d.nextStep && d.nextStep !== "None").length;
  const stale = filtered.filter((d) => d.lastInteraction < "2026-07-20").length;
  const confidence = filtered.length
    ? Math.round(filtered.reduce((s, d) => s + d.forecastConfidence, 0) / filtered.length)
    : 0;

  const stages = [...new Set(open.map((d) => d.stage))];
  const reps = [...new Set(open.map((d) => d.representativeId))];
  const teams = [...new Set(open.map((d) => d.teamId))];

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Pipeline</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Conversation-backed opportunity health. Totals reconcile with filtered open deals.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Metric label="Total pipeline" value={formatEur(total)} />
        <Metric label="High-risk pipeline" value={formatEur(highRiskVal)} />
        <Metric label="Forecasted revenue" value={formatEur(forecasted)} />
        <Metric label="Confirmed next steps" value={`${withNext}/${filtered.length}`} />
        <Metric label="No recent engagement" value={String(stale)} />
        <Metric label="Forecast confidence" value={`${confidence}%`} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {(["table", "kanban", "risk"] as View[]).map((v) => (
          <Button
            key={v}
            size="sm"
            variant={view === v ? "default" : "outline"}
            onClick={() => setView(v)}
          >
            {v === "table" ? "Table" : v === "kanban" ? "Kanban" : "Risk map"}
          </Button>
        ))}
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
        <Filter
          label="Team"
          value={teamId}
          onChange={setTeamId}
          options={[
            { value: "all", label: "All teams" },
            ...teams.map((t) => ({ value: t, label: teamById(t)?.name ?? t })),
          ]}
        />
        <Filter
          label="Representative"
          value={repId}
          onChange={setRepId}
          options={[
            { value: "all", label: "All reps" },
            ...reps.map((r) => ({ value: r, label: userById(r)?.name ?? r })),
          ]}
        />
        <Filter
          label="Stage"
          value={stage}
          onChange={setStage}
          options={[
            { value: "all", label: "All stages" },
            ...stages.map((s) => ({ value: s, label: s })),
          ]}
        />
        <Filter
          label="Risk"
          value={risk}
          onChange={setRisk}
          options={["all", "Low", "Medium", "High"].map((v) => ({
            value: v,
            label: v === "all" ? "All risk" : v,
          }))}
        />
        <Filter
          label="Conversation health"
          value={health}
          onChange={setHealth}
          options={["all", "Strong", "Stable", "At risk", "Critical"].map((v) => ({
            value: v,
            label: v === "all" ? "All health" : v,
          }))}
        />
        <label className="text-[11px] text-muted-foreground">
          Min value
          <Input
            className="mt-1 h-8"
            inputMode="numeric"
            placeholder="e.g. 40000"
            value={minValue}
            onChange={(e) => setMinValue(e.target.value)}
          />
        </label>
      </div>

      {view === "table" ? (
        <div className="mt-4 overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead className="border-b border-border bg-secondary/40 text-xs text-muted-foreground">
              <tr>
                {[
                  "Opportunity",
                  "Account",
                  "Rep",
                  "Stage",
                  "Amount",
                  "Expected close",
                  "Health",
                  "Risk",
                  "Last interaction",
                  "Action",
                ].map((h) => (
                  <th key={h} className="px-3 py-3 font-medium whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => (
                <tr
                  key={d.id}
                  className="cursor-pointer border-b border-border last:border-0 hover:bg-secondary/20"
                  onClick={() => setSelected(d)}
                >
                  <td className="px-3 py-3 font-medium">{d.title}</td>
                  <td className="px-3 py-3">{d.accountName}</td>
                  <td className="px-3 py-3 text-muted-foreground">
                    {userById(d.representativeId)?.name}
                  </td>
                  <td className="px-3 py-3">{d.stage}</td>
                  <td className="px-3 py-3 font-mono tabular-nums">{formatEur(d.value)}</td>
                  <td className="px-3 py-3">{d.expectedCloseDate}</td>
                  <td className="px-3 py-3">{d.conversationHealth}</td>
                  <td className="px-3 py-3">
                    <RiskPill level={d.riskLevel} />
                  </td>
                  <td className="px-3 py-3 text-muted-foreground">{d.lastInteraction}</td>
                  <td className="px-3 py-3 text-muted-foreground">{d.irisRecommendation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {view === "kanban" ? (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
          {stages.map((s) => (
            <div
              key={s}
              className="w-72 shrink-0 rounded-xl border border-border bg-secondary/15 p-3"
            >
              <p className="text-xs font-semibold tracking-wide uppercase">{s}</p>
              <div className="mt-3 space-y-2">
                {filtered
                  .filter((d) => d.stage === s)
                  .map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      className="w-full rounded-lg border border-border bg-card p-3 text-left"
                      onClick={() => setSelected(d)}
                    >
                      <p className="text-sm font-medium">{d.accountName}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatEur(d.value)} · {d.riskLevel}
                      </p>
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {view === "risk" ? (
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {(["High", "Medium", "Low"] as RiskLevel[]).map((level) => (
            <div key={level} className="rounded-xl border border-border bg-card p-4">
              <p className="text-sm font-semibold">{level} risk</p>
              <p className="mt-1 font-mono text-lg tabular-nums">
                {formatEur(
                  filtered.filter((d) => d.riskLevel === level).reduce((s, d) => s + d.value, 0),
                )}
              </p>
              <ul className="mt-3 space-y-2">
                {filtered
                  .filter((d) => d.riskLevel === level)
                  .map((d) => (
                    <li key={d.id}>
                      <button
                        type="button"
                        className="text-left text-sm hover:text-primary"
                        onClick={() => setSelected(d)}
                      >
                        {d.accountName} · {d.riskReasons[0] ?? "—"}
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      ) : null}

      {selected ? (
        <DealDrawer
          deal={selected}
          relatedCalls={calls.filter((c) => c.dealId === selected.id)}
          onClose={() => setSelected(null)}
        />
      ) : null}
    </div>
  );
}

function DealDrawer({
  deal,
  relatedCalls,
  onClose,
}: {
  deal: Deal;
  relatedCalls: { id: string; prospect: string; startedAt: string; outcome: string }[];
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="Close"
        onClick={onClose}
      />
      <aside className="relative h-full w-full max-w-lg overflow-y-auto border-l border-border bg-card p-5 shadow-xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">{deal.title}</h2>
            <p className="text-sm text-muted-foreground">{deal.accountName}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close drawer">
            <X className="size-4" />
          </button>
        </div>
        <dl className="mt-4 space-y-2 text-sm">
          <Row label="Stage" value={deal.stage} />
          <Row label="Amount" value={formatEur(deal.value)} />
          <Row label="Expected close" value={deal.expectedCloseDate} />
          <Row label="Rep" value={userById(deal.representativeId)?.name ?? "—"} />
          <Row label="Health" value={deal.conversationHealth} />
          <Row label="Risk" value={deal.riskLevel} />
          <Row label="Risk reasons" value={deal.riskReasons.join(", ") || "None"} />
          <Row label="Stakeholders" value={deal.stakeholders.join(", ")} />
          <Row label="Next step" value={deal.nextStep} />
          <Row label="CRM sync" value={`${deal.crmSource} · ${deal.crmSyncStatus}`} />
        </dl>
        <div className="mt-4 rounded-lg border border-primary/25 bg-primary/5 p-3 text-sm">
          <p className="text-xs font-medium text-primary">Iris recommendation</p>
          <p className="mt-1">{deal.irisRecommendation}</p>
        </div>
        <h3 className="mt-5 text-sm font-semibold">Conversation timeline</h3>
        <ul className="mt-2 space-y-2 text-sm">
          {relatedCalls.length === 0 ? (
            <li className="text-muted-foreground">No linked calls in scope.</li>
          ) : (
            relatedCalls.map((c) => (
              <li key={c.id}>
                <Link
                  to="/app/calls/$callId"
                  params={{ callId: c.id }}
                  className="hover:text-primary"
                >
                  {c.startedAt.slice(0, 10)} · {c.prospect} · {c.outcome}
                </Link>
              </li>
            ))
          )}
        </ul>
        <h3 className="mt-5 text-sm font-semibold">Sentiment / objections</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          See linked calls for sentiment trend, objections, and competitor mentions from analysis.
        </p>
      </aside>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[140px_1fr] gap-2">
      <dt className="text-muted-foreground">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-2 font-mono text-lg font-semibold tabular-nums">{value}</p>
    </div>
  );
}

function Filter({
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
    <label className="text-[11px] text-muted-foreground">
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

function RiskPill({ level }: { level: RiskLevel }) {
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

function Forbidden() {
  return (
    <div className="rounded-xl border border-dashed border-border px-6 py-16 text-center">
      <p className="font-medium">Pipeline unavailable</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Your role cannot access pipeline intelligence.
      </p>
    </div>
  );
}
