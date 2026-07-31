import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { CheckCircle2, Loader2 } from "lucide-react";
import {
  ONBOARDING_STEPS,
  clearOnboarding,
  defaultOnboardingState,
  loadOnboarding,
  saveOnboarding,
  validateOnboardingStep,
  type OnboardingState,
} from "@/lib/onboarding/state";
import { analysisByCallId, buildTranscript, calls, DEMO_LABEL } from "@/lib/demo/seed";
import { track } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Meter, ScoreRing } from "@/components/artemis/primitives";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const INDUSTRIES = [
  "Forex / CFDs",
  "Financial services",
  "Call centres",
  "Insurance",
  "Real estate",
  "Other",
];

export function OnboardingWizard() {
  const [state, setState] = useState<OnboardingState>(() => defaultOnboardingState());
  const [hydrated, setHydrated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loaded = loadOnboarding();
    setState(loaded);
    setHydrated(true);
    if (!loaded.completed) track("onboarding_started");
  }, []);

  function persist(next: OnboardingState) {
    setState(saveOnboarding(next));
  }

  function patch(partial: Partial<OnboardingState>) {
    persist({ ...state, ...partial });
  }

  async function goNext() {
    setError(null);
    const validation = validateOnboardingStep(state, state.step);
    if (validation) {
      setError(validation);
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 350));
    setLoading(false);

    if (state.step === 7) {
      track("first_call_analysed", { callId: state.firstCallId ?? undefined });
    }

    if (state.step >= ONBOARDING_STEPS.length - 1) {
      persist({ ...state, completed: true });
      track("onboarding_completed");
      toast.success("Organisation onboarding complete");
      return;
    }
    persist({ ...state, step: state.step + 1 });
  }

  function goBack() {
    setError(null);
    if (state.step > 0) persist({ ...state, step: state.step - 1 });
  }

  function skip() {
    if (!ONBOARDING_STEPS[state.step]?.optional) return;
    setError(null);
    persist({ ...state, step: state.step + 1 });
  }

  if (!hydrated) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-muted-foreground">
        <Loader2 className="mr-2 size-4 animate-spin" /> Loading onboarding…
      </div>
    );
  }

  if (state.completed) {
    return <CompletionSummary state={state} onRestart={() => persist(defaultOnboardingState())} />;
  }

  const stepMeta = ONBOARDING_STEPS[state.step]!;
  const progress = ((state.step + 1) / ONBOARDING_STEPS.length) * 100;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs text-muted-foreground">Organisation onboarding</p>
          <h1 className="text-2xl font-semibold tracking-tight">{stepMeta.title}</h1>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            saveOnboarding(state);
            toast.success("Progress saved — you can resume later");
          }}
        >
          Save and resume later
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">{DEMO_LABEL}</p>

      <div className="mt-4">
        <div className="mb-1 flex justify-between text-xs text-muted-foreground">
          <span>
            Step {state.step + 1} of {ONBOARDING_STEPS.length}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Meter value={progress} />
        <ol className="mt-3 flex flex-wrap gap-1">
          {ONBOARDING_STEPS.map((s, i) => (
            <li
              key={s.id}
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px]",
                i === state.step
                  ? "bg-primary/15 text-primary"
                  : i < state.step
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground",
              )}
            >
              {s.title}
              {s.optional ? " · optional" : ""}
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-6 rounded-xl border border-border bg-card p-5">
        <StepBody state={state} patch={patch} />
        {error ? (
          <p className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        ) : null}
        <div className="mt-6 flex flex-wrap gap-2">
          <Button variant="outline" onClick={goBack} disabled={state.step === 0 || loading}>
            Back
          </Button>
          {stepMeta.optional ? (
            <Button variant="ghost" onClick={skip} disabled={loading}>
              Skip
            </Button>
          ) : null}
          <Button className="ml-auto" onClick={() => void goNext()} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" /> Working…
              </>
            ) : state.step === ONBOARDING_STEPS.length - 1 ? (
              "Finish"
            ) : (
              "Next"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

function StepBody({
  state,
  patch,
}: {
  state: OnboardingState;
  patch: (p: Partial<OnboardingState>) => void;
}) {
  switch (state.step) {
    case 0:
      return (
        <Field label="Organisation name">
          <Input
            value={state.organisationName}
            onChange={(e) => patch({ organisationName: e.target.value })}
            placeholder="Apex Markets"
          />
        </Field>
      );
    case 1:
      return (
        <Field label="Industry">
          <Select value={state.industry} onValueChange={(v) => patch({ industry: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Select industry" />
            </SelectTrigger>
            <SelectContent>
              {INDUSTRIES.map((i) => (
                <SelectItem key={i} value={i}>
                  {i}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      );
    case 2:
      return (
        <div className="space-y-4">
          <div>
            <p className="mb-2 text-sm font-medium">Teams</p>
            {state.teams.map((t, idx) => (
              <div key={idx} className="mb-2 grid gap-2 sm:grid-cols-2">
                <Input
                  placeholder="Team name"
                  value={t.name}
                  onChange={(e) => {
                    const teams = [...state.teams];
                    teams[idx] = { ...t, name: e.target.value };
                    patch({ teams });
                  }}
                />
                <Input
                  placeholder="Office"
                  value={t.office}
                  onChange={(e) => {
                    const teams = [...state.teams];
                    teams[idx] = { ...t, office: e.target.value };
                    patch({ teams });
                  }}
                />
              </div>
            ))}
            <Button
              size="sm"
              variant="outline"
              onClick={() => patch({ teams: [...state.teams, { name: "", office: "" }] })}
            >
              Add team
            </Button>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">Users</p>
            {state.users.map((u, idx) => (
              <div key={idx} className="mb-2 grid gap-2 sm:grid-cols-3">
                <Input
                  placeholder="Name"
                  value={u.name}
                  onChange={(e) => {
                    const users = [...state.users];
                    users[idx] = { ...u, name: e.target.value };
                    patch({ users });
                  }}
                />
                <Input
                  placeholder="Email"
                  value={u.email}
                  onChange={(e) => {
                    const users = [...state.users];
                    users[idx] = { ...u, email: e.target.value };
                    patch({ users });
                  }}
                />
                <Select
                  value={u.role}
                  onValueChange={(v) => {
                    const users = [...state.users];
                    users[idx] = { ...u, role: v };
                    patch({ users });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="representative">Representative</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))}
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                patch({
                  users: [...state.users, { name: "", email: "", role: "representative" }],
                })
              }
            >
              Add user
            </Button>
          </div>
        </div>
      );
    case 3:
      return (
        <Field label="Call source">
          <Select value={state.callSource} onValueChange={(v) => patch({ callSource: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Select or skip" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="upload">Upload recordings</SelectItem>
              <SelectItem value="aircall">Aircall (in development)</SelectItem>
              <SelectItem value="zoom">Zoom (in development)</SelectItem>
              <SelectItem value="twilio">Twilio (planned)</SelectItem>
            </SelectContent>
          </Select>
          <p className="mt-2 text-xs text-muted-foreground">
            Optional — you can connect later in Integrations.
          </p>
        </Field>
      );
    case 4:
      return (
        <Field label="CRM">
          <Select value={state.crm} onValueChange={(v) => patch({ crm: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Select or skip" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hubspot">HubSpot (in development)</SelectItem>
              <SelectItem value="salesforce">Salesforce (in development)</SelectItem>
              <SelectItem value="pipedrive">Pipedrive (planned)</SelectItem>
              <SelectItem value="none">None yet</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      );
    case 5:
      return (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Upload a sales playbook or script. In this demo, selecting a file marks the step
            complete without uploading to a server.
          </p>
          <Input
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            onChange={(e) => {
              const file = e.target.files?.[0];
              patch({
                playbookUploaded: Boolean(file),
                playbookName: file?.name ?? "",
              });
            }}
          />
          {state.playbookName ? (
            <p className="text-sm">Selected: {state.playbookName}</p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Optional — skip if you will use Artemis playbooks later.
            </p>
          )}
        </div>
      );
    case 6:
      return (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Enable scorecard dimensions for first analyses.
          </p>
          {(Object.keys(state.scorecard) as (keyof OnboardingState["scorecard"])[]).map((key) => (
            <label key={key} className="flex items-center gap-2 text-sm capitalize">
              <input
                type="checkbox"
                checked={state.scorecard[key]}
                onChange={(e) =>
                  patch({ scorecard: { ...state.scorecard, [key]: e.target.checked } })
                }
                className="accent-[var(--primary)]"
              />
              {key.replace(/([A-Z])/g, " $1")}
            </label>
          ))}
        </div>
      );
    case 7:
      return <FirstCallStep state={state} patch={patch} />;
    case 8:
      return <FirstInsightStep state={state} />;
    default:
      return null;
  }
}

function FirstCallStep({
  state,
  patch,
}: {
  state: OnboardingState;
  patch: (p: Partial<OnboardingState>) => void;
}) {
  const demoCalls = useMemo(
    () => calls.filter((c) => c.analysisStatus === "Analyzed").slice(0, 6),
    [],
  );
  const call = demoCalls.find((c) => c.id === state.firstCallId) ?? null;
  const analysis = call ? analysisByCallId[call.id] : null;
  const transcript = call ? buildTranscript(call).slice(0, 4) : [];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={state.firstCallMode === "demo" ? "default" : "outline"}
          onClick={() => patch({ firstCallMode: "demo", firstCallId: demoCalls[0]?.id ?? null })}
        >
          Select a demo call
        </Button>
        <Button
          size="sm"
          variant={state.firstCallMode === "upload" ? "default" : "outline"}
          onClick={() => {
            patch({ firstCallMode: "upload" });
            toast.message("Upload is simulated in demo — pick a demo call to continue.");
          }}
        >
          Upload one call
        </Button>
      </div>
      {state.firstCallMode === "demo" ? (
        <Select value={state.firstCallId ?? ""} onValueChange={(v) => patch({ firstCallId: v })}>
          <SelectTrigger>
            <SelectValue placeholder="Choose call" />
          </SelectTrigger>
          <SelectContent>
            {demoCalls.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.prospect} · {c.company}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : null}

      {call && analysis ? (
        <div className="space-y-4 rounded-lg border border-border p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-medium">{call.prospect}</p>
              <p className="text-xs text-muted-foreground">{call.company}</p>
            </div>
            <ScoreRing value={analysis.overallScore} size={88} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-muted-foreground">
              Transcript preview
            </p>
            <ul className="mt-2 space-y-2 text-sm">
              {transcript.map((t) => (
                <li key={t.id}>
                  <span className="text-muted-foreground">{t.speakerName}: </span>
                  {t.text}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-muted-foreground">Scores</p>
            <div className="mt-2 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
              <Score label="Discovery" value={analysis.discoveryScore} />
              <Score label="Listening" value={analysis.listeningScore} />
              <Score label="Objections" value={analysis.objectionHandlingScore} />
              <Score label="Closing" value={analysis.closingScore} />
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-muted-foreground">
              Coaching insight
            </p>
            <p className="mt-1 text-sm">{analysis.recommendations[0]}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                toast.success(
                  "Follow-up email draft generated (demo):\nThanks for the conversation — confirming next step…",
                )
              }
            >
              Generate follow-up email
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                toast.message(
                  "CRM update preview: Next step, sentiment, and risk would sync when CRM is connected.",
                )
              }
            >
              Preview CRM update
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function FirstInsightStep({ state }: { state: OnboardingState }) {
  const call = calls.find((c) => c.id === state.firstCallId);
  const analysis = call ? analysisByCallId[call.id] : null;
  return (
    <div className="space-y-3 text-sm">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="size-5 text-success" />
        <p className="font-medium">Your first Artemis insight is ready</p>
      </div>
      <p className="text-muted-foreground">
        {analysis?.recommendations[0] ??
          "Artemis will surface coaching and pipeline signals as soon as calls are analysed."}
      </p>
      {analysis ? (
        <div className="rounded-lg border border-border bg-secondary/20 p-3">
          <p className="text-xs text-muted-foreground">Strength highlighted</p>
          <p className="mt-1">{analysis.strengths[0]?.text}</p>
          <p className="mt-3 text-xs text-muted-foreground">Improvement opportunity</p>
          <p className="mt-1">{analysis.weaknesses[0]?.text}</p>
        </div>
      ) : null}
      <p className="text-xs text-muted-foreground">
        Finish to open the product workspace with your demo organisation context.
      </p>
    </div>
  );
}

function CompletionSummary({
  state,
  onRestart,
}: {
  state: OnboardingState;
  onRestart: () => void;
}) {
  return (
    <div className="mx-auto max-w-xl rounded-xl border border-border bg-card p-6 text-center">
      <CheckCircle2 className="mx-auto size-10 text-success" />
      <h1 className="mt-4 text-2xl font-semibold">You are ready</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {state.organisationName || "Your organisation"} is configured for Artemis demo exploration.
      </p>
      <ul className="mt-6 space-y-2 text-left text-sm">
        <li>Industry: {state.industry || "—"}</li>
        <li>
          Teams:{" "}
          {state.teams
            .filter((t) => t.name)
            .map((t) => t.name)
            .join(", ") || "—"}
        </li>
        <li>Call source: {state.callSource || "Skipped"}</li>
        <li>CRM: {state.crm || "Skipped"}</li>
        <li>First call: {state.firstCallId ?? "—"}</li>
      </ul>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Button asChild>
          <Link to="/app">Open product</Link>
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            clearOnboarding();
            onRestart();
          }}
        >
          Restart onboarding
        </Button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="mb-1.5 block">{label}</Label>
      {children}
    </div>
  );
}

function Score({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-border p-2">
      <p className="text-[10px] text-muted-foreground">{label}</p>
      <p className="font-mono tabular-nums">{value}</p>
    </div>
  );
}
