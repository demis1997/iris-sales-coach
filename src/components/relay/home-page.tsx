import {
  ArrowRight,
  Bot,
  Building2,
  Globe2,
  Headphones,
  Layers,
  LineChart,
  PhoneCall,
  ShieldCheck,
  Sparkles,
  Workflow,
  Zap,
} from "lucide-react";
import { RelayButton, RelayMark } from "@/components/relay/brand";
import { RelayHeader } from "@/components/relay/header";
import { cn } from "@/lib/utils";

const LOGOS = [
  "Xoxoday",
  "BookingAgora",
  "Airpaz",
  "MyHolidays",
  "Doo Group",
  "Infomedia",
  "ThinkLogic",
  "Edumentors",
  "Dentfix",
  "Advanced Markets",
];

const PILLARS = [
  {
    eyebrow: "Embrace AI",
    title: "Elevate engagement with AI-powered tools",
    body: "Boost call volume by 400% with our AI Predictive Dialer and gain deep insights with speech analytics, transcriptions, sentiment analysis, summaries, and more — all available in 10+ languages.",
    cta: "Explore AI tools",
    href: "#speech",
    accent: "from-[#2EE6A6] to-[#18C4FF]",
    icon: Sparkles,
  },
  {
    eyebrow: "Intelligent workflows",
    title: "Smarter flows, faster resolutions",
    body: "Build and automate interaction flows with Relay AI’s no-code interface. Set up IVR menus, intelligent routing, and chatbot interactions to ensure fast, seamless customer support.",
    cta: "Explore Flow Builder",
    href: "#flow",
    accent: "from-[#4F6EF7] to-[#A855F7]",
    icon: Workflow,
  },
  {
    eyebrow: "CRM integrations",
    title: "Sync contacts and track interactions",
    body: "Connect Relay AI with HubSpot, Salesforce, Zoho and more to automate workflows, sync customer data, and enhance productivity. Reduce manual tasks and keep every team connected.",
    cta: "Learn more",
    href: "#integrations",
    accent: "from-[#FF7A45] to-[#FF4D8D]",
    icon: Layers,
  },
];

const STORIES = [
  {
    quote:
      "Before Relay AI we had several platforms for our operations. Now everything is managed and monitored from a single system.",
    name: "Wendy Anwar",
    role: "Chief Product Officer, Airpaz",
  },
  {
    quote:
      "Relay AI’s dialer increased our agents’ daily call volume by 40–50% while cutting idle time by nearly half.",
    name: "Ali Mustafa",
    role: "CEO & Founder, Realtree Properties",
  },
  {
    quote:
      "RideNow went live the same day they onboarded, connecting WhatsApp and activating their chatbot within hours.",
    name: "RideNow",
    role: "Customer story",
  },
];

const PRODUCTS = [
  {
    id: "omnichannel",
    eyebrow: "Many channels, one platform",
    title: "Omnichannel",
    body: "Deliver a seamless CX with Relay AI Omnichannel. Unify voice, messaging apps, and SMS in one platform for easy management. Provide personalized support, boost satisfaction, and strengthen relationships.",
    metric: null,
    tint: "bg-[#EEF2FF]",
  },
  {
    id: "dialer",
    eyebrow: "400% more calls per hour",
    title: "AI Predictive Dialer",
    body: "Boost contact rates and agent productivity with Relay AI’s Predictive Dialer. It intelligently dials based on agent availability, reducing idle time and maximizing connections to drive sales.",
    metric: "400%",
    tint: "bg-[#E8FFF6]",
  },
  {
    id: "speech",
    eyebrow: "Conversation intelligence",
    title: "AI Speech Analytics",
    body: "Unlock insights with AI Speech Analytics. Transcribe calls, analyze sentiment, and identify key topics automatically. Improve agent performance, enhance CX, and drive smarter decisions.",
    metric: null,
    tint: "bg-[#FFF4E8]",
  },
  {
    id: "flow",
    eyebrow: "Design, automate, optimize",
    title: "Flow Builder",
    body: "Create custom call flows with a no-code, drag-and-drop Flow Builder. Design IVR menus, intelligent routing, and CRM-connected journeys across voice, chat, and messaging.",
    metric: null,
    tint: "bg-[#F3E8FF]",
  },
];

