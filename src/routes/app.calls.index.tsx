import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { PageHeading, Panel, Chip } from "@/components/iris/primitives";
import { calls } from "@/lib/iris-data";

export const Route = createFileRoute("/app/calls/")({
  head: () => ({
    meta: [
      { title: "Calls — Iris Rep Workspace" },
      { name: "description", content: "Every analyzed call with scores, outcomes and confidence." },
      { property: "og:title", content: "Calls — Iris Rep Workspace" },
      { property: "og:description", content: "Every analyzed call with scores and outcomes." },
    ],
  }),
  component: CallsPage,
});

const tones: Record<string, "good" | "warn" | "bad" | "neutral" | "iris"> = {
  Closed: "good",
  "Follow-up": "warn",
  Qualified: "iris",
  Lost: "bad",
  "No answer": "neutral",
};

const filters = ["All", "Closed", "Follow-up", "Qualified", "Lost"];

function CallsPage() {
  const [filter, setFilter] = useState("All");
  const [q, setQ] = useState("");
  const rows = calls.filter(
    (c) =>
      (filter === "All" || c.outcome === filter) &&
      (c.prospect + c.company).toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <>
      <PageHeading title="Calls" subtitle={`${calls.length} calls recorded and scored this week`} />

      <Panel className="overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 border-b border-border px-4 py-3">
          <div className="flex min-w-[200px] flex-1 items-center gap-2 rounded-lg border border-border bg-secondary/40 px-3 py-1.5">
            <Search className="size-3.5 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search prospect or company"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <div className="flex flex-wrap gap-1">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-lg px-3 py-1.5 text-xs transition-colors ${
                  filter === f
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground">
            <SlidersHorizontal className="size-3.5" /> Filters
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[11px] tracking-wider text-muted-foreground uppercase">
                {["Date", "Prospect", "Duration", "Outcome", "Score", "Confidence", "Talk ratio", "Status", ""].map(
                  (h) => (
                    <th key={h} className="px-5 py-3 font-medium">
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id} className="border-b border-border/60 hover:bg-secondary/30">
                  <td className="px-5 py-3 text-muted-foreground">
                    {c.date} · {c.time}
                  </td>
                  <td className="px-5 py-3">
                    <p className="font-medium">{c.prospect}</p>
                    <p className="text-xs text-muted-foreground">{c.company}</p>
                  </td>
                  <td className="px-5 py-3 font-mono text-xs">{c.duration}</td>
                  <td className="px-5 py-3">
                    <Chip tone={tones[c.outcome]}>{c.outcome}</Chip>
                  </td>
                  <td className="px-5 py-3 font-mono">{c.score || "—"}</td>
                  <td className="px-5 py-3 font-mono">{c.confidence ? `${c.confidence}%` : "—"}</td>
                  <td className="px-5 py-3 font-mono">{c.talkRatio ? `${c.talkRatio}%` : "—"}</td>
                  <td className="px-5 py-3 text-xs text-muted-foreground">{c.status}</td>
                  <td className="px-5 py-3 text-right">
                    <Link
                      to="/app/calls/$callId"
                      params={{ callId: c.id }}
                      className="text-xs text-primary hover:underline"
                    >
                      Open analysis
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}
