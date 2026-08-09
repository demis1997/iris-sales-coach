import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  Brain,
  Building2,
  Dna,
  Gauge,
  Layers,
  Radio,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { ArtemisButton, ArtemisMark } from "@/components/relay/brand";
import { ArtemisHeader } from "@/components/relay/header";
import { ContactLinks } from "@/components/relay/contact-links";
import { CONTACT_EMAIL, CONTACT_MAILTO, CONTACT_PHONE_DISPLAY, CONTACT_TEL } from "@/components/relay/contact";
import { cn } from "@/lib/utils";

const MARKETS = [
  "Forex",
  "Insurance",
  "Real Estate",
  "Solar",
  "SaaS Sales",
  "Recruiting",
  "BPOs",
  "Call Centers",
  "Mortgage",
  "Financial Services",
];

const CATEGORY_PILLARS = [
  {
    title: "Revenue Intelligence",
    body: "Know what is converting, what is stalling, and why — from every conversation.",
    icon: TrendingUp,
    accent: "from-[#2EE6A6] to-[#18C4FF]",
  },
  {
    title: "Continuous Coaching",
    body: "Every rep improves after every call. Managers stop guessing who needs help.",
    icon: Sparkles,
    accent: "from-[#4F6EF7] to-[#A855F7]",
  },
  {
    title: "Sales Infrastructure",
    body: "Playbooks, memory, forecasting, and ops in one system — not five tools duct-taped together.",
    icon: Layers,
    accent: "from-[#FF7A45] to-[#FF4D8D]",
  },
];

const REVENUE_LOOP = [
  "Call",
  "Transcript",
  "AI Understanding",
  "Manager",
  "CRM",
  "Rep Improvement",
  "Higher Revenue",
];

const DNA_SKILLS = [
  "Confidence",
  "Discovery",
  "Listening",
  "Objection Handling",
  "Closing",
  "Compliance",
  "Urgency",
  "Product Knowledge",
];

const COPILOT_CARDS = [
  {
    signal: "Customer mentioned pricing.",
    action: "Ask about budget.",
  },
  {
    signal: "Customer sounds uncertain.",
    action: "Slow down.",
  },
  {
    signal: "High buying intent detected.",
    action: "Move toward closing.",
  },
  {
    signal: "Compliance reminder.",
    action: "Mention risk disclosure.",
  },
];

const OPS_SIGNALS = [
  "Team performance",
  "Coaching impact",
  "Revenue trends",
  "Deal risk",
  "Conversion bottlenecks",
  "Top objections",
  "Agent comparisons",
  "Skill gaps",
  "Upcoming coaching",
];

const COMMAND_SIGNALS = [
  "Revenue generated",
  "Forecast",
  "Conversion trend",
  "Pipeline health",
  "Coaching ROI",
  "AI insights",
  "Biggest risks",
  "Fastest growing teams",
  "Weekly recommendations",
];

const KNOWLEDGE_UPLOADS = [
  "Sales playbooks",
  "Pricing",
  "FAQs",
  "Compliance",
  "Winning calls",
  "Scripts",
  "Policies",
];

const KNOWLEDGE_USES = [
  "Live coaching",
  "Call analysis",
  "Roleplay",
  "Follow-ups",
  "Manager recommendations",
];

const COMPARISON = {
  traditional: [
    "Records calls",
    "Stores CRM notes",
    "Static playbooks",
    "Weekly reports",
    "Manual coaching",
  ],
  artemis: [
    "Designed to learn from every conversation",
    "Built to continuously improve every rep",
    "Adaptive playbooks",
    "Revenue intelligence from call evidence",
    "AI coaching after every call",
    "Live AI coaching during calls",
    "Company memory",
    "Revenue intelligence",
  ],
};

const FLYWHEEL = [
  "Good reps",
  "Better playbooks",
  "Smarter AI",
  "Better coaching",
  "Higher conversion",
  "More successful calls",
  "Even smarter AI",
];

