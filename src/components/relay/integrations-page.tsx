import { useState } from "react";
import {
  Headphones,
  Import,
  MousePointerClick,
  PhoneCall,
  Sparkles,
  Database,
} from "lucide-react";
import { ArtemisButton, ArtemisMark } from "@/components/relay/brand";
import { ArtemisHeader } from "@/components/relay/header";
import { ContactLinks } from "@/components/relay/contact-links";
import {
  CONTACT_EMAIL,
  CONTACT_MAILTO,
  CONTACT_PHONE_DISPLAY,
  CONTACT_TEL,
  buildContactMailto,
} from "@/components/relay/contact";
import { cn } from "@/lib/utils";

const BENEFITS = [
  {
    icon: Headphones,
    title: "Handle calls in CRM",
    text: "Make and receive calls while in your CRM by using Artemis AI’s built-in softphone.",
    tint: "from-[#E8FFF6] to-[#D9F7FF]",
    iconColor: "text-[#12C48A]",
  },
  {
    icon: MousePointerClick,
    title: "Use click-to-call",
    text: "Initiate calls with a click by selecting the contact’s phone number in your CRM.",
    tint: "from-[#EEF2FF] to-[#E8F7FF]",
    iconColor: "text-[#4F6EF7]",
  },
  {
    icon: PhoneCall,
    title: "Display info immediately",
    text: "Upon entering a call, the contact’s details and history appear automatically.",
    tint: "from-[#FFF4E8] to-[#FFECEC]",
    iconColor: "text-[#FF7A45]",
  },
  {
    icon: Import,
    title: "Import calling lists",
    text: "Import contacts into Artemis AI and make outbound calls with our AI Predictive Dialer.",
    tint: "from-[#F3E8FF] to-[#FFE8F7]",
    iconColor: "text-[#A855F7]",
  },
  {
    icon: Sparkles,
    title: "Summarize calls with AI",
    text: "Artemis AI Speech Analytics can generate call summaries directly in your CRM.",
    tint: "from-[#E8FFF6] to-[#FFF8E8]",
    iconColor: "text-[#12C48A]",
  },
  {
    icon: Database,
    title: "Unlock valuable data",
    text: "Benefit from call recordings, transcripts, and keyword analysis for every call.",
    tint: "from-[#E8F4FF] to-[#EEF2FF]",
    iconColor: "text-[#18C4FF]",
  },
];

const INTEGRATIONS = [
  {
    name: "HubSpot",
    color: "#FF7A59",
    status: "Planned",
    blurb:
      "Planned CRM connector for call logging, SMS, and dialer workflows inside HubSpot.",
  },
  {
    name: "Salesforce",
    color: "#00A1E0",
    status: "Planned",
    blurb:
      "Planned Salesforce connector for call context and coaching insights in the CRM.",
  },
  {
    name: "Zoho",
    color: "#E42527",
    status: "Planned",
    blurb:
      "Planned Zoho integration for call logging, campaigns, and ticket creation.",
  },
  {
    name: "Bitrix24",
    color: "#2FC6F6",
    status: "Planned",
    blurb:
      "Planned Bitrix24 connector for outbound calling and AI insights.",
  },
  {
    name: "Freshdesk",
    color: "#25C16F",
    status: "Planned",
    blurb:
      "Planned Freshdesk connector for call pop-up, history, and ticket creation.",
  },
  {
    name: "Zendesk",
    color: "#03363D",
    status: "Planned",
    blurb:
      "Planned Zendesk connector for AI calling features in support workflows.",
  },
  {
    name: "Zapier",
    color: "#FF4A00",
    status: "Planned",
    blurb:
      "Planned Zapier workflows to connect calls to CRM, helpdesk, and marketing tools.",
  },
  {
    name: "Make.com",
    color: "#6D00CC",
    status: "Planned",
    blurb:
      "Planned Make.com automation for calling workflows and app connections.",
  },
  {
    name: "Pipedrive",
    color: "#017737",
    status: "Planned",
    blurb:
      "Planned Pipedrive connector for pipeline context and dialer workflows.",
  },
  {
    name: "Twilio",
    color: "#F22F46",
    status: "In progress",
    blurb:
      "Telephony foundation in progress — click-to-call and caller ID for Artemis workspaces.",
  },
  {
    name: "Something else?",
    color: "#12C48A",
    status: "Talk to us",
    blurb:
      "Tell us which systems your floor runs. We prioritize connectors with design partners.",
  },
];

