import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { MarketingPage, CardGrid } from "@/components/marketing/page-shell";
import { ContentCard, Section } from "@/components/marketing/ui";
import { Button } from "@/components/ui/button";
import { pageHead } from "@/lib/seo";
import { track } from "@/lib/analytics";

export const Route = createFileRoute("/security")({
  head: () =>
    pageHead({
      title: "Security — Artemis",
      description:
        "How Artemis approaches encryption, access control, data lifecycle, AI data use, and enterprise security reviews. No unverified certification claims.",
      path: "/security",
    }),
  component: Page,
});

function Page() {
  useEffect(() => {
    track("security_page_viewed", { source: "security_route" });
  }, []);

  return (
    <MarketingPage
      eyebrow="Security"
      title="Built for sensitive sales conversations."
      lede="This page describes our security posture honestly: what the product architecture supports today, what is on the roadmap, and how enterprises can review Artemis. We do not claim SOC 2, ISO 27001, GDPR certification, or PCI compliance unless achieved."
    >
      <Section title="Security architecture">
        <CardGrid
          items={[
            {
              title: "Encryption in transit",
              text: "Application traffic is served over TLS. Production deployments should terminate TLS at the edge.",
            },
            {
              title: "Encryption at rest",
              text: "Roadmap / infrastructure-dependent. Target state: encrypted object storage and encrypted database volumes for recordings and transcripts.",
            },
            {
              title: "Tenant isolation",
              text: "Organisation-scoped data access is a core product requirement. Demo mode uses fixture data; production must enforce strict tenant boundaries server-side.",
            },
            {
              title: "Role-based permissions",
              text: "Conceptual roles include representative, manager, director, executive, and administrator—with least-privilege visibility.",
            },
          ]}
        />
      </Section>

      <Section title="Data lifecycle">
        <ContentCard className="max-w-3xl space-y-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            <strong className="text-foreground">Ingest:</strong> Calls enter via connected sources
            or uploads. Consent and recording policies remain the customer’s responsibility to
            configure lawfully.
          </p>
          <p>
            <strong className="text-foreground">Process:</strong> Transcripts and analyses are
            generated to power coaching, search, and reporting.
          </p>
          <p>
            <strong className="text-foreground">Retain:</strong> Configurable retention is on the
            roadmap for enterprise plans.
          </p>
          <p>
            <strong className="text-foreground">Export & deletion:</strong> Data export and deletion
            workflows are planned for administrators; contact us for current process during pilots.
          </p>
        </ContentCard>
      </Section>

      <Section title="Access controls">
        <CardGrid
          items={[
            {
              title: "Authentication",
              text: "Demo workspaces are currently open for product evaluation. Production login, MFA, and SSO (enterprise) are planned.",
            },
            {
              title: "Authorisation",
              text: "Representatives should only see their own coaching and calls unless granted broader permission.",
            },
            {
              title: "Audit logs",
              text: "Roadmap: exportable records of sensitive access and configuration changes.",
            },
            {
              title: "SCIM provisioning",
              text: "Roadmap for enterprise identity lifecycle management.",
            },
          ]}
        />
      </Section>

      <Section title="Tenant isolation">
        <ContentCard className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
          <p>
            Every organisation is a hard boundary. Queries, coaching stores, integrations, and
            reporting must be scoped by organisation ID on the server. The demo enforces this in
            client helpers; production requires equivalent server-side checks.
          </p>
        </ContentCard>
      </Section>

      <Section title="Retention and deletion">
        <ContentCard className="max-w-3xl space-y-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            Configurable retention windows and admin-initiated deletion are enterprise roadmap
            items. During pilots, contact Artemis for the current export and deletion process.
          </p>
          <p>
            We do not claim automated right-to-erasure workflows are generally available until they
            ship.
          </p>
        </ContentCard>
      </Section>

      <Section title="Recording consent">
        <ContentCard className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Customers remain responsible for lawful recording consent in their jurisdictions. Artemis can
          store consent configuration and source metadata when connected; it does not replace legal
          advice or local notice requirements.
        </ContentCard>
      </Section>

      <Section title="AI data use policy">
        <ContentCard className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
          <p>
            Customer conversation data is used to provide Artemis features for that customer’s
            organisation. We will not train public foundation models on your private call content
            without an explicit contractual agreement. Fine-grained data-use controls and redaction
            options are on the product roadmap.
          </p>
        </ContentCard>
      </Section>

      <Section title="Subprocessors">
        <ContentCard className="max-w-3xl text-sm text-muted-foreground">
          A formal subprocessors list will be published for production customers. During evaluation,
          ask your Artemis contact for the current hosting and AI processing providers relevant to your
          region.
        </ContentCard>
      </Section>

      <Section title="Responsible disclosure">
        <ContentCard className="max-w-3xl">
          <p className="text-sm text-muted-foreground">
            If you believe you have found a security issue, email{" "}
            <a href="mailto:security@artemis.sales" className="text-primary hover:underline">
              security@artemis.sales
            </a>{" "}
            with steps to reproduce. Please give us a reasonable window to investigate before public
            disclosure.
          </p>
          <Button className="mt-5" variant="outline" asChild>
            <Link to="/book-demo">Request enterprise security questionnaire</Link>
          </Button>
        </ContentCard>
      </Section>

      <Section title="EU data region & private deployment">
        <ContentCard className="max-w-3xl text-sm text-muted-foreground">
          EU data-region options and private deployment paths are enterprise roadmap items. We will
          not market them as generally available until they are.
        </ContentCard>
      </Section>
    </MarketingPage>
  );
}
