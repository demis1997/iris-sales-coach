import { createFileRoute, Link } from "@tanstack/react-router";
import { DemoPage } from "@/components/demo/demo-shell";
import { PageHeader, ProductCard, StatusBadge } from "@/components/product/ui";
import { APEX_CAMPAIGNS } from "@/data/demo/org";

export const Route = createFileRoute("/demo/manager/campaigns")({
  component: ManagerCampaignsPage,
});

function ManagerCampaignsPage() {
  const campaigns = APEX_CAMPAIGNS.filter((c) =>
    ["camp-uk-react", "camp-de-acq", "camp-vip", "camp-eu-new"].includes(c.id),
  );

  return (
    <DemoPage>
      <PageHeader
        eyebrow="Manager · Campaigns"
        title="Campaign performance"
        subtitle="Operational metrics for desks you run — drill into agents and AI insights."
      />
      <div className="grid gap-4">
        {campaigns.map((c) => (
          <ProductCard
            key={c.id}
            title={c.name}
            subtitle={`${c.team} · ${c.dialMode}`}
            action={
              <StatusBadge tone={c.status === "Running" ? "live" : "warn"}>{c.status}</StatusBadge>
            }
          >
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
              {[
                ["Calls", c.callsToday.toLocaleString()],
                ["Answer rate", "41%"],
                ["Conversion", `${c.conversion}%`],
                ["Avg talk", "4:12"],
                ["Deposits", c.id === "camp-vip" ? "28" : "19"],
                ["Revenue", c.id === "camp-vip" ? "€94K" : "€61K"],
                ["Leads left", (c.leads * 0.42).toFixed(0)],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5"
                >
                  <p className="text-[11px] uppercase tracking-wider text-[#8A9BB5]">{label}</p>
                  <p className="mt-1 text-sm font-semibold text-[#F7FAFF]">{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-3 text-xs">
              <Link to="/demo/manager/team" className="font-semibold text-[#2EE6A6] hover:underline">
                Agents →
              </Link>
              <Link to="/demo/manager/calls" className="font-semibold text-[#2EE6A6] hover:underline">
                Calls →
              </Link>
              <Link
                to="/demo/manager/coaching"
                className="font-semibold text-[#2EE6A6] hover:underline"
              >
                AI insights →
              </Link>
            </div>
          </ProductCard>
        ))}
      </div>
    </DemoPage>
  );
}
