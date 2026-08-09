import {
  ArrowDown,
  BookOpenCheck,
  BrainCircuit,
  ClipboardX,
  Ear,
  Gauge,
  HeadphonesIcon,
  LineChart,
  PhoneCall,
  ScaleIcon,
  ShieldAlert,
  Sparkles,
  UserPlus,
} from "lucide-react";
import { Panel } from "@/components/iris/primitives";
import { Reveal, Section } from "@/components/landing/marketing-bits";

export function Plateau() {
  const stats = [
    { label: "Every call", note: "Understood with evidence" },
    { label: "Every rep", note: "Coached after the conversation" },
    { label: "Every manager", note: "Focused on what needs attention" },
  ];

  return (
    <section className="relative border-y border-border bg-secondary/15">
      <div className="mx-auto w-full max-w-6xl px-5 py-20 md:py-24">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl leading-[1.15] font-semibold tracking-tight text-balance md:text-[2.75rem]">
            Sales teams don't fail because they don't work hard.
            <span className="mt-2 block gradient-text">
              They fail because nobody coaches every call.
            </span>
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.09}>
              <Panel className="group relative h-full overflow-hidden p-7 transition-colors hover:border-primary/40">
                <p className="text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
                  {s.label}
                </p>
                <p className="mt-4 text-2xl font-semibold gradient-text">{s.note}</p>
              </Panel>
            </Reveal>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Product capabilities for high-volume outbound floors — explore the interactive demo for the full story.
        </p>
      </div>
    </section>
  );
}

const problems = [
  {
    icon: HeadphonesIcon,
    t: "Managers cannot review hundreds of calls",
    d: "Directors cannot hear every conversation. They sample a handful and hope — Artemis is built to surface the calls that need attention.",
  },
  {
    icon: UserPlus,
    t: "New employees learn slowly",
    d: "Ramp is measured in quarters because feedback arrives weekly, long after the call is forgotten.",
  },
  {
    icon: BookOpenCheck,
    t: "Top performers' knowledge is lost",
    d: "Your best closer's exact objection language lives in their head and leaves when they do.",
  },
  {
    icon: ScaleIcon,
    t: "Coaching is inconsistent",
    d: "Two managers, two philosophies, two scorecards. Reps get contradictory advice on the same behaviour.",
  },
  {
    icon: ShieldAlert,
    t: "Compliance mistakes create risk",
    d: "One missed risk disclosure on a regulated call can cost more than a year of sales technology.",
  },
  {
    icon: ClipboardX,
    t: "No one knows why deals are lost",
    d: "CRM says 'price'. The recording says the rep quoted before discovery. Nobody ever listens to find out.",
  },
];

export function Problem() {
  return (
    <Section
      id="problem"
      eyebrow="The problem"
      title="Why most sales teams plateau"
      lede="It is never a motivation problem. It is a feedback problem — and feedback does not scale with headcount."
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {problems.map((p, i) => (
          <Reveal key={p.t} delay={(i % 3) * 0.07}>
            <Panel className="group relative h-full overflow-hidden p-6 transition-colors hover:border-destructive/40">
              <div className="flex items-center justify-between">
                <span className="grid size-10 place-items-center rounded-xl border border-border bg-secondary/40">
                  <p.icon className="size-4 text-destructive" />
                </span>
                <span className="font-mono text-[11px] text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-5 text-[0.95rem] font-semibold">{p.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.d}</p>
            </Panel>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

const flow = [
  { icon: PhoneCall, t: "Salesperson makes a call", d: "Iris connects to your dialer, VoIP or meeting platform." },
  { icon: BrainCircuit, t: "Iris analyzes it", d: "Transcription, sentiment, objections, compliance, stage scoring." },
  { icon: Sparkles, t: "Employee gets instant coaching", d: "Specific, personal feedback seconds after hang-up." },
  { icon: LineChart, t: "Manager sees team insights", d: "Patterns, risk flags and revenue impact across every desk." },
  { icon: Gauge, t: "Closing rates improve", d: "Measured weekly, per rep, per objection, per script." },
];

export function Solution() {
  return (
    <section className="relative overflow-hidden border-y border-border">
      <div className="aurora absolute inset-0 opacity-50" />
      <div className="relative mx-auto w-full max-w-6xl px-5 py-20 md:py-28">
        <Reveal className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/40 px-3 py-1 text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
            <Ear className="size-3" /> The solution
          </span>
          <h2 className="mt-5 text-3xl leading-[1.1] font-semibold tracking-tight text-balance md:text-[2.75rem]">
            Meet Iris.
            <span className="mt-1 block gradient-text">
              The AI sales coach for your entire company.
            </span>
          </h2>
          <p className="mt-5 text-base text-muted-foreground">
            We help sales organizations increase revenue by turning every conversation into
            measurable coaching, actionable insight and better closing performance.
          </p>
        </Reveal>

        <div className="mx-auto mt-14 max-w-3xl">
          {flow.map((s, i) => (
            <Reveal key={s.t} delay={i * 0.08}>
              <Panel className="flex items-center gap-5 p-5">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl gradient-surface text-background">
                  <s.icon className="size-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{s.t}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{s.d}</p>
                </div>
                <span className="ml-auto hidden font-mono text-xs text-muted-foreground sm:block">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </Panel>
              {i < flow.length - 1 ? (
                <div className="flex justify-center py-2">
                  <ArrowDown className="size-4 text-border" />
                </div>
              ) : null}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
