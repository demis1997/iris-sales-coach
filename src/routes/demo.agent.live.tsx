import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { LeadContextPanel } from "@/components/demo/live-call/lead-context-panel";
import { ActiveCallCenter } from "@/components/demo/live-call/active-call-center";
import { CopilotPanel } from "@/components/demo/live-call/copilot-panel";
import { LiveStatusBar } from "@/components/demo/live-call/live-status-bar";
import {
  DonePhase,
  ProcessingPhase,
  ReviewPhase,
  WrapUpPhase,
} from "@/components/demo/live-call/post-call-phases";
import { QueuePanel } from "@/components/demo/live-call/queue-panel";
import { DemoPage } from "@/components/demo/demo-shell";
import { useDemoLiveCall } from "@/lib/demo/live-call/use-demo-live-call";
import { cn } from "@/lib/utils";

type LiveSearch = {
  mode?: "midcall" | "idle" | "queue";
};

export const Route = createFileRoute("/demo/agent/live")({
  validateSearch: (search: Record<string, unknown>): LiveSearch => ({
    mode:
      search.mode === "idle" || search.mode === "queue" || search.mode === "midcall"
        ? search.mode
        : "midcall",
  }),
  component: AgentLiveWorkspacePage,
});

function AgentLiveWorkspacePage() {
  const { mode } = Route.useSearch();
  const navigate = useNavigate();
  const autoStart = mode === "idle" || mode === "queue" ? "idle" : "midcall";
  const { session, queue, tab, service } = useDemoLiveCall(autoStart);

  useEffect(() => {
    if (mode === "queue") service.setTab("queue");
  }, [mode, service]);

  return (
    <DemoPage>
      <div className="-mx-1 space-y-3 md:-mx-0">
        <LiveStatusBar session={session} onSpeed={(s) => service.setSpeed(s)} />

        <div className="flex flex-wrap gap-2">
          <TabButton
            active={tab === "live"}
            label="Live Call"
            onClick={() => service.setTab("live")}
          />
          <TabButton
            active={tab === "queue"}
            label="Queue"
            onClick={() => service.setTab("queue")}
          />
        </div>

        {session.phase === "processing" ? <ProcessingPhase session={session} /> : null}

        {session.phase === "review" ? (
          <ReviewPhase session={session} onContinue={() => service.continueToWrapUp()} />
        ) : null}

        {session.phase === "wrapup" ? (
          <WrapUpPhase
            session={session}
            onDisposition={(d) => service.setDisposition(d)}
            onFollowUp={(f, v) => service.setFollowUp(f, v)}
            onSave={() => service.saveDisposition()}
          />
        ) : null}

        {session.phase === "done" ? (
          <DonePhase
            onAgain={() => {
              service.startMidCall();
              void navigate({ to: "/demo/agent/live", search: { mode: "midcall" } });
            }}
            onQueue={() => {
              service.resetToAvailable();
              service.setTab("queue");
            }}
          />
        ) : null}

        {session.phase === "softphone" && tab === "queue" ? (
          <QueuePanel
            leads={queue}
            onCall={(id) => service.dialFromQueue(id)}
            onSkip={(id) => service.skipQueueLead(id)}
          />
        ) : null}

        {session.phase === "softphone" && tab === "live" ? (
          session.status === "AVAILABLE" ? (
            <div className="rounded-2xl border border-dashed border-border px-6 py-16 text-center">
              <p className="text-sm font-semibold">No active call</p>
              <p className="mt-2 text-xs text-muted-foreground">
                Open the queue to dial the next lead, or replay the mid-call story.
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <button
                  type="button"
                  onClick={() => service.setTab("queue")}
                  className="product-btn-primary !px-4 !py-2 text-xs"
                >
                  Open Queue
                </button>
                <button
                  type="button"
                  onClick={() => service.startMidCall()}
                  className="rounded-xl border border-border px-4 py-2 text-xs"
                >
                  Replay Client 10821 call
                </button>
              </div>
            </div>
          ) : (
            <div className="grid min-h-[calc(100vh-14rem)] gap-3 xl:grid-cols-[280px_minmax(0,1.25fr)_320px]">
              <LeadContextPanel session={session} onNotes={(n) => service.setNotes(n)} />
              <ActiveCallCenter
                session={session}
                onMute={() => service.toggleMute()}
                onHold={() => service.toggleHold()}
                onKeypad={() => service.toggleKeypad()}
                onEnd={() => service.endCall()}
              />
              <CopilotPanel
                session={session}
                onUse={(id) => service.useSuggestion(id)}
                onDismiss={(id) => service.dismissSuggestion(id)}
                onOpenPlaybook={() => service.openPlaybookDrawer(true)}
                onClosePlaybook={() => service.openPlaybookDrawer(false)}
              />
            </div>
          )
        ) : null}
      </div>
    </DemoPage>
  );
}

function TabButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-xl px-3 py-1.5 text-xs font-medium transition",
        active ? "bg-primary/15 text-foreground" : "text-muted-foreground hover:bg-secondary",
      )}
    >
      {label}
    </button>
  );
}
