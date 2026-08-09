import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DemoLoading, DemoPage } from "@/components/demo/demo-shell";
import { useDemoQuery } from "@/components/demo/use-demo-query";
import { Chip, PageHeading, Panel, PanelHeader } from "@/components/iris/primitives";
import { StatusBadge } from "@/components/product/ui";
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
        subtitle="Simulated AI · Alpha Desk"
        action={<StatusBadge tone="ai">Simulated AI</StatusBadge>}
      />
      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
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
                  "rounded-2xl border px-4 py-3.5 text-left text-sm transition-colors",
                  selected === a.callId
                    ? "border-[#2EE6A6]/35 bg-[#2EE6A6]/8"
                    : "border-border hover:bg-secondary/30",
                  a.status !== "live" && "opacity-55",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">{a.name}</span>
                  {a.status === "live" ? (
                    <StatusBadge tone="live">LIVE {a.duration}</StatusBadge>
                  ) : (
                    <StatusBadge tone="neutral">{a.status}</StatusBadge>
                  )}
                </div>
                {a.signal ? (
                  <p className="mt-1.5 text-[12px] capitalize text-muted-foreground">
                    {a.signal.replaceAll("_", " ")}
                  </p>
                ) : null}
              </button>
            ))}
          </div>
        </Panel>

        <Panel>
          <PanelHeader
            title="Artemis Copilot"
            subtitle={call?.agentName ?? "Select a live agent"}
            action={<StatusBadge tone="ai">Listening</StatusBadge>}
          />
          <div className="space-y-3 p-4">
            {(call?.transcript ?? []).map((l) => (
              <div key={l.id} className="rounded-xl border border-border px-3 py-2.5 text-xs">
                <span className="font-mono text-muted-foreground">{l.at}</span> {l.name}
                <p className="mt-1 text-sm">{l.text}</p>
              </div>
            ))}
            {(suggestions ?? []).slice(0, visibleTips).map((s) => (
              <div
                key={s.id}
                className="rounded-xl border border-[#18C4FF]/25 bg-[#18C4FF]/8 p-3 text-sm"
              >
                <Chip tone="iris">{s.label}</Chip>
                <p className="mt-2 font-medium">{s.suggestion}</p>
                {s.script ? (
                  <p className="mt-2 text-xs text-muted-foreground">Suggested: “{s.script}”</p>
                ) : null}
              </div>
            ))}
            {visibleTips === 0 && selected ? (
              <p className="text-xs text-muted-foreground">Waiting for simulated AI suggestions…</p>
            ) : null}
            {selected ? (
              <div className="flex flex-wrap gap-3 pt-1">
                <Link
                  to="/demo/agent/live"
                  search={{ mode: "midcall" }}
                  className="text-[13px] font-semibold text-[#2EE6A6] hover:underline"
                >
                  Open agent Sales Workspace →
                </Link>
                <Link
                  to="/demo/calls/$callId"
                  params={{ callId: selected }}
                  className="text-[13px] font-semibold text-[#18C4FF] hover:underline"
                >
                  Open full call review →
                </Link>
              </div>
            ) : null}
          </div>
        </Panel>
      </div>
    </DemoPage>
  );
}
