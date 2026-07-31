import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useSession } from "@/components/app/session";
import { getVisibleCoaching, userById } from "@/lib/demo/queries";
import { createCoaching, updateCoaching } from "@/lib/demo/operations";
import { recordAudit } from "@/lib/security/audit";
import type { CoachingItem, CoachingItemStatus } from "@/lib/demo/types";
import { users } from "@/lib/demo/seed";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Chip, Meter } from "@/components/artemis/primitives";
import { chartTooltip } from "@/components/artemis/chart-bits";
import { toast } from "sonner";

const STATUS_LABEL: Record<CoachingItemStatus, string> = {
  suggested: "Suggested",
  assigned: "Assigned",
  in_progress: "In progress",
  completed: "Completed",
  dismissed: "Dismissed",
};

export function CoachingPage() {
  const { access, allowed } = useSession();
  const [, tick] = useState(0);
  const refresh = () => tick((n) => n + 1);

  let items: CoachingItem[] = [];
  try {
    items = getVisibleCoaching(access);
  } catch {
    return <Forbidden />;
  }

  const isManager = allowed("coaching:team") || allowed("coaching:org");
  const priorities = items.filter((i) =>
    ["suggested", "assigned", "in_progress"].includes(i.status),
  );
  const assigned = items.filter((i) => i.status === "assigned" || i.status === "in_progress");
  const completed = items.filter((i) => i.status === "completed");
  const suggested = items.filter((i) => i.status === "suggested");
  const plans = useMemo(() => {
    const map = new Map<string, CoachingItem[]>();
    for (const item of items.filter((i) => i.status !== "dismissed")) {
      const list = map.get(item.planId) ?? [];
      list.push(item);
      map.set(item.planId, list);
    }
    return [...map.entries()];
  }, [items]);

  const trend = [
    { week: "W1", completion: 42, scoreLift: 2 },
    { week: "W2", completion: 51, scoreLift: 4 },
    { week: "W3", completion: 63, scoreLift: 7 },
    { week: "W4", completion: 74, scoreLift: 11 },
  ];

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Coaching</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isManager
              ? "Prioritise coaching by impact, assign work, and track whether behaviour improves."
              : "Your development plan — why each item exists, what to practise, and how you are progressing."}
          </p>
        </div>
        {isManager ? (
          <AssignForm
            onAssign={(payload) => {
              createCoaching(access.organisationId, payload);
              recordAudit({
                organisationId: access.organisationId,
                userId: access.user.id,
                action: "coaching.assign",
                resource: payload.userId,
                metadata: { skill: payload.skill },
              });
              toast.success("Coaching assigned");
              refresh();
            }}
            managerId={access.user.id}
          />
        ) : null}
      </div>

      <Section title="Coaching priorities" lede="Highest-impact open items in your scope.">
        <div className="space-y-3">
          {priorities.length === 0 ? (
            <Empty text="No open coaching priorities." />
          ) : (
            priorities.map((item) => (
              <CoachingCard
                key={item.id}
                item={item}
                isManager={isManager}
                onChange={(patch) => {
                  updateCoaching(access.organisationId, item.id, patch);
                  toast.success("Coaching updated");
                  refresh();
                }}
              />
            ))
          )}
        </div>
      </Section>

      <Section title="Personal development plans" lede="Grouped coaching plans per representative.">
        <div className="grid gap-3 md:grid-cols-2">
          {plans.map(([planId, planItems]) => {
            const owner = userById(planItems[0]!.userId);
            const avgProgress = Math.round(
              planItems.reduce((s, i) => s + i.progress, 0) / planItems.length,
            );
            return (
              <div key={planId} className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-medium">{owner?.name ?? planId}</h3>
                  <Chip tone="artemis">{planItems.length} items</Chip>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">Plan progress</p>
                <Meter value={avgProgress} />
                <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                  {planItems.map((i) => (
                    <li key={i.id}>
                      {i.skill} · {STATUS_LABEL[i.status]}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </Section>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Section title="Assigned coaching" lede="Actively owned items.">
          {assigned.length === 0 ? (
            <Empty text="Nothing assigned right now." />
          ) : (
            <ul className="space-y-2 text-sm">
              {assigned.map((i) => (
                <li key={i.id} className="rounded-lg border border-border px-3 py-2">
                  {i.skill} → {userById(i.userId)?.name} · due {i.dueDate}
                </li>
              ))}
            </ul>
          )}
        </Section>
        <Section title="Suggested" lede="Artemis recommendations awaiting assignment.">
          {suggested.length === 0 ? (
            <Empty text="No suggestions pending." />
          ) : (
            <ul className="space-y-2 text-sm">
              {suggested.map((i) => (
                <li key={i.id} className="rounded-lg border border-border px-3 py-2">
                  {i.skill} · {userById(i.userId)?.name}
                  {isManager ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="ml-2"
                      onClick={() => {
                        updateCoaching(access.organisationId, i.id, {
                          status: "assigned",
                          progress: Math.max(i.progress, 5),
                        });
                        toast.success("Suggestion assigned");
                        refresh();
                      }}
                    >
                      Assign
                    </Button>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </Section>
      </div>

      <Section title="Completed coaching" lede="Includes whether behaviour improved afterward.">
        {completed.length === 0 ? (
          <Empty text="No completed items yet." />
        ) : (
          <div className="space-y-2">
            {completed.map((i) => (
              <div key={i.id} className="rounded-xl border border-border bg-card px-4 py-3 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium">{i.skill}</span>
                  <Chip tone={i.behaviourImproved ? "good" : "neutral"}>
                    {i.behaviourImproved === true
                      ? "Behaviour improved"
                      : i.behaviourImproved === false
                        ? "No lift yet"
                        : "Impact pending"}
                  </Chip>
                </div>
                <p className="mt-1 text-muted-foreground">
                  {userById(i.userId)?.name} · completed {i.completedAt}
                </p>
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section title="Improvement trends" lede="Demo cohort: coaching completion vs score lift.">
        <div className="h-56 rounded-xl border border-border bg-card p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trend}>
              <XAxis dataKey="week" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip {...chartTooltip} />
              <Line
                type="monotone"
                dataKey="completion"
                name="Completion %"
                stroke="var(--primary)"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="scoreLift"
                name="Score lift"
                stroke="var(--cyan)"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Section>

      {isManager ? (
        <Section
          title="Manager coaching queue"
          lede="Suggested + assigned items ranked for your desk. Supportive coaching — not a scoreboard punishment."
        >
          <div className="space-y-3">
            {[...suggested, ...assigned]
              .sort(
                (a, b) => Number(b.impactEstimate === "High") - Number(a.impactEstimate === "High"),
              )
              .map((item) => (
                <CoachingCard
                  key={`q-${item.id}`}
                  item={item}
                  isManager
                  onChange={(patch) => {
                    updateCoaching(access.organisationId, item.id, patch);
                    toast.success("Queue updated");
                    refresh();
                  }}
                />
              ))}
          </div>
        </Section>
      ) : null}
    </div>
  );
}

function CoachingCard({
  item,
  isManager,
  onChange,
}: {
  item: CoachingItem;
  isManager: boolean;
  onChange: (patch: Partial<CoachingItem>) => void;
}) {
  const [note, setNote] = useState(item.notes);
  return (
    <article className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold">{item.skill}</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {userById(item.userId)?.name} · owner {userById(item.managerId)?.name} · due{" "}
            {item.dueDate}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Chip tone={item.impactEstimate === "High" ? "warn" : "artemis"}>
            {item.impactEstimate} impact
          </Chip>
          <Chip tone="neutral">{STATUS_LABEL[item.status]}</Chip>
        </div>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">
        <span className="font-medium text-foreground">Evidence: </span>
        {item.evidence}
      </p>
      <p className="mt-2 text-sm">{item.recommendation}</p>
      <p className="mt-2 text-sm text-muted-foreground">
        <span className="font-medium text-foreground">Suggested exercise: </span>
        {item.suggestedExercise}
      </p>
      <div className="mt-3">
        <div className="mb-1 flex justify-between text-xs">
          <span>Progress</span>
          <span className="font-mono tabular-nums">{item.progress}%</span>
        </div>
        <Meter value={item.progress} />
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {item.relatedCallIds.map((id) => (
          <Button key={id} size="sm" variant="outline" asChild>
            <Link to="/app/calls/$callId" params={{ callId: id }}>
              {id}
            </Link>
          </Button>
        ))}
      </div>
      {isManager ? (
        <div className="mt-4 grid gap-2 border-t border-border pt-3 sm:grid-cols-[1fr_auto_auto]">
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            placeholder="Add manager notes…"
          />
          <Input
            type="date"
            className="h-9"
            value={item.dueDate}
            onChange={(e) => onChange({ dueDate: e.target.value })}
            aria-label="Due date"
          />
          <Select
            value={item.status}
            onValueChange={(v) => onChange({ status: v as CoachingItemStatus, notes: note })}
          >
            <SelectTrigger className="h-9" aria-label="Status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(STATUS_LABEL) as CoachingItemStatus[]).map((s) => (
                <SelectItem key={s} value={s}>
                  {STATUS_LABEL[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onChange({ notes: note, progress: Math.min(100, item.progress + 15) })}
          >
            Save notes / +15% progress
          </Button>
          {item.status === "completed" ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onChange({ behaviourImproved: true })}
            >
              Mark behaviour improved
            </Button>
          ) : null}
        </div>
      ) : (
        <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-3">
          <Button
            size="sm"
            onClick={() =>
              onChange({
                status: item.status === "assigned" ? "in_progress" : item.status,
                progress: Math.min(100, item.progress + 20),
              })
            }
          >
            Log practice progress
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              onChange({ status: "completed", progress: 100, behaviourImproved: null })
            }
          >
            Mark complete
          </Button>
        </div>
      )}
    </article>
  );
}

function AssignForm({
  onAssign,
  managerId,
}: {
  managerId: string;
  onAssign: (item: Omit<CoachingItem, "id" | "organisationId">) => void;
}) {
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState("u-03");
  const [skill, setSkill] = useState("Value before price");
  const [dueDate, setDueDate] = useState("2026-08-10");
  if (!open) {
    return <Button onClick={() => setOpen(true)}>Assign coaching</Button>;
  }
  return (
    <div className="w-full max-w-md rounded-xl border border-border bg-card p-4">
      <p className="text-sm font-medium">Assign coaching</p>
      <div className="mt-3 space-y-2">
        <Select value={userId} onValueChange={setUserId}>
          <SelectTrigger aria-label="Representative">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {users
              .filter((u) => u.role === "representative" || u.role === "manager")
              .map((u) => (
                <SelectItem key={u.id} value={u.id}>
                  {u.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        <Input value={skill} onChange={(e) => setSkill(e.target.value)} placeholder="Skill" />
        <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        <div className="flex gap-2">
          <Button
            onClick={() => {
              onAssign({
                userId,
                managerId,
                skill,
                evidence: "Assigned manually from manager queue.",
                recommendation: `Focus coaching on ${skill}.`,
                suggestedExercise: `Practice session for ${skill}.`,
                status: "assigned",
                dueDate,
                completedAt: null,
                impactEstimate: "Medium",
                relatedCallIds: [],
                progress: 5,
                notes: "",
                behaviourImproved: null,
                planId: `plan-${userId}`,
              });
              setOpen(false);
            }}
          >
            Assign
          </Button>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  lede,
  children,
}: {
  title: string;
  lede?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-8">
      <h2 className="text-sm font-semibold">{title}</h2>
      {lede ? <p className="mt-1 text-xs text-muted-foreground">{lede}</p> : null}
      <div className="mt-3">{children}</div>
    </section>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="text-sm text-muted-foreground">{text}</p>;
}

function Forbidden() {
  return (
    <div className="rounded-xl border border-dashed border-border px-6 py-16 text-center">
      <p className="font-medium">Coaching unavailable</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Your role cannot access coaching in this scope.
      </p>
    </div>
  );
}
