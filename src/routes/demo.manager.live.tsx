import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DemoLoading, DemoPage } from "@/components/demo/demo-shell";
import { useDemoQuery } from "@/components/demo/use-demo-query";
import { Chip, PageHeading, Panel, PanelHeader } from "@/components/iris/primitives";
import { demoService } from "@/lib/demo/demo-service";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/demo/manager/live")({
  component: LiveFloorPage,
});

function LiveFloorPage() {
  const { data: floor, loading } = useDemoQuery(() => demoService.getLiveFloor(), []);
  const { data: suggestions } = useDemoQuery(() => demoService.getLiveSuggestions(), []);
  const [selected, setSelected] = useState<string | null>("call-maria-live");
  const [visibleTips, setVisibleTips] = useState(0);

  useEffect(() => {
    if (!selected) return;
    setVisibleTips(0);
    const t1 = setTimeout(() => setVisibleTips(1), 1200);
    const t2 = setTimeout(() => setVisibleTips(2), 3200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [selected]);

  const { data: call } = useDemoQuery(
    () => (selected ? demoService.getCall(selected) : Promise.resolve(null)),
    [selected],
  );

  if (loading || !floor) return <DemoLoading />;

  return (
    <DemoPage>
      <PageHeading
        title="Live floor"
        subtitle="Simulated AI demo · Alpha Desk"
        action={<Chip tone="iris">Simulated AI demo</Chip>}
      />
      <div className="grid gap-4 lg:grid-cols-[1fr_380px]">
        <Panel>
          <PanelHeader title="Agents" subtitle="Click a LIVE call" />
          <div className="grid gap-2 p-4 sm:grid-cols-2">
            {floor.map((a) => (
              <button
                key={a.agentId}
                type="button"
                disabled={a.status !== "live" || !a.callId}
                onClick={() => a.callId && setSelected(a.callId)}
                className={cn(
                  "rounded-xl border px-4 py-3 text-left text-sm transition-colors",
                  selected === a.callId ? "border-primary bg-primary/10" : "border-border",
                  a.status !== "live" && "opacity-60",
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{a.name}</span>
                  <Chip tone={a.status === "live" ? "good" : "neutral"}>
                    {a.status === "live" ? `LIVE ${a.duration}` : a.status}
                  </Chip>
                </div>
                {a.signal ? (
                  <p className="mt-1 text-xs text-muted-foreground">{a.signal.replace("_", " ")}</p>
                ) : null}
              </button>
            ))}
          </div>
        </Panel>

        <Panel className="border-primary/30">
          <PanelHeader title="Live call assist" subtitle={call?.agentName ?? "Select a live agent"} />
          <div className="space-y-3 p-4">
            {(call?.transcript ?? []).map((l) => (
              <div key={l.id} className="rounded-xl border border-border px-3 py-2 text-xs">
                <span className="font-mono text-muted-foreground">{l.at}</span> {l.name}
                <p className="mt-1 text-sm">{l.text}</p>
              </div>
            ))}
            {(suggestions ?? []).slice(0, visibleTips).map((s) => (
              <div key={s.id} className="rounded-xl border border-primary/40 bg-primary/10 p-3 text-sm">
                <Chip tone="iris">{s.label}</Chip>
                <p className="mt-2 font-medium">{s.suggestion}</p>
                {s.script ? <p className="mt-2 text-xs text-muted-foreground">Suggested: “{s.script}”</p> : null}
              </div>
            ))}
            {visibleTips === 0 && selected ? (
              <p className="text-xs text-muted-foreground">Waiting for simulated AI suggestions…</p>
            ) : null}
            {selected ? (
              <Link to="/demo/calls/$callId" params={{ callId: selected }} className="text-xs text-primary hover:underline">
                Open full call review →
              </Link>
            ) : null}
          </div>
        </Panel>
      </div>
    </DemoPage>
  );
}