const USE_CASES = [
  {
    title: "Accelerate your sales",
    body: "Artemis AI helps your sales team connect faster and convert more. With omnichannel communication, predictive dialer, answering machine detection, and local caller ID, it maximizes call efficiency.",
    accent: "from-[#2EE6A6] to-[#18C4FF]",
    label: "Sales contact center",
  },
  {
    title: "Elevate your customer support",
    body: "Deliver faster, more efficient support. With visual flow building, AI-powered insights, and self-service chatbots, every caller reaches the right agent — boosting satisfaction.",
    accent: "from-[#4F6EF7] to-[#A855F7]",
    label: "Support contact center",
  },
  {
    title: "Empower your remote agents",
    body: "Keep remote teams connected and productive. With a cloud-based platform, global call routing, and real-time monitoring, agents work from anywhere without losing performance.",
    accent: "from-[#FF7A45] to-[#FF4D8D]",
    label: "Remote contact center",
  },
];

const FAQS = [
  {
    q: "How easy is it to integrate Artemis AI with our existing tools?",
    a: "CRM and telephony connectors are planned or in progress. Demo screens may show simulated integrations. For design partners, we prioritize the connectors your floor actually needs — including API-first options.",
  },
  {
    q: "Can we connect multiple systems to Artemis AI at the same time?",
    a: "That is the product direction: CRM, helpdesk, and telephony together in one agent experience. Availability depends on which connectors have shipped for your workspace.",
  },
  {
    q: "What if our team needs a custom integration?",
    a: "Artemis is being built API-first. Talk to us about your stack — we work with design partners on custom setup plans where it makes sense.",
  },
  {
    q: "Is there a developer resource center available?",
    a: "API documentation and developer tooling are expanding as connectors ship. Contact us if you need early access materials.",
  },
  {
    q: "What if we need to go live quickly?",
    a: "Book a demo or become a design partner. We will map a realistic rollout for your telephony and CRM stack — without promising overnight connectors that are not shipped yet.",
  },
  {
    q: "How does Artemis AI ensure data security across integrations?",
    a: "Artemis AI is designed with enterprise security in mind — encryption, tenant isolation, audit trails, and access controls. We do not claim SOC 2, ISO 27001, or PCI DSS certification until those audits are completed.",
  },
];

