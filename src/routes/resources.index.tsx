import { createFileRoute, Link } from "@tanstack/react-router";
import {
  MarketingHero,
  MarketingSection,
  MarketingShell,
  seoMeta,
} from "@/components/marketing/shell";
import { ARTICLES } from "@/data/marketing/resources";

export const Route = createFileRoute("/resources/")({
  head: () =>
    seoMeta({
      title: "Resources | Artemis AI",
      description:
        "Guides and product updates on high-volume sales, AI coaching, and revenue intelligence.",
      path: "/resources",
    }),
  component: ResourcesHub,
});

function ResourcesHub() {
  return (
    <MarketingShell>
      <MarketingHero
        eyebrow="Resources"
        title="Practical writing for high-volume sales teams."
        subtitle="A small set of strong articles — not a flood of thin SEO posts."
      />
      <MarketingSection tone="white">
        <div className="grid gap-5 md:grid-cols-2">
          {ARTICLES.map((a) => (
            <Link
              key={a.slug}
              to="/resources/$slug"
              params={{ slug: a.slug }}
              className="rounded-[1.75rem] border border-[#E8EEF7] bg-white p-6 transition hover:border-[#2EE6A6]/50"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-[#8A9BB5]">
                {a.category} · {a.readingTime}
              </p>
              <h2 className="mt-2 text-xl font-semibold text-[#0B1B33]">{a.title}</h2>
              <p className="mt-2 text-sm text-[#4B5C76]">{a.description}</p>
            </Link>
          ))}
        </div>
      </MarketingSection>
    </MarketingShell>
  );
}
