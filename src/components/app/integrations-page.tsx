import { useEffect, useState } from "react";
import { useSession } from "@/components/app/session";
import {
  CRM_FIELDS,
  connectDemoIntegration,
  disconnectIntegration,
  getIntegrationRuntime,
  integrationsByCategory,
  saveIntegrationRuntime,
  type IntegrationDef,
  type IntegrationRuntimeState,
  type IntegrationStatus,
} from "@/lib/integrations/catalog";
import { track } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Chip } from "@/components/artemis/primitives";
import { toast } from "sonner";

const STATUS_TONE: Record<IntegrationStatus, "good" | "artemis" | "warn" | "neutral"> = {
  Connected: "good",
  Available: "artemis",
  "Requires configuration": "warn",
  "In development": "neutral",
  Planned: "neutral",
};

export function IntegrationsAppPage() {
  const { allowed } = useSession();
  const [selected, setSelected] = useState<IntegrationDef | null>(null);
  const [runtime, setRuntime] = useState<IntegrationRuntimeState | null>(null);
  const [, tick] = useState(0);

  if (!allowed("integrations:manage")) {
    return (
      <div className="rounded-xl border border-dashed border-border px-6 py-16 text-center">
        <p className="font-medium">Integrations unavailable</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Only organisation administrators can manage integrations. Switch to Admin in the role
          switcher.
        </p>
      </div>
    );
  }

  const groups = integrationsByCategory();

  function open(item: IntegrationDef) {
    track("integration_clicked", { name: item.name, status: item.status, source: "app" });
    setSelected(item);
    setRuntime(getIntegrationRuntime(item.id));
  }

  function refreshRuntime(id: string) {
    setRuntime(getIntegrationRuntime(id));
    tick((n) => n + 1);
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Integrations</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Connect CRM, communication, and automation tools. Statuses are truthful — nothing is marked
        Connected unless configured in this workspace.
      </p>

      <div className="mt-8 space-y-10">
        {[...groups.entries()].map(([category, items]) => (
          <section key={category}>
            <h2 className="text-sm font-semibold tracking-wide uppercase">{category}</h2>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => {
                const state = getIntegrationRuntime(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => open(item)}
                    className="rounded-xl border border-border bg-card p-4 text-left hover:border-primary/35"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium">{item.name}</p>
                      <Chip tone={STATUS_TONE[state.status]}>{state.status}</Chip>
                    </div>
                    <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {selected && runtime ? (
        <IntegrationDrawer
          item={selected}
          runtime={runtime}
          onClose={() => setSelected(null)}
          onChange={(patch) => {
            saveIntegrationRuntime(selected.id, patch);
            refreshRuntime(selected.id);
            toast.success("Integration settings updated");
          }}
          onConnect={() => {
            try {
              connectDemoIntegration(selected.id);
              refreshRuntime(selected.id);
              toast.success(`${selected.name} connected (demo)`);
            } catch (e) {
              toast.error(e instanceof Error ? e.message : "Cannot connect");
            }
          }}
          onDisconnect={() => {
            disconnectIntegration(selected.id);
            refreshRuntime(selected.id);
            toast.message(`${selected.name} disconnected`);
          }}
          onSync={() => {
            if (runtime.status !== "Connected") {
              toast.error("Connect the integration before syncing.");
              return;
            }
            const now = new Date().toISOString();
            saveIntegrationRuntime(selected.id, {
              lastSync: now,
              syncHistory: [
                { at: now, result: "ok" as const, message: "Manual sync (demo)" },
                ...runtime.syncHistory,
              ].slice(0, 10),
            });
            refreshRuntime(selected.id);
            toast.success("Sync completed (demo)");
          }}
        />
      ) : null}
    </div>
  );
}

function IntegrationDrawer({
  item,
  runtime,
  onClose,
  onChange,
  onConnect,
  onDisconnect,
  onSync,
}: {
  item: IntegrationDef;
  runtime: IntegrationRuntimeState;
  onClose: () => void;
  onChange: (patch: Partial<IntegrationRuntimeState>) => void;
  onConnect: () => void;
  onDisconnect: () => void;
  onSync: () => void;
}) {
  const canConnect =
    item.status === "Available" ||
    runtime.status === "Requires configuration" ||
    runtime.status === "Available";

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={onClose}>
      <aside
        className="flex h-full w-full max-w-lg flex-col border-l border-border bg-background shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-label={`${item.name} integration`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 border-b border-border p-4">
          <div>
            <h2 className="text-lg font-semibold">{item.name}</h2>
            <Chip tone={STATUS_TONE[runtime.status]}>{runtime.status}</Chip>
          </div>
          <Button size="sm" variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
        <div className="flex-1 space-y-5 overflow-y-auto p-4 text-sm">
          <p className="text-muted-foreground">{item.description}</p>

          <Block title="Permissions required">
            <ul className="list-disc space-y-1 pl-4 text-muted-foreground">
              {item.permissions.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </Block>

          <Block title="Data synced">
            <ul className="list-disc space-y-1 pl-4 text-muted-foreground">
              {item.dataSynced.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </Block>

          <Block title="Setup steps">
            <ol className="list-decimal space-y-1 pl-4 text-muted-foreground">
              {item.setupSteps.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ol>
          </Block>

          <Block title="Connection status">
            <p>Status: {runtime.status}</p>
            <p className="text-muted-foreground">
              Last sync: {runtime.lastSync ? new Date(runtime.lastSync).toLocaleString() : "Never"}
            </p>
          </Block>

          {item.isCrm ? (
            <Block title="Field mapping (conceptual)">
              <div className="space-y-2">
                {CRM_FIELDS.map((field) => (
                  <label
                    key={field}
                    className="grid grid-cols-[120px_1fr] items-center gap-2 text-xs"
                  >
                    <span className="text-muted-foreground">{field}</span>
                    <Input
                      value={runtime.mapping[field] ?? ""}
                      onChange={(e) =>
                        onChange({ mapping: { ...runtime.mapping, [field]: e.target.value } })
                      }
                      placeholder="CRM field path"
                      className="h-8"
                      disabled={item.status === "Planned" || item.status === "In development"}
                    />
                  </label>
                ))}
              </div>
            </Block>
          ) : null}

          <Block title="Sync history">
            {runtime.syncHistory.length === 0 ? (
              <p className="text-muted-foreground">No sync events yet.</p>
            ) : (
              <ul className="space-y-1 text-xs text-muted-foreground">
                {runtime.syncHistory.map((h) => (
                  <li key={h.at}>
                    {h.at.slice(0, 19)} · {h.result} · {h.message}
                  </li>
                ))}
              </ul>
            )}
          </Block>

          <Block title="Error logs">
            {runtime.errorLogs.length === 0 ? (
              <p className="text-muted-foreground">No errors recorded.</p>
            ) : (
              <ul className="space-y-1 text-xs text-red-400">
                {runtime.errorLogs.map((e) => (
                  <li key={e.at}>
                    {e.at.slice(0, 19)} · {e.message}
                  </li>
                ))}
              </ul>
            )}
          </Block>

          {(item.status === "In development" || item.status === "Planned") && (
            <p className="rounded-lg border border-border bg-secondary/30 p-3 text-xs text-muted-foreground">
              This connector is {item.status.toLowerCase()}. Contact sales for timeline — Artemis will
              not show it as active until implemented.
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2 border-t border-border p-4">
          {canConnect && runtime.status !== "Connected" ? (
            <Button onClick={onConnect}>Configure / connect</Button>
          ) : null}
          {runtime.status === "Connected" ? (
            <>
              <Button onClick={onSync}>Sync now</Button>
              <Button variant="outline" onClick={onDisconnect}>
                Disconnect
              </Button>
            </>
          ) : null}
          {!canConnect ? (
            <Button variant="outline" asChild>
              <a href="/book-demo">Contact sales</a>
            </Button>
          ) : null}
        </div>
      </aside>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-semibold tracking-wide uppercase">{title}</h3>
      <div className="mt-2">{children}</div>
    </div>
  );
}
