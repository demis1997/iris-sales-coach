import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowLeft,
  Briefcase,
  Building2,
  Headphones,
  LayoutDashboard,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  Users,
} from "lucide-react";
import { ArtemisEyeIcon } from "@/components/relay/brand";
import { CONTACT_MAILTO } from "@/components/relay/contact";
import { chartTooltip } from "@/components/iris/chart-bits";
import { Chip, Panel, PanelHeader, StatCard } from "@/components/iris/primitives";
import {
  DEMO_BROKER,
  agentCalls,
  agentDna,
  ceoKpis,
  coachingTasks,
  deskComparison,
  liveCoachLines,
  managerQueue,
  pickRandomTip,
  revenueByDay,
  type DemoRole,
} from "@/lib/forex-demo-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/demo")({
  head: () => ({
    meta: [
      { title: "Forex Broker Demo — Artemis AI" },
      {
        name: "description",
        content:
          "Interactive demo of Artemis AI for forex brokers — CEO command center, manager coaching queue, and agent workspace with live AI tips.",
      },
      { property: "og:title", content: "Forex Broker Demo — Artemis AI" },
      {
        property: "og:description",
        content: "See how CEOs, managers and agents use Artemis on a forex acquisition floor.",
      },
    ],
  }),
  component: ForexDemoPage,
});

const roles: { id: DemoRole; label: string; icon: typeof LayoutDashboard; blurb: string }[] = [
  {
    id: "ceo",
    label: "CEO view",
    icon: LayoutDashboard,
    blurb: "Deposits, FTDs, desk quality, compliance risk",
  },
  {
    id: "manager",
    label: "Manager view",
    icon: Users,
    blurb: "Review queue, coaching tasks, compliance gates",
  },
  {
    id: "agent",
    label: "Agent view",
    icon: Headphones,
    blurb: "Own calls, Rep DNA, live AI coaching tips",
  },
];

function ForexDemoPage() {
  const [role, setRole] = useState<DemoRole>("ceo");
  const [tip, setTip] = useState(() => pickRandomTip("ceo"));

  useEffect(() => {
    setTip(pickRandomTip(role));
  }, [role]);

  useEffect(() => {
    const t = setInterval(() => {
      setTip((prev) => pickRandomTip(role, prev.title));
    }, 7000);
    return () => clearInterval(t);
  }, [role]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(46,230,166,0.08),_transparent_50%),radial-gradient(ellipse_at_bottom_right,_rgba(56,120,255,0.06),_transparent_45%)]" />

      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="size-4" />
              <span className="grid size-7 place-items-center rounded-lg bg-gradient-to-br from-[#2EE6A6] to-[#18C4FF]">
                <ArtemisEyeIcon className="text-white" />
              </span>
              <span className="hidden font-semibold text-foreground sm:inline">Artemis AI</span>
            </Link>
            <div className="hidden h-5 w-px bg-border sm:block" />
            <div>
              <p className="text-sm font-semibold">Interactive forex demo</p>
              <p className="text-[11px] text-muted-foreground">
                Simulated · {DEMO_BROKER.name} · {DEMO_BROKER.regulation}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Chip tone="iris">Demo data</Chip>
            <a
              href={CONTACT_MAILTO}
              className="rounded-xl gradient-surface px-3 py-1.5 text-xs font-semibold text-background"
            >
              Book a live walkthrough
            </a>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-6 max-w-2xl">
          <p className="text-xs font-medium tracking-wider text-primary uppercase">For forex & CFD brokers</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            Switch roles — see what each person gets from Artemis
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Same product, three lenses: executive command, floor coaching, and the agent on the dialer.
            AI tips refresh automatically with forex-specific guidance.
          </p>
        </div>

        <div className="mb-6 grid gap-2 sm:grid-cols-3">
          {roles.map((r) => {
            const Icon = r.icon;
            const active = role === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setRole(r.id)}
                className={cn(
                  "rounded-2xl border px-4 py-3 text-left transition-colors",
                  active
                    ? "border-primary/50 bg-primary/10"
                    : "border-border bg-secondary/20 hover:bg-secondary/40",
                )}
              >
                <div className="flex items-center gap-2">
                  <Icon className={cn("size-4", active ? "text-primary" : "text-muted-foreground")} />
                  <span className="text-sm font-semibold">{r.label}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{r.blurb}</p>
              </button>
            );
          })}
        </div>

        <AiTipBanner
          tip={tip}
          onShuffle={() => setTip(pickRandomTip(role, tip.title))}
          role={role}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={role}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="mt-6"
          >
            {role === "ceo" ? <CeoDemoView /> : null}
            {role === "manager" ? <ManagerDemoView /> : null}
            {role === "agent" ? <AgentDemoView /> : null}
          </motion.div>
        </AnimatePresence>

        <p className="mt-10 text-center text-xs text-muted-foreground">
          Demo only — figures are illustrative for {DEMO_BROKER.name}.{" "}
          <Link to="/auth" className="text-primary hover:underline">
            Start a real workspace
          </Link>{" "}
          or{" "}
          <a href={CONTACT_MAILTO} className="text-primary hover:underline">
            contact us
          </a>
          .
        </p>
      </main>
    </div>
  );
}

