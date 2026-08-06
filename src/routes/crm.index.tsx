import { createFileRoute } from "@tanstack/react-router";
import { Building2 } from "lucide-react";
import { PageHeading, Panel, Chip, StatCard } from "@/components/iris/primitives";
import { crmCompanies } from "@/lib/revenue-os-data";

export const Route = createFileRoute("/crm/")({
  head: () => ({
    meta: [
      { title: "Accounts — Artemis CRM" },
      { name: "description", content: "Every account with revenue, owner and AI-scored health from conversations." },
      { property: "og:title", content: "Accounts — Artemis CRM" },
      { property: "og:description", content: "Account health scored from real conversations." },
    ],
  }),
  component: AccountsPage,
});

const tone: Record<string, "good" | "warn" | "bad"> = {
  Strong: "good",
  Watch: "warn",
  "At risk": "bad",
};

function AccountsPage() {
  const total = crmCompanies.reduce((s, c) => s + c.value, 0);

  return (
    <>
      <PageHeading title="Accounts" subtitle="Health is scored from what customers actually said" />

      <div className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Open account value" value={`€${(total / 1000).toFixed(0)}k`} delta={12} icon={Building2} />
        <StatCard label="Accounts" value={String(crmCompanies.length)} hint="2 expansion candidates" />
        <StatCard label="At risk" value="1" delta={-8} hint="Aegean FX — refund language" />
        <StatCard label="Avg. seats" value="116" hint="per account" />
      </div>

      <Panel className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[11px] tracking-wider text-muted-foreground uppercase">
                {["Account", "Industry", "Seats", "Owner", "Open value", "AI health"].map((h) => (
                  <th key={h} className="px-5 py-3 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {crmCompanies.map((c) => (
                <tr key={c.name} className="border-b border-border/60 hover:bg-secondary/30">
                  <td className="px-5 py-3 font-medium">{c.name}</td>
                  <td className="px-5 py-3 text-muted-foreground">{c.industry}</td>
                  <td className="px-5 py-3 font-mono">{c.seats}</td>
                  <td className="px-5 py-3 text-muted-foreground">{c.owner}</td>
                  <td className="px-5 py-3 font-mono">€{(c.value / 1000).toFixed(0)}k</td>
                  <td className="px-5 py-3">
                    <Chip tone={tone[c.health] ?? "neutral"}>{c.health}</Chip>
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
