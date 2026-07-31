import { motion, useInView, useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-70px" },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
};

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
      {...fadeUp}
      transition={{ ...fadeUp.transition, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/40 px-3 py-1 text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
      <span className="size-1.5 rounded-full gradient-surface" />
      {children}
    </span>
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
    <section id={id} className={cn("mx-auto w-full max-w-6xl px-5 py-20 md:py-28", className)}>
      {title ? (
        <Reveal
          className={cn(
            "max-w-2xl",
            align === "center" && "mx-auto max-w-3xl text-center",
          )}
        >
          {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
          <h2 className="mt-4 text-3xl leading-[1.1] font-semibold tracking-tight text-balance md:text-[2.6rem]">
            {title}
          </h2>
          {lede ? (
            <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-[1.05rem]">
              {lede}
            </p>
          ) : null}
        </Reveal>
      ) : null}
      {children ? <div className={title ? "mt-12" : ""}>{children}</div> : null}
    </section>
  );
}

export function CountUp({
  to,
  prefix = "",
  suffix = "",
  decimals = 0,
  className,
}: {
  to: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 60, damping: 18 });

  useEffect(() => {
    if (inView) mv.set(to);
  }, [inView, to, mv]);

  useEffect(
    () =>
      spring.on("change", (v) => {
        if (ref.current) {
          ref.current.textContent = `${prefix}${v.toFixed(decimals)}${suffix}`;
        }
      }),
    [spring, prefix, suffix, decimals],
  );

  return (
    <span ref={ref} className={className}>
      {prefix}0{suffix}
    </span>
  );
}