export function ArtemisIntegrationsPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-white text-[#0B1B33]">
      <div className="border-b border-[#E8EEF7] bg-gradient-to-r from-[#E8FFF6] via-[#EEF2FF] to-[#FFF4E8]">
        <p className="mx-auto max-w-6xl px-5 py-2.5 text-center text-sm text-[#4B5C76]">
          Building with high-volume sales teams.{" "}
          <a href="/demo" className="font-semibold text-[#4F6EF7] underline-offset-2 hover:underline">
            Explore the product demo
          </a>{" "}
          or{" "}
          <a href="#get-started" className="font-semibold text-[#12C48A] underline-offset-2 hover:underline">
            become a design partner
          </a>
          .
        </p>
      </div>

      <ArtemisHeader />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#E8FFF6_0%,_transparent_55%),radial-gradient(ellipse_at_80%_20%,_#EEF2FF_0%,_transparent_45%),radial-gradient(ellipse_at_20%_80%,_#FFF4E8_0%,_transparent_40%)]" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-5 py-16 lg:grid-cols-2 lg:items-center lg:py-24">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#12C48A]">
              Integrations
            </p>
            <h1 className="text-4xl font-bold leading-[1.08] tracking-tight text-[#0B1B33] sm:text-5xl lg:text-[3.4rem]">
              Connect Artemis AI with the tools you love
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-[#4B5C76]">
              Planned and in-progress connectors for the CRMs and telephony stacks high-volume sales
              teams already run. Demo screens may show simulated integrations until live connectors ship.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ArtemisButton href="#get-started" className="px-7 py-3 text-base">
                Talk to Us
              </ArtemisButton>
              <ArtemisButton href="/demo" variant="secondary" className="px-7 py-3 text-base">
                Explore the Product Demo
              </ArtemisButton>
            </div>
            <p className="mt-4 text-xs text-[#8A9BB5]">
              By clicking Get Started you agree to Artemis AI’s Privacy Policy and Terms of Service.
            </p>
          </div>

          <HeroArt />
        </div>
      </section>

      {/* Benefits */}
      <section id="capabilities" className="border-t border-[#E8EEF7] bg-[#F7FAFF] py-20">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-center text-3xl font-bold tracking-tight text-[#0B1B33] sm:text-4xl">
            How Artemis AI levels up
            <br className="hidden sm:block" /> CRMs and other apps
          </h2>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map((item) => (
              <article
                key={item.title}
                className="rounded-3xl border border-white bg-white p-6 shadow-[0_12px_40px_-20px_rgba(15,40,80,0.25)]"
              >
                <div
                  className={cn(
                    "mb-4 grid size-12 place-items-center rounded-2xl bg-gradient-to-br",
                    item.tint,
                  )}
                >
                  <item.icon className={cn("size-5", item.iconColor)} />
                </div>
                <h3 className="text-lg font-semibold text-[#0B1B33]">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#4B5C76]">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Integration grid */}
      <section id="integrations" className="py-20">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-center text-3xl font-bold tracking-tight text-[#0B1B33] sm:text-4xl">
            Planned integrations for your stack
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-[#4B5C76]">
            Labels below mark roadmap status — not live availability unless noted.
          </p>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {INTEGRATIONS.map((item) => (
              <article
                key={item.name}
                className="group rounded-3xl border border-[#E8EEF7] bg-white p-6 transition hover:-translate-y-0.5 hover:border-[#2EE6A6]/50 hover:shadow-[0_16px_40px_-24px_rgba(46,230,166,0.55)]"
              >
                <div className="mb-4 flex items-center gap-3">
                  <span
                    className="grid size-11 place-items-center rounded-2xl text-sm font-bold text-white"
                    style={{ backgroundColor: item.color }}
                  >
                    {item.name.slice(0, 2).toUpperCase()}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-[#0B1B33]">{item.name}</h3>
                    <p className="text-xs font-medium text-[#8A9BB5]">{item.status}</p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-[#4B5C76]">{item.blurb}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section id="use-cases" className="border-y border-[#E8EEF7] bg-[#F7FAFF] py-20">
        <div className="mx-auto grid max-w-6xl gap-5 px-5 lg:grid-cols-3">
          {USE_CASES.map((item) => (
            <article key={item.title} className="overflow-hidden rounded-3xl bg-white shadow-[0_12px_40px_-20px_rgba(15,40,80,0.25)]">
              <div className={cn("h-2 bg-gradient-to-r", item.accent)} />
              <div className="p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8A9BB5]">
                  {item.label}
                </p>
                <h3 className="mt-3 text-2xl font-bold tracking-tight text-[#0B1B33]">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#4B5C76]">{item.body}</p>
                <a href="#get-started" className="mt-5 inline-flex text-sm font-semibold text-[#12C48A]">
                  Explore →
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Lead form */}
      <section id="get-started" className="py-20">
        <div className="mx-auto max-w-3xl px-5">
          <div className="rounded-[2rem] border border-[#E8EEF7] bg-gradient-to-br from-white via-[#F7FAFF] to-[#E8FFF6] p-8 shadow-[0_20px_60px_-30px_rgba(15,40,80,0.35)] sm:p-10">
            <h2 className="text-center text-3xl font-bold tracking-tight text-[#0B1B33]">
              Talk through your stack with us
            </h2>
            <p className="mt-2 text-center text-[#4B5C76]">
              Book a demo, request early access, or become a design partner
            </p>
            <div className="mt-4 flex justify-center">
              <ContactLinks />
            </div>

            {submitted ? (
              <div className="mt-10 rounded-2xl border border-[#2EE6A6]/40 bg-[#E8FFF6] p-8 text-center">
                <p className="text-xl font-semibold text-[#0B1B33]">Thank you for your request!</p>
                <p className="mt-2 text-sm text-[#4B5C76]">
                  Your email client should open so you can send the message to {CONTACT_EMAIL}.
                </p>
              </div>
            ) : (
              <form
                className="mt-8 grid gap-4 sm:grid-cols-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const inputs = Array.from(form.querySelectorAll("input, select")) as (
                    | HTMLInputElement
                    | HTMLSelectElement
                  )[];
                  const values = Object.fromEntries(
                    inputs.map((el, i) => [el.name || `field_${i}`, el.value]),
                  );
                  const body = [
                    `Name: ${values.first ?? values.field_0 ?? ""} ${values.last ?? values.field_1 ?? ""}`,
                    `Company: ${values.company ?? values.field_2 ?? ""}`,
                    `Email: ${values.email ?? values.field_3 ?? ""}`,
                    `Phone: ${values.phone ?? values.field_4 ?? ""}`,
                    `Country: ${values.country ?? values.field_5 ?? ""}`,
                    `Agents: ${values.agents ?? ""}`,
                  ].join("\n");
                  window.location.href = buildContactMailto({
                    subject: "Artemis AI — Integrations inquiry",
                    body,
                  });
                  setSubmitted(true);
                }}
              >
                {[
                  ["First name", "text", "first"],
                  ["Last name", "text", "last"],
                  ["Company name", "text", "company"],
                  ["Business email", "email", "email"],
                  ["Phone number", "tel", "phone"],
                  ["Country", "text", "country"],
                ].map(([label, type, name]) => (
                  <label key={name} className="block text-sm">
                    <span className="mb-1.5 block font-medium text-[#4B5C76]">{label}</span>
                    <input
                      required
                      name={name}
                      type={type}
                      className="w-full rounded-xl border border-[#D7E0EF] bg-white px-3.5 py-2.5 text-[#0B1B33] outline-none ring-[#2EE6A6]/40 focus:ring-2"
                    />
                  </label>
                ))}
                <label className="block text-sm sm:col-span-2">
                  <span className="mb-1.5 block font-medium text-[#4B5C76]">Number of agents</span>
                  <select
                    required
                    name="agents"
                    className="w-full rounded-xl border border-[#D7E0EF] bg-white px-3.5 py-2.5 text-[#0B1B33] outline-none ring-[#2EE6A6]/40 focus:ring-2"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select…
                    </option>
                    {["1-4", "5-9", "10-24", "25-49", "50-99", "100+"].map((n) => (
                      <option key={n}>{n}</option>
                    ))}
                  </select>
                </label>
                <label className="flex items-start gap-2 text-sm text-[#4B5C76] sm:col-span-2">
                  <input type="checkbox" className="mt-1 accent-[#12C48A]" />
                  I agree to receive marketing communications from Artemis AI
                </label>
                <button
                  type="submit"
                  className="sm:col-span-2 inline-flex items-center justify-center rounded-full bg-[#2EE6A6] px-5 py-3 text-sm font-semibold text-[#0B1B33] shadow-lg shadow-[#2EE6A6]/35 transition hover:bg-[#5cf0bc]"
                >
                  Get Started
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-[#E8EEF7] bg-[#F7FAFF] py-20">
        <div className="mx-auto max-w-3xl px-5">
          <h2 className="text-center text-3xl font-bold tracking-tight text-[#0B1B33]">FAQ</h2>
          <div className="mt-10 space-y-3">
            {FAQS.map((item, i) => {
              const open = openFaq === i;
              return (
                <div key={item.q} className="overflow-hidden rounded-2xl border border-[#E8EEF7] bg-white">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-[#0B1B33]"
                    onClick={() => setOpenFaq(open ? null : i)}
                  >
                    {item.q}
                    <span className="text-[#12C48A]">{open ? "−" : "+"}</span>
                  </button>
                  {open ? (
                    <p className="border-t border-[#E8EEF7] px-5 py-4 text-sm leading-relaxed text-[#4B5C76]">
                      {item.a}
                    </p>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="border-t border-[#E8EEF7] bg-white py-12">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 sm:flex-row sm:justify-between">
          <div>
            <ArtemisMark />
            <p className="mt-3 max-w-xs text-sm text-[#8A9BB5]">
              AI contact center software with speech analytics, predictive dialing, and CRM integrations.
            </p>
            <ContactLinks className="mt-4" />
          </div>
          <div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-3">
            {[
              ["Products", ["Omnichannel", "Flow Builder", "Speech Analytics", "Predictive Dialer"]],
              ["Resources", ["Integrations", "Documentation", "Developers", "Blog"]],
              ["Company", ["About", "Careers", "Contact Sales", "Privacy"]],
            ].map(([title, links]) => (
              <div key={title as string}>
                <p className="font-semibold text-[#0B1B33]">{title as string}</p>
                <ul className="mt-3 space-y-2 text-[#8A9BB5]">
                  {(links as string[]).map((l) => (
                    <li key={l}>
                      <a
                        href={l === "Contact Sales" ? CONTACT_MAILTO : "#integrations"}
                        className="hover:text-[#12C48A]"
                      >
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

function HeroArt() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-md lg:max-w-none">
      <div className="absolute inset-8 rounded-full bg-gradient-to-br from-[#2EE6A6]/30 via-[#18C4FF]/25 to-[#A855F7]/20 blur-2xl" />
      <div className="relative grid h-full place-items-center">
        <div className="relative size-[78%] rounded-[2rem] border border-white bg-white/80 p-6 shadow-[0_30px_80px_-30px_rgba(15,40,80,0.45)] backdrop-blur">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-[#0B1B33]">Connected apps</p>
            <span className="rounded-full bg-[#E8FFF6] px-2.5 py-1 text-xs font-semibold text-[#12C48A]">
              Live
            </span>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {[
              ["HS", "#FF7A59", "HubSpot"],
              ["SF", "#00A1E0", "Salesforce"],
              ["ZD", "#03363D", "Zendesk"],
              ["PD", "#017737", "Pipedrive"],
            ].map(([abbr, color, name]) => (
              <div
                key={name}
                className="flex items-center gap-3 rounded-2xl border border-[#E8EEF7] bg-[#F7FAFF] p-3"
              >
                <span
                  className="grid size-9 place-items-center rounded-xl text-xs font-bold text-white"
                  style={{ backgroundColor: color }}
                >
                  {abbr}
                </span>
                <div>
                  <p className="text-sm font-semibold text-[#0B1B33]">{name}</p>
                  <p className="text-[11px] text-[#12C48A]">Synced</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-2xl bg-gradient-to-r from-[#2EE6A6] to-[#18C4FF] p-4 text-[#0B1B33]">
            <p className="text-xs font-semibold uppercase tracking-wide opacity-80">Today</p>
            <p className="mt-1 text-2xl font-bold">Calls synced today</p>
            <p className="text-sm opacity-80">across CRM + helpdesk automatically</p>
          </div>
        </div>
      </div>
    </div>
  );
}
