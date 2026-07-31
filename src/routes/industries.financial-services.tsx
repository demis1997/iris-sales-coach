import { createFileRoute } from "@tanstack/react-router";
import { MarketingPage, FeatureList, CardGrid } from "@/components/marketing/page-shell";
import { Section } from "@/components/marketing/ui";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/industries/financial-services")({
  head: () =>
    pageHead({
      title: "Iris for Financial Services",
      description:
        "Conversation intelligence for financial services sales—discovery quality, forecast confidence, and coaching across complex products.",
      path: "/industries/financial-services",
    }),
  component: Page,
});

function Page() {
  return (
    <MarketingPage
      eyebrow="Financial services"
      title="Complex products need conversation-backed sales discipline."
      lede="Iris helps wealth, banking, and financial product teams coach discovery quality, surface pipeline risk, and keep CRM records complete—without claiming to replace compliance programmes."
    >
      <Section>
        <FeatureList
          items={[
            "Longer sales cycles with clearer next-step discipline",
            "Stakeholder and decision-criteria capture from calls",
            "Objection and competitor intelligence",
            "Forecast confidence grounded in buyer conversations",
            "Playbooks for product-specific conversations",
            "Manager visibility across branches and teams",
          ]}
        />
      </Section>
      <Section>
        <CardGrid
          items={[
            {
              title: "Pipeline risk",
              text: "Identify deals lacking urgency, decision-makers, or agreed next steps.",
            },
            {
              title: "Coaching ROI",
              text: "Connect coaching activity to behaviour change and conversion trends.",
            },
            {
              title: "Knowledge transfer",
              text: "Turn top advisors’ language into searchable examples for the team.",
            },
          ]}
        />
      </Section>
    </MarketingPage>
  );
}
