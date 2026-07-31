import { createFileRoute } from "@tanstack/react-router";
import { MarketingPage, FeatureList } from "@/components/marketing/page-shell";
import { ContentCard, Section } from "@/components/marketing/ui";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/solutions/executives")({
  head: () =>
    pageHead({
      title: "Artemis for Executives",
      description:
        "Understand what is driving or threatening revenue—pipeline risk, conversion drivers, coaching impact, and forecast confidence.",
      path: "/solutions/executives",
    }),
  component: Page,
});

function Page() {
  return (
    <MarketingPage
      eyebrow="For executives"
      title="Understand what is driving—or threatening—revenue."
      lede="See pipeline risk early, understand conversion drivers, and measure whether coaching investment is changing outcomes across teams and markets."
    >
      <Section title="What leadership gets">
        <div className="grid gap-4 md:grid-cols-2">
          <ContentCard>
            <h3 className="font-semibold">Revenue visibility</h3>
            <FeatureList
              items={[
                "See pipeline risk early",
                "Understand conversion drivers",
                "Track team productivity",
                "Measure coaching impact",
                "Compare branches, teams, and markets",
                "Improve forecast confidence",
              ]}
            />
          </ContentCard>
          <ContentCard>
            <h3 className="font-semibold">Conversation-backed forecasting</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Stage dates and subjective probability alone are not enough. Artemis surfaces deals where
              buyers show pricing hesitation, missing stakeholders, or no agreed next step—before
              the forecast slips.
            </p>
          </ContentCard>
        </div>
      </Section>
    </MarketingPage>
  );
}
