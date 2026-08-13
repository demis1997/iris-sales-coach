import { createFileRoute, Link } from "@tanstack/react-router";
import { DemoPage } from "@/components/demo/demo-shell";
import { PageHeader, ProductButton, ProductCard, StatusBadge } from "@/components/product/ui";

export const Route = createFileRoute("/demo/agent/leads")({
  component: AgentLeadsPage,
});

const LEADS = [
  {
    name: "James Wilson",
    country: "UK",
    priority: "High",
    campaign: "Reactivation",
    lastContact: "8d",
    opportunity: "82%",
    status: "Call Now",
  },
  {
    name: "Anna Becker",
    country: "Germany",
    priority: "High",
    campaign: "Acquisition",
    lastContact: "New",
    opportunity: "78%",
    status: "Call Now",
  },
  {
    name: "Lucas Martin",
    country: "France",
    priority: "Medium",
    campaign: "VIP Retention",
    lastContact: "2d",
    opportunity: "64%",
    status: "Follow Up",
  },
  {
    name: "Elena Rossi",
    country: "Italy",
    priority: "Medium",
    campaign: "Reactivation",
    lastContact: "5d",
    opportunity: "71%",
    status: "Call Now",
  },
];

function AgentLeadsPage() {
  return (
    <DemoPage>
      <PageHeader
        eyebrow="Agent · Leads"
        title="Today's leads"
        subtitle="Queue for Alpha Desk · call directly from Artemis — no separate dialer."
        actions={
          <Link to="/demo/agent/live" search={{ mode: "idle" }}>
            <ProductButton>Start Power Dialer</ProductButton>
          </Link>
        }
      />

      <ProductCard title="Lead queue" subtitle="AI opportunity scores · Apex Markets demo data">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/[0.07] text-[11px] uppercase tracking-[0.14em] text-[#8A9BB5]">
                <th className="pb-3 font-medium">Name</th>
                <th className="pb-3 font-medium">Country</th>
                <th className="pb-3 font-medium">Priority</th>
                <th className="pb-3 font-medium">Campaign</th>
                <th className="pb-3 font-medium">Last contact</th>
                <th className="pb-3 font-medium">AI opportunity</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {LEADS.map((lead) => (
                <tr key={lead.name} className="border-b border-white/[0.05] last:border-0">
                  <td className="py-3 pr-3 font-medium text-[#F7FAFF]">{lead.name}</td>
                  <td className="py-3 pr-3 text-[#8A9BB5]">{lead.country}</td>
                  <td className="py-3 pr-3">
                    <StatusBadge tone={lead.priority === "High" ? "warn" : "neutral"}>
                      {lead.priority}
                    </StatusBadge>
                  </td>
                  <td className="py-3 pr-3 text-[#8A9BB5]">{lead.campaign}</td>
                  <td className="py-3 pr-3 text-[#8A9BB5]">{lead.lastContact}</td>
                  <td className="py-3 pr-3 font-semibold text-[#2EE6A6]">{lead.opportunity}</td>
                  <td className="py-3">
                    <Link
                      to="/demo/agent/live"
                      search={{ mode: lead.name === "James Wilson" ? "idle" : "midcall" }}
                      className="text-xs font-semibold text-[#2EE6A6] hover:underline"
                    >
                      {lead.status} →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-[#8A9BB5]">
          Power Dialer advances through the queue automatically after each wrap-up (demo simulation).
        </p>
      </ProductCard>
    </DemoPage>
  );
}
