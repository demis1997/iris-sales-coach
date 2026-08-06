import { useState } from "react";
import {
  CheckCircle2,
  FileText,
  Languages,
  MessageSquareText,
  ShieldAlert,
  Sparkles,
  Tags,
} from "lucide-react";
import { ArtemisButton, ArtemisMark } from "@/components/relay/brand";
import { ArtemisHeader } from "@/components/relay/header";
import { cn } from "@/lib/utils";

const CAPABILITIES = [
  {
    icon: FileText,
    title: "Rapid call transcription",
    text: "Accurately transcribe lengthy calls in just seconds to improve your QA processes.",
  },
  {
    icon: Tags,
    title: "Use your own keywords",
    text: "Highlight positive and negative keywords, or build your own custom keyword list.",
  },
  {
    icon: Sparkles,
    title: "Assess performance with AI",
    text: "AI-powered conversation scoring makes call reviews more efficient and impactful.",
  },
  {
    icon: ShieldAlert,
    title: "Diminish non-compliance",
    text: "Flag high-risk keywords in real time and take action to prevent non-compliance.",
  },
  {
    icon: MessageSquareText,
    title: "Summarize calls with AI",
    text: "Enjoy concise recaps of every conversation to quickly grasp the essence of every call.",
  },
  {
    icon: Languages,
    title: "Available in 10+ languages",
    text: "Leverage analytics in English, Spanish, French, Arabic, and many more languages.",
  },
];

const INSIGHTS = [
  {
    title: "Call Scoring",
    body: "Gain objective, data-driven insights into agent performance with Artemis AI Call Scoring. Automatically analyze every call to identify top performers, pinpoint areas for improvement, and ensure consistent quality. This leads to happier customers and a more successful contact center.",
    mock: "scoring",
  },
  {
    title: "Call Transcription",
    body: "Tired of missing critical details in customer calls? Artemis AI instantly transcribes every conversation in multiple languages, turning spoken words into searchable text. Quickly find key insights, ensure compliance, and improve customer experiences — all without having to listen to a single recording.",
    mock: "transcript",
  },
  {
    title: "Call Summaries",
    body: "Artemis AI Call Summaries automatically generate concise recaps of every conversation, highlighting key topics, action items, and customer sentiment. Quickly understand the essence of every interaction, improve agent efficiency, and make better-informed decisions.",
    mock: "summary",
  },
];

const OTHER = [
  {
    title: "Omnichannel",
    body: "Deliver a seamless CX with Artemis AI Omnichannel. Unify voice, messaging apps, and SMS in one platform for easy management. Provide personalized support, boost satisfaction, and strengthen relationships.",
  },
  {
    title: "Flow Builder",
    body: "Take control with our intuitive Flow Builder. Easily design call routing, IVR menus, and automated responses — no technical skills needed. Streamline customer journeys, boost satisfaction, and optimize performance.",
  },
  {
    title: "Real-time Dashboards",
    body: "Stay in control with our Real-time Dashboards. Monitor performance, track agent activity, and spot customer trends instantly. Make data-driven decisions to optimize resources and maximize efficiency.",
  },
  {
    title: "AI Predictive Dialer",
    body: "Maximize connections with our Predictive Dialer. Dial numbers based on agent availability, reducing idle time and boosting productivity. Reach more customers, increase sales, and optimize campaigns.",
  },
];


