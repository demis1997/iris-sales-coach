import { Link } from "@tanstack/react-router";
import {
  FeatureGrid,
  MarketingCTA,
  MarketingHero,
  MarketingSection,
  MarketingShell,
} from "@/components/marketing/shell";
import type { SolutionPage } from "@/data/marketing/solutions";
import type { IndustryPage } from "@/data/marketing/industries";

export function SolutionMarketingPage({ solution }: { solution: SolutionPage }) {
  return (
    <MarketingShell>
      <MarketingHero
        eyebrow="Solutions"
        title={solution.title}
        subtitle={solution.subtitle}
        actions={
          <>
            <Link
              to={solution.demoHref as "/"}
              className="inline-flex rounded-full bg-[#2EE6A6] px-6 py-3 text-sm font-semibold text-[#0B1B33] shadow-lg shadow-[#2EE6A6]/30 hover:bg-[#5cf0bc]"
            >
              {solution.demoLabel}
            </Link>
            <Link
              to="/contact"
              className="inline-flex rounded-full border border-[#D7E0EF] bg-white px-6 py-3 text-sm font-semibold"
            >
              Book a Demo
            </Link>
          </>
        }
      />
      <MarketingSection eyebrow="Focus" title="What Artemis helps with" tone="white">
        <FeatureGrid items={solution.points} />
      </MarketingSection>
      <MarketingSection eyebrow="Outcomes" title="What teams aim to improve" tone="soft">
        <ul className="grid gap-3 md:grid-cols-3">
          {solution.outcomes.map((o) => (
            <li
              key={o}
              className="rounded-2xl border border-[#E8EEF7] bg-white px-5 py-4 text-sm font-medium text-[#0B1B33]"
            >
              {o}
            </li>
          ))}
        </ul>
      </MarketingSection>
      <MarketingCTA
        title="See the workflow in the product demo."
        subtitle="Explore a realistic Apex Markets floor, then talk with us about your team."
        primary={{ label: solution.demoLabel, href: solution.demoHref }}
        secondary={{ label: "Book a Demo", href: "/contact" }}
      />
    </MarketingShell>
  );
}

export function IndustryMarketingPage({ industry }: { industry: IndustryPage }) {
  return (
    <MarketingShell>
      <MarketingHero
        eyebrow={industry.name}
        title={industry.title}
        subtitle={industry.subtitle}
        actions={
          <>
            <Link
              to={industry.demoHref as "/"}
              className="inline-flex rounded-full bg-[#2EE6A6] px-6 py-3 text-sm font-semibold text-[#0B1B33] shadow-lg shadow-[#2EE6A6]/30 hover:bg-[#5cf0bc]"
            >
              {industry.demoLabel}
            </Link>
            <Link
              to="/contact"
              className="inline-flex rounded-full border border-[#D7E0EF] bg-white px-6 py-3 text-sm font-semibold"
            >
              Book a Demo
            </Link>
          </>
        }
      />
      <MarketingSection eyebrow="Challenges" title="What these teams struggle with" tone="white">
        <ul className="grid gap-3 md:grid-cols-2">
          {industry.pains.map((p) => (
            <li key={p} className="rounded-2xl border border-[#E8EEF7] bg-[#F7FAFF] px-5 py-4 text-sm text-[#4B5C76]">
              {p}
            </li>
          ))}
        </ul>
      </MarketingSection>
      <MarketingSection eyebrow="By role" title="How Artemis helps" tone="soft">
        <div className="grid gap-4 md:grid-cols-3">
          {industry.helps.map((h) => (
            <article key={h.role} className="rounded-[1.5rem] border border-[#E8EEF7] bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#12C48A]">{h.role}</p>
              <p className="mt-2 text-sm text-[#4B5C76]">{h.body}</p>
            </article>
          ))}
        </div>
      </MarketingSection>
      <MarketingSection eyebrow="Capabilities" title="Relevant product areas" tone="white">
        <FeatureGrid items={industry.capabilities} />
      </MarketingSection>
      <MarketingCTA
        title="Explore Artemis on a realistic sales floor."
        subtitle="Start with the interactive demo, then talk through your workflows with us."
        primary={{ label: industry.demoLabel, href: industry.demoHref }}
        secondary={{ label: "Become a Design Partner", href: "/contact" }}
      />
    </MarketingShell>
  );
}
