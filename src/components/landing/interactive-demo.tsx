import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CircleAlert, MessageSquareQuote, Sparkles, Target, Waves, XCircle } from "lucide-react";
import { Panel } from "@/components/iris/primitives";
import { Reveal, Section } from "@/components/landing/marketing-bits";

const steps = [
  {
    key: "objection",
    tab: "Customer objection",
    icon: MessageSquareQuote,
    heading: "06:12 — the prospect pushes back",
    quote:
      "\"Honestly, your spreads look higher than what I'm paying now, and I've been with them four years.\"",
    body: "Iris tags this as a competitive price objection with a loyalty component — the two rarely resolve with a discount.",
    meta: [["Objection type", "Price + incumbent loyalty"], ["Pattern on many floors", "Common loss driver"]],
  },
  {
    key: "analysis",
    tab: "AI analysis",
    icon: Waves,
    heading: "What actually happened in the conversation",
    quote:
      "\"Rep quoted the spread 41 seconds after the objection, without asking about monthly volume or execution quality.\"",
    body: "Discovery covered 2 of 6 qualifying areas. The rep spoke 82% of the call and interrupted the prospect 4 times.",
    meta: [["Talk ratio", "82% rep / 18% client"], ["Discovery coverage", "2 of 6"]],
  },
  {
    key: "confidence",
    tab: "Confidence score",
    icon: Target,
    heading: "Confidence dropped exactly when it mattered",
    quote: "\"Vocal certainty fell from 88% to 51% within 12 seconds of the objection.\"",
    body: "Hesitation markers, a rising-tone apology and two filler clusters were detected in the response window.",
    meta: [["Peak confidence", "88%"], ["Confidence at objection", "51%"]],
  },
  {
    key: "response",
    tab: "Suggested response",
    icon: Sparkles,
    heading: "The response that converts on this objection",
    quote:
      "\"Before I talk numbers — how many lots do you trade monthly, and how often do you see requotes at news? Most clients switch to us on execution, not spread.\"",
    body: "Reps who reframe to execution before price close this objection 2.4× more often on your own historical data.",
    meta: [["Historical win rate", "2.4× higher"], ["Source", "418 of your own calls"]],
  },
  {
    key: "loss",
    tab: "Why the deal failed",
    icon: XCircle,
    heading: "Root cause, not CRM guesswork",
    quote: "\"Deal lost at 06:53 — price anchored before value was established.\"",
    body: "The CRM recorded this as 'price'. Iris shows the deal was lost 41 seconds earlier, in the discovery gap.",
    meta: [["CRM reason", "Price"], ["Actual reason", "Premature pricing"]],
  },
  {
    key: "coaching",
    tab: "Personal coaching",
    icon: CircleAlert,
    heading: "Marcus's plan for the next 10 calls",
    quote:
      "\"Ask both volume questions before any number leaves your mouth. Target talk ratio under 60%.\"",
    body: "Iris tracks the two behaviours on every subsequent call and reports the movement to Marcus and his manager weekly.",
    meta: [["Projected impact (illustrative)", "Close-rate focus"], ["Review", "After 10 calls"]],
  },
];

export function InteractiveDemo() {
  const [active, setActive] = useState(0);
  const step = steps[active];

  return (
    <Section
      id="interactive"
      eyebrow="Interactive demo"
      title="Click through a real call the way Iris sees it"
      lede="One outbound forex call, six moments. This is the entire product loop in ninety seconds."
    >
      <Reveal>
        <Panel className="overflow-hidden p-0">
          <div className="flex gap-1 overflow-x-auto border-b border-border p-2">
            {steps.map((s, i) => (
              <button
                key={s.key}
                onClick={() => setActive(i)}
                className={`relative flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-medium transition-colors ${
                  i === active
                    ? "text-background"
                    : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                }`}
              >
                {i === active ? (
                  <motion.span
                    layoutId="demo-pill"
                    className="absolute inset-0 -z-10 rounded-xl gradient-surface"
                    transition={{ type: "spring", stiffness: 400, damping: 34 }}
                  />
                ) : null}
                <s.icon className="size-3.5" />
                {s.tab}
              </button>
            ))}
          </div>

          <div className="grid gap-6 p-6 md:grid-cols-[1.5fr_1fr] md:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={step.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28 }}
              >
                <p className="text-xs tracking-[0.16em] text-primary uppercase">Step {active + 1} of 6</p>
                <h3 className="mt-3 text-xl font-semibold tracking-tight md:text-2xl">
                  {step.heading}
                </h3>
                <p className="mt-5 border-l-2 border-primary/60 pl-4 text-[0.95rem] leading-relaxed text-foreground/90 italic">
                  {step.quote}
                </p>
                <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
              </motion.div>
            </AnimatePresence>

            <div className="space-y-3">
              {step.meta.map(([k, v]) => (
                <div key={k} className="rounded-xl border border-border bg-secondary/30 p-4">
                  <p className="text-[11px] tracking-wide text-muted-foreground uppercase">{k}</p>
                  <p className="mt-1.5 text-lg font-semibold">{v}</p>
                </div>
              ))}
              <div className="rounded-xl border border-border bg-primary/5 p-4">
                <p className="text-[11px] tracking-wide text-muted-foreground uppercase">
                  Call timeline
                </p>
                <div className="mt-3 flex gap-1">
                  {steps.map((s, i) => (
                    <button
                      key={s.key}
                      onClick={() => setActive(i)}
                      aria-label={s.tab}
                      className={`h-1.5 flex-1 rounded-full transition-colors ${
                        i <= active ? "gradient-surface" : "bg-secondary"
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setActive((a) => (a + 1) % steps.length)}
                  className="mt-4 w-full rounded-lg border border-border py-2 text-xs font-medium transition-colors hover:bg-secondary"
                >
                  Next moment
                </button>
              </div>
            </div>
          </div>
        </Panel>
      </Reveal>
    </Section>
  );
}
