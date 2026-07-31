import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, ChevronDown, Linkedin } from "lucide-react";
import { Panel } from "@/components/artemis/primitives";
import { ArtemisMark } from "@/components/artemis/app-shell";
import { Reveal, Section } from "@/components/landing/marketing-bits";

const included = [
  "Unlimited managers",
  "AI coaching",
  "Call analysis",
  "Rep & executive dashboards",
  "Compliance monitoring",
  "CRM integrations",
];

const plans = [
  {
    name: "Starter",
    d: "For a single desk proving the model.",
    f: ["Up to 15 reps", "Call scoring & transcripts", "Personal AI coach", "Objection intelligence", "Email support"],
    cta: "Book demo",
    featured: false,
  },
  {
    name: "Growth",
    d: "For scaling floors that live on conversion rate.",
    f: ["Up to 150 reps", "Everything in Starter", "Compliance monitoring", "Executive dashboard & alerts", "Methodology scoring (SPIN, MEDDIC)", "Dedicated onboarding"],
    cta: "Book demo",
    featured: true,
  },
  {
    name: "Enterprise",
    d: "For multi-desk, multi-region, regulated organizations.",
    f: ["Unlimited reps & desks", "Everything in Growth", "SSO, SCIM & audit logs", "EU data residency & retention policy", "Custom coaching models", "Dedicated success manager"],
    cta: "Contact sales",
    featured: false,
  },
];

