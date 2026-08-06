import { createFileRoute } from "@tanstack/react-router";
import { PageHeading, Panel, Chip, StatCard } from "@/components/iris/primitives";
import { liveFloor } from "@/lib/revenue-os-data";

export const Route = createFileRoute("/manager/")({
  head: () => ({
    meta: [
      { title: "Live Floor — Artemis Manager" },
      { name: "description", content: "See who is on a call, live sentiment and which conversations need help right now." },
      { property: "og:title", content: "Live Floor — Artemis Manager" },
      { property: "og:description", content: "Real-time visibility of every conversation." },
    ],
  }),
  component: () => (
    <>
      <PageHeading title="Live floor" subtitle="Real-time team activity with AI risk flags" />
      <div className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active calls" value="3" hint="2 need attention" />
        <StatCard label="Calls today" value="184" delta={9} />
        <StatCard label="Avg. call score" value="76" delta={4} />
        <StatCard label="Flagged" value="2" delta={-12} hint="risk language detected" />
      </div>
      <Panel className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[11px] tracking-wider text-muted-foreground uppercase">
                {["Rep", "State", "Prospect", "Duration", "Sentiment", "", ""].map((h, i) => (
                  <th key={i} className="px-5 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {liveFloor.map((r) => (
                <tr key={r.rep} className="border-b border-border/60 hover:bg-secondary/30">
                  <td className="px-5 py-3 font-medium">{r.rep}</td>
                  <td className="px-5 py-3">
                    <Chip tone={r.state === "On call" ? "good" : "neutral"}>{r.state}</Chip>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{r.prospect}</td>
                  <td className="px-5 py-3 font-mono text-xs">{r.min ? `${r.min}m` : "—"}</td>
                  <td className="px-5 py-3 text-muted-foreground">{r.sentiment}</td>
                  <td className="px-5 py-3">{r.risk ? <Chip tone="bad">Needs help</Chip> : null}</td>
                  <td className="px-5 py-3 text-right">
                    <button className="text-xs text-primary hover:underline">Listen in</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  ),
});
