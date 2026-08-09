import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { ArtemisMark } from "@/components/iris/app-shell";
import { Panel } from "@/components/iris/primitives";
import { RequireAuth } from "@/components/auth/require-auth";
import { useAuth } from "@/components/auth/auth-provider";
import {
  aiConfigStepSchema,
  companyStepSchema,
  salesProcessStepSchema,
  type OnboardingWizardState,
  type TeamInvite,
} from "@/lib/onboarding-schemas";
import {
  completeOnboarding,
  createInvitation,
  loadOnboardingChecklist,
  saveOnboardingProgress,
} from "@/lib/auth-session";
import type { AppRole } from "@/lib/permissions";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Onboarding — Artemis AI" },
      { name: "description", content: "Set up your Artemis AI company workspace." },
    ],
  }),
  component: () => (
    <RequireAuth allowIncompleteOnboarding>
      <OnboardingPage />
    </RequireAuth>
  ),
});

const STEPS = [
  "Company",
  "Sales process",
  "Team",
  "Calls",
  "AI",
  "CRM",
  "Test",
] as const;

function OnboardingPage() {
  const navigate = useNavigate();
  const { refresh, session } = useAuth();
  const [step, setStep] = useState(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [wizard, setWizard] = useState<OnboardingWizardState>({
    step: 1,
    company: {
      name: session?.membership?.companyName ?? "",
      industry: "Financial services",
      country: "Cyprus",
      timezone: "Europe/Nicosia",
      companySize: "11-50",
      primaryUseCase: "Sales coaching",
      expectedAgentCount: 10,
      primaryLanguage: "en",
      additionalLanguages: [],
    },
    salesProcess: {
      productOrService: "",
      targetCustomer: "",
      typicalCallType: "Outbound sales",
      primaryOutcomes: ["Deposit", "Meeting booked"],
      commonObjections: ["Price", "Need to think"],
      requiredDisclosures: [],
      prohibitedClaims: [],
      idealCallStructure: "",
      conversionEvent: "Deposit",
    },
    invites: [],
    callsSetup: { method: "demo" },
    ai: {
      coachingTone: "direct",
      scoringStrictness: "balanced",
      complianceSensitivity: "standard",
      defaultLanguage: "en",
      autoCreateCoachingTasks: true,
    },
    crm: { provider: "skip" },
  });

  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<AppRole>("rep");

  useEffect(() => {
    void loadOnboardingChecklist().then((data) => {
      if (!data) return;
      if (data.completed) {
        void navigate({ to: "/ceo", replace: true });
        return;
      }
      if (data.wizard?.step) {
        setWizard((w) => ({ ...w, ...data.wizard }));
        setStep(data.wizard.step || 1);
      }
    });
  }, [navigate]);

  const progress = useMemo(() => (step / STEPS.length) * 100, [step]);

  async function persist(next: OnboardingWizardState, checklist?: Parameters<typeof saveOnboardingProgress>[0]["checklist"]) {
    setBusy(true);
    setError(null);
    try {
      await saveOnboardingProgress({ wizard: next, checklist });
      setWizard(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save progress.");
      throw err;
    } finally {
      setBusy(false);
    }
  }

  async function nextStep() {
    setError(null);
    try {
      if (step === 1) {
        const parsed = companyStepSchema.parse(wizard.company);
        const next = { ...wizard, step: 2, company: parsed };
        await persist(next, { company_profile_done: true });
        setStep(2);
        return;
      }
      if (step === 2) {
        const parsed = salesProcessStepSchema.parse(wizard.salesProcess);
        const next = {
          ...wizard,
          step: 3,
          salesProcess: parsed,
        };
        await persist(next, { sales_process_done: true });
        setStep(3);
        return;
      }
      if (step === 3) {
        const next = { ...wizard, step: 4 };
        await persist(next, { team_invites_done: true });
        setStep(4);
        return;
      }
      if (step === 4) {
        const next = { ...wizard, step: 5, callsSetup: wizard.callsSetup ?? { method: "demo" } };
        await persist(next, { calls_setup_done: true });
        setStep(5);
        return;
      }
      if (step === 5) {
        const parsed = aiConfigStepSchema.parse(wizard.ai);
        const next = { ...wizard, step: 6, ai: parsed };
        await persist(next, { ai_config_done: true });
        setStep(6);
        return;
      }
      if (step === 6) {
        const next = { ...wizard, step: 7, crm: wizard.crm ?? { provider: "skip" } };
        await persist(next, { crm_setup_done: true });
        setStep(7);
        return;
      }
      if (step === 7) {
        setBusy(true);
        await persist({ ...wizard, step: 7 }, { sample_call_done: true });
        await completeOnboarding();
        await refresh();
        void navigate({ to: "/ceo", replace: true });
      }
    } catch (err) {
      if (err && typeof err === "object" && "issues" in err) {
        setError("Please complete the required fields.");
      } else if (err instanceof Error && !error) {
        setError(err.message);
      }
    } finally {
      setBusy(false);
    }
  }

  async function addInvite() {
    setError(null);
    setInviteLink(null);
    if (!inviteEmail.includes("@")) {
      setError("Enter a valid email.");
      return;
    }
    setBusy(true);
    try {
      const { token } = await createInvitation({ email: inviteEmail, role: inviteRole });
      const link = `${window.location.origin}/invite/${token}`;
      setInviteLink(link);
      const invite: TeamInvite = { email: inviteEmail, role: inviteRole };
      setWizard((w) => ({ ...w, invites: [...(w.invites ?? []), invite] }));
      setInviteEmail("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create invitation.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <ArtemisMark />
        <h1 className="mt-6 text-2xl font-semibold tracking-tight">Set up your workspace</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Seven steps to configure company, team, AI coaching, and integrations. Progress is saved to your
          company account.
        </p>

        <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-secondary">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Step {step} of {STEPS.length}: {STEPS[step - 1]}
        </p>

        <Panel className="mt-6 p-6">
          {step === 1 && wizard.company && (
            <div className="grid gap-3">
              {(
                [
                  ["name", "Company name"],
                  ["industry", "Industry"],
                  ["country", "Country"],
                  ["timezone", "Time zone"],
                  ["companySize", "Company size"],
                  ["primaryUseCase", "Primary use case"],
                  ["primaryLanguage", "Primary language"],
                ] as const
              ).map(([key, label]) => (
                <label key={key} className="grid gap-1 text-sm">
                  <span className="text-muted-foreground">{label}</span>
                  <input
                    className="rounded-lg border border-border bg-background px-3 py-2"
                    value={String(wizard.company?.[key] ?? "")}
                    onChange={(e) =>
                      setWizard((w) => ({
                        ...w,
                        company: { ...w.company!, [key]: e.target.value },
                      }))
                    }
                  />
                </label>
              ))}
              <label className="grid gap-1 text-sm">
                <span className="text-muted-foreground">Expected agent count</span>
                <input
                  type="number"
                  min={1}
                  className="rounded-lg border border-border bg-background px-3 py-2"
                  value={wizard.company.expectedAgentCount}
                  onChange={(e) =>
                    setWizard((w) => ({
                      ...w,
                      company: { ...w.company!, expectedAgentCount: Number(e.target.value) },
                    }))
                  }
                />
              </label>
            </div>
          )}

          {step === 2 && wizard.salesProcess && (
            <div className="grid gap-3">
              <label className="grid gap-1 text-sm">
                <span className="text-muted-foreground">Product or service</span>
                <textarea
                  className="min-h-20 rounded-lg border border-border bg-background px-3 py-2"
                  value={wizard.salesProcess.productOrService}
                  onChange={(e) =>
                    setWizard((w) => ({
                      ...w,
                      salesProcess: { ...w.salesProcess!, productOrService: e.target.value },
                    }))
                  }
                />
              </label>
              <label className="grid gap-1 text-sm">
                <span className="text-muted-foreground">Target customer</span>
                <textarea
                  className="min-h-20 rounded-lg border border-border bg-background px-3 py-2"
                  value={wizard.salesProcess.targetCustomer}
                  onChange={(e) =>
                    setWizard((w) => ({
                      ...w,
                      salesProcess: { ...w.salesProcess!, targetCustomer: e.target.value },
                    }))
                  }
                />
              </label>
              <label className="grid gap-1 text-sm">
                <span className="text-muted-foreground">Conversion event</span>
                <input
                  className="rounded-lg border border-border bg-background px-3 py-2"
                  value={wizard.salesProcess.conversionEvent}
                  onChange={(e) =>
                    setWizard((w) => ({
                      ...w,
                      salesProcess: { ...w.salesProcess!, conversionEvent: e.target.value },
                    }))
                  }
                />
              </label>
              <label className="grid gap-1 text-sm">
                <span className="text-muted-foreground">Typical call type</span>
                <select
                  className="rounded-lg border border-border bg-background px-3 py-2"
                  value={wizard.salesProcess.typicalCallType}
                  onChange={(e) =>
                    setWizard((w) => ({
                      ...w,
                      salesProcess: { ...w.salesProcess!, typicalCallType: e.target.value },
                    }))
                  }
                >
                  <option>Outbound sales</option>
                  <option>Inbound support</option>
                  <option>Retention</option>
                  <option>Collections</option>
                  <option>Appointment setting</option>
                </select>
              </label>
            </div>
          )}

          {step === 3 && (
            <div className="grid gap-4">
              <p className="text-sm text-muted-foreground">
                Invite managers and agents. Invitation links are shown once — copy and send them securely.
              </p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  type="email"
                  placeholder="colleague@company.com"
                  className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
                <select
                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as AppRole)}
                >
                  <option value="manager">Manager</option>
                  <option value="rep">Agent</option>
                  <option value="qa">QA</option>
                  <option value="admin">Admin</option>
                  <option value="ceo">Executive</option>
                </select>
                <button
                  type="button"
                  onClick={() => void addInvite()}
                  disabled={busy}
                  className="rounded-lg bg-secondary px-4 py-2 text-sm font-medium"
                >
                  Invite
                </button>
              </div>
              {inviteLink ? (
                <p className="rounded-lg border border-border bg-secondary/40 p-3 text-xs break-all">
                  Invite link: {inviteLink}
                </p>
              ) : null}
              <ul className="space-y-1 text-sm">
                {(wizard.invites ?? []).map((inv) => (
                  <li key={inv.email} className="flex items-center gap-2 text-muted-foreground">
                    <Check className="size-3.5 text-primary" />
                    {inv.email} · {inv.role}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-muted-foreground">You can skip and invite later from Settings.</p>
            </div>
          )}

          {step === 4 && (
            <div className="grid gap-3">
              <p className="text-sm text-muted-foreground">
                Call ingestion requires a telephony connection or upload. Choose how you want to start.
              </p>
              {(
                [
                  ["demo", "Use demo data", "Explore the product with labelled demo calls. Not production metrics."],
                  ["upload", "Upload sample call", "Available in Phase 2 — call upload pipeline."],
                  ["telephony", "Connect telephony", "Twilio / Vonage / Aircall — unavailable until configured."],
                  ["voip", "Connect VoIP", "Unavailable until a provider is configured."],
                ] as const
              ).map(([method, title, desc]) => (
                <button
                  key={method}
                  type="button"
                  onClick={() =>
                    setWizard((w) => ({
                      ...w,
                      callsSetup: {
                        method,
                        note:
                          method === "upload" || method === "telephony" || method === "voip"
                            ? "Integration not configured yet"
                            : undefined,
                      },
                    }))
                  }
                  className={`rounded-xl border px-4 py-3 text-left ${
                    wizard.callsSetup?.method === method
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-secondary/40"
                  }`}
                >
                  <p className="text-sm font-medium">{title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
                </button>
              ))}
            </div>
          )}

          {step === 5 && wizard.ai && (
            <div className="grid gap-3">
              {(
                [
                  ["coachingTone", "Coaching tone", ["supportive", "direct", "strict"]],
                  ["scoringStrictness", "Scoring strictness", ["lenient", "balanced", "strict"]],
                  ["complianceSensitivity", "Compliance sensitivity", ["low", "standard", "high"]],
                ] as const
              ).map(([key, label, options]) => (
                <label key={key} className="grid gap-1 text-sm">
                  <span className="text-muted-foreground">{label}</span>
                  <select
                    className="rounded-lg border border-border bg-background px-3 py-2"
                    value={String(wizard.ai?.[key])}
                    onChange={(e) =>
                      setWizard((w) => ({
                        ...w,
                        ai: { ...w.ai!, [key]: e.target.value },
                      }))
                    }
                  >
                    {options.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={wizard.ai.autoCreateCoachingTasks}
                  onChange={(e) =>
                    setWizard((w) => ({
                      ...w,
                      ai: { ...w.ai!, autoCreateCoachingTasks: e.target.checked },
                    }))
                  }
                />
                Auto-create coaching tasks after analysis
              </label>
            </div>
          )}

          {step === 6 && (
            <div className="grid gap-3">
              <p className="text-sm text-muted-foreground">
                CRM sync is unavailable until credentials are configured. You can skip and connect later.
              </p>
              {(
                [
                  ["hubspot", "HubSpot"],
                  ["salesforce", "Salesforce"],
                  ["zoho", "Zoho"],
                  ["pipedrive", "Pipedrive"],
                  ["webhook", "Webhook / API"],
                  ["skip", "Skip for now"],
                ] as const
              ).map(([provider, label]) => (
                <button
                  key={provider}
                  type="button"
                  onClick={() => setWizard((w) => ({ ...w, crm: { provider } }))}
                  className={`rounded-xl border px-4 py-3 text-left text-sm ${
                    wizard.crm?.provider === provider
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-secondary/40"
                  }`}
                >
                  {label}
                  {provider !== "skip" ? (
                    <span className="mt-1 block text-xs text-muted-foreground">
                      Unavailable until integration is configured
                    </span>
                  ) : null}
                </button>
              ))}
            </div>
          )}

          {step === 7 && (
            <div className="space-y-3 text-sm">
              <p className="text-muted-foreground">
                Sample call transcription and AI analysis run in Phase 2. For now, completing onboarding unlocks
                your workspace with demo data clearly labelled.
              </p>
              <div className="rounded-xl border border-border bg-secondary/30 p-4">
                <p className="font-medium">What happens next</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
                  <li>Company settings and AI preferences are saved</li>
                  <li>Default sales + QA scorecards are ready</li>
                  <li>Call upload and analysis unlock in Phase 2</li>
                </ul>
              </div>
            </div>
          )}

          {error ? <p className="mt-4 text-sm text-red-500">{error}</p> : null}

          <div className="mt-6 flex items-center justify-between gap-3">
            <button
              type="button"
              disabled={step === 1 || busy}
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground disabled:opacity-40"
            >
              <ArrowLeft className="size-4" />
              Back
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => void nextStep()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60"
            >
              {busy ? <Loader2 className="size-4 animate-spin" /> : null}
              {step === 7 ? "Finish setup" : "Continue"}
              {step !== 7 ? <ArrowRight className="size-4" /> : null}
            </button>
          </div>
        </Panel>
      </div>
    </main>
  );
}
