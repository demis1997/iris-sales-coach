import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useSession } from "@/components/app/session";
import {
  duplicatePlaybook,
  generatePlaybookFromTopCalls,
  listPlaybooks,
  listPlaybookVersions,
  mutatePlaybook,
} from "@/lib/demo/operations";
import { userById } from "@/lib/demo/queries";
import type { Playbook, PlaybookStatus } from "@/lib/demo/types";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/iris/primitives";
import { toast } from "sonner";

export function PlaybooksPage() {
  const { access, allowed } = useSession();
  if (!allowed("playbooks:read")) {
    return <Forbidden />;
  }
  const [, tick] = useState(0);
  const refresh = () => tick((n) => n + 1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const list = listPlaybooks(access.organisationId).filter((p) => {
    if (filter === "all") return true;
    if (filter === "company") return p.scope === "company";
    if (filter === "team") return p.scope === "team";
    if (filter === "ai") return p.scope === "ai_discovered";
    if (filter === "objections") return p.category.toLowerCase().includes("objection");
    if (filter === "discovery") return p.category.toLowerCase().includes("discovery");
    if (filter === "closing") return p.category.toLowerCase().includes("closing");
    if (filter === "compliance") return p.category.toLowerCase().includes("compliance");
    if (filter === "product") return p.category.toLowerCase().includes("product");
    return true;
  });

  const selected = list.find((p) => p.id === selectedId) ?? list[0] ?? null;
  const versions = selected ? listPlaybookVersions(access.organisationId, selected.id) : [];

  const canWrite = allowed("playbooks:write");

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Playbooks</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Company standards, team variants, and AI-discovered practices — with version history.
          </p>
        </div>
        {canWrite ? (
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => {
                const created = generatePlaybookFromTopCalls(access.organisationId);
                setSelectedId(created.id);
                toast.success("Draft playbook generated from top calls");
                refresh();
              }}
            >
              Generate from top-performing calls
            </Button>
            <Button
              onClick={() => {
                toast.message("Create playbook form — use Generate or Duplicate to seed a draft.");
              }}
            >
              Create playbook
            </Button>
          </div>
        ) : null}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {[
          ["all", "All"],
          ["company", "Company"],
          ["team", "Team"],
          ["ai", "AI-discovered"],
          ["objections", "Objection library"],
          ["discovery", "Discovery"],
          ["closing", "Closing"],
          ["compliance", "Compliance"],
          ["product", "Product-specific"],
        ].map(([id, label]) => (
          <Button
            key={id}
            size="sm"
            variant={filter === id ? "default" : "outline"}
            onClick={() => setFilter(id)}
          >
            {label}
          </Button>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-2">
          {list.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelectedId(p.id)}
              className={`w-full rounded-xl border p-4 text-left ${
                selected?.id === p.id ? "border-primary/40 bg-primary/5" : "border-border bg-card"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium">{p.name}</p>
                <Chip
                  tone={p.status === "active" ? "good" : p.status === "draft" ? "warn" : "neutral"}
                >
                  {p.status}
                </Chip>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {p.category} · adoption {p.adoptionScore}% · v{p.version}
              </p>
            </button>
          ))}
        </div>

        {selected ? (
          <PlaybookDetail
            playbook={selected}
            versions={versions}
            canWrite={canWrite}
            onMutate={(patch) => {
              mutatePlaybook(access.organisationId, selected.id, patch);
              toast.success("Playbook updated");
              refresh();
            }}
            onDuplicate={() => {
              const copy = duplicatePlaybook(access.organisationId, selected.id);
              setSelectedId(copy.id);
              toast.success("Playbook duplicated as draft");
              refresh();
            }}
          />
        ) : (
          <p className="text-sm text-muted-foreground">Select a playbook.</p>
        )}
      </div>
    </div>
  );
}

function PlaybookDetail({
  playbook,
  versions,
  canWrite,
  onMutate,
  onDuplicate,
}: {
  playbook: Playbook;
  versions: {
    id: string;
    version: number;
    changedAt: string;
    summary: string;
    changedBy: string;
  }[];
  canWrite: boolean;
  onMutate: (patch: Partial<Playbook>) => void;
  onDuplicate: () => void;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">{playbook.name}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{playbook.purpose}</p>
        </div>
        <Chip tone="iris">{playbook.scope}</Chip>
      </div>

      <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-muted-foreground">Owner</dt>
          <dd>{userById(playbook.ownerId)?.name}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Adoption</dt>
          <dd>{playbook.adoptionScore}%</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Applicable call types</dt>
          <dd>{playbook.applicableCallTypes.join(", ")}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Impact trend</dt>
          <dd className="font-mono tabular-nums">{playbook.impactTrend.join(" → ")}</dd>
        </div>
      </dl>

      <Block title="Required behaviours" items={playbook.requiredBehaviours} />
      <Block title="Recommended phrases" items={playbook.recommendedPhrases} />
      <Block title="Phrases to avoid" items={playbook.phrasesToAvoid} />

      <h3 className="mt-4 text-sm font-semibold">Example call moments</h3>
      <div className="mt-2 flex flex-wrap gap-2">
        {playbook.exampleCallIds.map((id) => (
          <Button key={id} size="sm" variant="outline" asChild>
            <Link to="/app/calls/$callId" params={{ callId: id }}>
              {id}
            </Link>
          </Button>
        ))}
      </div>

      <h3 className="mt-5 text-sm font-semibold">Version history</h3>
      <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
        {versions.map((v) => (
          <li key={v.id}>
            v{v.version} · {v.changedAt} · {userById(v.changedBy)?.name} — {v.summary}
          </li>
        ))}
      </ul>

      {canWrite ? (
        <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-4">
          <Button size="sm" variant="outline" onClick={onDuplicate}>
            Duplicate
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onMutate({ teamId: playbook.teamId ?? "team-forex", scope: "team" })}
          >
            Assign to team
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              onMutate({
                status: playbook.status === "archived" ? "active" : "archived",
              })
            }
          >
            {playbook.status === "archived" ? "Reactivate" : "Archive"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              toast.message(`Comparing v${playbook.version} with prior versions (demo).`)
            }
          >
            Compare versions
          </Button>
          {playbook.status === "draft" ? (
            <Button size="sm" onClick={() => onMutate({ status: "active" as PlaybookStatus })}>
              Activate
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function Block({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mt-4">
      <h3 className="text-sm font-semibold">{title}</h3>
      <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-muted-foreground">
        {items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </div>
  );
}

function Forbidden() {
  return (
    <div className="rounded-xl border border-dashed border-border px-6 py-16 text-center">
      <p className="font-medium">Playbooks unavailable</p>
    </div>
  );
}
