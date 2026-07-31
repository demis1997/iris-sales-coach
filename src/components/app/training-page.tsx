import { useState } from "react";
import { useSession } from "@/components/app/session";
import {
  createCoaching,
  listRoleplays,
  listTrainingAssignments,
  listTrainingModules,
  saveRoleplay,
  updateTrainingAssignment,
} from "@/lib/demo/operations";
import { userById } from "@/lib/demo/queries";
import type { RoleplaySession } from "@/lib/demo/types";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/iris/primitives";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const SCENARIOS = [
  "Pricing objection",
  "Lack of trust",
  "Competitor comparison",
  "Need to think about it",
  "Not interested",
  "Compliance concern",
  "Decision-maker unavailable",
  "Follow-up after no response",
];

const PERSONAS = [
  "Cost-sensitive desk head",
  "Skeptical compliance lead",
  "Busy economic buyer",
  "Curious champion",
];

const OBJECTIONS = [
  "Your spreads are higher",
  "We already have a provider",
  "I need to speak to my partner",
  "Send me something in writing",
];

export function TrainingPage() {
  const { access, allowed } = useSession();
  if (!allowed("training:own") && !allowed("training:team") && !allowed("training:org")) {
    return (
      <div className="rounded-xl border border-dashed border-border px-6 py-16 text-center">
        <p className="font-medium">Training unavailable</p>
      </div>
    );
  }

  const [, tick] = useState(0);
  const refresh = () => tick((n) => n + 1);
  const isManager = allowed("training:team") || allowed("training:org");

  const modules = listTrainingModules(access.organisationId);
  let assignments = listTrainingAssignments(access.organisationId);
  if (!isManager) assignments = assignments.filter((a) => a.userId === access.user.id);

  const completed = assignments.filter((a) => a.status === "completed").length;
  const roleplays = listRoleplays(access.organisationId, isManager ? undefined : access.user.id);

  const [roleplayOpen, setRoleplayOpen] = useState(false);
  const [result, setResult] = useState<RoleplaySession | null>(null);

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Training</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Lessons, assessments, onboarding paths, and AI roleplay tied to real weaknesses.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Assigned" value={String(assignments.length)} />
        <Metric label="Completed" value={String(completed)} />
        <Metric
          label="Team completion"
          value={`${assignments.length ? Math.round((completed / assignments.length) * 100) : 0}%`}
        />
        <Metric label="Roleplay sessions" value={String(roleplays.length)} />
      </div>

      <section className="mt-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-semibold">Assigned lessons</h2>
          <Button size="sm" onClick={() => setRoleplayOpen(true)}>
            Start AI roleplay
          </Button>
        </div>
        <div className="mt-3 space-y-2">
          {assignments.map((a) => {
            const mod = modules.find((m) => m.id === a.moduleId);
            return (
              <div
                key={a.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4"
              >
                <div>
                  <p className="font-medium">{mod?.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {mod?.skill} · {mod?.difficulty} · {mod?.estimatedMinutes} min · due {a.dueDate}{" "}
                    · assigned by {userById(a.assignedBy)?.name}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Chip tone={a.status === "completed" ? "good" : "iris"}>
                    {a.status}
                    {a.score != null ? ` · ${a.score}` : ""}
                  </Chip>
                  {a.status !== "completed" ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        updateTrainingAssignment(access.organisationId, a.id, {
                          status: "completed",
                          score: 84 + Math.floor(Math.random() * 10),
                          completedAt: new Date().toISOString().slice(0, 10),
                        });
                        toast.success("Lesson marked complete");
                        refresh();
                      }}
                    >
                      Complete
                    </Button>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold">New-hire learning path</h2>
        <ol className="mt-3 space-y-2 border-l border-border pl-4 text-sm">
          {modules
            .filter((m) => m.type === "onboarding" || m.difficulty === "Beginner")
            .map((m, i) => (
              <li key={m.id}>
                <span className="font-medium">
                  {i + 1}. {m.title}
                </span>
                <span className="text-muted-foreground">
                  {" "}
                  — {m.estimatedMinutes} min · {m.skill}
                </span>
              </li>
            ))}
        </ol>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold">Internal milestones</h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-3">
          {[
            ["First 10 analysed calls", "On track"],
            ["Discovery score ≥ 80", "In progress"],
            ["Compliance checklist certified", "Available"],
          ].map(([t, s]) => (
            <li key={t} className="rounded-xl border border-border bg-card p-4 text-sm">
              <p className="font-medium">{t}</p>
              <p className="mt-1 text-xs text-muted-foreground">{s}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold">Recent roleplay sessions</h2>
        <div className="mt-3 space-y-2">
          {roleplays.length === 0 ? (
            <p className="text-sm text-muted-foreground">No sessions yet — start one above.</p>
          ) : (
            roleplays.map((r) => (
              <button
                key={r.id}
                type="button"
                className="block w-full rounded-xl border border-border bg-card p-4 text-left"
                onClick={() => setResult(r)}
              >
                <p className="font-medium">
                  {r.scenario} · {r.overallScore ?? "—"}/100
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {userById(r.userId)?.name} · {r.difficulty} · {r.mode}
                </p>
              </button>
            ))
          )}
        </div>
      </section>

      {roleplayOpen ? (
        <RoleplaySetup
          userId={access.user.id}
          organisationId={access.organisationId}
          onClose={() => setRoleplayOpen(false)}
          onComplete={(session) => {
            saveRoleplay(session);
            setRoleplayOpen(false);
            setResult(session);
            refresh();
            toast.success("Roleplay complete");
          }}
        />
      ) : null}

      {result ? (
        <RoleplayResult
          session={result}
          onClose={() => setResult(null)}
          onRetry={() => {
            setResult(null);
            setRoleplayOpen(true);
          }}
          onAddCoaching={() => {
            createCoaching(access.organisationId, {
              userId: result.userId,
              managerId: access.user.id,
              skill: result.scenario,
              evidence: `Roleplay ${result.id} scored ${result.overallScore}.`,
              recommendation: result.suggestedResponse,
              suggestedExercise: `Retry ${result.scenario} roleplay at higher difficulty.`,
              status: "assigned",
              dueDate: "2026-08-12",
              completedAt: null,
              impactEstimate: "Medium",
              relatedCallIds: [],
              progress: 5,
              notes: "Added from roleplay feedback",
              behaviourImproved: null,
              planId: `plan-${result.userId}`,
            });
            toast.success("Added to coaching plan");
          }}
        />
      ) : null}
    </div>
  );
}

function RoleplaySetup({
  userId,
  organisationId,
  onClose,
  onComplete,
}: {
  userId: string;
  organisationId: string;
  onClose: () => void;
  onComplete: (session: RoleplaySession) => void;
}) {
  const [step, setStep] = useState(0);
  const [scenario, setScenario] = useState(SCENARIOS[0]!);
  const [persona, setPersona] = useState(PERSONAS[0]!);
  const [difficulty, setDifficulty] = useState<"Beginner" | "Intermediate" | "Advanced">(
    "Intermediate",
  );
  const [objection, setObjection] = useState(OBJECTIONS[0]!);
  const [mode, setMode] = useState<"voice" | "text">("text");
  const [running, setRunning] = useState(false);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl border border-border bg-card p-5 shadow-xl">
        <h2 className="text-lg font-semibold">AI roleplay setup</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Demo flow — responses are deterministic until a live model is connected.
        </p>

        {step === 0 ? (
          <Field label="Scenario">
            <Select value={scenario} onValueChange={setScenario}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SCENARIOS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        ) : null}
        {step === 1 ? (
          <Field label="Prospect persona">
            <Select value={persona} onValueChange={setPersona}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PERSONAS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        ) : null}
        {step === 2 ? (
          <Field label="Difficulty">
            <Select value={difficulty} onValueChange={(v) => setDifficulty(v as typeof difficulty)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["Beginner", "Intermediate", "Advanced"].map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        ) : null}
        {step === 3 ? (
          <Field label="Objection">
            <Select value={objection} onValueChange={setObjection}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {OBJECTIONS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        ) : null}
        {step === 4 ? (
          <Field label="Mode">
            <Select value={mode} onValueChange={(v) => setMode(v as "voice" | "text")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="voice">Voice (demo)</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        ) : null}

        <div className="mt-5 flex justify-between gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <div className="flex gap-2">
            {step > 0 ? (
              <Button variant="outline" onClick={() => setStep((s) => s - 1)}>
                Back
              </Button>
            ) : null}
            {step < 4 ? (
              <Button onClick={() => setStep((s) => s + 1)}>Continue</Button>
            ) : (
              <Button
                disabled={running}
                onClick={() => {
                  setRunning(true);
                  window.setTimeout(() => {
                    const score =
                      difficulty === "Beginner" ? 82 : difficulty === "Advanced" ? 68 : 74;
                    onComplete({
                      id: `rp-${Date.now()}`,
                      organisationId,
                      userId,
                      scenario,
                      persona,
                      difficulty,
                      objection,
                      mode,
                      status: "completed",
                      overallScore: score,
                      strengths: [
                        "Acknowledged the prospect’s concern",
                        "Asked a clarifying question",
                      ],
                      missedOpportunities: [
                        "Could quantify value before re-quoting",
                        "Next step was implied, not booked",
                      ],
                      suggestedResponse: `Acknowledge “${objection}”, ask for current baseline, reframe with evidence, then propose a dated next step.`,
                      createdAt: new Date().toISOString(),
                    });
                    setRunning(false);
                  }, 700);
                }}
              >
                {running ? "Running…" : "Start roleplay"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function RoleplayResult({
  session,
  onClose,
  onRetry,
  onAddCoaching,
}: {
  session: RoleplaySession;
  onClose: () => void;
  onRetry: () => void;
  onAddCoaching: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl border border-border bg-card p-5 shadow-xl">
        <h2 className="text-lg font-semibold">Roleplay feedback</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {session.scenario} · {session.persona} · {session.difficulty}
        </p>
        <p className="mt-4 font-mono text-3xl font-semibold tabular-nums">
          {session.overallScore}/100
        </p>
        <h3 className="mt-4 text-sm font-semibold">Strengths</h3>
        <ul className="mt-1 list-disc pl-4 text-sm text-muted-foreground">
          {session.strengths.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        <h3 className="mt-4 text-sm font-semibold">Missed opportunities</h3>
        <ul className="mt-1 list-disc pl-4 text-sm text-muted-foreground">
          {session.missedOpportunities.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        <h3 className="mt-4 text-sm font-semibold">Suggested response</h3>
        <p className="mt-1 text-sm text-muted-foreground">{session.suggestedResponse}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Button onClick={onRetry}>Retry</Button>
          <Button variant="outline" onClick={onAddCoaching}>
            Add to coaching plan
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="mt-4 block text-sm">
      <span className="text-muted-foreground">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-2 font-mono text-xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}
