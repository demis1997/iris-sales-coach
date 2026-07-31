import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Check } from "lucide-react";
import { MarketingLayout } from "@/components/marketing/layout";
import { ContentCard, PageHero, Reveal, Section } from "@/components/marketing/ui";
import { Button } from "@/components/ui/button";
import { pageHead } from "@/lib/seo";
import { track } from "@/lib/analytics";
import { PRICING_FAQS, PRICING_PLANS, recommendPlan } from "@/lib/pricing/plans";

export const Route = createFileRoute("/pricing")({
  head: () =>
    pageHead({
      title: "Pricing — Artemis",
      description:
        "Starter, Growth, and Enterprise plans for sales teams that need coaching, pipeline intelligence, and management visibility. Book a demo for a scoped quote.",
      path: "/pricing",
    }),
  component: PricingPage,
});

function PricingPage() {
  const [reps, setReps] = useState(15);
  const [calls, setCalls] = useState(80);
  const [minutes, setMinutes] = useState(12);

  useEffect(() => {
    track("pricing_viewed");
  }, []);

  const estimate = useMemo(
    () =>
      recommendPlan({
        representatives: reps,
        monthlyCallsPerRep: calls,
        averageCallMinutes: minutes,
      }),
    [reps, calls, minutes],
  );

  return (
    <MarketingLayout>
      <PageHero
        eyebrow="Pricing"
        title="Plans for desks that need coaching and revenue visibility"
        lede="Example starting prices for planning conversations. Final commercial terms are scoped to seats, analysed minutes, and enterprise requirements during your demo."
        actions={
          <Button asChild>
            <Link
              to="/book-demo"
              onClick={() => track("book_demo_cta_clicked", { source: "pricing_hero" })}
            >
              Book a demo
            </Link>
          </Button>
        }
      />

      <Section>
        <div className="grid gap-4 lg:grid-cols-3">
          {PRICING_PLANS.map((plan, i) => (
            <Reveal key={plan.id} delay={i * 0.06}>
              <ContentCard
                className={
                  plan.featured
                    ? "flex h-full flex-col border-primary/30 bg-primary/5"
                    : "flex h-full flex-col"
                }
              >
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-lg font-semibold">{plan.name}</h2>
                  {plan.featured ? (
                    <span className="rounded-md bg-primary/15 px-2 py-0.5 text-[11px] text-primary">
                      Most popular
                    </span>
                  ) : null}
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{plan.description}</p>
                <p className="mt-6 text-3xl font-semibold tracking-tight">
                  {plan.priceLabel}
                  <span className="text-sm font-normal text-muted-foreground">{plan.period}</span>
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Example starting point · configurable
                </p>
                <ul className="mt-6 flex-1 space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  className="mt-7 w-full"
                  variant={plan.featured ? "default" : "outline"}
                  asChild
                >
                  <Link to="/book-demo">{plan.cta}</Link>
                </Button>
              </ContentCard>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Usage selector"
        title="Estimate which plan fits your floor"
        lede="This selector is guidance only. It does not generate a binding quote or hardcode unit economics into billing."
      >
        <ContentCard className="max-w-2xl space-y-5">
          <SliderField label="Representatives" value={reps} min={3} max={120} onChange={setReps} />
          <SliderField
            label="Average monthly calls per rep"
            value={calls}
            min={20}
            max={250}
            onChange={setCalls}
          />
          <SliderField
            label="Average call duration (minutes)"
            value={minutes}
            min={4}
            max={45}
            onChange={setMinutes}
          />
          <div className="rounded-lg border border-border bg-secondary/30 px-4 py-3 text-sm">
            <p className="font-medium">Rough monthly analysed minutes</p>
            <p className="mt-1 font-mono text-lg tabular-nums">
              {estimate.monthlyMinutes.toLocaleString()}
            </p>
            <p className="mt-2 text-muted-foreground">{estimate.guidance}</p>
          </div>
        </ContentCard>
      </Section>

      <Section eyebrow="FAQ" title="Common pricing questions">
        <div className="mx-auto max-w-3xl space-y-3">
          {PRICING_FAQS.map((faq, i) => (
            <Reveal key={faq.question} delay={i * 0.03}>
              <ContentCard>
                <h3 className="text-sm font-semibold">{faq.question}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{faq.answer}</p>
              </ContentCard>
            </Reveal>
          ))}
        </div>
      </Section>
    </MarketingLayout>
  );
}

function SliderField({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (n: number) => void;
}) {
  return (
    <label className="block">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span>{label}</span>
        <span className="font-mono tabular-nums text-muted-foreground">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[var(--primary)]"
      />
    </label>
  );
}