const FAQS: { q: string; a: React.ReactNode }[] = [
  {
    q: "What is Speech Analytics in AI?",
    a: "Speech Analytics is a powerful technology that uses artificial intelligence to analyze and understand your customer conversations. It can automatically transcribe calls, identify key topics and trends, and even gauge customer sentiment. This gives you valuable insights into how your contact center is performing and how you can improve the customer experience.",
  },
  {
    q: "How does Speech Analytics work?",
    a: (
      <div className="space-y-2">
        <p>
          Speech analytics uses a combination of speech-to-text and natural language processing to
          turn spoken audio into actionable insights:
        </p>
        <ol className="list-decimal space-y-1 pl-5">
          <li>Audio Capture and Preprocessing — ingest audio and improve clarity.</li>
          <li>Speech-to-Text (ASR) — convert audio into text with deep learning models.</li>
          <li>NLP and Text Analysis — extract keywords, entities, sentiment, and themes.</li>
          <li>Reporting and Insights — aggregate findings into dashboards and alerts.</li>
          <li>Continuous Improvement — refine models with feedback and new data.</li>
        </ol>
      </div>
    ),
  },
  {
    q: "What are the benefits of Speech Analytics?",
    a: "Speech Analytics helps improve customer experience, enhance agent performance, increase operational efficiency, and mitigate compliance risk by monitoring calls for adherence to guidelines and spotting issues early.",
  },
  {
    q: "What is speech analytics for customer service?",
    a: "Speech analytics for customer service is an AI-powered technology that analyzes customer interactions — both live and recorded — to extract actionable insights using NLP and machine learning at scale.",
  },
  {
    q: "What are the metrics of Speech Analytics?",
    a: "Key metrics include average handling time (AHT), hold time, transfer rates, first call resolution (FCR), customer sentiment, call escalation rates, script adherence, and keyword trends.",
  },
  {
    q: "What is the difference between Speech Analytics and Voice Analytics?",
    a: "Speech analytics focuses on what is said (words, topics, intent). Voice analytics focuses on how it is said (tone, pitch, pace, emotional intensity). Together they give a complete picture of every conversation.",
  },
  {
    q: "Is Speech Analytics considered AI?",
    a: "Yes. It uses ASR, NLP, machine learning, sentiment analysis, and acoustic analysis to convert conversations into searchable, actionable intelligence.",
  },
  {
    q: "How does Artemis AI’s speech analytics compare to other solutions?",
    a: "Artemis AI focuses on fast multilingual transcription, AI call summaries, keyword tagging, conversation scoring, and compliance monitoring for contact centers — with rapid onboarding and transparent product status.",
  },
];

const COUNTRIES = [
  "United States",
  "United Kingdom",
  "Cyprus",
  "Germany",
  "United Arab Emirates",
  "India",
  "Singapore",
  "Australia",
  "Canada",
  "Other",
];

