import { useMemo, useState } from "react";
import { ArrowRight, Calculator } from "lucide-react";
import { Panel } from "@/components/artemis/primitives";
import { Reveal, Section } from "@/components/landing/marketing-bits";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(Math.round(n));

function Field({
  label,
  value,
  min,
  max,
  step,
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix?: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label className="text-xs text-muted-foreground">{label}</label>
        <span className="font-mono text-sm font-semibold">
          {value}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-secondary accent-primary"
      />
    </div>
  );
}

export function RoiCalculator() {
  const [reps, setReps] = useState(40);
  const [deals, setDeals] = useState(12);
  const [revenue, setRevenue] = useState(4200);
  const [closeRate, setCloseRate] = useState(22);
  const [lift, setLift] = useState(3);

  const { current, improved, delta } = useMemo(() => {
    const currentAnnual = reps * deals * revenue * 12;
    const factor = (closeRate + lift) / closeRate;
    const improvedAnnual = currentAnnual * factor;
    return {
      current: currentAnnual,
      improved: improvedAnnual,
      delta: improvedAnnual - currentAnnual,
    };
  }, [reps, deals, revenue, closeRate, lift]);

  return (
    <section id="roi" className="relative overflow-hidden border-y border-border">
      <div className="aurora absolute inset-0 opacity-60" />
      <div className="relative mx-auto w-full max-w-6xl px-5 py-20 md:py-28">
        <Reveal className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/40 px-3 py-1 text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
            <Calculator className="size-3" /> ROI calculator
          </span>
          <h2 className="mt-5 text-3xl leading-[1.1] font-semibold tracking-tight text-balance md:text-[2.75rem]">
            What does a{" "}
            <span className="gradient-text">three-point close rate lift</span> pay you?
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Move the inputs to your own floor. Most teams find the answer larger than their entire
            sales technology budget.
          </p>
        </Reveal>

        <Reveal delay={0.08} className="mt-12">
          <Panel className="grid gap-8 p-6 md:grid-cols-[1fr_1fr] md:p-9">
            <div className="space-y-7">
              <Field label="Number of salespeople" value={reps} min={5} max={400} step={5} onChange={setReps} />
              <Field label="Average deals closed per rep, per month" value={deals} min={1} max={60} step={1} onChange={setDeals} />
              <Field label="Average revenue per deal" value={revenue} min={200} max={25000} step={100} suffix=" €" onChange={setRevenue} />
              <Field label="Current close rate" value={closeRate} min={5} max={60} step={1} suffix="%" onChange={setCloseRate} />
              <Field label="Close rate improvement with Artemis" value={lift} min={1} max={10} step={1} suffix=" pts" onChange={setLift} />
            </div>

            <div className="flex flex-col justify-between gap-5 rounded-2xl border border-border bg-secondary/25 p-6">
              <div>
                <p className="text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
                  Estimated additional annual revenue
                </p>
                <p className="mt-3 font-mono text-4xl leading-tight font-semibold gradient-text md:text-5xl">
                  {fmt(delta)}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  From {closeRate}% to {closeRate + lift}% close rate across {reps} reps.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Today</span>
                  <span className="font-mono">{fmt(current)}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-secondary">
                  <div className="h-full w-[62%] rounded-full bg-muted-foreground/40" />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>With Artemis</span>
                  <span className="font-mono">{fmt(improved)}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full gradient-surface transition-[width] duration-500"
                    style={{ width: `${Math.min(100, 62 * (improved / current))}%` }}
                  />
                </div>
              </div>

              <a
                href="#demo-form"
                className="inline-flex items-center justify-center gap-2 rounded-xl gradient-surface px-5 py-3 text-sm font-semibold text-background transition-transform hover:-translate-y-0.5"
              >
                Get this modelled on your data <ArrowRight className="size-4" />
              </a>
            </div>
          </Panel>
        </Reveal>
      </div>
    </section>
  );
}
