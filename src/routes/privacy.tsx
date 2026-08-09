import { createFileRoute, Link } from "@tanstack/react-router";
import {
  MarketingHero,
  MarketingSection,
  MarketingShell,
  seoMeta,
} from "@/components/marketing/shell";
import { CONTACT_EMAIL, CONTACT_MAILTO } from "@/components/relay/contact";

export const Route = createFileRoute("/privacy")({
  head: () =>
    seoMeta({
      title: "Privacy | Artemis AI",
      description: "How Artemis approaches privacy for conversation data and customer workspaces.",
      path: "/privacy",
    }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <MarketingShell>
      <MarketingHero
        eyebrow="Privacy"
        title="Privacy overview."
        subtitle="A concise statement of intent. Full privacy terms for production deployments are shared during procurement."
      />
      <MarketingSection tone="white">
        <div className="max-w-3xl space-y-5 text-sm leading-relaxed text-[#4B5C76]">
          <p>
            Artemis processes conversation and workspace data to deliver coaching, analytics, and
            operational views for your organization. Customer data is intended to stay isolated by
            company boundaries.
          </p>
          <p>
            We do not sell customer conversation data. Access is designed around role-based
            membership. Retention and deletion paths are part of the product direction for
            enterprise customers.
          </p>
          <p>
            Questions about data handling:{" "}
            <a href={CONTACT_MAILTO} className="font-semibold text-[#12C48A] hover:underline">
              {CONTACT_EMAIL}
            </a>{" "}
            or{" "}
            <Link to="/contact" className="font-semibold text-[#12C48A] hover:underline">
              contact form
            </Link>
            . See also{" "}
            <Link to="/security" className="font-semibold text-[#12C48A] hover:underline">
              Security
            </Link>
            .
          </p>
        </div>
      </MarketingSection>
    </MarketingShell>
  );
}
