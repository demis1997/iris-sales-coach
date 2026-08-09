import { useEffect, useRef, type ComponentType } from "react";
import {
  Grid3X3,
  Mic,
  MicOff,
  NotebookPen,
  Phone,
  PhoneOff,
  Pause,
  Play,
  UserPlus,
} from "lucide-react";
import { Panel } from "@/components/iris/primitives";
import type { CallSession } from "@/lib/demo/live-call/types";
import { cn } from "@/lib/utils";
import { SoftphoneWave, formatMs } from "./softphone-bits";

export function ActiveCallCenter({
  session,
  onMute,
  onHold,
  onKeypad,
  onEnd,
  onNotesFocus,
}: {
  session: CallSession;
  onMute: () => void;
  onHold: () => void;
  onKeypad: () => void;
  onEnd: () => void;
  onNotesFocus?: () => void;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const stickBottom = useRef(true);

  useEffect(() => {
    if (!stickBottom.current || !scroller.current) return;
    scroller.current.scrollTop = scroller.current.scrollHeight;
  }, [session.transcript]);

  const statusLabel =
    session.status === "ON_HOLD"
      ? "ON HOLD"
      : session.status === "DIALING"
        ? "DIALING…"
        : session.status === "RINGING"
          ? "RINGING…"
          : session.status === "CONNECTED"
            ? "ACTIVE CALL"
            : session.status;

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <Panel className="overflow-hidden">
        <div className="border-b border-border bg-[#18C4FF]/5 px-5 py-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p
                className={cn(
                  "text-[11px] font-semibold tracking-[0.16em] uppercase",
                  session.status === "ON_HOLD" ? "text-warning" : "text-[#18C4FF]",
                )}
              >
                {statusLabel}
              </p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight">
                {session.prospect.name}
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                {session.lead.country} · {session.lead.phoneMasked}
              </p>
            </div>
            <div className="text-right">
              <p className="font-mono text-4xl font-semibold tabular-nums tracking-tight gradient-text">
                {formatMs(session.elapsedMs)}
              </p>
              <div className="mt-1 flex flex-wrap justify-end gap-2 text-[11px] text-muted-foreground">
                <span className="capitalize">{session.direction}</span>
                <span>·</span>
                <span>
                  {session.status === "CONNECTED" || session.status === "ON_HOLD"
                    ? "Connected"
                    : session.status.toLowerCase()}
                </span>
                <span>·</span>
                <span className="text-success">Good connection</span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {session.stages.map((stage) => (
              <span
                key={stage.id}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px]",
                  stage.state === "complete" && "border-success/30 text-success",
                  stage.state === "active" && "border-primary/40 bg-primary/10 text-primary",
                  stage.state === "upcoming" && "border-border text-muted-foreground",
                )}
              >
                {stage.state === "complete" ? "✓" : stage.state === "active" ? "●" : "○"}
                {stage.label}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 px-4 py-4">
          <ControlButton
            label={session.muted ? "Unmute" : "Mute"}
            active={session.muted}
            onClick={onMute}
            icon={session.muted ? MicOff : Mic}
          />
          <ControlButton label="Keypad" active={session.keypadOpen} onClick={onKeypad} icon={Grid3X3} />
          <ControlButton
            label={session.onHold ? "Resume" : "Hold"}
            active={session.onHold}
            onClick={onHold}
            icon={session.onHold ? Play : Pause}
          />
          <ControlButton label="Transfer" onClick={() => undefined} icon={Phone} disabled />
          <ControlButton label="Add" onClick={() => undefined} icon={UserPlus} disabled />
          <ControlButton label="Notes" onClick={() => onNotesFocus?.()} icon={NotebookPen} />
          <button
            type="button"
            onClick={onEnd}
            className="inline-flex min-w-[88px] flex-col items-center gap-1 rounded-2xl bg-destructive px-3 py-2.5 text-[10px] font-semibold text-white shadow-[0_10px_30px_-12px_rgba(239,68,68,0.8)] transition hover:brightness-110"
          >
            <PhoneOff className="size-4" />
            End Call
          </button>
        </div>

        {session.keypadOpen ? (
          <div className="grid grid-cols-3 gap-2 border-t border-border px-6 py-4">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"].map((k) => (
              <button
                key={k}
                type="button"
                className="rounded-xl border border-border py-3 font-mono text-sm hover:bg-secondary/50"
              >
                {k}
              </button>
            ))}
          </div>
        ) : null}
      </Panel>

      <Panel className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div>
            <p className="text-sm font-semibold">Live transcript</p>
            <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <span className="size-1.5 animate-pulse rounded-full bg-primary" />
              Transcribing
            </p>
          </div>
          <div className="flex gap-4 text-xs">
            <span className="inline-flex items-center gap-1.5">
              <SoftphoneWave active={session.activeSpeaker === "agent"} />
              <span className={cn(session.activeSpeaker === "agent" && "text-primary")}>
                Maria · Agent
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <SoftphoneWave active={session.activeSpeaker === "prospect"} />
              <span className={cn(session.activeSpeaker === "prospect" && "text-cyan-300")}>
                Client · Prospect
              </span>
            </span>
          </div>
        </div>

        <div
          ref={scroller}
          onScroll={(e) => {
            const el = e.currentTarget;
            stickBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 48;
          }}
          className="min-h-[280px] flex-1 space-y-2 overflow-y-auto px-4 py-3"
        >
          {session.transcript.length === 0 ? (
            <p className="py-8 text-center text-xs text-muted-foreground">
              {session.status === "DIALING" || session.status === "RINGING"
                ? "Connecting… transcript starts when the call connects."
                : "Waiting for speech…"}
            </p>
          ) : null}
          {session.transcript.map((line) => (
            <div
              key={line.id}
              className={cn(
                "rounded-xl border px-3 py-2.5 text-sm",
                line.speaker === "agent"
                  ? "border-primary/20 bg-primary/5"
                  : "border-border bg-secondary/20",
                line.highlight === "objection" && "border-primary/40",
                line.highlight === "opportunity" && "border-warning/40",
                line.highlight === "risk" && "border-destructive/30",
                line.highlight === "good" && "border-success/30",
              )}
            >
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <span className="font-mono">{line.atLabel}</span>
                <span className="font-medium text-foreground/80">{line.name}</span>
                {line.partial ? (
                  <span className="animate-pulse text-primary">transcribing…</span>
                ) : null}
              </div>
              <p className="mt-1 leading-relaxed">
                “{line.text}”
                {line.partial ? <span className="ml-0.5 inline-block animate-pulse">▍</span> : null}
              </p>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function ControlButton({
  label,
  icon: Icon,
  onClick,
  active,
  disabled,
}: {
  label: string;
  icon: ComponentType<{ className?: string }>;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex min-w-[72px] flex-col items-center gap-1 rounded-2xl border px-3 py-2.5 text-[10px] font-medium transition",
        active
          ? "border-primary/40 bg-primary/15 text-primary"
          : "border-border bg-secondary/30 text-muted-foreground hover:text-foreground",
        disabled && "cursor-not-allowed opacity-40",
      )}
    >
      <Icon className="size-4" />
      {label}
    </button>
  );
}
