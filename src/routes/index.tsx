import { createFileRoute } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/marketing/layout";
import { HomeHero } from "@/components/marketing/home-hero";
import {
  AssistantSection,
  CapabilitiesSection,
  FinalCtaSection,
  IndustriesSection,
  OutcomeStrip,
  PipelineDemoSection,
  PlaybookSection,
  ProblemSection,
  RolesSection,
  SecurityTeaser,
  UseCasesSection,
  WorkflowSection,
} from "@/components/marketing/home-sections";
import { pageHead, softwareApplicationJsonLd } from "@/lib/seo";

const title = "Artemis — AI Sales Coaching and Revenue Intelligence";
const description =
  "Artemis analyses every sales conversation, coaches representatives, identifies pipeline risk, automates CRM updates, and gives managers visibility into what drives revenue.";

export const Route = createFileRoute("/")({
  head: () => ({
    ...pageHead({ title, description, path: "/" }),
    scripts: [softwareApplicationJsonLd(description)],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <MarketingLayout showAnnouncement>
      <HomeHero />
      <OutcomeStrip />
      <ProblemSection />
      <WorkflowSection />
      <CapabilitiesSection />
      <RolesSection />
      <AssistantSection />
      <PipelineDemoSection />
      <PlaybookSection />
      <IndustriesSection />
      <SecurityTeaser />
      <UseCasesSection />
      <FinalCtaSection />
    </MarketingLayout>
  );
}