function AiTipBanner({
  tip,
  onShuffle,
  role,
}: {
  tip: ReturnType<typeof pickRandomTip>;
  onShuffle: () => void;
  role: DemoRole;
}) {
  return (
    <Panel className="overflow-hidden border-primary/20 bg-primary/5 p-0">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border/60 px-5 py-3">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-primary" />
          <span className="text-sm font-semibold">Artemis AI tip</span>
          <Chip tone="iris">{role === "ceo" ? "Executive" : role === "manager" ? "Floor" : "Rep"}</Chip>
        </div>
        <button
          type="button"
          onClick={onShuffle}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1 text-xs text-muted-foreground hover:bg-secondary hover:text-foreground"
        >
          <RefreshCw className="size-3" />
          New tip
        </button>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={tip.title}
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -8 }}
          transition={{ duration: 0.2 }}
          className="px-5 py-4"
        >
          <p className="text-sm font-medium">{tip.title}</p>
          <p className="mt-1.5 text-sm text-muted-foreground">{tip.body}</p>
          <p className="mt-2 text-xs font-medium text-primary">{tip.impact}</p>
        </motion.div>
      </AnimatePresence>
    </Panel>
  );
}

function CeoDemoView() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <Building2 className="size-3.5" />
        {DEMO_BROKER.name} · Revenue Command Center · {DEMO_BROKER.period}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ceoKpis.map((k) => (
          <StatCard key={k.label} label={k.label} value={k.value} delta={k.delta} hint={k.hint} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel>
          <PanelHeader title="Deposits & FTDs" subtitle="EU + MENA acquisition desks" />
          <div className="h-56 p-3">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueByDay}>
                <defs>
                  <linearGradient id="depFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip {...chartTooltip} />
                <Area
                  type="monotone"
                  dataKey="deposits"
                  name="Deposits $k"
                  stroke="hsl(var(--primary))"
                  fill="url(#depFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="Desk comparison" subtitle="FTDs · quality · compliance" />
          <div className="h-56 p-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deskComparison}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="desk" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip {...chartTooltip} />
                <Bar dataKey="ftd" name="FTDs" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="quality" name="AI quality" fill="hsl(210 80% 55%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <Panel>
        <PanelHeader title="Where to intervene" subtitle="AI-ranked desk risks this week" />
        <div className="divide-y divide-border">
          {deskComparison.map((d) => (
            <div key={d.desk} className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 text-sm">
              <div>
                <p className="font-medium">{d.desk}</p>
                <p className="text-xs text-muted-foreground">
                  {d.agents} agents · {d.ftd} FTDs · compliance {d.compliance}%
                </p>
              </div>
              <Chip tone={d.compliance < 92 ? "warn" : d.quality < 75 ? "warn" : "good"}>
                {d.compliance < 92 ? "Compliance watch" : d.quality < 75 ? "Coaching needed" : "Healthy"}
              </Chip>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function ManagerDemoView() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <Briefcase className="size-3.5" />
        Floor Manager · {DEMO_BROKER.desk} · Review queue
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Panel>
          <PanelHeader
            title="Calls needing review"
            subtitle="Flagged by AI for coaching or compliance"
            action={<Chip tone="warn">{managerQueue.length} open</Chip>}
          />
          <div className="divide-y divide-border">
            {managerQueue.map((q) => (
              <div key={q.id} className="px-5 py-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium">
                      {q.agent} → {q.prospect}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">{q.issue}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Chip
                      tone={
                        q.severity === "critical"
                          ? "bad"
                          : q.severity === "high"
                            ? "warn"
                            : q.severity === "medium"
                              ? "iris"
                              : "good"
                      }
                    >
                      {q.severity}
                    </Chip>
                    <span className="font-mono text-sm">{q.score}</span>
                  </div>
                </div>
                <p className="mt-2 text-[11px] text-muted-foreground">{q.ago} ago</p>
              </div>
            ))}
          </div>
        </Panel>

        <div className="space-y-4">
          <Panel>
            <PanelHeader title="Coaching tasks" subtitle="Assigned from AI + manager" />
            <div className="divide-y divide-border">
              {coachingTasks.map((t) => (
                <div key={t.task} className="px-5 py-3">
                  <p className="text-sm font-medium">{t.agent}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{t.task}</p>
                  <p className="mt-1 text-[11px] text-primary">Due {t.due}</p>
                </div>
              ))}
            </div>
          </Panel>

          <Panel className="border-destructive/30 bg-destructive/5 p-5">
            <div className="flex items-start gap-2">
              <ShieldAlert className="mt-0.5 size-4 text-destructive" />
              <div>
                <p className="text-sm font-semibold">Dialer gate ready</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Nikos P. — CFD outbound locked until promotions compliance micro-cert is passed (≈8 min).
                </p>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

function AgentDemoView() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <Headphones className="size-3.5" />
        Agent workspace · Mira K. · {DEMO_BROKER.desk}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label="My AI score (7d)" value="81" delta={4} hint="above desk avg 76" />
        <StatCard label="FTDs this week" value="6" delta={20} hint="target 8" />
        <StatCard label="Compliance" value="94%" delta={2} hint="clean disclosures" />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        <Panel>
          <PanelHeader title="My recent calls" subtitle="Scored with forex playbook" />
          <div className="divide-y divide-border">
            {agentCalls.map((c) => (
              <div key={c.id} className="px-5 py-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium">
                      <span className="font-mono text-xs text-muted-foreground">{c.time}</span>{" "}
                      {c.prospect}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {c.product} · {c.outcome}
                    </p>
                  </div>
                  <Chip tone={c.score >= 85 ? "good" : c.score >= 70 ? "iris" : "warn"}>{c.score}</Chip>
                </div>
                <p className="mt-1.5 text-xs text-primary">{c.tip}</p>
              </div>
            ))}
          </div>
        </Panel>

        <div className="space-y-4">
          <Panel>
            <PanelHeader title="Rep DNA™" subtitle="This week" />
            <div className="space-y-3 p-5">
              {agentDna.map((s) => (
                <div key={s.skill}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span>{s.skill}</span>
                    <span className="font-mono">{s.score}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full gradient-surface"
                      style={{ width: `${s.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel>
            <PanelHeader title="Live call assist" subtitle="Spread objection moment" />
            <div className="space-y-2.5 p-4">
              {liveCoachLines.map((l, i) => (
                <div
                  key={i}
                  className={cn(
                    "rounded-xl px-3 py-2 text-xs",
                    l.who === "ai"
                      ? "border border-primary/30 bg-primary/10 text-foreground"
                      : l.who === "agent"
                        ? "bg-secondary/50"
                        : "border border-border text-muted-foreground",
                  )}
                >
                  <span className="font-mono text-[10px] text-muted-foreground">{l.at}</span>
                  <span className="ml-2 font-medium uppercase tracking-wide text-[10px] text-muted-foreground">
                    {l.who === "ai" ? "Artemis" : l.who}
                  </span>
                  <p className="mt-1">{l.text}</p>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
