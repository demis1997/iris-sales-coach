import { cn } from "@/lib/utils";

/** Shared Artemis eye mark used in navbar and exported as favicon source. */
export function ArtemisEyeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("size-4", className)} fill="none" aria-hidden>
      <path
        d="M4 12c4-6 12-6 16 0-4 6-12 6-16 0Z"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="2.5" fill="currentColor" />
    </svg>
  );
}

export function ArtemisMark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="grid size-8 place-items-center rounded-xl bg-gradient-to-br from-[#2EE6A6] to-[#18C4FF] shadow-sm shadow-[#2EE6A6]/40">
        <ArtemisEyeIcon className="text-white" />
      </span>
      <span className="text-[17px] font-semibold tracking-tight text-[#0B1B33]">
        Artemis <span className="font-semibold text-[#12C48A]">AI</span>
      </span>
    </span>
  );
}

export function ArtemisButton({
  children,
  href = "#get-started",
  variant = "primary",
  className,
}: {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
}) {
  const styles =
    variant === "primary"
      ? "bg-[#2EE6A6] text-[#0B1B33] shadow-lg shadow-[#2EE6A6]/35 hover:bg-[#5cf0bc]"
      : variant === "secondary"
        ? "border border-[#D7E0EF] bg-white text-[#0B1B33] hover:border-[#2EE6A6] hover:bg-[#F3FFFB]"
        : "text-[#4B5C76] hover:text-[#0B1B33]";
  return (
    <a
      href={href}
      className={cn(
        "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition-colors",
        styles,
        className,
      )}
    >
      {children}
    </a>
  );
}
