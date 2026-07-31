import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/marketing/layout";
import { ContentCard, PageHero, Section } from "@/components/marketing/ui";
import { Button } from "@/components/ui/button";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/contact")({
  head: () =>
    pageHead({
      title: "Contact — Iris",
      description: "Contact Iris sales or support. Book a demo for product walkthroughs.",
      path: "/contact",
    }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <MarketingLayout>
      <PageHero
        title="Contact"
        lede="Reach the Iris team for demos, partnership, or security questionnaires."
      />
      <Section>
        <div className="grid gap-4 md:grid-cols-2">
          <ContentCard>
            <h2 className="font-semibold">Sales</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              For product demos and commercial questions.
            </p>
            <a href="mailto:sales@iris.sales" className="mt-4 inline-block text-sm text-primary hover:underline">
              sales@iris.sales
            </a>
            <Button className="mt-5" asChild>
              <Link to="/book-demo">Book a demo</Link>
            </Button>
          </ContentCard>
          <ContentCard>
            <h2 className="font-semibold">Security</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Responsible disclosure and enterprise security reviews.
            </p>
            <a
              href="mailto:security@iris.sales"
              className="mt-4 inline-block text-sm text-primary hover:underline"
            >
              security@iris.sales
            </a>
            <Button className="mt-5" variant="outline" asChild>
              <Link to="/security">Security overview</Link>
            </Button>
          </ContentCard>
        </div>
      </Section>
    </MarketingLayout>
  );
}
