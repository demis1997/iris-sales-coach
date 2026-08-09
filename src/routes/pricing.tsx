import { createFileRoute, Link } from "@tanstack/react-router";
import {
  MarketingCTA,
  MarketingHero,
  MarketingSection,
  MarketingShell,
  seoMeta,
} from "@/components/marketing/shell";

export const Route = createFileRoute("/pricing")({
  head: () =>
    seoMeta({
      title: "Pricing | Artemis AI",
      description:
        "Design Partner, Growth, and Enterprise options for Artemis. Pricing based on seats and conversation volume.",
      path: "/pricing",
    }),
  component: PricingPage,
});

const TIERS = [
  {
    name: "Design Partner",
    price: "Custom",
    blurb: "For early customers building Artemis around real workflows.",
    features: [
      "Call intelligence",
      "AI coaching",
      "Manager dashboard",
      "Executive dashboard",
      "Direct founder support",
    ],
    cta: "Become a Design Partner",
    href: "/contact",
    highlight: true,
  },
  {
    name: "Growth",
    price: "Contact sales",
    blurb: "For scaling sales teams ready for broader rollout.",
    features: [
      "Everything in Design Partner",
      "Expanded coaching & roleplay",
      "Team operations at scale",
      "Priority onboarding",
    ],
    cta: "Contact Sales",
    href: "/contact",
    highlight: false,
  },
  {
    name: "Enterprise",
    price: "Custom",
    blurb: "Custom deployment, retention, integrations, and security requirements.",
    features: [
      "Advanced access controls",
      "Custom integrations",
      "Security review support",
      "Dedicated success path",
    ],
    cta: "Contact Sales",
    href: "/contact",
    highlight: false,
  },
];

function PricingPage() {
  return (
    <MarketingShell>
      <MarketingHero
        eyebrow="Pricing"
        title="Simple commercial conversations for serious sales teams."
        subtitle="Pricing is based on seats and conversation volume. We do not publish fake discounts or promotional countdown offers."
      />
      <MarketingSection tone="white">
        <div className="grid gap-5 lg:grid-cols-3">
          {TIERS.map((tier) => (
            <article
              key={tier.name}
              className={
                tier.highlight
                  ? "rounded-[1.75rem] border border-[#2EE6A6]/40 bg-gradient-to-br from-[#E8FFF6] to-white p-7 shadow-[0_16px_50px_-30px_rgba(46,230,166,0.45)]"
                  : "rounded-[1.75rem] border border-[#E8EEF7] bg-white p-7"
              }
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-[#8A9BB5]">{tier.name}</p>
              <p className="mt-3 text-3xl font-bold tracking-tight text-[#0B1B33]">{tier.price}</p>
              <p className="mt-3 text-sm text-[#4B5C76]">{tier.blurb}</p>
              <ul className="mt-6 space-y-2 text-sm text-[#4B5C76]">
                {tier.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="text-[#12C48A]">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to={tier.href as "/"}
                className={
                  tier.highlight
                    ? "mt-8 inline-flex rounded-full bg-[#2EE6A6] px-5 py-2.5 text-sm font-semibold text-[#0B1B33]"
                    : "mt-8 inline-flex rounded-full border border-[#D7E0EF] px-5 py-2.5 text-sm font-semibold text-[#0B1B33]"
                }
              >
                {tier.cta}
              </Link>
            </article>
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-[#8A9BB5]">
          Need a walkthrough first?{" "}
          <Link to="/demo" className="font-semibold text-[#12C48A] hover:underline">
            Explore the product demo
          </Link>
          .
        </p>
      </MarketingSection>
      <MarketingCTA
        title="Talk through fit before commercials."
        subtitle="We'll map Artemis to your desks, telephony, and coaching workflow."
        primary={{ label: "Book a Demo", href: "/contact" }}
        secondary={{ label: "Explore Demo", href: "/demo" }}
      />
    </MarketingShell>
  );
}
