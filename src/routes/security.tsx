import { createFileRoute, Link } from "@tanstack/react-router";
import {
  MarketingCTA,
  MarketingHero,
  MarketingSection,
  MarketingShell,
  FeatureGrid,
  seoMeta,
} from "@/components/marketing/shell";

export const Route = createFileRoute("/security")({
  head: () =>
    seoMeta({
      title: "Security | Artemis AI",
      description:
        "Artemis security posture — data isolation, access controls, encryption direction, retention, and roadmap. No unfinished certification claims.",
      path: "/security",
    }),
  component: SecurityPage,
});

function SecurityPage() {
  return (
    <MarketingShell>
      <MarketingHero
        eyebrow="Security"
        title="Designed with enterprise security in mind."
        subtitle="We describe architecture and intent honestly. We do not claim SOC 2, ISO 27001, or PCI DSS certifications we have not completed."
      />
      <MarketingSection eyebrow="Controls" title="What we design for" tone="white">
        <FeatureGrid
          items={[
            {
              title: "Data isolation",
              body: "Multi-tenant design with company boundaries and membership-based access.",
            },
            {
              title: "Access controls",
              body: "Role-based access patterns for agents, managers, and executives.",
            },
            {
              title: "Encryption",
              body: "Designed for encryption in transit and at rest for sensitive conversation data.",
            },
            {
              title: "Data retention",
              body: "Configurable retention direction to support operational and privacy needs.",
            },
            {
              title: "Infrastructure",
              body: "Modern cloud infrastructure with least-privilege operational practices.",
            },
            {
              title: "Auditability",
              body: "Access and sensitive actions are designed to be traceable for internal review.",
            },
          ]}
        />
      </MarketingSection>
      <MarketingSection
        eyebrow="Roadmap"
        title="Security roadmap"
        subtitle="Certifications and formal audits are pursued as the product and customer requirements mature. Until then, we use factual architecture language."
        tone="soft"
      >
        <ul className="space-y-3 text-sm text-[#4B5C76]">
          <li>• Formal compliance certifications when audits are completed — not before</li>
          <li>• GDPR-conscious workflow support (access, retention, erasure paths)</li>
          <li>• Enterprise SSO / provisioning as customer needs require</li>
        </ul>
        <p className="mt-6 text-sm text-[#8A9BB5]">
          Privacy and terms details can be discussed during procurement.{" "}
          <Link to="/contact" className="font-semibold text-[#12C48A] hover:underline">
            Contact us
          </Link>
          .
        </p>
      </MarketingSection>
      <MarketingCTA
        title="Questions about data handling?"
        subtitle="We'll walk through architecture, retention, and deployment expectations for your floor."
        primary={{ label: "Talk to Us", href: "/contact" }}
        secondary={{ label: "Explore Demo", href: "/demo" }}
      />
    </MarketingShell>
  );
}
