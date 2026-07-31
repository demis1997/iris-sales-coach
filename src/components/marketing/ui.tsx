import type { ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export function Reveal({
  delay = 0,
  className,
  children,
}: {
  delay?: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Section({
  id,
  eyebrow,
  title,
  lede,
  align = "left",
  className,
  children,
}: {
  id?: string;
  eyebrow?: string;
  title?: ReactNode;
  lede?: ReactNode;
  align?: "left" | "center";
  className?: string;
  children?: ReactNode;
}) {
  return (
    <section id={id} className={cn("container-page py-16 md:py-24", className)}>
      {title ? (
        <Reveal className={cn("max-w-2xl", align === "center" && "mx-auto max-w-3xl text-center")}>
          {eyebrow ? (
            <p className="text-[11px] font-medium tracking-[0.16em] text-primary uppercase">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="mt-3 text-3xl leading-[1.12] font-semibold tracking-tight text-balance md:text-[2.4rem]">
            {title}
          </h2>
          {lede ? (
            <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-[1.05rem]">
              {lede}
            </p>
          ) : null}
        </Reveal>
      ) : null}
      {children ? <div className={title ? "mt-10 md:mt-12" : undefined}>{children}</div> : null}
    </section>
  );
}

export function PageHero({
  eyebrow,
  title,
  lede,
  actions,
}: {
  eyebrow?: string;
  title: ReactNode;
  lede: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <section className="border-b border-border">
      <div className="container-page py-16 md:py-20">
        <Reveal className="max-w-3xl">
          {eyebrow ? (
            <p className="text-[11px] font-medium tracking-[0.16em] text-primary uppercase">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="mt-3 text-4xl leading-[1.08] font-semibold tracking-tight text-balance md:text-5xl">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            {lede}
          </p>
          {actions ? <div className="mt-8 flex flex-wrap gap-3">{actions}</div> : null}
        </Reveal>
      </div>
    </section>
  );
}

export function ContentCard({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("rounded-xl border border-border bg-card p-5 shadow-sm md:p-6", className)}>
      {children}
    </div>
  );
}
