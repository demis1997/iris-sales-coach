import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Panel, PanelHeader, Chip } from "@/components/iris/primitives";
import {
  getTelephonyStatus,
  saveCompanyTelephony,
} from "@/lib/telephony/telephony.functions";

type Status = Awaited<ReturnType<typeof getTelephonyStatus>>;

export function CompanyTelephonySetup() {
  const [status, setStatus] = useState<Status | null>(null);
  const [callerId, setCallerId] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const next = await getTelephonyStatus();
      setStatus(next);
      setCallerId(next.company.callerIdE164 || next.company.effectiveCallerId || "");
    } catch {
      setStatus(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function save() {
    setBusy(true);
    try {
      await saveCompanyTelephony({ data: { callerId, enabled: true } });
      toast.success("Company caller ID saved");
      await refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save");
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <Panel className="p-5">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Loading telephony…
        </div>
      </Panel>
    );
  }

  if (!status?.canManageCompanyTelephony) {
    return (
      <Panel className="p-5 text-sm text-muted-foreground">
        Only owners and admins can set the company caller ID. Employees only verify their own phone.
      </Panel>
    );
  }

  return (
    <Panel>
      <PanelHeader
        title="Company caller ID"
        subtitle="Prospects see this number. Employees enter their personal phone separately — Artemis rings them, then bridges the lead."
      />
      <div className="space-y-3 p-5">
        <div className="flex flex-wrap gap-2">
          <Chip tone={status.company.enabled ? "good" : "warn"}>
            {status.company.enabled ? "Calling enabled" : "Caller ID needed"}
          </Chip>
          <Chip tone={status.twilioConfigured ? "good" : "warn"}>
            {status.twilioConfigured ? "Twilio connected" : "Add TWILIO_* env keys"}
          </Chip>
        </div>
        <input
          value={callerId}
          onChange={(e) => setCallerId(e.target.value)}
          placeholder="+357 22 000 000 (Twilio or verified number)"
          className="w-full rounded-xl border border-border bg-secondary/30 px-3 py-2 text-sm outline-none focus:border-primary"
        />
        <p className="text-xs text-muted-foreground">
          Use a Twilio number on your account, or a number you verified in Twilio as Caller ID.
        </p>
        <button
          type="button"
          disabled={busy || !callerId}
          onClick={() => void save()}
          className="rounded-xl gradient-surface px-4 py-2 text-sm font-semibold text-background disabled:opacity-50"
        >
          {busy ? "Saving…" : "Save & enable calling"}
        </button>
      </div>
    </Panel>
  );
}
