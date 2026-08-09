import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import {
  Delete,
  Loader2,
  Mic,
  MicOff,
  Pause,
  PhoneCall,
  PhoneOff,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeading, Panel, PanelHeader, Chip } from "@/components/iris/primitives";
import { EmployeePhoneSetup } from "@/components/telephony/employee-phone-setup";
import { useAuth } from "@/components/auth/auth-provider";
import {
  getTelephonyStatus,
  hangupOutboundCall,
  placeOutboundCall,
} from "@/lib/telephony/telephony.functions";

export const Route = createFileRoute("/app/dialer")({
  head: () => ({
    meta: [
      { title: "Softphone & Live AI Coaching — Artemis AI" },
      {
        name: "description",
        content: "Click-to-call dialer: we ring your phone, then connect the prospect with company caller ID.",
      },
      { property: "og:title", content: "Softphone & Live AI Coaching — Artemis AI" },
    ],
  }),
  component: DialerPage,
});

const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"];

function DialerPage() {
  const { demoMode } = useAuth();
  const [number, setNumber] = useState("+");
  const [contactName, setContactName] = useState("");
  const [onCall, setOnCall] = useState(false);
  const [activeCallId, setActiveCallId] = useState<string | null>(null);
  const [muted, setMuted] = useState(false);
  const [held, setHeld] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [busy, setBusy] = useState(false);
  const [statusLabel, setStatusLabel] = useState("Ready to dial");
  const [callerId, setCallerId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [needsPhone, setNeedsPhone] = useState(false);

  const refreshReady = useCallback(async () => {
    if (demoMode) {
      setReady(false);
      setNeedsPhone(true);
      return;
    }
    try {
      const s = await getTelephonyStatus();
      setCallerId(s.company.effectiveCallerId);
      const ok =
        s.twilioConfigured &&
        Boolean(s.company.effectiveCallerId) &&
        s.employee.phoneVerified;
      setReady(ok);
      setNeedsPhone(!s.employee.phoneVerified);
      if (!s.twilioConfigured) setStatusLabel("Twilio not configured on server");
      else if (!s.company.effectiveCallerId) setStatusLabel("Company caller ID missing");
      else if (!s.employee.phoneVerified) setStatusLabel("Verify your phone to dial");
      else setStatusLabel("Ready to dial");
    } catch {
      setReady(false);
      setNeedsPhone(true);
    }
  }, [demoMode]);

  useEffect(() => {
    void refreshReady();
  }, [refreshReady]);

  useEffect(() => {
    if (!onCall || held) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [onCall, held]);

  const mmss = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  async function startCall() {
    if (demoMode) {
      toast.message("Connect Supabase + Twilio to place real calls");
      return;
    }
    if (!ready) {
      toast.error("Verify your phone and set company caller ID first");
      return;
    }
    setBusy(true);
    try {
      const res = await placeOutboundCall({
        data: {
          to: number,
          contactName: contactName || undefined,
        },
      });
      setActiveCallId(res.callId);
      setOnCall(true);
      setSeconds(0);
      setStatusLabel(`Ringing your phone · then ${res.prospect}`);
      toast.success("Answer your phone — we'll connect the prospect next");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Call failed");
    } finally {
      setBusy(false);
    }
  }

  async function endCall() {
    setBusy(true);
    try {
      if (activeCallId && !demoMode) {
        await hangupOutboundCall({ data: { callId: activeCallId } });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not hang up");
    } finally {
      setOnCall(false);
      setActiveCallId(null);
      setSeconds(0);
      setStatusLabel("Ready to dial");
      setBusy(false);
    }
  }

  return (
    <>
      <PageHeading
        title="Dialer"
        subtitle="Click-to-call: Artemis rings your phone, then bridges the prospect. Customers see the company number."
      />

      {needsPhone ? (
        <div className="mb-4">
          <EmployeePhoneSetup compact />
        </div>
      ) : null}

      <div className="mb-4 flex flex-wrap gap-2 text-xs">
        <Chip tone={ready ? "good" : "warn"}>{ready ? "Ready" : "Setup needed"}</Chip>
        {callerId ? <Chip tone="iris">Caller ID {callerId}</Chip> : null}
        <Link to="/app/settings" className="text-primary hover:underline">
          Phone settings →
        </Link>
        <Link to="/ceo/telephony" className="text-primary hover:underline">
          Company calling →
        </Link>
      </div>

      <div className="grid gap-4 xl:grid-cols-[340px_1fr]">
        <Panel className="p-5">
          <div className="rounded-xl border border-border bg-secondary/30 p-4 text-center">
            <p className="text-xs text-muted-foreground">{statusLabel}</p>
            <p className="mt-1 font-mono text-2xl">{onCall ? mmss : number}</p>
            {onCall ? (
              <p className="mt-1 text-xs text-muted-foreground">
                Answer your handset · recording {callerId ? `· from ${callerId}` : ""}
              </p>
            ) : null}
            <div className="mt-3 flex justify-center gap-2">
              <Chip tone={onCall ? "good" : "neutral"}>
                {held ? "On hold" : onCall ? "Live" : "Idle"}
              </Chip>
            </div>
          </div>

          <label className="mt-4 block text-[11px] tracking-wider text-muted-foreground uppercase">
            Contact name (optional)
          </label>
          <input
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            placeholder="Prospect name"
            className="mt-1 w-full rounded-xl border border-border bg-secondary/30 px-3 py-2 text-sm outline-none focus:border-primary"
            disabled={onCall}
          />

          <div className="mt-4 grid grid-cols-3 gap-2">
            {keys.map((k) => (
              <button
                key={k}
                type="button"
                disabled={onCall}
                onClick={() => setNumber((n) => n + k)}
                className="rounded-xl border border-border bg-secondary/30 py-3 font-mono text-base transition-colors hover:bg-secondary disabled:opacity-40"
              >
                {k}
              </button>
            ))}
          </div>

          <div className="mt-3 flex gap-2">
            <button
              type="button"
              disabled={onCall}
              onClick={() => setNumber((n) => (n.length <= 1 ? "+" : n.slice(0, -1)))}
              className="grid flex-1 place-items-center rounded-xl border border-border bg-secondary/30 py-2.5 text-muted-foreground hover:bg-secondary disabled:opacity-40"
            >
              <Delete className="size-4" />
            </button>
            <button
              type="button"
              disabled={busy || (!onCall && number.replace(/\D/g, "").length < 8)}
              onClick={() => void (onCall ? endCall() : startCall())}
              className={`flex flex-[2] items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold disabled:opacity-50 ${
                onCall ? "bg-destructive/20 text-destructive" : "gradient-surface text-background"
              }`}
            >
              {busy ? (
                <Loader2 className="size-4 animate-spin" />
              ) : onCall ? (
                <PhoneOff className="size-4" />
              ) : (
                <PhoneCall className="size-4" />
              )}
              {onCall ? "End call" : "Call"}
            </button>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
            <button
              type="button"
              disabled={!onCall}
              onClick={() => setMuted((v) => !v)}
              className="flex flex-col items-center gap-1 rounded-xl border border-border bg-secondary/30 py-2.5 text-muted-foreground disabled:opacity-40"
            >
              {muted ? <MicOff className="size-4" /> : <Mic className="size-4" />}
              {muted ? "Unmute (handset)" : "Mute (handset)"}
            </button>
            <button
              type="button"
              disabled={!onCall}
              onClick={() => setHeld((v) => !v)}
              className="flex flex-col items-center gap-1 rounded-xl border border-border bg-secondary/30 py-2.5 text-muted-foreground disabled:opacity-40"
            >
              <Pause className="size-4" />
              {held ? "Resume timer" : "Hold timer"}
            </button>
          </div>
        </Panel>

        <div className="space-y-4">
          <Panel>
            <PanelHeader title="How calling works" subtitle="Built for teams that hire often" />
            <ol className="list-decimal space-y-2 p-5 pl-9 text-sm text-muted-foreground">
              <li>Admin sets the company caller ID once (Twilio number).</li>
              <li>Each employee verifies their personal phone with an SMS code.</li>
              <li>Dial a prospect here — we ring the employee first, then connect the lead.</li>
              <li>Recording lands in Calls and runs through the same AI pipeline as uploads.</li>
            </ol>
          </Panel>

          {activeCallId ? (
            <Panel className="p-5 text-sm">
              <p className="font-medium">Active call</p>
              <p className="mt-1 text-muted-foreground font-mono text-xs">{activeCallId}</p>
              <Link
                to="/app/calls/$callId"
                params={{ callId: activeCallId }}
                className="mt-3 inline-flex text-primary hover:underline"
              >
                Open call record →
              </Link>
            </Panel>
          ) : (
            <Panel className="p-5 text-sm text-muted-foreground">
              After you hang up, open <Link to="/app/calls" className="text-primary hover:underline">Calls</Link>{" "}
              for the recording and AI review.
            </Panel>
          )}
        </div>
      </div>
    </>
  );
}
