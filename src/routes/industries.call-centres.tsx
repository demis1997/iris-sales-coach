import { createFileRoute } from "@tanstack/react-router";
import { MarketingPage, FeatureList, CardGrid } from "@/components/marketing/page-shell";
import { Section } from "@/components/marketing/ui";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/industries/call-centres")({
  head: () =>
    pageHead({
      title: "Iris for Call Centres",
      description:
        "Quality at scale for call centres—coaching queues, consistent handling, and visibility across shifts without reviewing every recording manually.",
      path: "/industries/call-centres",
    }),
  component: Page,
});

function Page() {
  return (
    <MarketingPage
      eyebrow="Call centres"
      title="Quality and coaching that keep up with volume."
      lede="When hundreds of conversations happen every hour, random QA samples are not enough. Iris analyses every conversation and prioritises coaching where it moves outcomes."
    >
      <Section title="Built for centre operations">
        <FeatureList
          items={[
            "Shift and team performance visibility",
            "Coaching queues ranked by impact",
            "Consistent handling of objections and scripts",
            "Reduced manual QA sampling",
            "Faster onboarding with real call examples",
            "CRM note automation to protect talk time",
          ]}
        />
      </Section>
      <Section>
        <CardGrid
          items={[
            {
              title: "Managers",
              text: "Spend time coaching, not hunting for the next recording to review.",
            },
            {
              title: "Agents",
              text: "Get private, specific feedback after each conversation.",
            },
            {
              title: "Operations",
              text: "See quality trends across sites without waiting for month-end QA packs.",
            },
          ]}
        />
      </Section>
    </MarketingPage>
  );
}