const CLIENTS = [
  {
    company: "BookingAgora",
    quote:
      "We’re delighted to utilise Relay AI as our trusted contact center solution. With its efficiency and reliability, we can provide unparalleled support regarding travel services to our global clientele.",
    person: "Kadri Ciga, Co-founder",
  },
  {
    company: "Karma Group",
    quote:
      "We have smoothed our entire business process by integrating systems with the Relay AI platform. Facebook-generated leads drop into Zoho, become available in Relay AI, and call outcomes sync back automatically.",
    person: "David M. Scheckter, COO",
  },
  {
    company: "Weblio",
    quote:
      "Relay AI’s dialer revolutionized our communication processes. With seamless automation, our team now efficiently contacts thousands of tutors daily, significantly boosting productivity.",
    person: "Ody Aporado, Dispatch Supervisor",
  },
];

const USE_CASES = [
  {
    label: "Outbound",
    title: "Accelerate your sales",
    body: "Help your sales team connect faster and convert more. Omnichannel outreach, predictive dialing, answering machine detection, and local caller ID maximize talk time with the right prospects.",
  },
  {
    label: "Inbound",
    title: "Elevate customer support",
    body: "Deliver faster support with visual flow building, AI insights, and self-service chatbots. Reduce wait times and ensure every caller reaches the right agent.",
  },
  {
    label: "Remote",
    title: "Empower remote agents",
    body: "Keep remote teams connected with a cloud platform, global call routing, and real-time monitoring — high performance from anywhere.",
  },
];

const INDUSTRIES = [
  "BPOs",
  "Travel & Hospitality",
  "Fintech",
  "Healthcare",
  "IT & Technology",
  "eCommerce",
  "EdTech",
  "Retail",
  "iGaming",
  "Recruitment",
  "Non Profit",
  "Insurance",
  "Telemarketing",
  "Loans",
  "Transportation",
];

const NEXT_LEVEL = [
  {
    icon: Bot,
    title: "Live AI coach in every call",
    body: "Real-time prompts, objection handlers, and talk-track guidance while agents are still on the line — not just after-call scoring.",
  },
  {
    icon: LineChart,
    title: "Rep DNA & skill graphs",
    body: "Map each agent’s strengths, gaps, and coaching plan automatically so managers know exactly who to train and why.",
  },
  {
    icon: Headphones,
    title: "AI roleplay & certification",
    body: "Practice tough scenarios with an AI buyer, score the session, and unlock campaigns only when reps are certified.",
  },
  {
    icon: Zap,
    title: "Revenue OS, not just dialer",
    body: "Pipeline, tasks, coaching, QA, and executive dashboards in one system — so contact center data becomes closed-won revenue.",
  },
];

