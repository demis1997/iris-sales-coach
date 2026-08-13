import { createFileRoute, Link, useRouterState } from "@tanstack/react-router";
import { Building2, Gauge, Headphones, Settings2, Users } from "lucide-react";
import { ArtemisMark, ArtemisButton } from "@/components/relay/brand";
import { DEMO_COMPANY } from "@/data/demo/company";
import { CONTACT_MAILTO } from "@/components/relay/contact";

export const Route = createFileRoute("/demo/")({
  head: () => ({
    meta: [
      { title: "Experience Artemis — Product Demo" },
      {
        name: "description",
        content:
          "Interactive Apex Markets demo — Sales Agent, Manager, CEO and Admin workspaces for the AI-native sales platform.",
      },
    ],
  }),
  component: DemoLanding,
});

const cards = [
  {
    to: "/demo/agent/live" as const,
    title: "Sales Agent",
    headline: "Call prospects with live AI coaching.",
    blurb:
      "Call directly from Artemis, receive live guidance and improve after every conversation.",
    cta: "Enter Agent Workspace",
    icon: Headphones,
    search: { mode: "midcall" as const },
  },
  {
    to: "/demo/manager" as const,
    title: "Manager",
    headline: "Run the sales floor and coach with precision.",
    blurb:
      "Live floor, coaching queues and campaign control — know exactly why your team wins or loses.",
    cta: "Enter Manager Workspace",
    icon: Users,
  },
  {
    to: "/demo/ceo" as const,
    title: "CEO",
    headline: "Revenue intelligence and AI recommendations.",
    blurb:
      "Understand conversion, teams and lost revenue — with concrete actions across the organization.",
    cta: "Enter Executive Dashboard",
    icon: Gauge,
  },
  {
    to: "/demo/admin" as const,
    title: "Admin",
    headline: "Configure the platform end to end.",
    blurb:
      "Users, phone numbers, routing, campaigns and integrations — Artemis as contact-center infrastructure.",
    cta: "Enter Admin Console",
    icon: Settings2,
  },
];

function DemoLanding() {
  const searchStr = useRouterState({ select: (s) => s.location.searchStr });
  const presenter = new URLSearchParams(searchStr).get("presenter") === "true";

  return (
    <div className="min-h-screen bg-white text-[#0B1B33]">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,_#E8FFF6_0%,_transparent_50%),radial-gradient(ellipse_at_90%_10%,_#EEF2FF_0%,_transparent_40%)]" />

      <header className="relative mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <Link to="/">
          <ArtemisMark />
        </Link>
        <div className="flex items-center gap-3">
          <span className="rounded-full border border-[#E8EEF7] bg-white px-3 py-1 text-[11px] font-medium text-[#8A9BB5]">
            Demo
          </span>
          <ArtemisButton href={CONTACT_MAILTO} variant="secondary" className="px-4 py-2 text-xs">
            Book a Demo
          </ArtemisButton>
        </div>
      </header>

      <main className="relative mx-auto max-w-6xl px-5 pb-20 pt-8 md:pt-14">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#12C48A]">
          Product Demo
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl">
          Experience Artemis From Every Level of the Sales Floor
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[#4B5C76]">
          See how Artemis transforms the experience of agents, managers, executives and
          administrators — as a complete AI-native sales platform.
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-2 text-sm text-[#8A9BB5]">
          <Building2 className="size-4" />
          Demo company: {DEMO_COMPANY.name} · {DEMO_COMPANY.agents} sales agents ·{" "}
          {DEMO_COMPANY.industry}
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {cards.map((c) => {
            const Icon = c.icon;
            return (
              <article
                key={c.to}
                className="flex flex-col rounded-[1.75rem] border border-[#E8EEF7] bg-white p-7 shadow-[0_16px_50px_-30px_rgba(15,40,80,0.35)]"
              >
                <div className="mb-5 grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-[#E8FFF6] to-[#EEF2FF] text-[#12C48A]">
                  <Icon className="size-5" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8A9BB5]">
                  {c.title}
                </p>
                <h2 className="mt-2 text-xl font-bold tracking-tight text-[#0B1B33]">{c.headline}</h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-[#4B5C76]">{c.blurb}</p>
                <Link
                  to={c.to}
                  search={"search" in c ? c.search : undefined}
                  className="mt-6 inline-flex items-center justify-center rounded-full bg-[#2EE6A6] px-5 py-2.5 text-sm font-semibold text-[#0B1B33] shadow-lg shadow-[#2EE6A6]/30 transition hover:bg-[#5cf0bc]"
                >
                  {c.cta}
                </Link>
              </article>
            );
          })}
        </div>

        {presenter ? (
          <div className="mt-10 rounded-[1.75rem] border border-[#E8EEF7] bg-[#F7FAFF] p-6 text-sm text-[#4B5C76]">
            <p className="font-semibold text-[#0B1B33]">Presenter notes</p>
            <p className="mt-2">
              Suggested story: Admin numbers → Agent live call → Manager floor → CEO executive
              brief.
            </p>
            <p className="mt-2 text-xs text-[#8A9BB5]">
              Visible only with <code className="rounded bg-white px-1">?presenter=true</code>
            </p>
          </div>
        ) : null}
      </main>
    </div>
  );
}
