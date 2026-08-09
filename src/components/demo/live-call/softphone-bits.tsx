import { cn } from "@/lib/utils";

export function SoftphoneWave({ active }: { active: boolean }) {
  return (
    <span className="inline-flex h-3 items-end gap-0.5" aria-hidden>
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className={cn(
            "w-0.5 rounded-full bg-primary/70",
            active ? "animate-pulse" : "opacity-30",
          )}
          style={{
            height: active ? `${6 + ((i * 3) % 7)}px` : "4px",
            animationDelay: `${i * 120}ms`,
          }}
        />
      ))}
    </span>
  );
}

export function formatMs(ms: number) {
  const total = Math.floor(Math.max(0, ms) / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
