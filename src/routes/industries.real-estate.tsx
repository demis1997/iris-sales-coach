import { createFileRoute } from "@tanstack/react-router";
import { MarketingPage, FeatureList, CardGrid } from "@/components/marketing/page-shell";
import { Section } from "@/components/marketing/ui";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/industries/real-estate")({
  head: () =>
    pageHead({
      title: "Iris for Real Estate Sales Teams",
      description:
        "Help real-estate teams improve objection handling, urgency, and next-step discipline across agent conversations.",
      path: "/industries/real-estate",
    }),
  component: Page,
});

function Page() {
  return (
    <MarketingPage
      eyebrow="Real estate"
      title="Turn every buyer and seller conversation into team learning."
      lede="Iris coaches agents on discovery, objection handling, and closing discipline—and gives managers visibility into which behaviours actually move listings and offers."
    >
      <Section>
        <FeatureList
          items={[
            "Objection patterns across price, timing, and trust",
            "Next-step discipline after viewings and negotiations",
            "Best-call libraries for common scenarios",
            "Faster onboarding for new agents",
            "Less time writing notes after every conversation",
            "Branch and team performance comparisons",
          ]}
        />
      </Section>
      <Section>
        <CardGrid
          items={[
            {
              title: "Agents",
              text: "Private coaching after calls and viewings—specific and actionable.",
            },
            {
              title: "Team leads",
              text: "See who needs support on urgency, pricing conversations, or follow-up.",
            },
            {
              title: "Leadership",
              text: "Understand conversion trends without sitting on every recording.",
            },
          ]}
        />
      </Section>
    </MarketingPage>
  );
}
