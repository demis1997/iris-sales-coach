import { cn } from "@/lib/utils";

/** Official Artemis AI brand assets — see public/brand/README.md */
export const ARTEMIS_BRAND = {
  navy: "#071B33",
  turquoise: "#22CDBD",
  lightTurquoise: "#35E4D3",
  /** Full wordmark for light/white backgrounds (transparent PNG) */
  logoDark: "/brand/artemis-ai-logo-dark.png",
  /** Full wordmark for navy/black/dark backgrounds (transparent PNG) */
  logoLight: "/brand/artemis-ai-logo-light.png",
  /** Transparent A icon */
  icon: "/brand/artemis-ai-icon.png",
  /** Square app / social icon */
  iconApp: "/brand/artemis-ai-icon-dark-background.png",
} as const;

/** Tiny A mark for inline accents. */
export function ArtemisEyeIcon({ className }: { className?: string }) {
  return (
    <img
      src={ARTEMIS_BRAND.icon}
      alt=""
      aria-hidden
      className={cn("size-4 object-contain", className)}
    />
  );
}

export function ArtemisIcon({
  className,
  size = 32,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <img
      src={ARTEMIS_BRAND.iconApp}
      alt="Artemis AI"
      width={size}
      height={size}
      className={cn("rounded-[22%] object-contain", className)}
    />
  );
}

/**
 * Official Artemis AI wordmark.
 * @param variant `dark` = navy wordmark for light UIs; `light` = white wordmark for dark UIs
 */
export function ArtemisMark({
  className,
  variant = "dark",
  height = 28,
}: {
  className?: string;
  variant?: "dark" | "light";
  height?: number;
}) {
  const src = variant === "light" ? ARTEMIS_BRAND.logoLight : ARTEMIS_BRAND.logoDark;
  return (
    <span className={cn("inline-flex items-center", className)}>
      <img
        src={src}
        alt="Artemis AI"
        height={height}
        className="h-7 w-auto max-w-[190px] object-contain object-left sm:h-8"
        style={{ height }}
        decoding="async"
      />
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
      ? "bg-[#22CDBD] text-[#071B33] shadow-lg shadow-[#22CDBD]/30 hover:bg-[#35E4D3]"
      : variant === "secondary"
        ? "border border-[#D7E0EF] bg-white text-[#071B33] hover:border-[#22CDBD] hover:bg-[#F3FFFB]"
        : "text-[#4B5C76] hover:text-[#071B33]";
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
