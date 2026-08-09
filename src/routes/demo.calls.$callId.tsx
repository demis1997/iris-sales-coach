import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { DemoLoading, DemoPage } from "@/components/demo/demo-shell";
import { useDemoQuery } from "@/components/demo/use-demo-query";
import { Chip, PageHeading, Panel, PanelHeader } from "@/components/iris/primitives";
import { demoService } from "@/lib/demo/demo-service";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/demo/calls/$callId")({
  component: CallDetailPage,
});

function CallDetailPage() {
  const { callId } = Route.useParams();
  const { data: call, loading } = useDemoQuery(() => demoService.getCall(callId), [callId]);
  const [focusAt, setFocusAt] = useState<string | null>(null);
  const [scoreKey, setScoreKey] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(18);

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setProgress((p) => (p >= 100 ? 0 : p + 1)), 400);
    return () => clearInterval(t);
  }, [playing]);

  const analysis = call?.analysis;
  const scoreEntries = useMemo(() => {
    if (!analysis) return [];
    const s = analysis.scores;
    return [
      ["Opening", s.opening],
      ["Discovery", s.discovery],
      ["Listening", s.listening],
      ["Product Knowledge", s.productKnowledge],
      ["Objection Handling", s.objectionHandling],
      ["Closing", s.closing],
      ["Compliance", s.compliance],
    ] as const;
  }, [analysis]);

  if (loading || !call || !analysis) return <DemoLoading />;

  return (
    <DemoPage>
      <div className="mb-2 flex flex-wrap gap-2">
        <Chip tone="iris">Demo Workspace</Chip>
        <Chip tone="neutral">Simulated AI</Chip>
        <Link to="/demo/ceo" className="text-xs text-primary hover:underline">
          ← CEO
        </Link>
        <Link to="/demo/manager" className="text-xs text-primary hover:underline">
          Manager
        </Link>
      </div>
      <PageHeading
        title={`${call.contactLabel} · ${call.agentName}`}
        subtitle={`${call.teamName} · ${call.startedAt} · ${call.duration}`}
      />

      <div className="grid gap-4 xl:grid-cols-[280px_1fr_320px]">
        <Panel className="p-5">
          <p className="text-xs text-muted-foreground">Demo audio player</p>
          <div className="mt-3 h-16 rounded-xl bg-secondary/50">
            <div className="flex h-full items-end gap-0.5 px-3 py-2">
              {Array.from({ length: 40 }).map((_, i) => (
                <div
                  key={i}
                  className={cn("flex-1 rounded-sm", i < progress / 2.5 ? "bg-primary" : "bg-border")}
                  style={{ height: `${20 + ((i * 37) % 60)}%` }}
                />
              ))}
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPlaying((v) => !v)}
              className="rounded-xl gradient-surface px-3 py-1.5 text-xs font-semibold text-background"
            >
              {playing ? "Pause" : "Play"}
            </button>
            <button
              type="button"
              onClick={() => {
                setFocusAt("08:14");
                setProgress(70);
                toast.message("Jumped to 08:14 — buying signal moment");
              }}
              className="rounded-xl border border-border px-3 py-1.5 text-xs"
            >
              Jump to 08:14
            </button>
          </div>
          <div className="mt-4 space-y-2 text-sm">
            <Row label="Intent" value={analysis.intent.replace("_", " ")} />
            <Row label="Outcome" value={analysis.outcome} />
            <Row label="Conv. probability" value={`${analysis.conversionProbability}%`} />
            <Row label="Deal risk" value={analysis.dealRisk} />
            <Row label="Primary objection" value={analysis.primaryObjection} />
          </div>
          <p className="mt-3 text-xs text-muted-foreground">{analysis.recommendedAction}</p>
          <Link
            to="/demo/contacts/$contactId"
            params={{ contactId: call.contactId }}
            className="mt-3 inline-flex text-xs text-primary hover:underline"
          >
            View contact →
          </Link>
        </Panel>

        <Panel>
          <PanelHeader title="Transcript" subtitle="Highlighted moments" />
          <div className="max-h-[560px] space-y-3 overflow-y-auto p-5">
            {call.transcript.length ? (
              call.transcript.map((line) => (
                <div
                  key={line.id}
                  className={cn(
                    "rounded-xl border px-3 py-2 text-sm",
                    focusAt === line.at && "ring-2 ring-primary",
                    line.highlight === "good" && "border-success/40 bg-success/5",
                    line.highlight === "opportunity" && "border-warning/40 bg-warning/5",
                    line.highlight === "risk" && "border-destructive/40 bg-destructive/5",
                    line.highlight === "objection" && "border-primary/40 bg-primary/5",
                    !line.highlight && "border-border",
                  )}
                >
                  <div className="mb-1 flex gap-2 text-[10px] text-muted-foreground">
                    <span className="font-mono">{line.at}</span>
                    <span className="uppercase">{line.name}</span>
                    {line.highlight ? <Chip tone="iris">{line.highlight}</Chip> : null}
                  </div>
                  <p>{line.text}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Transcript available on featured demo calls.</p>
            )}
          </div>
        </Panel>

        <div className="space-y-4">
          <Panel>
            <PanelHeader title="AI analysis" subtitle={`Score ${analysis.scores.overall || "—"} / 100`} />
            <div className="space-y-2 p-4">
              {scoreEntries.map(([label, value]) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setScoreKey(label)}
                  className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-sm hover:bg-secondary/40"
                >
                  <span>{label}</span>
                  <span className="font-mono">{value}</span>
                </button>
              ))}
            </div>
            {scoreKey ? (
              <p className="border-t border-border px-4 py-3 text-xs text-muted-foreground">
                Demo evidence for {scoreKey}: see highlighted transcript moments and coaching timestamps.
              </p>
            ) : null}
          </Panel>

          <Panel>
            <PanelHeader title="3 things that change the outcome" />
            <div className="space-y-3 p-4">
              {analysis.coaching.map((c, i) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => c.timestamp && setFocusAt(c.timestamp)}
                  className="block w-full rounded-xl border border-border p-3 text-left text-sm hover:bg-secondary/30"
                >
                  <p className="font-medium">
                    {i + 1}. {c.title}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{c.detail}</p>
                  {c.timestamp ? <p className="mt-1 font-mono text-[10px] text-primary">{c.timestamp}</p> : null}
                </button>
              ))}
            </div>
          </Panel>

          <Panel className="border-primary/30 bg-primary/5">
            <PanelHeader title="Next best action" />
            <div className="space-y-3 p-4 text-sm">
              <p className="font-medium">{analysis.nextBestAction.title}</p>
              <p className="text-xs text-muted-foreground">{analysis.nextBestAction.reason}</p>
              {analysis.nextBestAction.suggestedMessage ? (
                <p className="rounded-xl bg-secondary/40 p-3 text-xs">{analysis.nextBestAction.suggestedMessage}</p>
              ) : null}
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="rounded-xl gradient-surface px-3 py-1.5 text-xs font-semibold text-background"
                  onClick={() => {
                    void navigator.clipboard?.writeText(analysis.nextBestAction.suggestedMessage ?? "");
                    toast.success("Message copied");
                  }}
                >
                  Copy message
                </button>
                <button type="button" className="rounded-xl border border-border px-3 py-1.5 text-xs" onClick={() => toast.success("Task created (demo)")}>
                  Create task
                </button>
                <Link
                  to="/demo/contacts/$contactId"
                  params={{ contactId: call.contactId }}
                  className="rounded-xl border border-border px-3 py-1.5 text-xs"
                >
                  View contact
                </Link>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </DemoPage>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-2 text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}
