import { createFileRoute } from "@tanstack/react-router";
import { MarketingPage } from "@/components/marketing/page-shell";
import { ContentCard, Reveal, Section } from "@/components/marketing/ui";
import { pageHead } from "@/lib/seo";
import { track } from "@/lib/analytics";
import { integrationsByCategory } from "@/lib/integrations/catalog";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/integrations")({
  head: () =>
    pageHead({
      title: "Integrations — Artemis",
      description:
        "See how Artemis connects to CRM, communication, productivity, and automation tools. Statuses are labelled honestly: available, in development, or planned.",
      path: "/integrations",
    }),
  component: Page,
});

function Page() {
  const groups = integrationsByCategory();

  return (
    <MarketingPage
      eyebrow="Integrations"
      title="Connect the systems your floor already uses."
      lede="Artemis is designed to sit alongside your dialer and CRM. Integration statuses below are labelled honestly—we never present a connector as live unless it is."
    >
      <Section>
        <p className="mb-6 text-sm text-muted-foreground">
          Current demo workspaces can ingest sample recordings and local fixtures. Production
          connectors ship progressively; ask during your demo about your stack. Webhooks and API are
          Available for configuration in the product demo.
        </p>
        <div className="space-y-10">
          {[...groups.entries()].map(([title, items]) => (
            <div key={title}>
              <h2 className="text-sm font-semibold tracking-wide text-foreground uppercase">
                {title}
              </h2>
              <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item, i) => (
                  <Reveal key={item.id} delay={i * 0.02}>
                    <button
                      type="button"
                      className="w-full text-left"
                      onClick={() =>
                        track("integration_clicked", {
                          name: item.name,
                          status: item.status,
                        })
                      }
                    >
                      <ContentCard className="flex items-center justify-between gap-3 py-4 transition-colors hover:border-primary/35">
                        <span className="text-sm font-medium">{item.name}</span>
                        <StatusBadge status={item.status} />
                      </ContentCard>
                    </button>
                  </Reveal>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>
    </MarketingPage>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "rounded-md px-2 py-0.5 text-[11px] font-medium",
        status === "Available" && "bg-success/15 text-success",
        status === "In development" && "bg-primary/15 text-primary",
        status === "Planned" && "bg-secondary text-muted-foreground",
      )}
    >
      {status}
    </span>
  );
}
