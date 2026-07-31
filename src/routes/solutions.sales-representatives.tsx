import { createFileRoute } from "@tanstack/react-router";
import { MarketingPage, FeatureList } from "@/components/marketing/page-shell";
import { ContentCard, Section } from "@/components/marketing/ui";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/solutions/sales-representatives")({
  head: () =>
    pageHead({
      title: "Artemis for Sales Representatives",
      description:
        "A private AI coach for every call—next-call prep, objection practice, personal progress, and less CRM admin.",
      path: "/solutions/sales-representatives",
    }),
  component: Page,
});

function Page() {
  return (
    <MarketingPage
      eyebrow="For sales representatives"
      title="A private AI coach for every call."
      lede="Know what to improve, prepare for the next conversation, and learn from the organisation’s best calls—without waiting for a manager to free up calendar time."
    >
      <Section title="What representatives get">
        <div className="grid gap-4 md:grid-cols-2">
          <ContentCard>
            <h3 className="font-semibold">After every conversation</h3>
            <FeatureList
              items={[
                "Know exactly what to improve",
                "Prepare for the next conversation",
                "Practise difficult objections",
                "Track personal development",
                "Reduce CRM administration",
                "Learn from the organisation’s best calls",
              ]}
            />
          </ContentCard>
          <ContentCard>
            <h3 className="font-semibold">What it feels like day to day</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Finish a call. Artemis surfaces one clear coaching focus with evidence from the
              transcript. Draft the follow-up. See progress on discovery, listening, and closing
              over weeks—not only a single score.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Communication style insights describe how you sell (consultative vs presentation-led,
              concise vs detailed)—not personality diagnoses.
            </p>
          </ContentCard>
        </div>
      </Section>
    </MarketingPage>
  );
}
