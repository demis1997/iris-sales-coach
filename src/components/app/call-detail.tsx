import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  BookmarkPlus,
  Check,
  Copy,
  Forward,
  Mail,
  MessageSquareText,
  Pause,
  Play,
  Share2,
  SkipBack,
  SkipForward,
  Volume2,
} from "lucide-react";
import { useSession } from "@/components/app/session";
import { AskArtemisPanel } from "@/components/app/ask-artemis";
import {
  formatDuration,
  formatEur,
  getAnalysis,
  getCallById,
  teamById,
  userById,
  deals,
} from "@/lib/demo/queries";
import { buildMarkers, buildTranscript } from "@/lib/demo/seed";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Meter, ScoreRing, Chip } from "@/components/artemis/primitives";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const SPEEDS = [0.75, 1, 1.25, 1.5];

export function CallDetailPage({ callId }: { callId: string }) {
  const { access } = useSession();
  const call = getCallById(access, callId);
  const analysis = call ? getAnalysis(access, callId) : null;
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [speedIdx, setSpeedIdx] = useState(1);
  const [volume, setVolume] = useState(0.8);
  const [transcriptQuery, setTranscriptQuery] = useState("");
  const [askOpen, setAskOpen] = useState(false);
  const [actionState, setActionState] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<{ at: number; text: string }[]>([]);

  const transcript = useMemo(() => (call ? buildTranscript(call) : []), [call]);
  const markers = useMemo(() => (call ? buildMarkers(call.id) : []), [call]);

  if (!call) {
    return (
      <div className="rounded-xl border border-dashed border-border px-6 py-16 text-center">
        <p className="font-medium">Call not found or not permitted</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Your role cannot access this call, or it is outside your organisation.
        </p>
        <Button className="mt-4" variant="outline" asChild>
          <Link to="/app/calls">Back to calls</Link>
        </Button>
      </div>
    );
  }

  const rep = userById(call.representativeId);
  const deal = call.dealId ? deals.find((d) => d.id === call.dealId) : null;
  const filteredTranscript = transcript.filter((s) =>
    transcriptQuery ? s.text.toLowerCase().includes(transcriptQuery.toLowerCase()) : true,
  );

  function jump(sec: number) {
    setPosition(Math.max(0, Math.min(call!.durationSec, sec)));
  }

  function runAction(id: string, message: string) {
    setActionState(id);
    toast.success(message);
    setTimeout(() => setActionState(null), 1200);
  }

  return (
    <div>
      <Link
        to="/app/calls"
        className="mb-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" /> Back to calls
      </Link>

      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{call.prospect}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {call.company} · {rep?.name} · {teamById(call.teamId)?.name} ·{" "}
            {call.startedAt.slice(0, 16).replace("T", " ")} · {formatDuration(call.durationSec)} ·{" "}
            {call.outcome}
            {deal ? ` · ${deal.title} (${formatEur(deal.value)})` : ""}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Chip tone="artemis">{call.callType}</Chip>
            <Chip tone={call.analysisStatus === "Analyzed" ? "good" : "warn"}>
              {call.analysisStatus}
            </Chip>
            {analysis ? <Chip tone="neutral">{analysis.sentiment}</Chip> : null}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              runAction("export", "Export package prepared (transcript + scores JSON).")
            }
          >
            <Copy className="size-3.5" /> Export
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => runAction("share", "Share link copied for managers in your org.")}
          >
            <Share2 className="size-3.5" /> Share
          </Button>
          <Button size="sm" onClick={() => setAskOpen(true)}>
            <MessageSquareText className="size-3.5" /> Ask Artemis
          </Button>
        </div>
      </div>

      {/* Player */}
      <div className="mb-4 rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <Button
            size="icon"
            variant="outline"
            aria-label="Back 10s"
            onClick={() => jump(position - 10)}
          >
            <SkipBack className="size-4" />
          </Button>
          <Button
            size="icon"
            aria-label={playing ? "Pause" : "Play"}
            onClick={() => {
              setPlaying((p) => !p);
              toast.message(
                playing ? "Paused" : "Demo player — audio file not attached in this workspace.",
              );
            }}
          >
            {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
          </Button>
          <Button
            size="icon"
            variant="outline"
            aria-label="Forward 10s"
            onClick={() => jump(position + 10)}
          >
            <SkipForward className="size-4" />
          </Button>
          <span className="font-mono text-xs tabular-nums text-muted-foreground">
            {formatDuration(position)} / {formatDuration(call.durationSec)}
          </span>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setSpeedIdx((i) => (i + 1) % SPEEDS.length)}
          >
            {SPEEDS[speedIdx]}x
          </Button>
          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            <Volume2 className="size-3.5" />
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              aria-label="Volume"
            />
          </label>
        </div>

        <div className="relative mt-4 h-10">
          <input
            type="range"
            min={0}
            max={call.durationSec}
            value={position}
            onChange={(e) => setPosition(Number(e.target.value))}
            className="absolute inset-x-0 top-4 w-full accent-[var(--primary)]"
            aria-label="Playback position"
          />
          <div className="absolute inset-x-0 top-0 h-3">
            {markers.map((m) => (
              <button
                key={`${m.type}-${m.atSec}`}
                type="button"
                title={m.label}
                className={cn(
                  "absolute top-0 size-2.5 -translate-x-1/2 rounded-full",
                  markerColor(m.type),
                )}
                style={{ left: `${(m.atSec / call.durationSec) * 100}%` }}
                onClick={() => jump(m.atSec)}
              />
            ))}
          </div>
        </div>
        <div className="mt-2 flex flex-wrap gap-3 text-[10px] text-muted-foreground">
          {[
            ["objection", "Objections"],
            ["pricing", "Pricing"],
            ["competitor", "Competitors"],
            ["positive", "Positive"],
            ["negative", "Negative"],
            ["interruption", "Interruptions"],
            ["next_step", "Next steps"],
            ["compliance", "Compliance"],
          ].map(([t, l]) => (
            <span key={t} className="inline-flex items-center gap-1">
              <span className={cn("size-2 rounded-full", markerColor(t))} />
              {l}
            </span>
          ))}
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        {/* Transcript */}
        <div className="rounded-xl border border-border bg-card shadow-sm">
          <div className="border-b border-border px-4 py-3">
            <h2 className="text-sm font-semibold">Transcript</h2>
            <Input
              className="mt-2 h-8"
              placeholder="Search transcript…"
              value={transcriptQuery}
              onChange={(e) => setTranscriptQuery(e.target.value)}
            />
          </div>
          <div className="max-h-[520px] space-y-3 overflow-y-auto p-4">
            {call.analysisStatus !== "Analyzed" ? (
              <p className="text-sm text-muted-foreground">
                Transcript available after analysis completes.
              </p>
            ) : filteredTranscript.length === 0 ? (
              <p className="text-sm text-muted-foreground">No matching segments.</p>
            ) : (
              filteredTranscript.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className="block w-full rounded-lg border border-transparent px-2 py-2 text-left hover:border-border hover:bg-secondary/30"
                  onClick={() => jump(s.startTime)}
                >
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span className="font-mono tabular-nums">{formatDuration(s.startTime)}</span>
                    <span className="font-medium text-foreground">{s.speakerName}</span>
                    <span>{s.sentiment}</span>
                    {s.tags.map((t) => (
                      <Chip key={t} tone="artemis">
                        {t}
                      </Chip>
                    ))}
                  </div>
                  <p className="mt-1 text-sm leading-relaxed">{s.text}</p>
                  <div className="mt-1 flex gap-2">
                    <button
                      type="button"
                      className="text-[11px] text-primary hover:underline"
                      onClick={(e) => {
                        e.stopPropagation();
                        runAction(
                          "moment",
                          `Moment at ${formatDuration(s.startTime)} marked as shareable.`,
                        );
                      }}
                    >
                      Share moment
                    </button>
                  </div>
                </button>
              ))
            )}
          </div>
          <div className="border-t border-border p-3">
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (!comment.trim()) return;
                setComments((c) => [...c, { at: position, text: comment.trim() }]);
                setComment("");
                toast.success("Comment added on timeline");
              }}
            >
              <Input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={`Comment at ${formatDuration(position)}…`}
              />
              <Button type="submit" variant="outline">
                Add
              </Button>
            </form>
            {comments.length ? (
              <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                {comments.map((c, i) => (
                  <li key={i}>
                    {formatDuration(c.at)} — {c.text}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>

        {/* Analysis */}
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <h2 className="text-sm font-semibold">AI analysis</h2>
            {!analysis || call.analysisStatus !== "Analyzed" ? (
              <p className="mt-3 text-sm text-muted-foreground">Analysis pending.</p>
            ) : (
              <>
                <div className="mt-4 flex justify-center">
                  <ScoreRing value={analysis.overallScore} />
                </div>
                <div className="mt-4 space-y-3">
                  {(
                    [
                      ["Discovery", analysis.discoveryScore],
                      ["Listening", analysis.listeningScore],
                      ["Confidence", analysis.confidenceScore],
                      ["Pitch", analysis.pitchScore],
                      ["Objection handling", analysis.objectionHandlingScore],
                      ["Closing", analysis.closingScore],
                      ["Playbook adherence", analysis.playbookScore],
                    ] as const
                  ).map(([label, score]) => (
                    <div key={label}>
                      <div className="mb-1 flex justify-between text-xs">
                        <span>{label}</span>
                        <span className="font-mono tabular-nums">{score}</span>
                      </div>
                      <Meter value={score} />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {analysis && call.analysisStatus === "Analyzed" ? (
            <>
              <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                <h2 className="text-sm font-semibold">What went well</h2>
                <ul className="mt-3 space-y-2">
                  {analysis.strengths.map((s) => (
                    <li key={s.text} className="flex gap-2 text-sm">
                      <Check className="mt-0.5 size-3.5 shrink-0 text-success" />
                      <span>
                        {s.text}{" "}
                        <button
                          type="button"
                          className="font-mono text-xs text-primary hover:underline"
                          onClick={() => jump(s.timestampSec)}
                        >
                          {formatDuration(s.timestampSec)}
                        </button>
                      </span>
                    </li>
                  ))}
                  {analysis.strengths.length === 0 ? (
                    <li className="text-sm text-muted-foreground">No strengths tagged.</li>
                  ) : null}
                </ul>
              </div>

              <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                <h2 className="text-sm font-semibold">What reduced the chance of success</h2>
                <ul className="mt-3 space-y-2">
                  {analysis.weaknesses.map((s) => (
                    <li key={s.text} className="text-sm text-muted-foreground">
                      {s.text}{" "}
                      <button
                        type="button"
                        className="font-mono text-xs text-primary hover:underline"
                        onClick={() => jump(s.timestampSec)}
                      >
                        {formatDuration(s.timestampSec)}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                <h2 className="text-sm font-semibold">Next-call recommendations</h2>
                <ul className="mt-3 list-disc space-y-1 pl-4 text-sm text-muted-foreground">
                  {analysis.recommendations.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                <h2 className="text-sm font-semibold">Deal intelligence</h2>
                <dl className="mt-3 grid gap-2 text-sm">
                  <Row
                    label="Buyer needs"
                    value={analysis.dealIntel.buyerNeeds.join("; ") || "—"}
                  />
                  <Row
                    label="Pain points"
                    value={analysis.dealIntel.painPoints.join("; ") || "—"}
                  />
                  <Row label="Objections" value={analysis.dealIntel.objections.join("; ") || "—"} />
                  <Row
                    label="Decision criteria"
                    value={analysis.dealIntel.decisionCriteria.join("; ")}
                  />
                  <Row
                    label="Competitors"
                    value={analysis.dealIntel.competitors.join("; ") || "—"}
                  />
                  <Row label="Budget signals" value={analysis.dealIntel.budgetSignals} />
                  <Row label="Urgency" value={analysis.dealIntel.urgency} />
                  <Row label="Stakeholders" value={analysis.dealIntel.stakeholders.join("; ")} />
                  <Row label="Agreed next step" value={analysis.dealIntel.agreedNextStep} />
                  <Row label="Risk level" value={analysis.dealIntel.riskLevel} />
                </dl>
              </div>
            </>
          ) : null}

          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <h2 className="text-sm font-semibold">Generated actions</h2>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <ActionBtn
                busy={actionState === "email"}
                icon={Mail}
                label="Generate follow-up email"
                onClick={() =>
                  runAction(
                    "email",
                    "Draft opened: recap + next step. Connect Gmail/Outlook in Integrations to send.",
                  )
                }
              />
              <ActionBtn
                busy={actionState === "crm"}
                icon={Forward}
                label="Update CRM"
                onClick={() =>
                  runAction(
                    "crm",
                    "CRM update preview ready. Requires an active CRM connector (see Integrations).",
                  )
                }
              />
              <ActionBtn
                busy={actionState === "coach"}
                icon={BookmarkPlus}
                label="Create coaching task"
                onClick={() =>
                  runAction("coach", "Coaching task created in Coaching queue (demo).")
                }
              />
              <ActionBtn
                busy={actionState === "playbook"}
                icon={BookmarkPlus}
                label="Add to playbook"
                onClick={() => runAction("playbook", "Moment queued for playbook editor review.")}
              />
              <ActionBtn
                busy={actionState === "manager"}
                icon={Share2}
                label="Share with manager"
                onClick={() =>
                  runAction("manager", "Shared with team manager (demo notification).")
                }
              />
              <ActionBtn
                busy={actionState === "training"}
                icon={BookmarkPlus}
                label="Create training exercise"
                onClick={() =>
                  runAction("training", "Training exercise drafted from weakness tags.")
                }
              />
            </div>
          </div>
        </div>
      </div>

      <AskArtemisPanel open={askOpen} onOpenChange={setAskOpen} callId={call.id} />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[140px_1fr] gap-2">
      <dt className="text-muted-foreground">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function ActionBtn({
  label,
  onClick,
  icon: Icon,
  busy,
}: {
  label: string;
  onClick: () => void;
  icon: typeof Mail;
  busy: boolean;
}) {
  return (
    <Button variant="outline" className="h-auto justify-start py-3 text-left" onClick={onClick}>
      <Icon className="size-3.5 shrink-0" />
      <span className="text-xs">{busy ? "Working…" : label}</span>
    </Button>
  );
}

function markerColor(type: string) {
  switch (type) {
    case "objection":
      return "bg-warning";
    case "pricing":
      return "bg-primary";
    case "competitor":
      return "bg-chart-5";
    case "positive":
      return "bg-success";
    case "negative":
      return "bg-destructive";
    case "interruption":
      return "bg-orange-400";
    case "next_step":
      return "bg-cyan";
    case "compliance":
      return "bg-violet";
    default:
      return "bg-muted-foreground";
  }
}
