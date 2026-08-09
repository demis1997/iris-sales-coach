import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  MarketingCTA,
  MarketingHero,
  MarketingSection,
  MarketingShell,
  seoMeta,
} from "@/components/marketing/shell";
import { getIntegration, statusLabel } from "@/data/marketing/integrations";

export const Route = createFileRoute("/integrations/$slug")({
  head: ({ params }) => {
    const item = getIntegration(params.slug);
    if (!item) return {};
    return seoMeta({
      title: `${item.name} Integration | Artemis AI`,
      description: item.blurb,
      path: `/integrations/${item.slug}`,
    });
  },
  component: IntegrationDetail,
});

function IntegrationDetail() {
  const { slug } = Route.useParams();
  const item = getIntegration(slug);
  if (!item) throw notFound();
  return (
    <MarketingShell>
      <MarketingHero
        eyebrow={`${item.category} · ${statusLabel(item.status)}`}
        title={`Bring conversation intelligence into ${item.name}.`}
        subtitle={item.blurb}
        actions={
          <>
            <Link
              to="/contact"
              className="inline-flex rounded-full bg-[#2EE6A6] px-6 py-3 text-sm font-semibold text-[#0B1B33] shadow-lg shadow-[#2EE6A6]/30"
            >
              {item.status === "planned" ? "Request Integration" : "Talk to Us"}
            </Link>
            <Link
              to="/integrations"
              className="inline-flex rounded-full border border-[#D7E0EF] px-6 py-3 text-sm font-semibold"
            >
              All integrations
            </Link>
          </>
        }
      />
      <MarketingSection eyebrow="Workflow" title="Planned workflow" tone="white">
        <ol className="space-y-3">
          {item.workflow.map((step, i) => (
            <li
              key={step}
              className="flex gap-3 rounded-2xl border border-[#E8EEF7] bg-[#F7FAFF] px-5 py-4 text-sm text-[#4B5C76]"
            >
              <span className="font-semibold text-[#12C48A]">{i + 1}</span>
              {step}
            </li>
          ))}
        </ol>
        {item.status !== "available" ? (
          <p className="mt-6 text-sm text-[#8A9BB5]">
            This integration is {statusLabel(item.status).toLowerCase()}. It is not presented as live
            availability.
          </p>
        ) : null}
      </MarketingSection>
      <MarketingCTA
        title="Building with design partners."
        subtitle="Tell us which systems your floor runs — we prioritize connectors with real workflows."
        primary={{ label: "Become a Design Partner", href: "/contact" }}
        secondary={{ label: "Explore Demo", href: "/demo" }}
      />
    </MarketingShell>
  );
}
