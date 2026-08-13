import { createFileRoute } from "@tanstack/react-router";
import { DemoPage } from "@/components/demo/demo-shell";
import { PageHeader, ProductCard, StatusBadge } from "@/components/product/ui";

export const Route = createFileRoute("/demo/admin/playbooks")({
  component: () => (
    <DemoPage>
      <PageHeader
        eyebrow="Admin · AI Playbooks"
        title="Organization playbooks"
        subtitle="Publish talk tracks and compliance guidance that power live coaching."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {[
          { name: "Value Before Price", status: "Published" },
          { name: "Trust / Withdrawal Objection", status: "Published" },
          { name: "Discovery Depth", status: "Draft" },
          { name: "Compliance — Risk Disclosure", status: "Published" },
        ].map((p) => (
          <ProductCard key={p.name} title={p.name} subtitle="Apex Markets">
            <StatusBadge tone={p.status === "Published" ? "live" : "warn"}>{p.status}</StatusBadge>
          </ProductCard>
        ))}
      </div>
    </DemoPage>
  ),
});
