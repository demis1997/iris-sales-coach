import { createFileRoute } from "@tanstack/react-router";
import { MarketingPage, FeatureList } from "@/components/marketing/page-shell";
import { ContentCard, Section } from "@/components/marketing/ui";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/solutions/sales-managers")({
  head: () =>
    pageHead({
      title: "Iris for Sales Managers",
      description:
        "Coach the right person on the right skill—priorities, skill gaps, behaviour change, and fair comparisons.",
      path: "/solutions/sales-managers",
    }),
  component: Page,
});

function Page() {
  return (
    <MarketingPage
      eyebrow="For sales managers"
      title="Coach the right person on the right skill."
      lede="Stop sampling random calls. Iris ranks coaching by expected impact, shows team skill gaps, and helps you prove whether coaching changed behaviour."
    >
      <Section title="What managers get">
        <div className="grid gap-4 md:grid-cols-2">
          <ContentCard>
            <h3 className="font-semibold">Coaching with evidence</h3>
            <FeatureList
              items={[
                "Stop manually reviewing random calls",
                "Identify team-wide skill gaps",
                "Prioritise coaching by expected impact",
                "Track whether coaching changes behaviour",
                "Compare teams and representatives fairly",
                "Find examples from top performers",
              ]}
            />
          </ContentCard>
          <ContentCard>
            <h3 className="font-semibold">Built for the reality of the floor</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              You cannot listen to every call. Iris can. Your queue becomes “who needs discovery
              coaching this week,” not “whoever you happened to overhear.”
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Leaderboards emphasise improvement and skill strengths—not only volume—so recognition
              stays motivational rather than punitive.
            </p>
          </ContentCard>
        </div>
      </Section>
    </MarketingPage>
  );
}
