import { FileLock2, Fingerprint, Globe2, KeyRound, ScrollText, ServerCog } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Panel } from "@/components/iris/primitives";
import { Reveal, Section } from "@/components/landing/marketing-bits";

/** Product-focused proof — no fabricated customer testimonials. */
export function Testimonials() {
  return (
    <Section
      eyebrow="Product proof"
      title="Built around the way high-volume sales teams actually operate."
      lede="AI-native revenue intelligence for CEOs, managers, and agents — explore the interactive demo."
    >
      <div className="grid gap-4 md:grid-cols-3">
        {[
          {
            t: "CEO",
            d: "Understand what's driving revenue.",
            to: "/demo/ceo" as const,
          },
          {
            t: "Manager",
            d: "Know who needs attention and why.",
            to: "/demo/manager" as const,
          },
          {
            t: "Agent",
            d: "Get better after every conversation.",
            to: "/demo/agent" as const,
          },
        ].map((card, i) => (
          <Reveal key={card.t} delay={i * 0.07}>
            <Panel className="flex h-full flex-col p-6">
              <h3 className="text-lg font-semibold">{card.t}</h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{card.d}</p>
              <Link to={card.to} className="mt-5 text-sm font-semibold text-primary hover:underline">
                Explore the Demo →
              </Link>
            </Panel>
          </Reveal>
        ))}
      </div>
      <div className="mt-8 grid gap-3 sm:grid-cols-4">
        {[
          ["Every Call", "Understood"],
          ["Every Rep", "Coached"],
          ["Every Manager", "Informed"],
          ["Every Team", "Improving"],
        ].map(([a, b]) => (
          <Panel key={a} className="p-4 text-center">
            <p className="text-sm font-semibold">{a}</p>
            <p className="mt-1 text-xs text-muted-foreground">↓</p>
            <p className="mt-1 text-sm text-primary">{b}</p>
          </Panel>
        ))}
      </div>
    </Section>
  );
}

const security = [
  {
    icon: FileLock2,
    t: "Encryption in transit and at rest",
    d: "Designed so recordings and data can be protected with modern transport and storage encryption.",
  },
  {
    icon: KeyRound,
    t: "Role-based access controls",
    d: "Rep, manager, executive and compliance-style roles with scoped access patterns.",
  },
  {
    icon: ScrollText,
    t: "Audit-friendly logging",
    d: "Access and sensitive actions are designed to be traceable for internal review.",
  },
  {
    icon: Globe2,
    t: "GDPR-conscious workflows",
    d: "Designed to support retention, consent, and erasure workflows — not a completed certification claim.",
  },
  {
    icon: ServerCog,
    t: "Secure data isolation",
    d: "Multi-tenant design with company boundaries and membership-based access.",
  },
  {
    icon: Fingerprint,
    t: "Enterprise access controls",
    d: "SSO and advanced provisioning are planned for enterprise deployments.",
  },
];

export function Security() {
  return (
    <Section
      id="security"
      eyebrow="Security & compliance"
      title="Designed with enterprise security in mind"
      lede="Regulated conversations need careful architecture. We describe design intent — not unfinished certifications."
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
        No SOC 2, ISO 27001, or PCI badges are claimed here. This section describes product design
        direction and is not an independent audit report.
      </p>
    </Section>
  );
}

const integrations = [
  ["Salesforce", "CRM · Planned"],
  ["HubSpot", "CRM · Planned"],
  ["Microsoft Dynamics", "CRM · Planned"],
  ["Zoho", "CRM · Planned"],
  ["Pipedrive", "CRM · Planned"],
  ["Slack", "Collaboration · Planned"],
  ["Microsoft Teams", "Collaboration · Planned"],
  ["Zoom", "Meetings · Planned"],
  ["Google Meet", "Meetings · Planned"],
  ["Aircall", "Telephony · Planned"],
  ["Genesys", "Contact centre · Planned"],
  ["RingCentral", "Telephony · Planned"],
  ["Twilio", "Telephony · In progress"],
];

export function Integrations() {
  return (
    <Section
      id="integrations"
      eyebrow="Integrations"
      title="Built for the stack your floor already runs on"
      lede="Connectors are planned or in progress. Demo screens may show simulated integrations until live connectors ship."
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
            Custom SIP & REST API · Planned
          </Panel>
        </Reveal>
      </div>
    </Section>
  );
}