export function ArtemisSpeechAnalyticsPage() {
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-[#0B1220] text-white">
      <div className="bg-[#151D2E] px-4 py-2 text-center text-sm text-white/90">
        🎯 BPO Growth Program: 30% off your first year — August only.{" "}
        <a href="#get-started" className="font-semibold text-[#2EE6A6] underline-offset-2 hover:underline">
          Learn more
        </a>
      </div>

      <ArtemisHeader />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(46,230,166,0.18),_transparent_55%),radial-gradient(ellipse_at_80%_20%,_rgba(56,120,255,0.18),_transparent_40%)]" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-5 pt-16 pb-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pt-20">
          <div>
            <p className="text-sm font-semibold tracking-wide text-[#2EE6A6] uppercase">
              AI Speech Analytics
            </p>
            <h1 className="mt-4 text-4xl leading-[1.08] font-semibold tracking-tight text-balance sm:text-5xl lg:text-[3.4rem]">
              AI Voice Analytics For Contact Centers
            </h1>
            <h2 className="mt-5 text-xl font-medium text-white/90 text-balance sm:text-2xl">
              Turn customer conversations into actionable insights
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-white/65">
              Analyze calls automatically to uncover customer trends, improve agent performance, and
              help teams make faster, more informed decisions.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <ArtemisButton href="#get-started" className="px-7 py-3 text-base">
                Get Started
              </ArtemisButton>
              <p className="max-w-xs text-xs text-white/45">
                By clicking &quot;Get Started&quot; you agree to Artemis AI&apos;s Privacy Policy and
                Terms of Service.
              </p>
            </div>
          </div>

          <HeroProductMock />
        </div>
      </section>

      {/* Capabilities */}
      <section id="features" className="border-t border-white/10 bg-[#0E1628] py-20">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-center text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Understand customers better than ever before
          </h2>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CAPABILITIES.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-[#2EE6A6]/35"
              >
                <item.icon className="size-6 text-[#2EE6A6]" aria-hidden />
                <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Unlock insights */}
      <section id="insights" className="py-20">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Unlock new insights</h2>
          <div className="mt-12 space-y-16">
            {INSIGHTS.map((item, i) => (
              <div
                key={item.title}
                className={cn(
                  "grid items-center gap-8 lg:grid-cols-2",
                  i % 2 === 1 && "lg:[&>*:first-child]:order-2",
                )}
              >
                <div>
                  <h3 className="text-2xl font-semibold">{item.title}</h3>
                  <p className="mt-4 text-base leading-relaxed text-white/65">{item.body}</p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <ArtemisButton href="#get-started">Explore {item.title}</ArtemisButton>
                    <ArtemisButton href="#get-started" variant="secondary">
                      Contact Sales
                    </ArtemisButton>
                  </div>
                </div>
                <FeatureMock kind={item.mock as "scoring" | "transcript" | "summary"} />
              </div>
            ))}
          </div>

          <div className="mt-16 rounded-3xl border border-white/10 bg-gradient-to-br from-[#152038] to-[#0E1628] p-8 text-center sm:p-12">
            <h3 className="text-2xl font-semibold text-balance sm:text-3xl">
              Identify coaching opportunities and customer trends automatically
            </h3>
            <ArtemisButton href="#get-started" className="mt-6 px-8 py-3">
              Get Started
            </ArtemisButton>
          </div>
        </div>
      </section>

      {/* Other features */}
      <section className="border-t border-white/10 bg-[#0E1628] py-20">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-sm font-semibold tracking-wide text-[#2EE6A6] uppercase">
            Other Features
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {OTHER.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
              >
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/60">{item.body}</p>
                <a
                  href="#get-started"
                  className="mt-5 inline-flex text-sm font-semibold text-[#2EE6A6] hover:underline"
                >
                  Explore
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Customers */}

      {/* Integrations */}
      <section id="integrations" className="border-t border-white/10 bg-[#0E1628] py-20">
        <div className="mx-auto max-w-6xl px-5 text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Seamless integration with your CRM
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-white/60">
            Sync with your favorite apps in just a few clicks to leverage the power of Artemis AI
            contact center features.
          </p>
          <div className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
            {["Salesforce", "HubSpot", "Zendesk", "Freshdesk", "Slack", "Zapier", "Twilio", "Aircall"].map(
              (name) => (
                <div
                  key={name}
                  className="rounded-xl border border-white/10 bg-[#0B1220] px-3 py-4 text-sm font-medium text-white/80"
                >
                  {name}
                </div>
              ),
            )}
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ArtemisButton href="#get-started" variant="secondary">
              Explore All Integrations
            </ArtemisButton>
            <ArtemisButton href="#get-started">Get Started</ArtemisButton>
          </div>
        </div>
      </section>

      {/* Lead form */}
      <section id="get-started" className="py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 lg:grid-cols-2 lg:items-start">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              Get started in less than 24 hours
            </h2>
            <p className="mt-4 text-white/65">
              Deploy speech analytics tools with fast onboarding, automated conversation analysis,
              and insights built for modern support and sales teams.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-white/70">
              {[
                "AI transcription in 10+ languages",
                "Automated call scoring and summaries",
                "Keyword and compliance monitoring",
                "CRM-ready conversation insights",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#2EE6A6]" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#121A2C] p-6 sm:p-8">
            {submitted ? (
              <div className="py-10 text-center">
                <CheckCircle2 className="mx-auto size-10 text-[#2EE6A6]" />
                <h3 className="mt-4 text-2xl font-semibold">Thank you for your request!</h3>
                <p className="mt-2 text-white/60">We will contact you as soon as possible.</p>
              </div>
            ) : (
              <form
                className="space-y-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="First name" name="first" required />
                  <Field label="Last name" name="last" required />
                </div>
                <Field label="Company name" name="company" required />
                <Field label="Business email" name="email" type="email" required />
                <Field label="Phone number" name="phone" required />
                <label className="block text-sm">
                  <span className="mb-1.5 block text-white/70">Select your country</span>
                  <select
                    name="country"
                    required
                    className="w-full rounded-xl border border-white/15 bg-[#0B1220] px-3 py-2.5 text-white outline-none focus:border-[#2EE6A6]"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select your country
                    </option>
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block text-sm">
                  <span className="mb-1.5 block text-white/70">Number of Agents</span>
                  <select
                    name="agents"
                    required
                    className="w-full rounded-xl border border-white/15 bg-[#0B1220] px-3 py-2.5 text-white outline-none focus:border-[#2EE6A6]"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      How many agents will you require?
                    </option>
                    {["1-4", "5-9", "10-24", "25-49", "50-99", "100+"].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex items-start gap-2 text-xs text-white/55">
                  <input type="checkbox" className="mt-0.5 accent-[#2EE6A6]" />
                  I agree to receive marketing communications from Artemis AI
                </label>
                <button
                  type="submit"
                  className="w-full rounded-full bg-[#2EE6A6] px-5 py-3 text-sm font-semibold text-[#0B1220] hover:bg-[#5cf0bc]"
                >
                  Get Started
                </button>
                <p className="text-[11px] leading-relaxed text-white/40">
                  By clicking &quot;Get Started&quot;, you agree that we may process your personal
                  data in accordance with our Privacy Policy and you accept our Terms and Conditions.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-white/10 bg-[#0E1628] py-20">
        <div className="mx-auto max-w-3xl px-5">
          <h2 className="text-center text-3xl font-semibold tracking-tight sm:text-4xl">
            Frequently asked questions
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-white/60">
            Our platform streamlines the management of high-performing contact centers, allowing
            businesses to deliver more value to their customers.
          </p>
          <div className="mt-10 divide-y divide-white/10 rounded-2xl border border-white/10 bg-[#0B1220]">
            {FAQS.map((item, i) => {
              const open = openFaq === i;
              return (
                <div key={item.q}>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold sm:text-base"
                    aria-expanded={open}
                    onClick={() => setOpenFaq(open ? null : i)}
                  >
                    {item.q}
                    <span className="text-[#2EE6A6]">{open ? "−" : "+"}</span>
                  </button>
                  {open ? (
                    <div className="px-5 pb-5 text-sm leading-relaxed text-white/60">{item.a}</div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 py-12">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 sm:flex-row sm:justify-between">
          <div>
            <ArtemisMark />
            <p className="mt-3 max-w-sm text-sm text-white/50">
              AI speech analytics for contact centers — turn every conversation into actionable
              intelligence.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 text-sm text-white/60 sm:grid-cols-3">
            <div>
              <p className="font-semibold text-white">Product</p>
              <div className="mt-3 flex flex-col gap-2">
                <a href="#features">Speech Analytics</a>
                <a href="#insights">Call Scoring</a>
                <a href="#integrations">Integrations</a>
              </div>
            </div>
            <div>
              <p className="font-semibold text-white">Company</p>
              <div className="mt-3 flex flex-col gap-2">
                <a href="#customers">Customers</a>
                <a href="#faq">FAQ</a>
                <a href="#get-started">Contact</a>
              </div>
            </div>
            <div>
              <p className="font-semibold text-white">App</p>
              <div className="mt-3 flex flex-col gap-2">
                <a href="/app">Log In</a>
                <a href="#get-started">Try for Free</a>
              </div>
            </div>
          </div>
        </div>
        <p className="mx-auto mt-10 max-w-6xl px-5 text-xs text-white/35">
          © {new Date().getFullYear()} Artemis AI. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

function Badge({ label, score }: { label: string; score: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="rounded bg-white/10 px-2 py-1 text-xs font-semibold">{label}</span>
      <span className="text-xs">Score {score}</span>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block text-white/70">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full rounded-xl border border-white/15 bg-[#0B1220] px-3 py-2.5 text-white outline-none placeholder:text-white/30 focus:border-[#2EE6A6]"
      />
    </label>
  );
}

function HeroProductMock() {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#121A2C] p-4 shadow-2xl shadow-black/40">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <p className="text-sm font-semibold">Call intelligence</p>
        <span className="rounded-full bg-[#2EE6A6]/15 px-2.5 py-1 text-[11px] font-semibold text-[#2EE6A6]">
          Score 4.6
        </span>
      </div>
      <div className="mt-4 space-y-3">
        {[
          ["Discovery", 92],
          ["Listening", 88],
          ["Objection handling", 81],
          ["Compliance", 95],
        ].map(([label, value]) => (
          <div key={String(label)}>
            <div className="mb-1 flex justify-between text-xs text-white/55">
              <span>{label}</span>
              <span className="font-mono text-white/80">{value}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-[#2EE6A6]" style={{ width: `${value}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 rounded-2xl border border-white/10 bg-[#0B1220] p-4">
        <p className="text-xs font-semibold tracking-wide text-white/40 uppercase">AI summary</p>
        <p className="mt-2 text-sm leading-relaxed text-white/75">
          Prospect confirmed budget authority. Pricing objection resolved with value framing. Next
          step booked for Thursday demo.
        </p>
      </div>
    </div>
  );
}

function FeatureMock({ kind }: { kind: "scoring" | "transcript" | "summary" }) {
  if (kind === "transcript") {
    return (
      <div className="rounded-3xl border border-white/10 bg-[#121A2C] p-5">
        <p className="text-xs font-semibold text-white/40 uppercase">Transcript</p>
        <div className="mt-4 space-y-3 text-sm">
          <p>
            <span className="text-[#2EE6A6]">Agent:</span>{" "}
            <span className="text-white/70">Thanks for calling — how can I help today?</span>
          </p>
          <p>
            <span className="text-sky-300">Customer:</span>{" "}
            <span className="text-white/70">
              I need clarity on pricing and whether this works for our team in Arabic and English.
            </span>
          </p>
          <p className="rounded-lg bg-[#2EE6A6]/10 px-3 py-2 text-[#2EE6A6]">
            Keyword highlighted: pricing · multilingual
          </p>
        </div>
      </div>
    );
  }
  if (kind === "summary") {
    return (
      <div className="rounded-3xl border border-white/10 bg-[#121A2C] p-5">
        <p className="text-xs font-semibold text-white/40 uppercase">Call summary</p>
        <ul className="mt-4 space-y-2 text-sm text-white/70">
          <li>• Topics: onboarding, pricing, support hours</li>
          <li>• Sentiment: mixed → positive</li>
          <li>• Action items: send proposal, schedule follow-up</li>
          <li>• Risk flags: none</li>
        </ul>
      </div>
    );
  }
  return (
    <div className="rounded-3xl border border-white/10 bg-[#121A2C] p-5">
      <p className="text-xs font-semibold text-white/40 uppercase">AI call scoring</p>
      <div className="mt-4 grid grid-cols-3 gap-3 text-center">
        {[
          ["Overall", "4.6"],
          ["Empathy", "4.8"],
          ["Process", "4.3"],
        ].map(([l, v]) => (
          <div key={l} className="rounded-xl bg-[#0B1220] p-3">
            <p className="text-2xl font-semibold text-[#2EE6A6]">{v}</p>
            <p className="mt-1 text-[11px] text-white/45">{l}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
