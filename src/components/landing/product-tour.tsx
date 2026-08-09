import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check } from "lucide-react";
import { Section, Reveal } from "./marketing-bits";
import repDashboard from "@/assets/rep-dashboard.png.asset.json";
import aiCoach from "@/assets/ai-coach.png.asset.json";
import repPerformance from "@/assets/rep-performance.png.asset.json";
import execOverview from "@/assets/exec-overview.png.asset.json";

type Tab = {
  key: string;
  label: string;
  who: string;
  title: string;
  plain: string;
  bullets: string[];
  outcome: string;
  img: string;
  alt: string;
};

const tabs: Tab[] = [
  {
    key: "dashboard",
    label: "1 · Rep dashboard",
    who: "What the employee sees every morning",
    title: "Each rep opens one screen and knows exactly what to fix today",
    plain:
      "No spreadsheets, no waiting for a manager. Iris scores every call overnight and tells the rep, in plain words, the one habit that is costing them deals.",
    bullets: [
      "Score, confidence and close rate for every single call",
      "A daily brief written in plain language, not analytics jargon",
      "The weakest stage of their process highlighted automatically",
    ],
    outcome: "Reps stop guessing why they lost the deal.",
    img: repDashboard.url,
    alt: "Iris rep dashboard showing call scores, confidence trend and a daily AI brief",
  },
  {
    key: "coach",
    label: "2 · AI coach",
    who: "How the employee actually improves",
    title: "Every rep gets a private coach after every call — not once a quarter",
    plain:
      "Iris replays the exact moment the deal turned, explains what to say instead, and turns it into a short weekly practice plan the rep can tick off.",
    bullets: [
      "The exact objection that lost the deal, quoted from the call",
      "A better answer, written for your product and your market",
      "A weekly plan with 3–4 concrete habits to change",
    ],
    outcome: "Coaching designed to cover every conversation — not only the ones a manager can sample.",
    img: aiCoach.url,
    alt: "Iris AI coach chat with a coaching plan and stage scores for the last call",
  },
  {
    key: "progress",
    label: "3 · Proof of improvement",
    who: "How you know it's working",
    title: "You can see each employee getting better, week by week",
    plain:
      "Improvement is measured, not claimed. Every rep has a curve. If the curve is flat after four weeks, you know before it shows up in the quarter.",
    bullets: [
      "Skill-by-skill progress: discovery, objections, closing, compliance",
      "Benchmarks against your own top performers",
      "Early warning when a rep is sliding",
    ],
    outcome: "Weak performance becomes visible early — while there is still time to coach.",
    img: repPerformance.url,
    alt: "Iris performance page showing skill breakdown and improvement trend for a rep",
  },
  {
    key: "exec",
    label: "4 · Your view",
    who: "What you see as CEO or Sales Director",
    title: "One screen for revenue, risk and where the money is leaking",
    plain:
      "Revenue by desk, close rate by hour, the objections costing you most, and which reps are at risk — all from calls that already happened.",
    bullets: [
      "Top reasons deals are lost, ranked by lost revenue",
      "Compliance flags surfaced before they become fines",
      "Team, desk and individual comparison in one place",
    ],
    outcome: "Leadership decisions based on conversation evidence, not a thin sample.",
    img: execOverview.url,
    alt: "Iris executive dashboard with revenue charts, risk table and close rate by hour",
  },
];

export function ProductTour() {
  const [active, setActive] = useState(0);
  const t = tabs[active];

  return (
    <Section
      id="tour"
      eyebrow="See it in plain English"
      title={
        <>
          What your team actually gets, <span className="gradient-text">screen by screen</span>
        </>
      }
      lede="Four screens explain the whole product: what the rep sees, how they improve, how you prove it improved, and what lands on your desk."
    >
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab, i) => (
          <button
            key={tab.key}
            onClick={() => setActive(i)}
            className={`rounded-xl border px-3.5 py-2 text-sm transition-colors ${
              i === active
                ? "border-primary/50 bg-primary/10 text-foreground"
                : "border-border bg-secondary/30 text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:items-start">
        <AnimatePresence mode="wait">
          <motion.figure
            key={t.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="glass gradient-border overflow-hidden rounded-2xl"
          >
            <img
              src={t.img}
              alt={t.alt}
              loading="lazy"
              width={1440}
              height={900}
              className="w-full"
            />
            <figcaption className="border-t border-border px-4 py-3 text-xs text-muted-foreground">
              {t.who}
            </figcaption>
          </motion.figure>
        </AnimatePresence>

        <Reveal className="glass rounded-2xl border border-border p-6">
          <p className="text-[11px] tracking-[0.16em] text-muted-foreground uppercase">{t.who}</p>
          <h3 className="mt-3 text-xl leading-snug font-semibold tracking-tight text-balance">
            {t.title}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t.plain}</p>
          <ul className="mt-5 space-y-2.5">
            {t.bullets.map((b) => (
              <li key={b} className="flex gap-2.5 text-sm text-muted-foreground">
                <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                {b}
              </li>
            ))}
          </ul>
          <p className="mt-5 rounded-xl border border-border bg-secondary/30 p-3 text-sm">
            <span className="text-muted-foreground">Why it matters: </span>
            {t.outcome}
          </p>
        </Reveal>
      </div>
    </Section>
  );
}

const simple = [
  {
    n: "01",
    h: "Every call is recorded and scored",
    p: "No manager time, no sampling. 100% of conversations analyzed within minutes of hang-up.",
  },
  {
    n: "02",
    h: "Each rep is told what to change",
    p: "In plain language, with the exact moment they lost the deal and a better answer to use next time.",
  },
  {
    n: "03",
    h: "You see the revenue move",
    p: "Close rate, lost-deal reasons and compliance risk per desk — measured weekly, not guessed quarterly.",
  },
];

export function SimpleExplainer() {
  return (
    <Section
      align="center"
      eyebrow="The 30-second version"
      title={<>If you only read one section, read this</>}
      lede="Iris turns the conversations your team is already having into more closed revenue. That's it."
    >
      <div className="grid gap-4 md:grid-cols-3">
        {simple.map((s, i) => (
          <Reveal key={s.n} delay={i * 0.08}>
            <div className="glass h-full rounded-2xl border border-border p-6">
              <span className="font-mono text-xs text-primary">{s.n}</span>
              <h3 className="mt-3 text-base font-semibold">{s.h}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.p}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
