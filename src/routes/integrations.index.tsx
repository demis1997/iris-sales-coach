import { createFileRoute, Link } from "@tanstack/react-router";
import {
  MarketingHero,
  MarketingSection,
  MarketingShell,
  seoMeta,
} from "@/components/marketing/shell";
import { INTEGRATIONS, statusLabel } from "@/data/marketing/integrations";

export const Route = createFileRoute("/integrations/")({
  head: () =>
    seoMeta({
      title: "Integrations | Artemis AI",
      description:
        "CRM, telephony, and data integrations for Artemis — planned and in-progress connectors clearly labeled.",
      path: "/integrations",
    }),
  component: IntegrationsHub,
});

function IntegrationsHub() {
  const groups = ["CRM", "Telephony", "Communication", "Data"] as const;
  return (
    <MarketingShell>
      <MarketingHero
        eyebrow="Integrations"
        title="Connect Artemis to the stack your floor already runs."
        subtitle="CRM and telephony connectors are planned or in progress. Demo screens may show simulated integrations until live connectors ship."
        actions={
          <Link
            to="/contact"
            className="inline-flex rounded-full bg-[#2EE6A6] px-6 py-3 text-sm font-semibold text-[#0B1B33] shadow-lg shadow-[#2EE6A6]/30"
          >
            Request an integration
          </Link>
        }
      />
      {groups.map((group) => {
        const items = INTEGRATIONS.filter((i) => i.category === group);
        if (!items.length) return null;
        return (
          <MarketingSection
            key={group}
            eyebrow={group}
            title={`${group} connectors`}
            tone={group === "CRM" || group === "Data" ? "white" : "soft"}
          >
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <Link
                  key={item.slug}
                  to="/integrations/$slug"
                  params={{ slug: item.slug }}
                  className="rounded-[1.5rem] border border-[#E8EEF7] bg-white p-5 transition hover:border-[#2EE6A6]/50"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold text-[#0B1B33]">{item.name}</h3>
                    <span className="rounded-full bg-[#F7FAFF] px-2 py-0.5 text-[11px] font-medium text-[#8A9BB5]">
                      {statusLabel(item.status)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-[#4B5C76]">{item.blurb}</p>
                </Link>
              ))}
            </div>
          </MarketingSection>
        );
      })}
    </MarketingShell>
  );
}