export function Pricing() {
  return (
    <Section
      id="pricing"
      eyebrow="Pricing"
      title="Priced per floor. Measured in closed deals."
      lede="Every plan includes the full coaching engine. We scope pricing on your call volume and desk structure during the demo."
    >
      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((p, i) => (
          <Reveal key={p.name} delay={i * 0.07}>
            <Panel
              className={`flex h-full flex-col p-7 ${p.featured ? "gradient-border bg-primary/5" : ""}`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold">{p.name}</h3>
                {p.featured ? (
                  <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[11px] text-primary">
                    Most popular
                  </span>
                ) : null}
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{p.d}</p>
              <p className="mt-6 text-2xl font-semibold">
                {p.name === "Enterprise" ? "Contact sales" : "Custom quote"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Scoped to seats and monthly call volume
              </p>
              <ul className="mt-6 flex-1 space-y-2.5">
                {p.f.map((x) => (
                  <li key={x} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="mt-0.5 size-3.5 shrink-0 text-cyan" /> {x}
                  </li>
                ))}
              </ul>
              <a
                href="#demo-form"
                className={`mt-7 rounded-xl px-4 py-2.5 text-center text-sm font-semibold transition-colors ${
                  p.featured
                    ? "gradient-surface text-background"
                    : "border border-border hover:bg-secondary"
                }`}
              >
                {p.cta}
              </a>
            </Panel>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1} className="mt-4">
        <Panel className="flex flex-wrap items-center gap-x-8 gap-y-3 p-6">
          <p className="text-xs tracking-[0.16em] text-muted-foreground uppercase">
            Everything included
          </p>
          {included.map((x) => (
            <span key={x} className="flex items-center gap-2 text-sm text-muted-foreground">
              <Check className="size-3.5 text-success" /> {x}
            </span>
          ))}
        </Panel>
      </Reveal>
    </Section>
  );
}

const faqs = [
  ["How accurate is the AI?", "Transcription accuracy averages 96% on clear telephony audio and scoring is calibrated against your own managers during onboarding. Every score links to the exact audio moment that produced it, so nothing has to be taken on faith."],
  ["How quickly can we onboard?", "Most floors are live within five business days: connect the dialer, import last month's calls for a baseline, calibrate scoring with your managers, then switch reps on desk by desk."],
  ["Does Artemis integrate with our phone system?", "Yes — Aircall, Genesys, RingCentral, Twilio, Zoom, Teams and Google Meet are supported natively, and anything else can send audio through our SIP recorder or REST API."],
  ["Can managers customize coaching?", "Managers define the scorecard, the required call stages, the compliance checklist and the methodology (SPIN, MEDDIC, BANT, Challenger). Artemis coaches against your standard, not a generic one."],
  ["Is customer data secure?", "Recordings are encrypted at rest and in transit, isolated per tenant, accessible only through role-based permissions, and every access is written to an exportable audit log. EU data residency is available."],
  ["Can Artemis support multiple languages?", "Artemis analyzes and coaches in 30+ languages including English, German, Spanish, Italian, Polish, Arabic and Greek, with mixed-language calls handled in a single transcript."],
  ["How does compliance monitoring work?", "You define required disclosures and prohibited claims per product and jurisdiction. Artemis checks every call, flags misses to compliance within minutes, and keeps the evidence trail for audits."],
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Section eyebrow="FAQ" title="Questions procurement will ask">
      <div className="mx-auto max-w-3xl space-y-3">
        {faqs.map(([q, a], i) => (
          <Reveal key={q} delay={(i % 4) * 0.04}>
            <Panel className="overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <span className="text-sm font-medium">{q}</span>
                <ChevronDown
                  className={`size-4 shrink-0 text-muted-foreground transition-transform ${
                    open === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              {open === i ? (
                <p className="px-6 pb-6 text-sm leading-relaxed text-muted-foreground">{a}</p>
              ) : null}
            </Panel>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

export function FinalCta() {
  return (
    <section id="demo-form" className="relative overflow-hidden border-t border-border">
      <div className="aurora absolute inset-0" />
      <div className="grid-lines absolute inset-0 opacity-30 [mask-image:radial-gradient(60%_60%_at_50%_50%,#000,transparent)]" />
      <div className="relative mx-auto w-full max-w-4xl px-5 py-24 text-center md:py-32">
        <Reveal>
          <h2 className="text-3xl leading-[1.1] font-semibold tracking-tight text-balance md:text-[3.2rem]">
            Your competitors are coaching yesterday's calls.
            <span className="mt-2 block gradient-text">
              Your team could be improving after every conversation.
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground">
            Bring one week of recordings. We will show you, on your own calls, exactly where the
            revenue is leaking — before you buy anything.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <a
              href="mailto:sales@artemis.sales?subject=Artemis%20demo%20request"
              className="inline-flex items-center gap-2 rounded-xl gradient-surface px-6 py-3.5 text-sm font-semibold text-background shadow-[0_10px_40px_-12px_oklch(0.66_0.2_293/0.7)] transition-transform hover:-translate-y-0.5"
            >
              Book your demo <ArrowRight className="size-4" />
            </a>
            <Link
              to="/ceo"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-secondary/40 px-6 py-3.5 text-sm font-medium transition-colors hover:bg-secondary"
            >
              Tour the executive dashboard
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const footerCols = [
  ["Product", ["Features", "Solutions", "Pricing", "Security"]],
  ["Resources", ["Blog", "Resources", "Documentation", "Changelog"]],
  ["Company", ["Contact", "Careers", "Partners", "Press"]],
  ["Legal", ["Privacy", "Terms", "DPA", "Subprocessors"]],
] as const;

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/10">
      <div className="mx-auto w-full max-w-6xl px-5 py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div>
            <ArtemisMark />
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              The revenue acceleration platform for high-performance sales organizations.
            </p>
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <Linkedin className="size-3.5" /> LinkedIn
            </a>
          </div>
          {footerCols.map(([title, links]) => (
            <div key={title}>
              <p className="text-xs font-semibold tracking-[0.14em] text-foreground uppercase">
                {title}
              </p>
              <ul className="mt-4 space-y-2.5">
                {links.map((l) => (
                  <li key={l}>
                    <a
                      href="#demo-form"
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
          <p className="text-xs text-muted-foreground">© 2026 Artemis Intelligence. All rights reserved.</p>
          <div className="flex gap-6 text-xs text-muted-foreground">
            <Link to="/app" className="hover:text-foreground">Rep dashboard</Link>
            <Link to="/ceo" className="hover:text-foreground">Executive dashboard</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
