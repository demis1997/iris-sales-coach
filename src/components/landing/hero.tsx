import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowRight, PhoneCall, Play, Sparkles, Trophy } from "lucide-react";
import { Panel } from "@/components/artemis/primitives";
import { Reveal, fadeUp } from "@/components/landing/marketing-bits";

const bars = [18, 34, 52, 28, 66, 82, 47, 71, 90, 62, 38, 74, 55, 86, 41, 68, 33, 79, 49, 60];

function HeroVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 34, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.85, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      <div className="pointer-events-none absolute -inset-x-10 -top-10 -bottom-16 -z-10 opacity-70 blur-3xl [background:radial-gradient(50%_40%_at_50%_40%,oklch(0.66_0.2_293/0.25),transparent_70%)]" />
      <Panel className="overflow-hidden p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2.5">
            <span className="grid size-7 place-items-center rounded-lg bg-primary/15">
              <PhoneCall className="size-3.5 text-primary" />
            </span>
            <div className="leading-tight">
              <p className="text-xs font-medium">Marcus Feldman · Feldman Capital</p>
              <p className="text-[11px] text-muted-foreground">Outbound · 14:22 · Forex desk</p>
            </div>
          </div>
          <span className="flex items-center gap-1.5 rounded-full bg-success/15 px-2 py-1 text-[11px] font-medium text-success">
            <span className="size-1.5 animate-pulse rounded-full bg-success" /> Live analysis
          </span>
        </div>

        <div className="grid gap-4 p-4 md:grid-cols-[1.4fr_1fr]">
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-secondary/30 p-3">
              <div className="flex items-end gap-[3px]">
                {bars.map((h, i) => (
                  <motion.span
                    key={i}
                    initial={{ height: 4 }}
                    animate={{ height: h }}
                    transition={{ delay: 0.45 + i * 0.03, duration: 0.5 }}
                    className="w-full rounded-full gradient-surface"
                    style={{ opacity: 0.35 + h / 160 }}
                  />
                ))}
              </div>
              <div className="mt-3 flex justify-between text-[10px] text-muted-foreground">
                {["Greeting", "Discovery", "Pitch", "Objections", "Close"].map((s) => (
                  <span key={s}>{s}</span>
                ))}
              </div>
              <div className="mt-2 flex h-1.5 overflow-hidden rounded-full">
                {[
                  ["18%", "var(--violet)"],
                  ["26%", "var(--blue)"],
                  ["22%", "var(--cyan)"],
                  ["18%", "var(--warning)"],
                  ["16%", "var(--success)"],
                ].map(([w, c]) => (
                  <span key={c} style={{ width: w, background: c }} />
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-secondary/30 p-3">
                <p className="text-[10px] tracking-wide text-muted-foreground uppercase">
                  Objection detected
                </p>
                <p className="mt-1.5 text-xs">"Your spreads are higher than my current broker."</p>
                <p className="mt-1 text-[11px] text-warning">Handled partially · 06:12</p>
              </div>
              <div className="rounded-xl border border-border bg-secondary/30 p-3">
                <p className="text-[10px] tracking-wide text-muted-foreground uppercase">
                  Confidence score
                </p>
                <p className="mt-1 font-mono text-2xl font-semibold">74%</p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "74%" }}
                    transition={{ delay: 0.9, duration: 0.9 }}
                    className="h-full gradient-surface"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-secondary/30 p-3">
              <div className="flex items-center gap-2">
                <Trophy className="size-3.5 text-cyan" />
                <p className="text-[10px] tracking-wide text-muted-foreground uppercase">
                  Team leaderboard · this week
                </p>
              </div>
              <div className="mt-2.5 space-y-1.5">
                {[
                  ["Alex Moreau", 91, "34%"],
                  ["Nadia Petrova", 89, "30%"],
                  ["Priya Nair", 88, "31%"],
                ].map(([n, s, c], i) => (
                  <div key={n as string} className="flex items-center gap-2.5 text-[11px]">
                    <span className="w-3 font-mono text-muted-foreground">{i + 1}</span>
                    <span className="flex-1 truncate">{n}</span>
                    <div className="hidden h-1 w-24 overflow-hidden rounded-full bg-secondary sm:block">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${s as number}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.1 * i }}
                        className="h-full gradient-surface"
                      />
                    </div>
                    <span className="font-mono text-muted-foreground">{c}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="rounded-xl border border-border bg-secondary/30 p-4 text-center">
              <p className="text-[11px] tracking-wide text-muted-foreground uppercase">
                AI call score
              </p>
              <p className="mt-1 font-mono text-4xl font-semibold gradient-text">92</p>
              <p className="text-[11px] text-muted-foreground">Top 6% this week</p>
            </div>
            <div className="rounded-xl border border-border bg-secondary/30 p-4">
              <p className="text-[11px] tracking-wide text-muted-foreground uppercase">
                Closing probability
              </p>
              <p className="mt-1 font-mono text-2xl font-semibold">78%</p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "78%" }}
                  transition={{ delay: 0.8, duration: 0.9 }}
                  className="h-full gradient-surface"
                />
              </div>
            </div>
            {[
              ["Talk ratio", "54%"],
              ["Interruptions", "1"],
              ["Filler words", "7"],
              ["Dead air", "0:11"],
              ["Compliance", "Pass"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between text-xs">
                <span className="text-muted-foreground">{k}</span>
                <span className="font-mono">{v}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-start gap-3 border-t border-border bg-primary/5 px-4 py-3">
          <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" />
          <p className="text-xs text-muted-foreground">
            <span className="text-foreground">Coaching recommendation:</span> you quoted pricing
            before quantifying monthly volume. Ask two budget questions before the number —{" "}
            <span className="text-success">projected +17% close rate.</span>
          </p>
        </div>
      </Panel>
    </motion.div>
  );
}

export function Hero() {
  return (
    <section className="aurora relative overflow-hidden">
      <div className="grid-lines absolute inset-0 opacity-40 [mask-image:radial-gradient(60%_50%_at_50%_0%,#000,transparent)]" />
      <div className="relative mx-auto w-full max-w-6xl px-5 pt-20 pb-16 md:pt-28">
        <motion.div {...fadeUp} className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/40 px-3 py-1 text-xs text-muted-foreground">
            <span className="size-1.5 rounded-full bg-cyan" />
            The revenue acceleration platform for high-volume sales floors
          </span>
          <h1 className="mt-6 text-4xl leading-[1.04] font-semibold tracking-tight text-balance md:text-[4rem]">
            Every sales call makes{" "}
            <span className="gradient-text">your team better.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Artemis automatically analyzes every sales call, identifies what prevented a deal from
            closing, coaches every salesperson individually, and gives managers complete visibility
            into team performance — without listening to hours of recordings.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <a
              href="#demo-form"
              className="inline-flex items-center gap-2 rounded-xl gradient-surface px-5 py-3 text-sm font-semibold text-background shadow-[0_10px_40px_-12px_oklch(0.66_0.2_293/0.7)] transition-transform hover:-translate-y-0.5"
            >
              Book a demo <ArrowRight className="size-4" />
            </a>
            <a
              href="#interactive"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-secondary/40 px-5 py-3 text-sm font-medium transition-colors hover:bg-secondary"
            >
              <Play className="size-3.5" /> Watch 2-minute demo
            </a>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Deployed in days · Works with your existing dialer · No recordings leave your region
          </p>
        </motion.div>

        <div className="mx-auto mt-14 max-w-5xl">
          <HeroVisual />
        </div>

        <Reveal className="mx-auto mt-14 max-w-4xl">
          <p className="text-center text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
            Built for regulated, high-volume sales organizations
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 opacity-60">
            {["MERIDIAN FX", "NORTHGATE", "AURORA", "VAULT TRADING", "KESTREL", "HARBOR WEALTH"].map(
              (b) => (
                <span
                  key={b}
                  className="text-xs font-medium tracking-[0.22em] text-muted-foreground"
                >
                  {b}
                </span>
              ),
            )}
          </div>
        </Reveal>

        <Reveal delay={0.1} className="mx-auto mt-8 flex max-w-4xl justify-center">
          <Link
            to="/ceo"
            className="text-xs text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
          >
            Explore the live product tour →
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
