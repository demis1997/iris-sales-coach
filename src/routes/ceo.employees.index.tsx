import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeading, Panel, Chip } from "@/components/iris/primitives";
import { employees } from "@/lib/iris-data";

export const Route = createFileRoute("/ceo/employees/")({
  head: () => ({
    meta: [
      { title: "Employees — Iris Executive" },
      { name: "description", content: "Every rep's calls, close rate, confidence, revenue and risk." },
      { property: "og:title", content: "Employees — Iris Executive" },
      { property: "og:description", content: "Every rep's calls, close rate, confidence and risk." },
    ],
  }),
  component: EmployeesPage,
});

function EmployeesPage() {
  return (
    <>
      <PageHeading title="Employees" subtitle="48 reps across 6 desks · showing top 8 by volume" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {employees.map((e) => (
          <Link key={e.id} to="/ceo/employees/$employeeId" params={{ employeeId: e.id }}>
            <Panel className="h-full p-5 transition-colors hover:border-primary/40">
              <div className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-full gradient-surface text-xs font-semibold text-background">
                  {e.name.split(" ").map((n) => n[0]).join("")}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{e.name}</p>
                  <p className="text-xs text-muted-foreground">{e.dept}</p>
                </div>
                <span className="ml-auto">
                  <Chip tone={e.risk === "Low" ? "good" : e.risk === "Medium" ? "warn" : "bad"}>
                    {e.risk}
                  </Chip>
                </span>
              </div>
              <div className="mt-4 grid grid-cols-4 gap-2 text-center">
                {[
                  ["Calls", `${e.calls}`],
                  ["Close", `${e.closeRate}%`],
                  ["Conf.", `${e.confidence}%`],
                  ["Score", `${e.score}`],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-lg border border-border bg-secondary/25 py-2">
                    <p className="text-[10px] text-muted-foreground">{k}</p>
                    <p className="font-mono text-xs">{v}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex justify-between text-xs">
                <span className="text-muted-foreground">
                  ${(e.revenue / 1000).toFixed(0)}K revenue
                </span>
                <span className={e.trend >= 0 ? "text-success" : "text-destructive"}>
                  {e.trend > 0 ? "+" : ""}
                  {e.trend}% trend
                </span>
              </div>
            </Panel>
          </Link>
        ))}
      </div>
    </>
  );
}