export function ArtemisHomePage() {
  return (
    <div className="min-h-screen bg-white text-[#0B1B33]">
      <ArtemisHeader />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#E8FFF6_0%,_transparent_50%),radial-gradient(ellipse_at_90%_10%,_#EEF2FF_0%,_transparent_40%),radial-gradient(ellipse_at_10%_90%,_#FFF4E8_0%,_transparent_35%)]" />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-5 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-24">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#12C48A]">
              AI Operating System
            </p>
            <h1 className="text-4xl font-bold leading-[1.05] tracking-tight text-[#0B1B33] sm:text-5xl lg:text-[3.35rem]">
              The AI Operating System
              <br />
              for Revenue Teams.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-[#4B5C76]">
              Artemis is designed to turn every customer conversation into coaching, revenue
              intelligence, and clearer next actions — so high-volume sales organizations improve
              continuously, not only after the week is over.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ArtemisButton href="#get-started" className="px-7 py-3 text-base">
                Book a Demo
              </ArtemisButton>
              <ArtemisButton href="/demo" variant="secondary" className="px-7 py-3 text-base">
                Explore the Product Demo
              </ArtemisButton>
            </div>
            <p className="mt-6 text-xs font-medium tracking-wide text-[#8A9BB5] uppercase">
              Built for high-volume sales organizations
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {MARKETS.slice(0, 6).map((m) => (
                <span
                  key={m}
                  className="rounded-full border border-[#E8EEF7] bg-white/80 px-3 py-1 text-xs font-medium text-[#4B5C76]"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
          <HeroVisual />
        </div>
      </section>

      {/* Category pillars */}
      <section id="capabilities" className="py-20">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8A9BB5]">
            Not another analytics tool
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-[#0B1B33] sm:text-4xl">
            Infrastructure for how revenue teams actually work.
          </h2>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {CATEGORY_PILLARS.map((item) => (
              <article
                key={item.title}
                className="flex flex-col rounded-[1.75rem] border border-[#E8EEF7] bg-white p-7 shadow-[0_16px_50px_-30px_rgba(15,40,80,0.35)]"
              >
                <div
                  className={cn(
                    "mb-5 grid size-12 place-items-center rounded-2xl bg-gradient-to-br text-white",
                    item.accent,
                  )}
                >
                  <item.icon className="size-5" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-[#0B1B33]">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#4B5C76]">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Revenue Loop */}
      <section id="revenue-loop" className="border-y border-[#E8EEF7] bg-[#F7FAFF] py-20">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#12C48A]">
            Revenue Loop
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-[#0B1B33] sm:text-4xl">
            Every conversation improves your business.
          </h2>
          <p className="mt-3 max-w-xl text-[#4B5C76]">
            Every call becomes structured knowledge.
            <br />
            The AI continuously learns what wins deals.
          </p>
          <RevenueLoop />
        </div>
      </section>

      {/* Company Brain */}
      <section id="company-brain" className="py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#12C48A]">
              Company Memory
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#0B1B33] sm:text-4xl">
              Your company finally remembers every conversation.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#4B5C76]">
              Artemis is designed to turn customer conversations into searchable institutional
              knowledge — so winning behaviours are not trapped in one rep's head.
            </p>
            <p className="mt-3 text-base leading-relaxed text-[#4B5C76]">
              Top-performing patterns can teach the rest of the organization.
            </p>
          </div>
          <div className="rounded-[2rem] border border-[#E8EEF7] bg-gradient-to-br from-[#E8FFF6] via-white to-[#EEF2FF] p-8">
            <div className="space-y-3">
              {[
                ["Company Intelligence", "What works across every team"],
                ["Rep Intelligence", "Who is improving — and why"],
                ["Revenue Forecasting", "Where pipeline will land"],
                ["AI Decision Engine", "What to do next, not just what happened"],
              ].map(([t, d]) => (
                <div key={t} className="rounded-2xl border border-white bg-white/90 px-4 py-3 shadow-sm">
                  <p className="text-sm font-semibold text-[#0B1B33]">{t}</p>
                  <p className="mt-0.5 text-xs text-[#8A9BB5]">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Rep DNA */}
      <section id="rep-dna" className="border-y border-[#E8EEF7] bg-[#F7FAFF] py-20">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#12C48A]">
            Rep Intelligence
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-[#0B1B33] sm:text-4xl">
            Rep DNA™
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#4B5C76]">
            Artemis builds a continuously evolving profile of every sales representative.
          </p>
          <p className="mt-2 max-w-2xl text-base leading-relaxed text-[#4B5C76]">
            Not personality. Sales behaviour.
          </p>
          <div className="mt-10 flex flex-wrap gap-2">
            {DNA_SKILLS.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-[#D7E0EF] bg-white px-4 py-2 text-sm font-medium text-[#0B1B33]"
              >
                {skill}
              </span>
            ))}
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {[
              ["Who is improving", "Track 7- and 30-day skill trends with evidence from real calls."],
              ["Who needs coaching", "Surface the highest-impact gaps before they hit revenue."],
              ["Who is ready for promotion", "Promote on behaviour patterns — not gut feel."],
            ].map(([t, b]) => (
              <article key={t} className="rounded-[1.5rem] border border-white bg-white p-6">
                <Dna className="size-5 text-[#12C48A]" />
                <h3 className="mt-4 text-lg font-semibold text-[#0B1B33]">{t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#4B5C76]">{b}</p>
              </article>
            ))}
          </div>
          <p className="mt-8 text-sm font-medium text-[#4B5C76]">
            Every call updates the model.
          </p>
        </div>
      </section>

      {/* Live AI Copilot */}
      <section id="copilot" className="py-20">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#12C48A]">
            Live AI Copilot
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-[#0B1B33] sm:text-4xl">
            The AI doesn’t wait until the call ends.
          </h2>
          <p className="mt-3 max-w-xl text-[#4B5C76]">
            It assists during the conversation.
          </p>
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {COPILOT_CARDS.map((card, i) => (
              <motion.article
                key={card.signal}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="rounded-[1.5rem] border border-[#E8EEF7] bg-white p-6 shadow-[0_12px_40px_-28px_rgba(15,40,80,0.3)]"
              >
                <div className="flex items-start gap-3">
                  <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#E8FFF6] text-[#12C48A]">
                    <Radio className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#8A9BB5]">{card.signal}</p>
                    <p className="mt-1 text-lg font-semibold text-[#0B1B33]">{card.action}</p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Operations Center */}
      <section id="operations" className="border-y border-[#E8EEF7] bg-[#F7FAFF] py-20">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#12C48A]">
              Manager Operating System
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#0B1B33] sm:text-4xl">
              Operations Center
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#4B5C76]">
              Run the floor from one place. See coaching impact, bottlenecks, and deal risk before
              the week is lost.
            </p>
            <ArtemisButton href="/manager" className="mt-8">
              Open Operations Center
            </ArtemisButton>
          </div>
          <SignalGrid items={OPS_SIGNALS} />
        </div>
      </section>

      {/* Revenue Command Center */}
      <section id="command" className="py-20">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-2 lg:items-center">
          <SignalGrid items={COMMAND_SIGNALS} tint="executive" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#12C48A]">
              Executive Command Center
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#0B1B33] sm:text-4xl">
              Revenue Command Center
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#4B5C76]">
              Not another analytics page.
              <br />
              A command surface for forecast, risk, and weekly action.
            </p>
            <ArtemisButton href="/ceo" className="mt-8">
              Open Command Center
            </ArtemisButton>
          </div>
        </div>
      </section>

      {/* Knowledge Engine */}
      <section id="knowledge" className="border-y border-[#E8EEF7] bg-[#F7FAFF] py-20">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#12C48A]">
            Knowledge Engine
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-[#0B1B33] sm:text-4xl">
            Teach Artemis once.
            <br />
            Improve every salesperson forever.
          </h2>
          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold text-[#0B1B33]">Upload</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {KNOWLEDGE_UPLOADS.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-[#D7E0EF] bg-white px-3 py-1.5 text-xs font-medium text-[#4B5C76]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-[#0B1B33]">Used during</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {KNOWLEDGE_USES.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-[#2EE6A6]/40 bg-[#E8FFF6] px-3 py-1.5 text-xs font-medium text-[#0B1B33]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Roleplay */}
      <section id="roleplay" className="py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#12C48A]">
              Roleplay & Certification
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#0B1B33] sm:text-4xl">
              Practice before customers.
              <br />
              Not after.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#4B5C76]">
              Managers create AI customers. Agents practice. AI scores every simulation.
            </p>
            <p className="mt-3 text-base leading-relaxed text-[#4B5C76]">
              Certification before campaigns.
            </p>
          </div>
          <div className="rounded-[2rem] border border-[#E8EEF7] bg-white p-8 shadow-[0_20px_50px_-30px_rgba(15,40,80,0.25)]">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-[#0B1B33]">Scenario · Price objection</p>
              <span className="rounded-full bg-[#E8FFF6] px-2.5 py-1 text-[11px] font-semibold text-[#12C48A]">
                Score 86
              </span>
            </div>
            <div className="mt-5 space-y-3 text-sm">
              <div className="rounded-xl bg-[#F7FAFF] px-4 py-3 text-[#4B5C76]">
                AI buyer: “I need to think about it — your fees feel high.”
              </div>
              <div className="rounded-xl border border-[#E8EEF7] px-4 py-3 text-[#0B1B33]">
                Rep: “Fair — what part of the fee feels unclear versus expensive?”
              </div>
            </div>
            <p className="mt-5 text-xs text-[#8A9BB5]">
              Ready for campaign assignment after two more scenarios.
            </p>
          </div>
        </div>
      </section>

      {/* Markets */}
      <section id="markets" className="border-y border-[#E8EEF7] bg-[#F7FAFF] py-20">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8A9BB5]">
            Markets
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-[#0B1B33] sm:text-4xl">
            Built for high-volume revenue teams
          </h2>
          <p className="mt-3 max-w-xl text-[#4B5C76]">
            Industry focus areas — not a claim that these companies are already customers.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            {[
              "Forex & CFD",
              "Insurance",
              "Financial Services",
              "Real Estate",
              "BPO & Contact Centers",
              "SaaS Sales",
              "Recruiting",
            ].map((name) => (
              <span
                key={name}
                className="rounded-full border border-[#D7E0EF] bg-white px-4 py-2 text-sm font-medium text-[#4B5C76]"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section id="comparison" className="py-20">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#12C48A]">
            Category shift
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-[#0B1B33] sm:text-4xl">
            Traditional sales software records.
            <br />
            Artemis learns.
          </h2>
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <div className="rounded-[1.75rem] border border-[#E8EEF7] bg-[#F7FAFF] p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8A9BB5]">
                Traditional Sales Software
              </p>
              <ul className="mt-6 space-y-3">
                {COMPARISON.traditional.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-[#4B5C76]">
                    <span className="size-1.5 rounded-full bg-[#A8B5C9]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[1.75rem] border border-[#2EE6A6]/40 bg-gradient-to-br from-[#E8FFF6] to-white p-8 shadow-[0_20px_50px_-30px_rgba(18,196,138,0.35)]">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#12C48A]">
                Artemis
              </p>
              <ul className="mt-6 space-y-3">
                {COMPARISON.artemis.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm font-medium text-[#0B1B33]">
                    <span className="size-1.5 rounded-full bg-[#12C48A]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Product proof — roles */}
      <section id="product-proof" className="border-y border-[#E8EEF7] bg-white py-20">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#12C48A]">
            Product proof
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-[#0B1B33] sm:text-4xl">
            Built around the way high-volume sales teams actually operate.
          </h2>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {[
              ["CEO", "Understand what's driving revenue.", "/demo/ceo"],
              ["Manager", "Know who needs attention and why.", "/demo/manager"],
              ["Agent", "Get better after every conversation.", "/demo/agent"],
            ].map(([title, body, href]) => (
              <article
                key={title}
                className="flex flex-col rounded-[1.75rem] border border-[#E8EEF7] bg-[#F7FAFF] p-7"
              >
                <h3 className="text-xl font-bold text-[#0B1B33]">{title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-[#4B5C76]">{body}</p>
                <a
                  href={href}
                  className="mt-5 inline-flex text-sm font-semibold text-[#12C48A] hover:underline"
                >
                  Explore the Demo →
                </a>
              </article>
            ))}
          </div>
          <div className="mt-10 grid gap-3 sm:grid-cols-4">
            {[
              ["Every Call", "Understood"],
              ["Every Rep", "Coached"],
              ["Every Manager", "Informed"],
              ["Every Team", "Improving"],
            ].map(([a, b]) => (
              <div key={a} className="rounded-2xl border border-[#E8EEF7] bg-white px-4 py-4 text-center">
                <p className="text-sm font-semibold text-[#0B1B33]">{a}</p>
                <p className="mt-1 text-xs text-[#8A9BB5]">↓</p>
                <p className="mt-1 text-sm font-medium text-[#12C48A]">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Artemis */}
      <section id="why" className="border-y border-[#E8EEF7] bg-[#0B1B33] py-20 text-white">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2EE6A6]">
            Why Artemis
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Most CRMs store what happened.
            <br />
            Artemis is built to understand why it happened.
          </h2>
        </div>
      </section>

      {/* Flywheel */}
      <section id="flywheel" className="py-20">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#12C48A]">
            Flywheel
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-[#0B1B33] sm:text-4xl">
            The system gets smarter every week you use it.
          </h2>
          <p className="mt-3 max-w-xl text-[#4B5C76]">
            Good calls create better playbooks. Better playbooks create smarter AI. Smarter AI creates
            better coaching — and higher conversion.
          </p>
          <Flywheel />
        </div>
      </section>

      {/* Integrations + Pricing */}
      <section id="integrations" className="border-t border-[#E8EEF7] bg-[#F7FAFF] py-20">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 lg:grid-cols-2">
          <article className="rounded-[2rem] bg-gradient-to-br from-[#E8FFF6] via-white to-[#EEF2FF] p-8 sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#12C48A]">
              Integrations
            </p>
            <h3 className="mt-3 text-3xl font-bold tracking-tight text-[#0B1B33]">
              Plugs into the stack you already run
            </h3>
            <p className="mt-3 text-[#4B5C76]">
              CRM and telephony connections are on the roadmap. Demo screens may show simulated
              integrations while we build the live connectors.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {[
                ["HubSpot", "Planned"],
                ["Salesforce", "Planned"],
                ["Zoho", "Planned"],
                ["Pipedrive", "Planned"],
                ["Twilio", "In progress"],
                ["Webhook / API", "Planned"],
              ].map(([n, status]) => (
                <span
                  key={n}
                  className="rounded-full border border-[#D7E0EF] bg-white px-3 py-1.5 text-xs font-semibold text-[#4B5C76]"
                >
                  {n} · <span className="text-[#8A9BB5]">{status}</span>
                </span>
              ))}
            </div>
          </article>

          <article id="pricing" className="rounded-[2rem] border border-[#E8EEF7] bg-white p-8 sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8A9BB5]">Pricing</p>
            <h3 className="mt-3 text-3xl font-bold tracking-tight text-[#0B1B33]">
              €50 per user / month
            </h3>
            <p className="mt-3 text-[#4B5C76]">
              Simple seat pricing for high-volume sales organizations. Pay for the people Artemis
              coaches — not for vanity features.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-[#4B5C76]">
              {[
                "Revenue OS for every seat",
                "Live AI Copilot + Rep DNA™",
                "Operations + Command centers included",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <span className="mt-0.5 text-[#12C48A]">✓</span>
                  {t}
                </li>
              ))}
            </ul>
            <ArtemisButton href="#get-started" className="mt-8">
              Book Demo
            </ArtemisButton>
          </article>
        </div>
      </section>

      {/* Security */}
      <section id="security" className="py-20">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8A9BB5]">
            Trust
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#0B1B33] sm:text-4xl">
            Built for regulated revenue teams
          </h2>
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            <article className="rounded-[1.75rem] border border-[#E8EEF7] bg-white p-8">
              <div className="mb-4 grid size-12 place-items-center rounded-2xl bg-[#EEF2FF] text-[#4F6EF7]">
                <ShieldCheck className="size-5" />
              </div>
              <h3 className="text-xl font-bold text-[#0B1B33]">Designed with enterprise security in mind</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#4B5C76]">
                Role-based access, tenant isolation, and secure data boundaries are part of the
                product design. We do not claim SOC 2 / ISO certifications we have not completed.
              </p>
            </article>
            <article className="rounded-[1.75rem] border border-[#E8EEF7] bg-white p-8">
              <div className="mb-4 grid size-12 place-items-center rounded-2xl bg-[#E8FFF6] text-[#12C48A]">
                <Brain className="size-5" />
              </div>
              <h3 className="text-xl font-bold text-[#0B1B33]">AI that cites evidence</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#4B5C76]">
                Coaching and scores are designed to reference moments in the conversation. Insights
                are assistance — not legal conclusions.
              </p>
            </article>
          </div>
          <p className="mt-6 text-xs text-[#8A9BB5]">
            Built to support GDPR-conscious workflows (access control, retention, erasure paths). Not a
            claim of completed certification audits.
          </p>
        </div>
      </section>

      {/* Design partners */}
      <section id="design-partners" className="border-t border-[#E8EEF7] bg-[#F7FAFF] py-20">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#12C48A]">
            Early access
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#0B1B33] sm:text-4xl">
            Building with high-volume sales teams.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[#4B5C76]">
            We're inviting sales organizations to build Artemis with us — around real workflows,
            real conversations, and real revenue problems.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <ArtemisButton href={CONTACT_MAILTO} className="px-7 py-3 text-base">
              Become a Design Partner
            </ArtemisButton>
            <ArtemisButton href="#get-started" variant="secondary" className="px-7 py-3 text-base">
              Book a Demo
            </ArtemisButton>
            <ArtemisButton href="/demo" variant="secondary" className="px-7 py-3 text-base">
              View Interactive Demo
            </ArtemisButton>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="get-started" className="py-20">
        <div className="mx-auto max-w-4xl px-5">
          <div className="rounded-[2rem] bg-gradient-to-br from-[#0B1B33] via-[#132742] to-[#1A3358] p-10 text-center text-white sm:p-14">
            <Building2 className="mx-auto size-8 text-[#2EE6A6]" />
            <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
              Put Artemis at the center
              <br />
              of your sales organization.
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-white/70">
              Book a demo — or explore the interactive product demo and see the CEO → call → coaching story.
            </p>
            <div className="mt-6 flex justify-center">
              <ContactLinks tone="dark" className="items-center text-center" />
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <ArtemisButton href={CONTACT_MAILTO} className="px-8 py-3 text-base">
                Book a Demo
              </ArtemisButton>
              <ArtemisButton href="/demo" variant="secondary" className="px-8 py-3 text-base">
                Explore the Product
              </ArtemisButton>
              <ArtemisButton href={CONTACT_MAILTO} variant="secondary" className="px-8 py-3 text-base">
                Request Early Access
              </ArtemisButton>
            </div>
            <p className="mt-4 text-xs text-white/45">
              Or call {CONTACT_PHONE_DISPLAY}
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#E8EEF7] bg-white py-12">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 sm:flex-row sm:justify-between">
          <div>
            <ArtemisMark />
            <p className="mt-3 max-w-xs text-sm text-[#8A9BB5]">
              The AI Operating System for high-volume sales organizations.
            </p>
            <ContactLinks className="mt-4" />
          </div>
          <div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-4">
            {[
              ["Product", ["Revenue Loop", "Rep DNA™", "Live Copilot", "Command Center"]],
              ["Platform", ["Operations Center", "Knowledge Engine", "Roleplay", "Integrations"]],
              ["Markets", ["Forex", "Insurance", "Real Estate", "BPOs"]],
              ["Company", ["Why Artemis", "Trust", "Contact Sales", "Privacy"]],
            ].map(([title, links]) => (
              <div key={title as string}>
                <p className="font-semibold text-[#0B1B33]">{title as string}</p>
                <ul className="mt-3 space-y-2 text-[#8A9BB5]">
                  {(links as string[]).map((l) => {
                    const href =
                      l === "Contact Sales"
                        ? CONTACT_MAILTO
                        : l === "Why Artemis"
                          ? "#why"
                          : l === "Trust"
                            ? "#security"
                            : "#capabilities";
                    return (
                      <li key={l}>
                        <a href={href} className="hover:text-[#12C48A]">
                          {l}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <p className="mx-auto mt-10 max-w-6xl px-5 text-xs text-[#A8B5C9]">
          © {new Date().getFullYear()} Artemis AI. All Rights Reserved. ·{" "}
          <a href={CONTACT_MAILTO} className="hover:text-[#12C48A]">
            {CONTACT_EMAIL}
          </a>{" "}
          ·{" "}
          <a href={CONTACT_TEL} className="hover:text-[#12C48A]">
            {CONTACT_PHONE_DISPLAY}
          </a>
        </p>
      </footer>
    </div>
  );
}

function RevenueLoop() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduce = useReducedMotion();

  return (
    <div ref={ref} className="mt-12 overflow-x-auto pb-2">
      <div className="flex min-w-max items-center gap-2 md:min-w-0 md:flex-wrap md:justify-center">
        {REVENUE_LOOP.map((step, i) => (
          <div key={step} className="flex items-center gap-2">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{ delay: i * 0.1, duration: 0.35 }}
              className="rounded-2xl border border-[#D7E0EF] bg-white px-4 py-3 text-sm font-semibold text-[#0B1B33] shadow-sm"
            >
              {step}
            </motion.div>
            {i < REVENUE_LOOP.length - 1 ? (
              <ArrowDown className="hidden size-4 rotate-[-90deg] text-[#12C48A] md:block" />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function Flywheel() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % FLYWHEEL.length);
    }, 1600);
    return () => window.clearInterval(id);
  }, [reduce]);

  return (
    <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {FLYWHEEL.map((step, i) => (
        <div
          key={step}
          className={cn(
            "rounded-[1.25rem] border px-4 py-4 text-sm font-semibold transition-all duration-500",
            i === active
              ? "border-[#2EE6A6] bg-[#E8FFF6] text-[#0B1B33] shadow-[0_12px_40px_-24px_rgba(18,196,138,0.55)]"
              : "border-[#E8EEF7] bg-white text-[#8A9BB5]",
          )}
        >
          <span className="mr-2 text-xs font-bold text-[#12C48A]">{i + 1}</span>
          {step}
          {i < FLYWHEEL.length - 1 ? (
            <ArrowRight className="ml-2 inline size-3.5 opacity-40" />
          ) : (
            <Zap className="ml-2 inline size-3.5 text-[#12C48A]" />
          )}
        </div>
      ))}
    </div>
  );
}

function SignalGrid({
  items,
  tint = "ops",
}: {
  items: string[];
  tint?: "ops" | "executive";
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-3 rounded-[2rem] border p-6 sm:grid-cols-3",
        tint === "executive"
          ? "border-[#E8EEF7] bg-gradient-to-br from-[#0B1B33] to-[#1A3358] text-white"
          : "border-[#E8EEF7] bg-white",
      )}
    >
      {items.map((item) => (
        <div
          key={item}
          className={cn(
            "rounded-xl px-3 py-3 text-xs font-semibold leading-snug",
            tint === "executive" ? "bg-white/10 text-white/90" : "bg-[#F7FAFF] text-[#0B1B33]",
          )}
        >
          {item}
        </div>
      ))}
    </div>
  );
}

function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-lg">
      <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-[#2EE6A6]/25 via-[#18C4FF]/20 to-[#A855F7]/20 blur-2xl" />
      <div className="relative overflow-hidden rounded-[2rem] border border-white bg-white/90 p-5 shadow-[0_30px_80px_-28px_rgba(15,40,80,0.45)] backdrop-blur">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gauge className="size-4 text-[#12C48A]" />
            <p className="text-sm font-semibold text-[#0B1B33]">Revenue OS</p>
          </div>
          <span className="rounded-full bg-[#E8FFF6] px-2.5 py-1 text-[11px] font-semibold text-[#12C48A]">
            Product preview
          </span>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3">
          {[
            ["Every call", "Understood"],
            ["Every rep", "Coached"],
            ["Every team", "Visible"],
          ].map(([l, v]) => (
            <div key={l} className="rounded-2xl bg-[#F7FAFF] p-3">
              <p className="text-[10px] font-medium uppercase tracking-wide text-[#8A9BB5]">{l}</p>
              <p className="mt-1 text-sm font-bold text-[#0B1B33]">{v}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-2">
          {[
            ["Rep DNA · behaviour model", "skills + evidence"],
            ["Copilot · in-call assist", "designed for live moments"],
            ["Command · revenue view", "forecast · risk · coaching"],
          ].map(([a, b]) => (
            <div
              key={a}
              className="flex items-center justify-between rounded-xl border border-[#E8EEF7] px-3 py-2.5 text-sm"
            >
              <span className="font-medium text-[#0B1B33]">{a}</span>
              <span className="text-xs text-[#8A9BB5]">{b}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-2xl bg-gradient-to-r from-[#2EE6A6] to-[#18C4FF] p-4 text-[#0B1B33]">
          <div className="flex items-center gap-2">
            <Target className="size-3.5 opacity-80" />
            <p className="text-xs font-semibold uppercase tracking-wide opacity-80">Product proof</p>
          </div>
          <p className="mt-1 text-sm font-semibold">
            Explore the interactive Apex Markets demo — CEO, manager, agent, call review, and coaching in one flow.
          </p>
        </div>
      </div>
    </div>
  );
}
