import { createFileRoute, Link } from "@tanstack/react-router";
import {
  MarketingCTA,
  MarketingHero,
  MarketingSection,
  MarketingShell,
  seoMeta,
} from "@/components/marketing/shell";

export const Route = createFileRoute("/company")({
  head: () =>
    seoMeta({
      title: "Company | Artemis AI",
      description:
        "Artemis is building the AI operating system for high-volume sales teams — turning conversations into coaching and revenue intelligence.",
      path: "/company",
    }),
  component: CompanyPage,
});

function CompanyPage() {
  return (
    <MarketingShell>
      <MarketingHero
        eyebrow="Company"
        title="We're building the AI operating system for high-volume sales teams."
        subtitle="Sales organizations generate thousands of conversations. Artemis turns those conversations into a continuously learning operating layer."
      />
      <MarketingSection eyebrow="Problem" title="The gap in every high-volume floor" tone="white">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["Managers cannot review every call", "Coaching becomes inconsistent and late."],
            ["Agents get uneven guidance", "Best practices stay trapped in a few top performers."],
            ["Executives see outcomes, not behavior", "CRMs show what happened — not why."],
          ].map(([t, b]) => (
            <article key={t} className="rounded-[1.5rem] border border-[#E8EEF7] bg-[#F7FAFF] p-6">
              <h3 className="font-semibold text-[#0B1B33]">{t}</h3>
              <p className="mt-2 text-sm text-[#4B5C76]">{b}</p>
            </article>
          ))}
        </div>
      </MarketingSection>
      <MarketingSection
        eyebrow="Approach"
        title="Conversation → understanding → action → improvement"
        subtitle="Live guidance, coaching, manager operations, and revenue intelligence share one intelligence layer."
        tone="soft"
      >
        <p className="max-w-3xl text-base leading-relaxed text-[#4B5C76]">
          We are early-stage and building with design partners. We do not invent employee counts,
          funding rounds, or office footprints. What we will show you is the product — and a clear
          path to try it on your floor.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/demo" className="text-sm font-semibold text-[#12C48A] hover:underline">
            Explore the product demo →
          </Link>
          <Link to="/security" className="text-sm font-semibold text-[#12C48A] hover:underline">
            Read security posture →
          </Link>
        </div>
      </MarketingSection>
      <MarketingCTA
        title="Build with us."
        subtitle="Become a design partner or book a walkthrough of the Apex Markets demo."
        primary={{ label: "Become a Design Partner", href: "/contact" }}
        secondary={{ label: "Explore Demo", href: "/demo" }}
      />
    </MarketingShell>
  );
}
