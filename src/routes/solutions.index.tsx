import { createFileRoute, Link } from "@tanstack/react-router";
import {
  MarketingHero,
  MarketingSection,
  MarketingShell,
  seoMeta,
} from "@/components/marketing/shell";
import { SOLUTIONS } from "@/data/marketing/solutions";

export const Route = createFileRoute("/solutions/")({
  head: () =>
    seoMeta({
      title: "Solutions | Artemis AI",
      description:
        "Artemis solutions for sales agents, managers, revenue leaders, QA, training, and compliance teams.",
      path: "/solutions",
    }),
  component: SolutionsHub,
});

function SolutionsHub() {
  return (
    <MarketingShell>
      <MarketingHero
        eyebrow="Solutions"
        title="Built for how revenue teams actually work."
        subtitle="Whether you sell, manage, lead, train, or review quality — Artemis connects conversations to better decisions."
        actions={
          <Link
            to="/demo"
            className="inline-flex rounded-full bg-[#2EE6A6] px-6 py-3 text-sm font-semibold text-[#0B1B33] shadow-lg shadow-[#2EE6A6]/30"
          >
            Explore Demo
          </Link>
        }
      />
      <MarketingSection tone="white">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {SOLUTIONS.map((s) => (
            <Link
              key={s.slug}
              to="/solutions/$slug"
              params={{ slug: s.slug }}
              className="rounded-[1.75rem] border border-[#E8EEF7] bg-white p-6 shadow-[0_12px_40px_-28px_rgba(15,40,80,0.3)] transition hover:border-[#2EE6A6]/50"
            >
              <h2 className="text-lg font-semibold text-[#0B1B33]">{s.title}</h2>
              <p className="mt-2 text-sm text-[#4B5C76]">{s.subtitle}</p>
              <p className="mt-4 text-sm font-semibold text-[#12C48A]">Learn more →</p>
            </Link>
          ))}
        </div>
      </MarketingSection>
    </MarketingShell>
  );
}
