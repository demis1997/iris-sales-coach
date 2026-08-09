import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, Headphones, LayoutDashboard, Users } from "lucide-react";
import { ArtemisMark } from "@/components/iris/app-shell";
import { Chip, Panel } from "@/components/iris/primitives";
import { DEMO_COMPANY } from "@/data/demo/company";
import { CONTACT_MAILTO } from "@/components/relay/contact";

export const Route = createFileRoute("/demo/")({
  head: () => ({
    meta: [
      { title: "Experience Artemis AI — Forex Demo" },
      {
        name: "description",
        content:
          "Interactive Apex Markets demo — CEO, manager and agent views with simulated AI coaching for forex sales floors.",
      },
    ],
  }),
  component: DemoLanding,
});

const cards = [
  {
    to: "/demo/ceo" as const,
    title: "CEO",
    blurb: "See the entire revenue operation.",
    icon: LayoutDashboard,
  },
  {
    to: "/demo/manager" as const,
    title: "Manager",
    blurb: "Know exactly who needs coaching and why.",
    icon: Users,
  },
  {
    to: "/demo/agent" as const,
    title: "Sales Agent",
    blurb: "Get better after every conversation.",
    icon: Headphones,
  },
];

function DemoLanding() {
  return (
    <div className="min-h-screen bg-background">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(46,230,166,0.08),_transparent_50%)]" />
      <header className="relative mx-auto flex max-w-5xl items-center justify-between px-4 py-5 sm:px-6">
        <Link to="/">
          <ArtemisMark />
        </Link>
        <div className="flex items-center gap-2">
          <Chip tone="iris">Demo Workspace</Chip>
          <a href={CONTACT_MAILTO} className="text-xs text-primary hover:underline">
            Book walkthrough
          </a>
        </div>
      </header>

      <main className="relative mx-auto max-w-5xl px-4 pb-16 sm:px-6">
        <p className="text-xs font-medium tracking-wider text-primary uppercase">Product demo</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Experience Artemis AI</h1>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
          See how Artemis AI turns thousands of sales conversations into coaching, revenue intelligence and
          better-performing teams.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <Building2 className="size-3.5" />
          Demo company: {DEMO_COMPANY.name} · {DEMO_COMPANY.agents} sales agents · {DEMO_COMPANY.industry}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {cards.map((c) => {
            const Icon = c.icon;
            return (
              <Panel key={c.to} className="flex flex-col p-5 transition-colors hover:border-primary/40">
                <Icon className="size-5 text-primary" />
                <h2 className="mt-4 text-lg font-semibold">{c.title}</h2>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{c.blurb}</p>
                <Link
                  to={c.to}
                  className="mt-5 inline-flex rounded-xl gradient-surface px-4 py-2 text-sm font-semibold text-background"
                >
                  Enter Demo →
                </Link>
              </Panel>
            );
          })}
        </div>

        <Panel className="mt-8 p-5 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Suggested meeting story</p>
          <p className="mt-2">
            CEO overview → revenue at risk → Velocity Desk → Daniel → lost call at 08:14 → coaching → Rep DNA →
            Manager live floor → Agent coach → back to CEO coaching ROI.
          </p>
          <p className="mt-3 text-xs">All figures are example Apex Markets data. Labels say Demo / Simulated AI.</p>
        </Panel>
      </main>
    </div>
  );
}
