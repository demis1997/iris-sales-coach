import { createFileRoute } from "@tanstack/react-router";
import { DemoPage } from "@/components/demo/demo-shell";
import { PageHeader, ProductCard, StatusBadge } from "@/components/product/ui";

export const Route = createFileRoute("/demo/admin/compliance")({
  component: () => (
    <DemoPage>
      <PageHeader
        eyebrow="Admin · Compliance"
        title="Compliance controls"
        subtitle="Recording notice, risk disclosure prompts and QA alert policies."
      />
      <ProductCard title="Active policies" subtitle="Demo configuration">
        <ul className="space-y-3 text-sm text-[#C5D0E0]">
          {[
            "Recording disclosure required in first 30 seconds",
            "Risk warning before deposit discussion",
            "QA alert on prohibited claims",
            "Manager review queue for scores below 65",
          ].map((t) => (
            <li
              key={t}
              className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.06] px-3 py-2.5"
            >
              <span>{t}</span>
              <StatusBadge tone="live">On</StatusBadge>
            </li>
          ))}
        </ul>
      </ProductCard>
    </DemoPage>
  ),
});
