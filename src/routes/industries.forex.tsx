import { createFileRoute } from "@tanstack/react-router";
import { MarketingPage, FeatureList, CardGrid } from "@/components/marketing/page-shell";
import { ContentCard, Section } from "@/components/marketing/ui";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/industries/forex")({
  head: () =>
    pageHead({
      title: "Iris for Forex & Brokerages",
      description:
        "Coach high-volume forex desks, improve first-deposit conversion, monitor script adherence, and compare desks—without claiming guaranteed compliance.",
      path: "/industries/forex",
    }),
  component: Page,
});

function Page() {
  return (
    <MarketingPage
      eyebrow="Forex & brokerages"
      title="High-volume desks need coaching and visibility at scale."
      lede="Iris helps forex and brokerage teams analyse multilingual conversations, reinforce playbooks, and surface conversion risk across desks—while leaving regulatory judgement to your compliance function."
    >
      <Section title="Where Iris helps on the floor">
        <div className="grid gap-4 md:grid-cols-2">
          <ContentCard>
            <FeatureList
              items={[
                "High call volumes across desks and shifts",
                "Script and disclosure adherence monitoring",
                "Objection handling for pricing, trust, and competitors",
                "First-deposit conversion patterns",
                "Lead-quality signals from conversation content",
                "Retention and reactivation call quality",
                "Team and desk comparisons",
                "Multilingual conversation analysis",
              ]}
            />
          </ContentCard>
          <ContentCard>
            <h3 className="font-semibold">Important note on compliance</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Iris can help you monitor whether required disclosures and scripts appear in
              conversations, and flag moments for review. Iris does not guarantee regulatory
              compliance. Your compliance and legal teams remain responsible for policy design and
              regulatory obligations.
            </p>
          </ContentCard>
        </div>
      </Section>
      <Section title="Typical outcomes teams seek">
        <CardGrid
          items={[
            {
              title: "Faster ramp for new brokers",
              text: "Train on real desk calls and roleplay the objections that appear most often.",
            },
            {
              title: "Consistent execution",
              text: "Turn top-desk behaviour into playbooks every desk can follow.",
            },
            {
              title: "Earlier risk detection",
              text: "Spot weak discovery and pricing-first patterns before conversion drops.",
            },
          ]}
        />
      </Section>
    </MarketingPage>
  );
}
