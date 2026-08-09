import { Link } from "@tanstack/react-router";
import { Chip } from "@/components/iris/primitives";
import type { CallSession, DemoSpeed } from "@/lib/demo/live-call/types";
import { cn } from "@/lib/utils";

const SPEEDS: DemoSpeed[] = [1, 2, 4];

export function LiveStatusBar({
  session,
  onSpeed,
}: {
  session: CallSession;
  onSpeed: (s: DemoSpeed) => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/[0.08] bg-[#132742] px-5 py-4">
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <p className="text-sm font-semibold">{session.agent.name}</p>
          <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-success">
            <span className="size-1.5 animate-pulse rounded-full bg-success" />
            ONLINE
          </p>
        </div>
        <span className="hidden h-8 w-px bg-border sm:block" />
        <div>
          <p className="text-xs text-muted-foreground">{session.companyName}</p>
          <p className="text-xs">
            Campaign: <span className="font-medium text-foreground">{session.campaign}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-xs">
          <span>
            Calls today: <span className="font-mono font-semibold">{session.callsToday}</span>
          </span>
          <span>
            FTDs: <span className="font-mono font-semibold">{session.ftdsToday}</span>
          </span>
          <span>
            Conversion:{" "}
            <span className="font-mono font-semibold">{session.conversionToday}%</span>
          </span>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Chip tone="iris">Demo Workspace</Chip>
        <Chip tone="neutral">Simulated AI</Chip>
        <div className="flex items-center gap-1 rounded-lg border border-border px-1 py-0.5">
          <span className="px-1 text-[10px] text-muted-foreground">Speed</span>
          {SPEEDS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onSpeed(s)}
              className={cn(
                "rounded-md px-1.5 py-0.5 text-[10px] font-semibold",
                session.speed === s ? "bg-primary/20 text-primary" : "text-muted-foreground",
              )}
            >
              {s}×
            </button>
          ))}
        </div>
        {session.managerCanMonitor ? (
          <Link
            to="/demo/manager/live"
            className="rounded-lg border border-border px-2 py-1 text-[11px] text-muted-foreground hover:text-foreground"
          >
            Manager View · {session.managerName}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
