import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ArtemisHeader } from "@/components/relay/header";
import { ArtemisFooter } from "@/components/marketing/footer";
import { cn } from "@/lib/utils";

export function MarketingShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("min-h-screen bg-white text-[#0B1B33]", className)}>
      <ArtemisHeader />
      {children}
      <ArtemisFooter />
    </div>
  );
}

export function MarketingHero({
  eyebrow,
  title,
  subtitle,
  actions,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  actions?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-[#E8EEF7]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#E8FFF6_0%,_transparent_55%),radial-gradient(ellipse_at_90%_10%,_#EEF2FF_0%,_transparent_40%)]" />
      <div className="relative mx-auto max-w-6xl px-5 py-16 md:py-24">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#12C48A]">{eyebrow}</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl">
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#4B5C76]">{subtitle}</p>
        {actions ? <div className="mt-8 flex flex-wrap gap-3">{actions}</div> : null}
      </div>
    </section>
  );
}

export function MarketingSection({
  id,
  eyebrow,
  title,
  subtitle,
  children,
  tone = "white",
}: {
  id?: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  tone?: "white" | "soft" | "dark";
}) {
  return (
    <section
      id={id}
      className={cn(
        "py-20",
        tone === "soft" && "border-y border-[#E8EEF7] bg-[#F7FAFF]",
        tone === "dark" && "bg-[#0B1B33] text-white",
        tone === "white" && "bg-white",
      )}
    >
      <div className="mx-auto max-w-6xl px-5">
        {(eyebrow || title) && (
          <div className="mb-10 max-w-2xl">
            {eyebrow ? (
              <p
                className={cn(
                  "text-xs font-semibold uppercase tracking-[0.18em]",
                  tone === "dark" ? "text-[#2EE6A6]" : "text-[#12C48A]",
                )}
              >
                {eyebrow}
              </p>
            ) : null}
            {title ? (
              <h2
                className={cn(
                  "mt-3 text-3xl font-bold tracking-tight sm:text-4xl",
                  tone === "dark" ? "text-white" : "text-[#0B1B33]",
                )}
              >
                {title}
              </h2>
            ) : null}
            {subtitle ? (
              <p
                className={cn(
                  "mt-3 text-base leading-relaxed",
                  tone === "dark" ? "text-white/70" : "text-[#4B5C76]",
                )}
              >
                {subtitle}
              </p>
            ) : null}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

export function FeatureGrid({
  items,
}: {
  items: { title: string; body: string }[];
}) {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <article
          key={item.title}
          className="rounded-[1.75rem] border border-[#E8EEF7] bg-white p-6 shadow-[0_12px_40px_-28px_rgba(15,40,80,0.3)]"
        >
          <h3 className="text-lg font-semibold tracking-tight text-[#0B1B33]">{item.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-[#4B5C76]">{item.body}</p>
        </article>
      ))}
    </div>
  );
}

export function MarketingCTA({
  title,
  subtitle,
  primary,
  secondary,
}: {
  title: string;
  subtitle: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
}) {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-4xl px-5">
        <div className="rounded-[2rem] bg-gradient-to-br from-[#0B1B33] via-[#132742] to-[#1A3358] p-10 text-center text-white sm:p-14">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
          <p className="mx-auto mt-3 max-w-lg text-white/70">{subtitle}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href={primary.href}
              className="inline-flex rounded-full bg-[#2EE6A6] px-6 py-3 text-sm font-semibold text-[#0B1B33] shadow-lg shadow-[#2EE6A6]/30 hover:bg-[#5cf0bc]"
            >
              {primary.label}
            </a>
            {secondary ? (
              <a
                href={secondary.href}
                className="inline-flex rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/5"
              >
                {secondary.label}
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

export function MockPanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-[#E8EEF7] bg-white shadow-[0_20px_60px_-30px_rgba(15,40,80,0.4)]">
      <div className="flex items-center justify-between border-b border-[#E8EEF7] bg-[#F7FAFF] px-5 py-3">
        <p className="text-sm font-semibold text-[#0B1B33]">{title}</p>
        <span className="rounded-full bg-[#E8FFF6] px-2.5 py-1 text-[11px] font-semibold text-[#12C48A]">
          Product preview
        </span>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

export function RelatedLinks({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string; description?: string }[];
}) {
  return (
    <MarketingSection eyebrow="Related" title={title} tone="soft">
      <div className="grid gap-4 md:grid-cols-3">
        {links.map((l) => (
          <Link
            key={l.href}
            to={l.href as "/"}
            className="rounded-[1.5rem] border border-[#E8EEF7] bg-white p-5 transition hover:border-[#2EE6A6]/50"
          >
            <p className="font-semibold text-[#0B1B33]">{l.label}</p>
            {l.description ? (
              <p className="mt-2 text-sm text-[#4B5C76]">{l.description}</p>
            ) : null}
          </Link>
        ))}
      </div>
    </MarketingSection>
  );
}

export function seoMeta(opts: {
  title: string;
  description: string;
  path: string;
}) {
  return {
    meta: [
      { title: opts.title },
      { name: "description", content: opts.description },
      { property: "og:title", content: opts.title },
      { property: "og:description", content: opts.description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: opts.path }],
  };
}
