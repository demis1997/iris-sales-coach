import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader2, Sparkles } from "lucide-react";
import { Panel, PanelHeader, ScoreRing, Chip } from "@/components/iris/primitives";
import { getCallBundle } from "@/lib/calls";
import { useAuth } from "@/components/auth/auth-provider";

export const Route = createFileRoute("/app/calls/$callId")({
  head: () => ({
    meta: [{ title: "Call review — Artemis AI" }],
  }),
  component: CallReviewPage,
});

function CallReviewPage() {
  const { callId } = Route.useParams();
  const { demoMode, session } = useAuth();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["call", callId, session?.activeCompanyId],
    queryFn: () => getCallBundle(callId),
    enabled: Boolean(callId) && !demoMode && Boolean(session?.activeCompanyId),
    refetchInterval: (q) => {
      const status = (q.state.data as { call?: { analysis_status?: string } } | undefined)?.call
        ?.analysis_status;
      return status === "completed" || status === "failed" ? false : 4000;
    },
  });

  if (demoMode) {
    return (
      <Panel className="p-6 text-sm text-muted-foreground">
        Sign in to review real call recordings and analysis.
      </Panel>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" /> Loading call…
      </div>
    );
  }

  if (error || !data) {
    return (
      <Panel className="p-6 text-sm text-destructive">
        {(error as Error)?.message ?? "Call not found"}{" "}
        <button type="button" className="underline" onClick={() => void refetch()}>
          Retry
        </button>
      </Panel>
    );
  }

  const call = data.call as Record<string, any>;
  const analysis = data.analysis as Record<string, any> | null;
  const segments = data.segments as Array<Record<string, any>>;
  const jobs = data.jobs as Array<Record<string, any>>;
  const signedUrl = data.signedUrl as string | null;
  const coaching = (analysis?.coaching ?? {}) as {
    strengths?: string[];
    weaknesses?: string[];
    topImprovements?: string[];
    nextCallGoal?: string;
  };
  const objections = (analysis?.objections ?? []) as Array<{
    category: string;
    text: string;
    betterResponse?: string;
  }>;

  return (
    <>
      <Link
        to="/app/calls"
        className="mb-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" /> Back to calls
      </Link>

      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{call.contact_name ?? "Call"}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {call.contact_company ?? "—"} · {new Date(call.created_at).toLocaleString()} ·{" "}
            {call.direction}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Chip tone="iris">{call.analysis_status}</Chip>
          <Chip tone="neutral">{call.outcome ?? "Pending outcome"}</Chip>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel className="flex flex-col items-center justify-center gap-3 p-6">
          <ScoreRing value={Number(call.overall_score ?? analysis?.overall_score ?? 0)} />
          <p className="text-xs text-muted-foreground">Overall AI score</p>
          <p className="px-3 text-center text-[11px] text-muted-foreground">
            AI insights can be inaccurate and should be reviewed for important decisions.
          </p>
        </Panel>

        <Panel className="lg:col-span-2 p-5">
          <PanelHeader title="Recording" subtitle="Signed URL expires in 30 minutes" />
          {signedUrl ? (
            <audio controls className="mt-4 w-full" src={signedUrl} preload="metadata" />
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">Audio unavailable.</p>
          )}
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Panel className="p-5">
          <PanelHeader title="Summary" />
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {analysis?.summary_concise ??
              (call.analysis_status === "completed"
                ? "No summary stored."
                : "Analysis still running…")}
          </p>
          {analysis?.summary_detailed ? (
            <p className="mt-3 text-sm leading-relaxed">{analysis.summary_detailed}</p>
          ) : null}
        </Panel>

        <Panel className="p-5">
          <PanelHeader title="Coaching" />
          <ul className="mt-3 space-y-2 text-sm">
            {(coaching.topImprovements ?? []).map((item) => (
              <li key={item} className="flex gap-2">
                <Sparkles className="mt-0.5 size-3.5 shrink-0 text-primary" />
                {item}
              </li>
            ))}
            {!coaching.topImprovements?.length ? (
              <li className="text-muted-foreground">Coaching appears when analysis completes.</li>
            ) : null}
          </ul>
          {coaching.nextCallGoal ? (
            <p className="mt-4 text-xs text-muted-foreground">Next call goal: {coaching.nextCallGoal}</p>
          ) : null}
        </Panel>
      </div>

      <Panel className="mt-4 p-5">
        <PanelHeader title="Transcript" subtitle={`${segments.length} segments`} />
        <div className="mt-4 max-h-[420px] space-y-3 overflow-y-auto">
          {segments.map((s) => (
            <div key={s.id} className="rounded-xl border border-border px-3 py-2 text-sm">
              <div className="mb-1 flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="font-medium text-foreground">{s.speaker ?? "Speaker"}</span>
                <span>
                  {(s.start_ms / 1000).toFixed(1)}s
                  {s.is_objection ? " · objection" : ""}
                </span>
              </div>
              <p>{s.text}</p>
            </div>
          ))}
          {!segments.length ? (
            <p className="text-sm text-muted-foreground">Transcript segments appear after processing.</p>
          ) : null}
        </div>
      </Panel>

      {objections.length ? (
        <Panel className="mt-4 p-5">
          <PanelHeader title="Objections" />
          <div className="mt-3 space-y-3">
            {objections.map((o, i) => (
              <div key={`${o.category}-${i}`} className="rounded-xl border border-border p-3 text-sm">
                <p className="font-medium">
                  {o.category}: {o.text}
                </p>
                {o.betterResponse ? (
                  <p className="mt-1 text-xs text-muted-foreground">Better: {o.betterResponse}</p>
                ) : null}
              </div>
            ))}
          </div>
        </Panel>
      ) : null}

      <Panel className="mt-4 p-5">
        <PanelHeader title="Processing history" />
        <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
          {jobs.map((j) => (
            <li key={j.id}>
              {j.stage} · {j.status}
              {j.error ? ` · ${j.error}` : ""}
            </li>
          ))}
          {!jobs.length ? <li>No jobs yet.</li> : null}
        </ul>
      </Panel>
    </>
  );
}
