import { createFileRoute } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeading, Panel, PanelHeader, Meter } from "@/components/iris/primitives";
import { chartTooltip } from "@/components/iris/chart-bits";
import { employees } from "@/lib/iris-data";

export const Route = createFileRoute("/ceo/comparison")({
  head: () => ({
    meta: [
      { title: "Team Comparison — Artemis Executive" },
      { name: "description", content: "Compare reps on confidence, closing, pitch timing and compliance." },
      { property: "og:title", content: "Team Comparison — Artemis Executive" },
      { property: "og:description", content: "Compare reps across every behavioural metric." },
    ],
  }),
  component: ComparisonPage,
});

const metrics = [
  { key: "Confidence", vals: [88, 84, 71, 79, 58, 81, 66, 86] },
  { key: "Closing", vals: [87, 82, 64, 76, 51, 78, 62, 85] },
  { key: "Call length", vals: [72, 69, 81, 66, 88, 71, 79, 68] },
  { key: "Interruptions", vals: [79, 83, 58, 74, 44, 77, 61, 85] },
  { key: "Pitch timing", vals: [84, 80, 62, 72, 49, 75, 64, 82] },
  { key: "Engagement", vals: [81, 78, 66, 74, 55, 76, 68, 84] },
  { key: "Speaking ratio", vals: [76, 81, 59, 70, 42, 73, 63, 80] },
  { key: "Compliance", vals: [93, 91, 78, 88, 71, 89, 82, 94] },
  { key: "Energy", vals: [90, 85, 74, 77, 62, 83, 70, 87] },
];

function ComparisonPage() {
  const chartData = employees.map((e, i) => ({
    name: e.name.split(" ")[0],
    confidence: metrics[0].vals[i],
    closing: metrics[1].vals[i],
    compliance: metrics[7].vals[i],
  }));

  return (
    <>
      <PageHeading title="Team comparison" subtitle="Normalized behavioural scores across the floor" />

      <Panel>
        <PanelHeader title="Confidence · closing · compliance" />
        <div className="h-72 p-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid stroke="var(--border)" vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={11} stroke="var(--muted-foreground)" />
              <YAxis tickLine={false} axisLine={false} fontSize={11} stroke="var(--muted-foreground)" width={28} />
              <Tooltip {...chartTooltip} />
              <Legend wrapperStyle={{ fontSize: 11, color: "var(--muted-foreground)" }} />
              <Bar dataKey="confidence" fill="var(--violet)" radius={[5, 5, 0, 0]} />
              <Bar dataKey="closing" fill="var(--blue)" radius={[5, 5, 0, 0]} />
              <Bar dataKey="compliance" fill="var(--cyan)" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {metrics.map((m) => (
          <Panel key={m.key}>
            <PanelHeader title={m.key} />
            <div className="space-y-2.5 p-5">
              {employees.map((e, i) => (
                <div key={e.id}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-muted-foreground">{e.name}</span>
                    <span className="font-mono">{m.vals[i]}</span>
                  </div>
                  <Meter value={m.vals[i]} tone={m.vals[i] < 60 ? "flat" : "iris"} />
                </div>
              ))}
            </div>
          </Panel>
        ))}
      </div>
    </>
  );
}
