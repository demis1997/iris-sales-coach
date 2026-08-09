import {
  BadgeCheck,
  Bot,
  GraduationCap,
  ScrollText,
  ShieldCheck,
  Timer,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import { Panel } from "@/components/iris/primitives";
import { Reveal, Section } from "@/components/landing/marketing-bits";

const benefits = [
  {
    icon: TrendingUp,
    t: "Identify behaviours that influence conversion",
    d: "Surface the objection language and call patterns that show up before wins — grounded in your own conversations.",
  },
  {
    icon: Timer,
    t: "Help new hires improve sooner",
    d: "Give agents coaching after conversations instead of waiting for a weekly 1:1 sample.",
  },
  {
    icon: Bot,
    t: "Coach after every conversation",
    d: "Let managers review the calls that need attention instead of manually listening to every recording.",
  },
  {
    icon: ScrollText,
    t: "Find what top performers actually say",
    d: "Turn winning moments into playbooks the rest of the floor can practice.",
  },
  {
    icon: ShieldCheck,
    t: "Support compliance workflows",
    d: "Flag missing disclosures and risky claims with evidence for human review.",
  },
  {
    icon: UsersRound,
    t: "Focus manager time where it matters",
    d: "Ranked insights and coaching queues — not vanity dashboards.",
  },
  {
    icon: GraduationCap,
    t: "Scale coaching without scaling headcount first",
    d: "Pair AI coaching and roleplay with manager oversight as the floor grows.",
  },
];

export function Benefits() {
  return (
    <Section
      id="results"
      eyebrow="Capabilities"
      title="What Artemis is built to do for your floor"
      lede="Product capabilities — not fabricated customer ROI numbers."
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
  ["Natural Language Search", '"Show me lost forex calls that mentioned spreads"'],
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
