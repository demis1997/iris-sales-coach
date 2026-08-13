import { createFileRoute } from "@tanstack/react-router";
import { DemoPage } from "@/components/demo/demo-shell";
import { PageHeader, ProductCard } from "@/components/product/ui";
import { APEX_ORG } from "@/data/demo/org";

export const Route = createFileRoute("/demo/admin/settings")({
  component: () => (
    <DemoPage>
      <PageHeader
        eyebrow="Admin · Settings"
        title="Workspace settings"
        subtitle={`${APEX_ORG.name} · ${APEX_ORG.location}`}
      />
      <div className="grid gap-4 md:grid-cols-2">
        {[
          ["Organization name", APEX_ORG.name],
          ["Industry", APEX_ORG.industry],
          ["Timezone", "Europe/Nicosia"],
          ["Default language", "English"],
          ["Recording retention", "24 months"],
          ["Demo mode", "Enabled — no live telephony"],
        ].map(([k, v]) => (
          <ProductCard key={k} title={k} subtitle={String(v)} />
        ))}
      </div>
    </DemoPage>
  ),
});
