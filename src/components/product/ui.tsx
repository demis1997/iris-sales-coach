import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Sparkles, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

/** Shared product UI — visual tokens match marketing navy/mint language. */

export function ProductMark({ className, light = false }: { className?: string; light?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="grid size-8 place-items-center rounded-xl bg-gradient-to-br from-[#2EE6A6] to-[#18C4FF] shadow-sm shadow-[#2EE6A6]/30">
        <svg viewBox="0 0 24 24" className="size-3.5 text-white" fill="none" aria-hidden>
          <path
            d="M4 12c4-6 12-6 16 0-4 6-12 6-16 0Z"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <circle cx="12" cy="12" r="2.5" fill="currentColor" />
        </svg>
      </span>
      <span
        className={cn(
          "text-[16px] font-semibold tracking-tight",
          light ? "text-[#0B1B33]" : "text-[#F7FAFF]",
        )}
      >
        Artemis <span className="text-[#12C48A]">AI</span>
      </span>
    </span>
  );
}

export function StatusBadge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "good" | "warn" | "bad" | "live" | "ai" | "demo";
}) {
  const tones: Record<string, string> = {
    neutral: "bg-white/5 text-[#8A9BB5] ring-1 ring-white/10",
    good: "bg-[#2EE6A6]/12 text-[#2EE6A6] ring-1 ring-[#2EE6A6]/20",
    warn: "bg-[#F5B942]/12 text-[#F5B942] ring-1 ring-[#F5B942]/20",
    bad: "bg-[#F07167]/12 text-[#F07167] ring-1 ring-[#F07167]/20",
    live: "bg-[#2EE6A6]/12 text-[#2EE6A6] ring-1 ring-[#2EE6A6]/25",
    ai: "bg-[#18C4FF]/10 text-[#18C4FF] ring-1 ring-[#18C4FF]/20",
    demo: "bg-white/5 text-[#8A9BB5] ring-1 ring-white/10",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}

export function SectionHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 border-b border-white/8 px-6 py-4">
      <div>
        <h3 className="text-[15px] font-semibold tracking-tight text-[#F7FAFF]">{title}</h3>
        {subtitle ? <p className="mt-0.5 text-[13px] text-[#8A9BB5]">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function ProductCard({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/[0.08] bg-[#132742] shadow-[0_12px_40px_-28px_rgba(0,0,0,0.45)]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function KPICard({
  label,
  value,
  delta,
  hint,
}: {
  label: string;
  value: string;
  delta?: number;
  hint?: string;
}) {
  const up = (delta ?? 0) >= 0;
  return (
    <ProductCard className="p-6">
      <p className="text-[11px] font-semibold tracking-[0.14em] text-[#8A9BB5] uppercase">
        {label}
      </p>
      <p className="mt-3 font-mono text-[28px] leading-none font-semibold tracking-tight text-[#F7FAFF] tabular-nums md:text-[32px]">
        {value}
      </p>
      {delta !== undefined ? (
        <p
          className={cn(
            "mt-2 inline-flex items-center gap-1 text-[13px] font-medium",
            up ? "text-[#2EE6A6]" : "text-[#F07167]",
          )}
        >
          {up ? <TrendingUp className="size-3.5" /> : <TrendingDown className="size-3.5" />}
          {up ? "+" : ""}
          {delta}%
          <span className="font-normal text-[#8A9BB5]">vs previous period</span>
        </p>
      ) : hint ? (
        <p className="mt-2 text-[13px] text-[#8A9BB5]">{hint}</p>
      ) : null}
    </ProductCard>
  );
}

export function AIInsight({
  title = "Artemis AI",
  subtitle,
  children,
  action,
  className,
}: {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <ProductCard className={cn("overflow-hidden", className)}>
      <div className="flex items-start gap-3 border-b border-white/8 px-6 py-4">
        <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-xl bg-[#18C4FF]/12 text-[#18C4FF]">
          <Sparkles className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[15px] font-semibold text-[#F7FAFF]">{title}</p>
            <StatusBadge tone="ai">Artemis AI</StatusBadge>
          </div>
          {subtitle ? <p className="mt-0.5 text-[13px] text-[#8A9BB5]">{subtitle}</p> : null}
        </div>
        {action}
      </div>
      <div className="relative px-6 py-5">
        <div className="absolute top-0 left-0 h-full w-0.5 bg-gradient-to-b from-[#2EE6A6] to-[#18C4FF]" />
        {children}
      </div>
    </ProductCard>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-3xl">
        <h1 className="text-[28px] leading-tight font-semibold tracking-tight text-[#F7FAFF] md:text-[34px]">
          {title}
        </h1>
        {subtitle ? <p className="mt-2 text-[15px] leading-relaxed text-[#8A9BB5]">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function ProductButton({
  children,
  variant = "primary",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
}) {
  const styles = {
    primary: "product-btn-primary",
    secondary: "product-btn-secondary",
    ghost: "product-btn-ghost",
    danger: "inline-flex items-center justify-center rounded-full bg-[#F07167]/15 px-5 py-2.5 text-sm font-semibold text-[#F07167] ring-1 ring-[#F07167]/25 hover:bg-[#F07167]/25",
  } as const;
  return (
    <button type="button" className={cn(styles[variant], className)} {...props}>
      {children}
    </button>
  );
}

export type ProductNavItem = {
  label: string;
  to: string;
  icon: LucideIcon;
  section?: string;
};
