import { FileLock2, Fingerprint, Globe2, KeyRound, ScrollText, ServerCog } from "lucide-react";
import { Panel } from "@/components/iris/primitives";
import { Reveal, Section } from "@/components/landing/marketing-bits";

const testimonials = [
  {
    q: "Our close rate moved from 19% to 27% in one quarter. Iris found that reps were pitching before discovery on almost every call — something four managers had missed for two years.",
    n: "Elena Kovač",
    r: "Sales Director",
    c: "Meridian FX",
    stat: "+8 pts close rate",
  },
  {
    q: "We are a regulated broker. Missed risk disclosures used to be found in audits. Now they are found in ninety seconds, and they stopped happening within a month.",
    n: "Daniel Reisner",
    r: "Managing Director",
    c: "Vault Trading (Forex)",
    stat: "97% fewer disclosure misses",
  },
  {
    q: "Onboarding used to take a full quarter. New advisors now hit quota in six weeks because they get corrected on call two, not week five.",
    n: "Amira Saleh",
    r: "COO",
    c: "Aurora Insurance",
    stat: "Ramp 90 → 38 days",
  },
  {
    q: "I stopped listening to recordings entirely. I read five ranked insights every morning and know exactly which agent needs me and why.",
    n: "James Whitmore",
    r: "Head of Sales",
    c: "Northgate Realty",
    stat: "14 hrs/week returned",
  },
  {
    q: "Our top biller's objection language is now taught to the whole floor automatically. That alone changed our placement rate.",
    n: "Priya Raman",
    r: "Founder",
    c: "Kestrel Recruitment",
    stat: "+21% placements",
  },
];

export function Testimonials() {
  return (
    <Section
      eyebrow="Customer proof"
      title="Trusted on the loudest sales floors in Europe"
      lede="Forex brokers, insurers, agencies and call centres running Iris across regulated, high-volume outbound."
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t, i) => (
          <Reveal
            key={t.n}
            delay={(i % 3) * 0.07}
            className={i === 0 ? "lg:col-span-2" : undefined}
          >
            <Panel className="flex h-full flex-col p-6">
              <span className="w-fit rounded-full bg-primary/12 px-2.5 py-1 text-[11px] font-medium text-primary">
                {t.stat}
              </span>
              <p className="mt-4 flex-1 text-[0.95rem] leading-relaxed text-foreground/90">
                "{t.q}"
              </p>
              <div className="mt-6 flex items-center gap-3 border-t border-border pt-4">
                <span className="grid size-9 place-items-center rounded-full gradient-surface text-[11px] font-semibold text-background">
                  {t.n
                    .split(" ")
                    .map((x) => x[0])
                    .join("")}
                </span>
                <div className="leading-tight">
                  <p className="text-xs font-medium">{t.n}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {t.r} · {t.c}
                  </p>
                </div>
              </div>
            </Panel>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

const security = [
  { icon: FileLock2, t: "Encrypted recordings", d: "AES-256 at rest, TLS 1.3 in transit, per-tenant key isolation." },
  { icon: KeyRound, t: "Role-based permissions", d: "Rep, manager, executive and compliance roles with scoped call access." },
  { icon: ScrollText, t: "Audit logs", d: "Every playback, export and score override recorded and exportable." },
  { icon: Globe2, t: "GDPR-ready architecture", d: "EU data residency, consent capture, retention windows and right-to-erasure." },
  { icon: ServerCog, t: "Secure cloud infrastructure", d: "Isolated tenancy, continuous monitoring, annual penetration testing." },
  { icon: Fingerprint, t: "Enterprise access control", d: "SSO, SCIM provisioning and IP allow-listing on Enterprise plans." },
];

export function Security() {
  return (
    <Section
      id="security"
      eyebrow="Security & compliance"
      title="Built for forex, finance and insurance"
      lede="Regulated conversations demand more than a transcription vendor. Iris is designed for the audit that follows the call."
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {security.map((s, i) => (
          <Reveal key={s.t} delay={(i % 3) * 0.06}>
            <Panel className="h-full p-6">
              <s.icon className="size-4 text-cyan" />
              <h3 className="mt-4 text-sm font-semibold">{s.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
            </Panel>
          </Reveal>
        ))}
      </div>
      <p className="mt-6 text-xs text-muted-foreground">
        This page is maintained by Iris to answer common security questions. It describes product
        capabilities and is not an independent certification or audit report.
      </p>
    </Section>
  );
}

const integrations = [
  ["Salesforce", "CRM"],
  ["HubSpot", "CRM"],
  ["Microsoft Dynamics", "CRM"],
  ["Zoho", "CRM"],
  ["Pipedrive", "CRM"],
  ["Slack", "Collaboration"],
  ["Microsoft Teams", "Collaboration"],
  ["Zoom", "Meetings"],
  ["Google Meet", "Meetings"],
  ["Aircall", "Telephony"],
  ["Genesys", "Contact centre"],
  ["RingCentral", "Telephony"],
  ["Twilio", "Telephony"],
];

export function Integrations() {
  return (
    <Section
      id="integrations"
      eyebrow="Integrations"
      title="Plugs into the stack your floor already runs on"
      lede="Calls in, coaching out. No rip-and-replace, no new dialer, no change to how reps work."
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {integrations.map(([name, cat], i) => (
          <Reveal key={name} delay={(i % 4) * 0.04}>
            <Panel className="group flex h-full items-center gap-3 p-4 transition-colors hover:border-primary/40">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-border bg-secondary/40 font-mono text-sm font-semibold text-foreground/80 transition-colors group-hover:text-primary">
                {name.replace("Microsoft ", "").slice(0, 2).toUpperCase()}
              </span>
              <div className="min-w-0 leading-tight">
                <p className="truncate text-sm font-medium">{name}</p>
                <p className="text-[11px] text-muted-foreground">{cat}</p>
              </div>
            </Panel>
          </Reveal>
        ))}
        <Reveal delay={0.1}>
          <Panel className="gradient-border flex h-full items-center justify-center p-4 text-center text-xs text-muted-foreground">
            Custom SIP & REST API
          </Panel>
        </Reveal>
      </div>
    </Section>
  );
}
