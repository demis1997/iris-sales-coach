import { createFileRoute } from "@tanstack/react-router";
import { DemoPage } from "@/components/demo/demo-shell";
import { PageHeader, ProductCard, StatusBadge } from "@/components/product/ui";

export const Route = createFileRoute("/demo/admin/integrations")({
  component: AdminIntegrationsPage,
});

const ITEMS = [
  { name: "Salesforce", status: "Planned", note: "Optional CRM sync" },
  { name: "HubSpot", status: "Planned", note: "Optional CRM sync" },
  { name: "Zoho", status: "Planned", note: "Optional CRM sync" },
  { name: "Meta Leads", status: "Planned", note: "Lead ingest" },
  { name: "Google Ads", status: "Planned", note: "Lead ingest" },
  { name: "Webhook / REST API", status: "Planned", note: "Custom connectors" },
  { name: "SIP trunk", status: "Planned", note: "Enterprise voice bring-your-own" },
];

function AdminIntegrationsPage() {
  return (
    <DemoPage>
      <PageHeader
        eyebrow="Admin · Integrations"
        title="Use Artemis alone — or connect what you already have"
        subtitle="Integrations are optional. Apex Markets runs calling, coaching and analytics natively in Artemis."
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ITEMS.map((item) => (
          <ProductCard key={item.name} title={item.name} subtitle={item.note}>
            <StatusBadge tone="neutral">{item.status}</StatusBadge>
          </ProductCard>
        ))}
      </div>
    </DemoPage>
  );
}
