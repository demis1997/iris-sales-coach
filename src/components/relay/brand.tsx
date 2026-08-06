import { cn } from "@/lib/utils";

export function ArtemisMark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <img
        src="/artemis-mark.png?v=artemis"
        alt=""
        width={32}
        height={32}
        className="size-8 rounded-lg object-cover"
      />
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
