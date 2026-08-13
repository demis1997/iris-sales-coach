import { createFileRoute } from "@tanstack/react-router";
import { ArrowDown } from "lucide-react";
import { DemoPage } from "@/components/demo/demo-shell";
import { PageHeader, ProductCard, StatusBadge } from "@/components/product/ui";
import { APEX_ROUTING_RULES } from "@/data/demo/org";

export const Route = createFileRoute("/demo/admin/routing")({
  component: AdminRoutingPage,
});

function AdminRoutingPage() {
  return (
    <DemoPage>
      <PageHeader
        eyebrow="Admin · Call Routing"
        title="Inbound routing"
        subtitle="Business hours, queues and overflow — configured as Artemis Voice rules."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {APEX_ROUTING_RULES.map((rule) => (
          <ProductCard
            key={rule.id}
            title={rule.name}
            subtitle={rule.number}
            action={<StatusBadge tone="live">Active</StatusBadge>}
          >
            <ol className="space-y-0">
              <li className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-center text-sm font-medium text-[#F7FAFF]">
                Incoming call
              </li>
              {rule.flow.map((step) => (
                <li key={step} className="flex flex-col items-center">
                  <ArrowDown className="my-1.5 size-4 text-[#2EE6A6]" />
                  <div className="w-full rounded-xl border border-white/[0.08] bg-[#0B1B33]/60 px-3 py-2.5 text-center text-sm text-[#F7FAFF]">
                    {step}
                  </div>
                </li>
              ))}
            </ol>
          </ProductCard>
        ))}
      </div>

      <ProductCard title="Example: UK Sales after hours" subtitle="Visual flow">
        <div className="mx-auto flex max-w-lg flex-col items-center gap-0 py-2">
          {[
            "Incoming Call",
            "Business Hours?",
            "YES → UK Sales Queue",
            "NO → Recorded Message → Callback Task",
          ].map((step, i) => (
            <div key={step} className="flex w-full flex-col items-center">
              {i > 0 ? <ArrowDown className="my-2 size-4 text-[#2EE6A6]" /> : null}
              <div
                className={`w-full rounded-xl border px-4 py-3 text-center text-sm font-medium ${
                  i === 0
                    ? "border-[#2EE6A6]/40 bg-[#2EE6A6]/10 text-[#2EE6A6]"
                    : "border-white/[0.08] bg-white/[0.03] text-[#F7FAFF]"
                }`}
              >
                {step}
              </div>
            </div>
          ))}
        </div>
      </ProductCard>
    </DemoPage>
  );
}
