import { createFileRoute } from "@tanstack/react-router";
import { DemoPage } from "@/components/demo/demo-shell";
import { KPICard, PageHeader, ProductCard } from "@/components/product/ui";
import { APEX_ORG } from "@/data/demo/org";

export const Route = createFileRoute("/demo/admin/billing")({
  component: () => (
    <DemoPage>
      <PageHeader
        eyebrow="Admin · Billing"
        title="Platform license + voice usage"
        subtitle="Seats billed monthly. Voice minutes billed separately by destination and volume."
      />
      <div className="grid gap-3 sm:grid-cols-3">
        <KPICard label="Plan" value={APEX_ORG.plan} />
        <KPICard label="Seats" value={String(APEX_ORG.activeUsers)} hint="Platform license" />
        <KPICard
          label="Voice minutes"
          value={APEX_ORG.voiceMinutes.toLocaleString()}
          hint="This month · usage billed separately"
        />
      </div>
      <ProductCard title="Enterprise voice" subtitle="Custom rates available">
        <p className="text-sm leading-relaxed text-[#8A9BB5]">
          Larger floors can negotiate destination-based voice pricing. Exact telecom rates are not
          shown in this demo.
        </p>
      </ProductCard>
    </DemoPage>
  ),
});
