import { createFileRoute, Link } from "@tanstack/react-router";
import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { SalesLead } from "@/components/crm/lead-directory";
import { useCallback, useEffect, useState } from "react";
import { Delete, Loader2, Mic, MicOff, Pause, PhoneCall, PhoneOff } from "lucide-react";
import { toast } from "sonner";
import { PageHeading, Panel, PanelHeader, Chip } from "@/components/iris/primitives";
import { LiveCoachingPanel } from "@/components/telephony/live-coaching-panel";
import { EmployeePhoneSetup } from "@/components/telephony/employee-phone-setup";
import { useAuth } from "@/components/auth/auth-provider";
import {
  getTelephonyStatus,
  getOutboundCall,
  hangupOutboundCall,
  placeOutboundCall,
} from "@/lib/telephony/telephony.functions";

export const Route = createFileRoute("/app/dialer")({
  head: () => ({
    meta: [
      { title: "Softphone & Live AI Coaching — Artemis AI" },
      {
        name: "description",
        content:
          "Click-to-call dialer: we ring your phone, then connect the prospect with company caller ID.",
      },
      { property: "og:title", content: "Softphone & Live AI Coaching — Artemis AI" },
    ],
  }),
  component: DialerPage,
});

const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"];

function DialerPage() {
  const { demoMode, session } = useAuth();
  const [leads, setLeads] = useState<SalesLead[]>([]),
    [leadId, setLeadId] = useState("");
  useEffect(() => {
    if (demoMode || !session?.activeCompanyId) return;
    let active = true;
    void (supabase as SupabaseClient)
      .from("sales_leads")
      .select("id,name,phone_e164,status,marketing_consent,consent_reference")
      .eq("company_id", session.activeCompanyId)
      .eq("marketing_consent", "granted")
      .limit(100)
      .then(({ data, error }) => {
        if (active && !error) setLeads(data as SalesLead[]);
      });
    return () => {
      active = false;
    };
  }, [demoMode, session?.activeCompanyId]);
  const [number, setNumber] = useState("+");
  const [contactName, setContactName] = useState("");
  const [consentReference, setConsentReference] = useState("");
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [idempotencyKey, setIdempotencyKey] = useState(() => crypto.randomUUID());
  const [providerState, setProviderState] = useState("created");
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
        s.company.enabled &&
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
    if (!onCall || providerState !== "in_progress") return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [onCall, providerState]);

  useEffect(() => {
    if (!activeCallId || demoMode) return;
    let active = true;
    const refresh = async () => {
      try {
        const call = await getOutboundCall({ data: { callId: activeCallId } });
        if (!active) return;
        setProviderState(call.status);
        setStatusLabel(
          call.status === "in_progress"
            ? "Agent leg connected · prospect answer not yet measured"
            : call.status.replaceAll("_", " "),
        );
        if (["completed", "failed", "cancelled", "missed"].includes(call.status)) {
          setOnCall(false);
          setActiveCallId(null);
          setIdempotencyKey(crypto.randomUUID());
        }
      } catch {
        if (active) setStatusLabel("Call status unavailable · check provider before redialling");
      }
    };
    void refresh();
    const timer = setInterval(() => void refresh(), 2000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [activeCallId, demoMode]);

  const mmss = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  async function startCall() {
    if (demoMode) {
      toast.message("Connect Supabase + Twilio to place real calls");
      return;
    }
    if (!leadId) {
      toast.error("Select a consented lead from CRM contacts first");
      return;
    }
    if (!marketingConsent || consentReference.trim().length < 8) {
      toast.error("Record the marketing-consent reference before calling");
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
          leadId,
          idempotencyKey,
          marketingConsent: true,
          consentReference,
          contactName: contactName || undefined,
        },
      });
      setActiveCallId(res.callId);
      setOnCall(true);
      setProviderState(res.status);
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
      if (activeCallId && !demoMode) await hangupOutboundCall({ data: { callId: activeCallId } });
      setOnCall(false);
      setActiveCallId(null);
      setSeconds(0);
      setIdempotencyKey(crypto.randomUUID());
      setStatusLabel("Call ended");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Hangup unconfirmed; reconcile before redialling",
      );
    } finally {
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

      {activeCallId && !demoMode && <LiveCoachingPanel callId={activeCallId} />}
      <div className="grid gap-4 xl:grid-cols-[340px_1fr]">
        <Panel className="p-5">
          <div className="rounded-xl border border-border bg-secondary/30 p-4 text-center">
            <p className="text-xs text-muted-foreground">{statusLabel}</p>
            <p className="mt-1 font-mono text-2xl">{onCall ? mmss : number}</p>
            {onCall ? (
              <p className="mt-1 text-xs text-muted-foreground">
                Answer your handset · recording disabled {callerId ? `· from ${callerId}` : ""}
              </p>
            ) : null}
            <div className="mt-3 flex justify-center gap-2">
              <Chip tone={onCall ? "good" : "neutral"}>
                {onCall ? providerState.replaceAll("_", " ") : "Idle"}
              </Chip>
            </div>
          </div>

          <label className="mt-4 block text-xs">
            Consented lead
            <select
              value={leadId}
              disabled={onCall}
              onChange={(event) => {
                const lead = leads.find((item) => item.id === event.target.value);
                setLeadId(event.target.value);
                if (lead) {
                  setNumber(lead.phone_e164);
                  setContactName(lead.name);
                  setConsentReference(lead.consent_reference ?? "");
                }
              }}
              className="mt-1 block w-full rounded border border-border bg-secondary p-2"
            >
              <option value="">Choose an actual consented lead</option>
              {leads.map((lead) => (
                <option key={lead.id} value={lead.id}>
                  {lead.name} · {lead.phone_e164}
                </option>
              ))}
            </select>
          </label>
          <Link to="/crm/contacts" className="text-xs text-primary">
            Create or update a lead
          </Link>
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

          <label className="mt-4 block text-xs">
            <input
              type="checkbox"
              checked={marketingConsent}
              onChange={(event) => setMarketingConsent(event.target.checked)}
              disabled={onCall}
            />{" "}
            I verified marketing consent and permission to contact this lead.
          </label>
          <label className="mt-2 block text-xs">
            Consent record reference
            <input
              value={consentReference}
              onChange={(event) => setConsentReference(event.target.value)}
              disabled={onCall}
              className="mt-1 w-full rounded border border-border bg-secondary p-2"
              placeholder="CRM consent record or approved campaign reference"
            />
          </label>
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

          <p className="mt-3 text-xs text-muted-foreground">
            Use your handset to mute. Provider hold is not implemented. Connection status refers to
            the agent leg; prospect-answer analytics require child-leg tracking.
          </p>
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
              After you hang up, open{" "}
              <Link to="/app/calls" className="text-primary hover:underline">
                Calls
              </Link>{" "}
              for the recording and AI review.
            </Panel>
          )}
        </div>
      </div>
    </>
  );
}
