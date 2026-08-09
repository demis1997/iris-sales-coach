import { createFileRoute, Link } from "@tanstack/react-router";
import {
  MarketingHero,
  MarketingSection,
  MarketingShell,
  seoMeta,
} from "@/components/marketing/shell";
import { INDUSTRIES } from "@/data/marketing/industries";

export const Route = createFileRoute("/industries/")({
  head: () =>
    seoMeta({
      title: "Industries | Artemis AI",
      description:
        "Artemis is designed for high-volume sales organizations across forex, insurance, financial services, real estate, BPOs, SaaS, and more.",
      path: "/industries",
    }),
  component: IndustriesHub,
});

function IndustriesHub() {
  return (
    <MarketingShell>
      <MarketingHero
        eyebrow="Industries"
        title="Built for high-volume revenue teams."
        subtitle="Industry focus areas — not a claim that every company in these markets is already a customer."
        actions={
          <Link
            to="/industries/$slug"
            params={{ slug: "forex" }}
            className="inline-flex rounded-full bg-[#2EE6A6] px-6 py-3 text-sm font-semibold text-[#0B1B33] shadow-lg shadow-[#2EE6A6]/30"
          >
            Explore Forex
          </Link>
        }
      />
      <MarketingSection tone="white">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {INDUSTRIES.map((i) => (
            <Link
              key={i.slug}
              to="/industries/$slug"
              params={{ slug: i.slug }}
              className="rounded-[1.75rem] border border-[#E8EEF7] bg-white p-6 transition hover:border-[#2EE6A6]/50"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-[#8A9BB5]">
                {i.featured ? "Beachhead" : "Industry"}
              </p>
              <h2 className="mt-2 text-lg font-semibold text-[#0B1B33]">{i.name}</h2>
              <p className="mt-2 text-sm text-[#4B5C76] line-clamp-3">{i.subtitle}</p>
            </Link>
          ))}
        </div>
      </MarketingSection>
    </MarketingShell>
  );
}
