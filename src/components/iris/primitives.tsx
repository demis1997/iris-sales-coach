import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";

export function Panel({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("glass rounded-2xl", className)} {...props}>
      {children}
    </div>
  );
}

export function PanelHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
      <div>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {subtitle ? (
          <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

export function StatCard({
  label,
  value,
  delta,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string;
  delta?: number;
  hint?: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  const up = (delta ?? 0) >= 0;
  return (
    <Panel className="group relative overflow-hidden p-4 transition-colors hover:border-primary/40">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {label}
        </span>
        {Icon ? <Icon className="size-4 text-muted-foreground" /> : null}
      </div>
      <div className="mt-3 flex items-end gap-2">
        <span className="font-mono text-2xl font-semibold text-foreground tabular-nums">
          {value}
        </span>
        {delta !== undefined ? (
          <span
            className={cn(
              "mb-1 inline-flex items-center gap-0.5 text-xs font-medium",
              up ? "text-success" : "text-destructive",
            )}
          >
            {up ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
            {up ? "+" : ""}
            {delta}%
          </span>
        ) : null}
      </div>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
      <div className="pointer-events-none absolute -right-10 -bottom-10 size-24 rounded-full bg-primary/10 blur-2xl transition-opacity group-hover:opacity-100 opacity-0" />
    </Panel>
  );
}

export function ScoreRing({ value, size = 132 }: { value: number; size?: number }) {
  const r = size / 2 - 10;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="iris-ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.72 0.12 230)" />
            <stop offset="55%" stopColor="oklch(0.68 0.14 235)" />
            <stop offset="100%" stopColor="oklch(0.75 0.08 210)" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={8}
          className="stroke-secondary"
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={8}
          stroke="url(#iris-ring)"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={c - (c * value) / 100}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-3xl font-semibold tabular-nums">{value}</span>
        <span className="text-[11px] text-muted-foreground">/ 100</span>
      </div>
    </div>
  );
}

export function Meter({ value, tone = "iris" }: { value: number; tone?: "iris" | "flat" }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
      <div
        className={cn("h-full rounded-full", tone === "iris" ? "gradient-surface" : "bg-muted-foreground")}
        style={{ width: `${Math.min(100, value)}%` }}
      />
    </div>
  );
}

export function Chip({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "good" | "warn" | "bad" | "iris";
}) {
  const tones: Record<string, string> = {
    neutral: "bg-secondary text-muted-foreground",
    good: "bg-success/15 text-success",
    warn: "bg-warning/15 text-warning",
    bad: "bg-destructive/15 text-destructive",
    iris: "bg-primary/15 text-primary",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium",
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}

export function PageHeading({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}
