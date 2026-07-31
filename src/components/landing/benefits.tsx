import {
  ArrowUpRight,
  BadgeCheck,
  Bot,
  Check,
  GraduationCap,
  Minus,
  ScrollText,
  ShieldCheck,
  Timer,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import { Panel } from "@/components/artemis/primitives";
import { Reveal, Section } from "@/components/landing/marketing-bits";

const benefits = [
  {
    icon: TrendingUp,
    t: "Increase closing rates",
    d: "Every rep gets the objection language that actually converts on your product, not generic sales theory.",
    impact: "+4 pts close rate ≈ €1.1M added annual revenue on a 40-rep floor",
  },
  {
    icon: Timer,
    t: "Reduce onboarding time",
    d: "New hires are coached after their first call instead of their fourth week.",
    impact: "Ramp cut from 90 to 38 days ≈ €62K earlier revenue per hire",
  },
  {
    icon: Bot,
    t: "Coach every employee automatically",
    d: "100% of calls scored and coached — not the 2% a manager can sample.",
    impact: "Replaces ~1 coaching FTE per 25 reps",
  },
  {
    icon: ScrollText,
    t: "Identify your best scripts",
    d: "Artemis finds the phrasing that statistically precedes a close, then teaches it to the floor.",
    impact: "Winning-script rollout lifts desk conversion 6–11%",
  },
  {
    icon: ShieldCheck,
    t: "Improve compliance",
    d: "Required disclosures, prohibited claims and consent language checked on every regulated call.",
    impact: "One avoided regulatory penalty pays for years of Artemis",
  },
  {
    icon: UsersRound,
    t: "Reduce manager workload",
    d: "Managers stop auditing recordings and start acting on ranked, evidence-backed insights.",
    impact: "~14 hours per manager per week returned to selling",
  },
  {
    icon: GraduationCap,
    t: "Scale coaching without hiring",
    d: "Double the floor without doubling sales management or QA headcount.",
    impact: "Avoids ~€90K per additional sales trainer",
  },
];

export function Benefits() {
  return (
    <Section
      id="results"
      eyebrow="Business outcomes"
      title="What this does to your P&L"
      lede="Artemis is not bought as software. It is bought as revenue, retained margin and reduced risk."
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {benefits.map((b, i) => (
          <Reveal key={b.t} delay={(i % 3) * 0.06}>
            <Panel className="group flex h-full flex-col p-6 transition-transform hover:-translate-y-1">
              <span className="grid size-10 place-items-center rounded-xl bg-primary/12">
                <b.icon className="size-4 text-primary" />
              </span>
              <h3 className="mt-5 text-[0.95rem] font-semibold">{b.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.d}</p>
              <p className="mt-5 flex items-start gap-2 border-t border-border pt-4 text-xs text-cyan">
                <ArrowUpRight className="mt-0.5 size-3.5 shrink-0" />
                {b.impact}
              </p>
            </Panel>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

const capabilities = [
  ["AI Call Coach", "Personal coaching after every conversation"],
  ["Conversation Intelligence", "Topics, intent, momentum and outcome"],
  ["Confidence Detection", "Hesitation, authority and energy per minute"],
  ["Objection Intelligence", "Every objection, how it was handled, what wins"],
  ["Closing Analysis", "The exact moment a deal was lost"],
  ["Compliance Monitoring", "Disclosures, claims and consent on every call"],
  ["Manager Insights", "Ranked actions, not raw dashboards"],
  ["Performance Tracking", "Weekly improvement per rep and per desk"],
  ["Personalized Learning", "A curriculum built from the rep's own calls"],
  ["Weekly AI Reports", "An executive briefing every Monday morning"],
  ["Knowledge Base Coaching", "Coaching grounded in your product and policy"],
  ["Natural Language Search", "\"Show me lost forex calls that mentioned spreads\""],
];

export function Capabilities() {
  return (
    <Section
      id="platform"
      eyebrow="Capabilities"
      title="One platform, the whole revenue conversation"
      lede="Everything that happens on a call — understood, scored and turned into behaviour change."
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {capabilities.map(([t, d], i) => (
          <Reveal key={t} delay={(i % 3) * 0.05}>
            <Panel className="h-full p-5 transition-colors hover:border-primary/40">
              <div className="flex items-center gap-2">
                <BadgeCheck className="size-4 text-cyan" />
                <h3 className="text-sm font-semibold">{t}</h3>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </Panel>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

const comparison = [
  ["Call coverage", "Listen to random calls", "Every call analyzed"],
  ["Coaching speed", "Manual, days later", "Instant, after every call"],
  ["Feedback quality", "Subjective feedback", "Objective AI scoring"],
  ["Visibility", "Limited to sampled calls", "Company-wide insights"],
  ["Consistency", "Varies by manager", "Continuous, identical standard"],
  ["Proof of impact", "Anecdotal", "Measurable improvement"],
];

export function Comparison() {
  return (
    <Section
      eyebrow="Why Artemis is different"
      title="Traditional QA was built for sampling. Artemis was built for scale."
    >
      <Reveal>
        <Panel className="overflow-hidden p-0">
          <div className="grid grid-cols-[1.1fr_1fr_1fr] border-b border-border text-xs tracking-[0.14em] text-muted-foreground uppercase">
            <div className="px-5 py-4" />
            <div className="px-5 py-4">Traditional QA</div>
            <div className="bg-primary/8 px-5 py-4 text-foreground">Artemis</div>
          </div>
          {comparison.map(([k, a, b]) => (
            <div
              key={k}
              className="grid grid-cols-[1.1fr_1fr_1fr] border-b border-border last:border-0"
            >
              <div className="px-5 py-4 text-sm font-medium">{k}</div>
              <div className="flex items-start gap-2 px-5 py-4 text-sm text-muted-foreground">
                <Minus className="mt-0.5 size-3.5 shrink-0" />
                {a}
              </div>
              <div className="flex items-start gap-2 bg-primary/8 px-5 py-4 text-sm">
                <Check className="mt-0.5 size-3.5 shrink-0 text-success" />
                {b}
              </div>
            </div>
          ))}
        </Panel>
      </Reveal>
    </Section>
  );
}
