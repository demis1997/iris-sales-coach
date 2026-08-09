import { createFileRoute, Link } from "@tanstack/react-router";
import {
  MarketingHero,
  MarketingSection,
  MarketingShell,
  seoMeta,
} from "@/components/marketing/shell";
import { CONTACT_EMAIL, CONTACT_MAILTO } from "@/components/relay/contact";

export const Route = createFileRoute("/terms")({
  head: () =>
    seoMeta({
      title: "Terms | Artemis AI",
      description: "Terms overview for using Artemis AI websites, demos, and early access.",
      path: "/terms",
    }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <MarketingShell>
      <MarketingHero
        eyebrow="Terms"
        title="Terms overview."
        subtitle="Simple rules for the public site and product demo. Commercial terms for design partners and customers are provided separately."
      />
      <MarketingSection tone="white">
        <div className="max-w-3xl space-y-5 text-sm leading-relaxed text-[#4B5C76]">
          <p>
            The Artemis website and interactive demo are provided for evaluation and product
            exploration. Demo data is simulated (including the Apex Markets story) and should not be
            treated as a live customer environment.
          </p>
          <p>
            Do not attempt to misuse the demo, scrape confidential materials, or represent demo
            outputs as production guarantees. AI assistance in Artemis is guidance — not legal,
            compliance, or financial advice.
          </p>
          <p>
            For commercial agreements, early access, or design partnerships, contact{" "}
            <a href={CONTACT_MAILTO} className="font-semibold text-[#12C48A] hover:underline">
              {CONTACT_EMAIL}
            </a>{" "}
            or use the{" "}
            <Link to="/contact" className="font-semibold text-[#12C48A] hover:underline">
              contact form
            </Link>
            .
          </p>
        </div>
      </MarketingSection>
    </MarketingShell>
  );
}
