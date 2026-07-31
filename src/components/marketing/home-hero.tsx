import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  ArrowRight,
  AlertTriangle,
  TrendingUp,
  Users,
  PhoneCall,
  Sparkles,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/marketing/ui";
import { track } from "@/lib/analytics";

const kpis = [
  { label: "Revenue influenced", value: "€2.4M", delta: "+12%", icon: TrendingUp },
  { label: "Pipeline at risk", value: "€384K", delta: "−8%", icon: AlertTriangle },
  { label: "Team score", value: "82/100", delta: "+4", icon: Users },
  { label: "Calls analysed", value: "12,842", delta: "+1.2K", icon: PhoneCall },
  { label: "Coaching hours saved", value: "146", delta: "+22", icon: Clock },
];

const leaders = [
  { name: "Alex Moreau", score: 91, trend: "+8" },
  { name: "Nadia Petrova", score: 89, trend: "+14" },
  { name: "Priya Nair", score: 88, trend: "+12" },
];

export function HomeHero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="aurora absolute inset-0" />
      <div className="grid-lines absolute inset-0 opacity-40 [mask-image:linear-gradient(to_bottom,#000_40%,transparent)]" />

      <div className="relative container-page py-16 md:py-20 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <Reveal>
            <p className="text-[11px] font-medium tracking-[0.16em] text-primary uppercase">
              Iris · Sales operating system
            </p>
            <h1 className="mt-4 max-w-xl text-4xl leading-[1.05] font-semibold tracking-tight text-balance md:text-5xl lg:text-[3.25rem]">
              Every sales conversation makes your entire team smarter.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
              Iris analyses every call, coaches every representative, identifies winning behaviours,
              predicts pipeline risk, and gives managers a clear view of what is driving revenue.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link
                  to="/book-demo"
                  onClick={() => track("book_demo_cta_clicked", { source: "hero" })}
                >
                  Book a demo
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a
                  href="#platform"
                  onClick={() => track("hero_demo_cta_clicked", { source: "hero_secondary" })}
                >
                  See Iris in action
                </a>
              </Button>
            </div>
            <p className="mt-6 max-w-md text-sm text-muted-foreground">
              Built for high-volume sales teams in financial services, forex, call centres, real
              estate, recruitment, and B2B sales.
            </p>
          </Reveal>

          <Reveal delay={0.12}>
            <ProductPreview />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function ProductPreview() {
  return (
    <div className="relative">
      <div
        className="overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-elevated)]"
        aria-label="Illustrative Iris product preview with demo metrics"
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="grid size-6 place-items-center rounded-md bg-primary/15">
              <Sparkles className="size-3.5 text-primary" />
            </span>
            <div>
              <p className="text-xs font-medium">Organisation overview</p>
              <p className="text-[10px] text-muted-foreground">Demo workspace · Last 30 days</p>
            </div>
          </div>
          <span className="rounded-md border border-border bg-secondary/50 px-2 py-0.5 text-[10px] text-muted-foreground">
            Illustrative demo data
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 p-3 sm:grid-cols-3 lg:grid-cols-5">
          {kpis.map((kpi, i) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * 0.05 }}
              className="rounded-lg border border-border bg-secondary/30 p-2.5"
            >
              <div className="flex items-center justify-between gap-1">
                <p className="text-[10px] text-muted-foreground">{kpi.label}</p>
                <kpi.icon className="size-3 text-muted-foreground" aria-hidden />
              </div>
              <p className="mt-1 font-mono text-sm font-semibold tabular-nums">{kpi.value}</p>
              <p className="text-[10px] text-success">{kpi.delta}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-3 border-t border-border p-3 md:grid-cols-2">
          <div className="rounded-lg border border-border bg-secondary/20 p-3">
            <p className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
              Closing trend
            </p>
            <div className="mt-3 flex h-16 items-end gap-1">
              {[42, 48, 45, 55, 52, 61, 58, 67, 64, 72, 70, 78].map((h, i) => (
                <span
                  key={i}
                  className="w-full rounded-sm bg-primary/70"
                  style={{ height: `${h}%`, opacity: 0.35 + h / 200 }}
                />
              ))}
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">
              Win rate trending up as discovery coverage improves
            </p>
          </div>

          <div className="rounded-lg border border-border bg-secondary/20 p-3">
            <p className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
              Representative leaderboard
            </p>
            <ul className="mt-2 space-y-2">
              {leaders.map((r, i) => (
                <li key={r.name} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2">
                    <span className="grid size-5 place-items-center rounded-full bg-secondary text-[10px] font-medium">
                      {i + 1}
                    </span>
                    {r.name}
                  </span>
                  <span className="font-mono tabular-nums">
                    {r.score}{" "}
                    <span className="text-success">{r.trend}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid gap-3 border-t border-border p-3 md:grid-cols-2">
          <div className="rounded-lg border border-border bg-secondary/20 p-3">
            <p className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
              Top coaching opportunity
            </p>
            <p className="mt-2 text-sm font-medium">Introduce value before pricing</p>
            <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
              41% of lost calls moved to price before discovery was complete. Highest impact on the
              Cyprus desk.
            </p>
          </div>
          <div className="rounded-lg border border-primary/25 bg-primary/5 p-3">
            <p className="flex items-center gap-1.5 text-[10px] font-medium tracking-wide text-primary uppercase">
              <Sparkles className="size-3" /> Iris insight
            </p>
            <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">
              Assign the “Value Before Price” playbook to Elena and Andreas, then review the five
              highlighted calls this week.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
