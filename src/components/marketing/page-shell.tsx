import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { MarketingLayout } from "@/components/marketing/layout";
import { ContentCard, PageHero, Reveal, Section } from "@/components/marketing/ui";
import { Button } from "@/components/ui/button";
import { track } from "@/lib/analytics";

export function MarketingPage({
  eyebrow,
  title,
  lede,
  children,
  showAnnouncement = false,
}: {
  eyebrow?: string;
  title: ReactNode;
  lede: string;
  children: ReactNode;
  showAnnouncement?: boolean;
}) {
  return (
    <MarketingLayout showAnnouncement={showAnnouncement}>
      <PageHero
        eyebrow={eyebrow}
        title={title}
        lede={lede}
        actions={
          <>
            <Button asChild>
              <Link
                to="/book-demo"
                onClick={() => track("book_demo_cta_clicked", { source: "page_hero" })}
              >
                Book a demo <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/product">Explore the platform</Link>
            </Button>
          </>
        }
      />
      {children}
      <Section align="center">
        <Reveal className="mx-auto max-w-xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight">
            Ready to see Iris on your conversations?
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Book a personalised demo with your team structure, call volume, and CRM in mind.
          </p>
          <Button className="mt-6" asChild>
            <Link to="/book-demo">Book a personalised demo</Link>
          </Button>
        </Reveal>
      </Section>
    </MarketingLayout>
  );
}

export function FeatureList({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
          <Check className="mt-0.5 size-3.5 shrink-0 text-success" aria-hidden />
          {item}
        </li>
      ))}
    </ul>
  );
}

export function CardGrid({
  items,
}: {
  items: { title: string; text: string }[];
}) {
  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item, i) => (
        <Reveal key={item.title} delay={i * 0.03}>
          <ContentCard className="h-full">
            <h3 className="text-sm font-semibold">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
          </ContentCard>
        </Reveal>
      ))}
    </div>
  );
}

export function PlaceholderPage({
  title,
  description,
  body,
}: {
  title: string;
  description: string;
  body: string;
}) {
  return (
    <MarketingLayout>
      <PageHero title={title} lede={description} />
      <Section>
        <ContentCard className="max-w-3xl">
          <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
          <p className="mt-4 text-sm text-muted-foreground">
            Questions?{" "}
            <Link to="/contact" className="text-primary hover:underline">
              Contact us
            </Link>{" "}
            or{" "}
            <Link to="/book-demo" className="text-primary hover:underline">
              book a demo
            </Link>
            .
          </p>
        </ContentCard>
      </Section>
    </MarketingLayout>
  );
}
