import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Panel, PanelHeader, Chip } from "@/components/iris/primitives";
import { maskPhone } from "@/lib/telephony/phone";
import {
  confirmPhoneVerification,
  getTelephonyStatus,
  startPhoneVerification,
} from "@/lib/telephony/telephony.functions";

type Status = Awaited<ReturnType<typeof getTelephonyStatus>>;

export function EmployeePhoneSetup({ compact = false }: { compact?: boolean }) {
  const [status, setStatus] = useState<Status | null>(null);
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"idle" | "code">("idle");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const next = await getTelephonyStatus();
      setStatus(next);
      if (next.employee.phoneE164) setPhone(next.employee.phoneE164);
    } catch {
      setStatus(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function sendCode() {
    setBusy(true);
    try {
      const res = await startPhoneVerification({ data: { phone } });
      setPhone(res.phone);
      setStep("code");
      toast.success("Verification code sent by SMS");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not send code");
    } finally {
      setBusy(false);
    }
  }

  async function confirm() {
    setBusy(true);
    try {
      await confirmPhoneVerification({ data: { phone, code } });
      toast.success("Phone verified — you can dial from the app");
      setStep("idle");
      setCode("");
      await refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Invalid code");
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <Panel className="p-5">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Loading phone setup…
        </div>
      </Panel>
    );
  }

  const verified = status?.employee.phoneVerified;

  return (
    <Panel className={compact ? "p-4" : undefined}>
      {!compact ? (
        <PanelHeader
          title="My calling phone"
          subtitle="We'll ring this number, then connect your prospect. Customers see the company caller ID."
        />
      ) : null}
      <div className={compact ? "space-y-3" : "space-y-3 p-5"}>
        {compact ? (
          <p className="text-sm font-medium">My calling phone</p>
        ) : null}
        <div className="flex flex-wrap items-center gap-2">
          {verified ? (
            <Chip tone="good">Verified {maskPhone(status?.employee.phoneE164)}</Chip>
          ) : (
            <Chip tone="warn">Not verified</Chip>
          )}
          {!status?.twilioConfigured ? (
            <Chip tone="neutral">Twilio not configured yet</Chip>
          ) : null}
        </div>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+357 99 123456"
          className="w-full rounded-xl border border-border bg-secondary/30 px-3 py-2 text-sm outline-none focus:border-primary"
        />
        {step === "code" ? (
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="6-digit code"
            className="w-full rounded-xl border border-border bg-secondary/30 px-3 py-2 text-sm outline-none focus:border-primary"
          />
        ) : null}
        <div className="flex flex-wrap gap-2">
          {step === "idle" ? (
            <button
              type="button"
              disabled={busy || !phone}
              onClick={() => void sendCode()}
              className="rounded-xl gradient-surface px-4 py-2 text-sm font-semibold text-background disabled:opacity-50"
            >
              {busy ? "Sending…" : verified ? "Re-verify phone" : "Send SMS code"}
            </button>
          ) : (
            <>
              <button
                type="button"
                disabled={busy || code.length < 4}
                onClick={() => void confirm()}
                className="rounded-xl gradient-surface px-4 py-2 text-sm font-semibold text-background disabled:opacity-50"
              >
                {busy ? "Checking…" : "Confirm code"}
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => void sendCode()}
                className="rounded-xl border border-border px-4 py-2 text-sm"
              >
                Resend
              </button>
            </>
          )}
        </div>
      </div>
    </Panel>
  );
}