export function RelayHomePage() {
  return (
    <div className="min-h-screen bg-white text-[#0B1B33]">
      <div className="border-b border-[#E8EEF7] bg-gradient-to-r from-[#E8FFF6] via-[#EEF2FF] to-[#FFF4E8]">
        <p className="mx-auto max-w-6xl px-5 py-2.5 text-center text-sm text-[#4B5C76]">
          <span className="mr-1.5">🎯</span>
          BPO Growth Program: <span className="font-semibold text-[#12C48A]">30% off</span> your
          first year — August only.{" "}
          <a href="#get-started" className="font-semibold text-[#4F6EF7] underline-offset-2 hover:underline">
            Learn more
          </a>
        </p>
      </div>

      <RelayHeader />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#E8FFF6_0%,_transparent_50%),radial-gradient(ellipse_at_90%_10%,_#EEF2FF_0%,_transparent_40%),radial-gradient(ellipse_at_10%_90%,_#FFF4E8_0%,_transparent_35%)]" />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-5 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-24">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#12C48A]">
              AI Contact Center Software
            </p>
            <h1 className="text-4xl font-bold leading-[1.05] tracking-tight text-[#0B1B33] sm:text-5xl lg:text-[3.5rem]">
              Every interaction,
              <br />a human connection.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-[#4B5C76]">
              Unify customer interactions across all channels with an intelligent, AI-powered contact
              center platform — boosting agent efficiency and delivering seamless customer experiences.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <RelayButton href="#get-started" className="px-7 py-3 text-base">
                Get Started
              </RelayButton>
              <RelayButton href="#products" variant="secondary" className="px-7 py-3 text-base">
                Explore products
              </RelayButton>
            </div>
            <p className="mt-4 text-xs text-[#8A9BB5]">
              By clicking Get Started you agree to Relay AI’s Privacy Policy and Terms of Service.
            </p>

            <div className="mt-10 flex flex-wrap gap-6">
              {[
                ["Trustpilot", "4.6/5"],
                ["G2", "4.8/5"],
                ["Capterra", "4.7/5"],
              ].map(([name, score]) => (
                <div key={name} className="min-w-[110px]">
                  <p className="text-xs font-medium uppercase tracking-wide text-[#8A9BB5]">{name}</p>
                  <p className="mt-1 text-lg font-bold text-[#0B1B33]">{score}</p>
                  <div className="mt-1 flex gap-0.5 text-[#2EE6A6]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <HeroVisual />
        </div>
      </section>

      {/* Logo strip */}
      <section className="border-y border-[#E8EEF7] bg-[#F7FAFF] py-10">
        <div className="mx-auto max-w-6xl px-5">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
            {LOGOS.map((name) => (
              <span
                key={name}
                className="text-sm font-semibold tracking-wide text-[#A8B5C9] transition hover:text-[#4B5C76]"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Three pillars */}
      <section id="capabilities" className="py-20">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 lg:grid-cols-3">
          {PILLARS.map((item) => (
            <article
              key={item.eyebrow}
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
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8A9BB5]">
                {item.eyebrow}
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#0B1B33]">{item.title}</h2>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-[#4B5C76]">{item.body}</p>
              <a
                href={item.href}
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[#12C48A]"
              >
                {item.cta} <ArrowRight className="size-4" />
              </a>
            </article>
          ))}
        </div>
      </section>

      {/* Platform for growth */}
      <section className="border-y border-[#E8EEF7] bg-[#F7FAFF] py-20">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-center text-3xl font-bold tracking-tight text-[#0B1B33] sm:text-4xl">
            A platform for growth
          </h2>
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {STORIES.map((s) => (
              <blockquote
                key={s.name}
                className="rounded-[1.75rem] border border-white bg-white p-7 shadow-[0_12px_40px_-24px_rgba(15,40,80,0.3)]"
              >
                <p className="text-[15px] leading-relaxed text-[#4B5C76]">“{s.quote}”</p>
                <footer className="mt-6">
                  <p className="font-semibold text-[#0B1B33]">{s.name}</p>
                  <p className="text-sm text-[#8A9BB5]">{s.role}</p>
                  <a href="#get-started" className="mt-3 inline-flex text-sm font-semibold text-[#4F6EF7]">
                    Read the story →
                  </a>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* Product deep dives */}
      <section id="products" className="py-8">
        {PRODUCTS.map((p, i) => (
          <div
            key={p.id}
            id={p.id}
            className={cn("py-16", i % 2 === 1 ? "bg-[#F7FAFF]" : "bg-white")}
          >
            <div
              className={cn(
                "mx-auto grid max-w-6xl items-center gap-10 px-5 lg:grid-cols-2",
                i % 2 === 1 && "lg:[&>*:first-child]:order-2",
              )}
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#12C48A]">
                  {p.eyebrow}
                </p>
                <h3 className="mt-3 text-3xl font-bold tracking-tight text-[#0B1B33] sm:text-4xl">
                  {p.title}
                </h3>
                <p className="mt-4 text-base leading-relaxed text-[#4B5C76]">{p.body}</p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <RelayButton href="#get-started">Explore {p.title}</RelayButton>
                  <RelayButton href="#get-started" variant="secondary">
                    Contact Sales
                  </RelayButton>
                </div>
              </div>
              <ProductMock title={p.title} tint={p.tint} metric={p.metric} />
            </div>
          </div>
        ))}
      </section>

      {/* What clients say */}
      <section id="customers" className="border-y border-[#E8EEF7] bg-white py-20">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-[#8A9BB5]">
            What clients say
          </p>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {CLIENTS.map((c) => (
              <article
                key={c.company}
                className="rounded-[1.75rem] border border-[#E8EEF7] bg-[#F7FAFF] p-7"
              >
                <h3 className="text-xl font-bold text-[#0B1B33]">{c.company}</h3>
                <p className="mt-4 text-sm leading-relaxed text-[#4B5C76]">“{c.quote}”</p>
                <p className="mt-5 text-sm font-medium text-[#8A9BB5]">{c.person}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section id="solutions" className="bg-[#F7FAFF] py-20">
        <div className="mx-auto grid max-w-6xl gap-5 px-5 lg:grid-cols-3">
          {USE_CASES.map((u) => (
            <article
              key={u.title}
              className="rounded-[1.75rem] border border-white bg-white p-7 shadow-[0_12px_40px_-24px_rgba(15,40,80,0.28)]"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8A9BB5]">
                {u.label}
              </p>
              <h3 className="mt-3 text-2xl font-bold tracking-tight text-[#0B1B33]">{u.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#4B5C76]">{u.body}</p>
              <div className="mt-6 flex flex-wrap gap-4 text-sm font-semibold">
                <a href="#get-started" className="text-[#12C48A]">
                  Explore →
                </a>
                <a href="#get-started" className="text-[#4F6EF7]">
                  Contact Sales
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Integrations + Pricing */}
      <section id="integrations" className="py-20">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 lg:grid-cols-2">
          <article className="rounded-[2rem] bg-gradient-to-br from-[#E8FFF6] via-white to-[#EEF2FF] p-8 sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#12C48A]">
              Integrations
            </p>
            <h3 className="mt-3 text-3xl font-bold tracking-tight text-[#0B1B33]">
              Seamless integration with your CRM
            </h3>
            <p className="mt-3 text-[#4B5C76]">
              Sync with your favorite apps in just a few clicks to leverage Relay AI’s contact center
              features.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["HubSpot", "Salesforce", "Zoho", "Zendesk", "Pipedrive", "Zapier"].map((n) => (
                <span
                  key={n}
                  className="rounded-full border border-[#D7E0EF] bg-white px-3 py-1.5 text-xs font-semibold text-[#4B5C76]"
                >
                  {n}
                </span>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <RelayButton href="#get-started">Explore All Integrations</RelayButton>
              <RelayButton href="#get-started" variant="secondary">
                Get Started
              </RelayButton>
            </div>
          </article>

          <article id="pricing" className="rounded-[2rem] border border-[#E8EEF7] bg-white p-8 sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8A9BB5]">Pricing</p>
            <h3 className="mt-3 text-3xl font-bold tracking-tight text-[#0B1B33]">
              Prices and features suitable for all sizes
            </h3>
            <p className="mt-3 text-[#4B5C76]">
              Whether you are an enterprise or a medium-sized business, we’ve built a flexible
              platform that scales with you while providing fair pricing based on your needs.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-[#4B5C76]">
              {[
                "Per-agent plans that grow with your team",
                "Omnichannel + dialer + analytics included",
                "Go live in less than 24 hours",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <span className="mt-0.5 text-[#12C48A]">✓</span>
                  {t}
                </li>
              ))}
            </ul>
            <RelayButton href="#get-started" className="mt-8">
              Go to pricing
            </RelayButton>
          </article>
        </div>
      </section>

      {/* Industries */}
      <section className="border-y border-[#E8EEF7] bg-[#F7FAFF] py-20">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8A9BB5]">
            Industries
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-[#0B1B33] sm:text-4xl">
            Built for your industry
          </h2>
          <p className="mt-3 max-w-2xl text-[#4B5C76]">
            Our platform streamlines high-performing contact centers, helping businesses deliver more
            value to their customers.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            {INDUSTRIES.map((name) => (
              <a
                key={name}
                href="#get-started"
                className="rounded-full border border-[#D7E0EF] bg-white px-4 py-2 text-sm font-medium text-[#4B5C76] transition hover:border-[#2EE6A6] hover:text-[#0B1B33]"
              >
                {name}
              </a>
            ))}
          </div>
          <a href="#get-started" className="mt-8 inline-flex text-sm font-semibold text-[#4F6EF7]">
            All Industries →
          </a>
        </div>
      </section>

      {/* Next level — Relay differentiators */}
      <section id="next-level" className="py-20">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-[#12C48A]">
            Beyond the contact center
          </p>
          <h2 className="mt-3 text-center text-3xl font-bold tracking-tight text-[#0B1B33] sm:text-4xl">
            Take it to the next level with Relay AI
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-[#4B5C76]">
            Match Voiso’s contact-center core — then go further with live coaching, skill DNA,
            roleplay certification, and a full revenue OS.
          </p>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {NEXT_LEVEL.map((item) => (
              <article
                key={item.title}
                className="rounded-[1.5rem] border border-[#E8EEF7] bg-white p-6 shadow-[0_12px_40px_-28px_rgba(15,40,80,0.35)]"
              >
                <div className="mb-4 grid size-11 place-items-center rounded-2xl bg-[#E8FFF6] text-[#12C48A]">
                  <item.icon className="size-5" />
                </div>
                <h3 className="font-semibold text-[#0B1B33]">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#4B5C76]">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Infrastructure */}
      <section id="security" className="border-y border-[#E8EEF7] bg-[#F7FAFF] py-20">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8A9BB5]">
            Certified & Trusted
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#0B1B33] sm:text-4xl">
            Infrastructure and security
          </h2>
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            <article className="rounded-[1.75rem] border border-white bg-white p-8">
              <div className="mb-4 grid size-12 place-items-center rounded-2xl bg-[#EEF2FF] text-[#4F6EF7]">
                <Globe2 className="size-5" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8A9BB5]">
                Worldwide
              </p>
              <h3 className="mt-2 text-xl font-bold text-[#0B1B33]">
                Global coverage you can count on
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#4B5C76]">
                We maintain a worldwide network of data centers and NOCs, ensuring reliable service,
                superior call quality, and global coverage.
              </p>
            </article>
            <article className="rounded-[1.75rem] border border-white bg-white p-8">
              <div className="mb-4 grid size-12 place-items-center rounded-2xl bg-[#E8FFF6] text-[#12C48A]">
                <ShieldCheck className="size-5" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8A9BB5]">
                Certified
              </p>
              <h3 className="mt-2 text-xl font-bold text-[#0B1B33]">
                Protecting you and your customers
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#4B5C76]">
                End-to-end encryption for all data handling, GDPR compliance, and alignment with ISO
                27001, ISO 9001, and PCI DSS.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="get-started" className="py-20">
        <div className="mx-auto max-w-4xl px-5">
          <div className="rounded-[2rem] bg-gradient-to-br from-[#0B1B33] via-[#132742] to-[#1A3358] p-10 text-center text-white sm:p-14">
            <Building2 className="mx-auto size-8 text-[#2EE6A6]" />
            <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
              Get started in
              <br />
              less than 24 hours
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-white/70">
              Let’s discuss a solution that works for you.
            </p>
            <RelayButton href="/app" className="mt-8 px-8 py-3 text-base">
              Get Started
            </RelayButton>
            <p className="mt-4 text-xs text-white/45">
              By clicking Get Started you agree to Relay AI’s Privacy Policy and Terms of Service.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#E8EEF7] bg-white py-12">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 sm:flex-row sm:justify-between">
          <div>
            <RelayMark />
            <p className="mt-3 max-w-xs text-sm text-[#8A9BB5]">
              AI contact center software — omnichannel, predictive dialing, speech analytics, and a
              full revenue OS.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-4">
            {[
              ["Solutions", ["Sales", "Support", "BPOs", "Virtual Numbers"]],
              ["Products", ["Omnichannel", "Flow Builder", "Speech Analytics", "Predictive Dialer"]],
              ["Resources", ["Integrations", "Documentation", "Developers", "Blog"]],
              ["Company", ["About", "Careers", "Contact Sales", "Privacy"]],
            ].map(([title, links]) => (
              <div key={title as string}>
                <p className="font-semibold text-[#0B1B33]">{title as string}</p>
                <ul className="mt-3 space-y-2 text-[#8A9BB5]">
                  {(links as string[]).map((l) => (
                    <li key={l}>
                      <a href="#get-started" className="hover:text-[#12C48A]">
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <p className="mx-auto mt-10 max-w-6xl px-5 text-xs text-[#A8B5C9]">
          © {new Date().getFullYear()} Relay AI. All Rights Reserved.
        </p>
      </footer>
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
            <PhoneCall className="size-4 text-[#12C48A]" />
            <p className="text-sm font-semibold text-[#0B1B33]">Live contact center</p>
          </div>
          <span className="rounded-full bg-[#E8FFF6] px-2.5 py-1 text-[11px] font-semibold text-[#12C48A]">
            24 agents online
          </span>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3">
          {[
            ["Calls / hr", "412", "+38%"],
            ["Answer rate", "67%", "+5x local ID"],
            ["CSAT", "4.8", "AI scored"],
          ].map(([l, v, s]) => (
            <div key={l} className="rounded-2xl bg-[#F7FAFF] p-3">
              <p className="text-[10px] font-medium uppercase tracking-wide text-[#8A9BB5]">{l}</p>
              <p className="mt-1 text-xl font-bold text-[#0B1B33]">{v}</p>
              <p className="text-[11px] text-[#12C48A]">{s}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-2">
          {[
            ["Inbound · WhatsApp", "routed · 00:12"],
            ["Outbound · Predictive", "connected · live"],
            ["QA · Speech AI", "score 4.6 · summarized"],
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
          <p className="text-xs font-semibold uppercase tracking-wide opacity-80">AI coach tip</p>
          <p className="mt-1 text-sm font-semibold">
            Prospect mentioned budget — ask for decision timeline before pitching tiers.
          </p>
        </div>
      </div>
    </div>
  );
}

function ProductMock({
  title,
  tint,
  metric,
}: {
  title: string;
  tint: string;
  metric: string | null;
}) {
  return (
    <div className={cn("relative overflow-hidden rounded-[2rem] p-8", tint)}>
      <div className="rounded-[1.5rem] border border-white/80 bg-white/90 p-6 shadow-[0_20px_50px_-30px_rgba(15,40,80,0.4)]">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#8A9BB5]">{title}</p>
        {metric ? (
          <p className="mt-3 text-5xl font-bold tracking-tight text-[#0B1B33]">{metric}</p>
        ) : (
          <div className="mt-4 space-y-2">
            {[88, 64, 76, 52].map((w, i) => (
              <div key={i} className="h-2.5 rounded-full bg-[#E8EEF7]">
                <div className="h-2.5 rounded-full bg-[#2EE6A6]" style={{ width: `${w}%` }} />
              </div>
            ))}
          </div>
        )}
        <p className="mt-4 text-sm text-[#4B5C76]">
          Real-time visibility across agents, queues, and customer journeys.
        </p>
      </div>
    </div>
  );
}
