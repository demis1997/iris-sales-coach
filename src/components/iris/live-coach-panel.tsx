import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  AlertTriangle,
  Check,
  Copy,
  Swords,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  X,
} from "lucide-react";
import { Chip, Meter, Panel, PanelHeader } from "@/components/iris/primitives";
import {
  AI_INTEGRATION_NOTICE,
  callStagesTrack,
  liveCoachSession,
  type LiveCoachSuggestion,
} from "@/lib/revenue-intelligence-data";
import { cn } from "@/lib/utils";

const kindTone: Record<string, "iris" | "good" | "warn" | "bad" | "neutral"> = {
  objection: "warn",
  signal: "good",
  question: "iris",
  close: "good",
  risk: "bad",
  compliance: "bad",
  battlecard: "iris",
};

export function LiveCoachPanel({ visibleCount }: { visibleCount: number }) {
  const { metrics, checklist, skippedWarnings, suggestions, campaign, playbook } = liveCoachSession;
  const cards = suggestions.slice(0, Math.min(visibleCount, suggestions.length));

  return (
    <div className="space-y-4">
      <Panel className="gradient-border">
        <PanelHeader
          title="Iris live coaching"
          subtitle={`${campaign} · ${playbook}`}
          action={<Chip tone="iris">Contextual</Chip>}
        />
        <div className="space-y-3 border-b border-border px-4 py-3">
          <CallStageTracker activeIndex={metrics.stageIndex} />
          {skippedWarnings.map((w) => (
            <div
              key={w}
              className="flex gap-2 rounded-lg border border-warning/30 bg-warning/10 px-3 py-2 text-xs text-warning"
            >
              <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
              Stage warning: {w}
            </div>
          ))}
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            {[
              ["Sentiment", metrics.sentiment],
              ["Buying intent", metrics.buyingIntent],
              ["Talk / listen", metrics.talkListen],
              ["Agent confidence", metrics.agentConfidence],
              ["Deal risk", metrics.dealRisk],
            ].map(([l, v]) => (
              <div key={String(l)} className="rounded-lg border border-border bg-secondary/30 p-2">
                <p className="text-muted-foreground">{l}</p>
                <p className="mt-0.5 font-mono text-sm font-semibold">{v}%</p>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-3 p-4">
          <AnimatePresence initial={false}>
            {cards.map((c) => (
              <CoachCard key={c.id} card={c} />
            ))}
          </AnimatePresence>
        </div>
        <p className="border-t border-border px-4 py-2 text-[10px] text-muted-foreground">
          {AI_INTEGRATION_NOTICE}
        </p>
      </Panel>

      <Panel className="p-4">
        <p className="text-xs font-medium">Campaign playbook checklist</p>
        <div className="mt-3 space-y-2">
          {checklist.map((item) => (
            <div key={item.label} className="flex items-center justify-between gap-2 text-xs">
              <span className={cn(item.done ? "text-foreground" : "text-muted-foreground")}>
                {item.label}
              </span>
              <Chip tone={item.done ? "good" : "warn"}>{item.done ? "Done" : "Missing"}</Chip>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function CallStageTracker({ activeIndex }: { activeIndex: number }) {
  return (
    <div>
      <p className="mb-2 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
        Live call progress
      </p>
      <div className="flex flex-wrap gap-1">
        {callStagesTrack.map((stage, i) => (
          <span
            key={stage}
            className={cn(
              "rounded-full px-2 py-0.5 text-[10px] font-medium",
              i < activeIndex && "bg-success/15 text-success",
              i === activeIndex && "bg-primary/20 text-primary",
              i > activeIndex && "bg-secondary text-muted-foreground",
            )}
          >
            {stage}
          </span>
        ))}
      </div>
    </div>
  );
}

function CoachCard({ card }: { card: LiveCoachSuggestion }) {
  const [alt, setAlt] = useState(0);
  const [battle, setBattle] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [feedback, setFeedback] = useState<"useful" | "inaccurate" | null>(null);
  const [copied, setCopied] = useState(false);

  const response = useMemo(() => {
    if (alt === 0) return card.suggestedResponse;
    return card.alternatives[alt - 1] ?? card.suggestedResponse;
  }, [alt, card]);

  if (dismissed) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-xl border border-border bg-secondary/30 p-3"
    >
      <div className="flex items-center justify-between gap-2">
        <Chip tone={kindTone[card.kind]}>{card.kind}</Chip>
        <span className="font-mono text-[10px] text-muted-foreground">{card.at}</span>
      </div>
      <p className="mt-2 text-xs text-muted-foreground italic">{card.trigger}</p>
      <p className="mt-2 text-xs font-medium text-foreground">
        Detected: <span className="text-primary">{card.detected}</span>
      </p>
      <p className="mt-2 flex gap-1.5 text-sm font-medium leading-snug">
        <Sparkles className="mt-0.5 size-3.5 shrink-0 text-primary" />
        Suggested response
      </p>
      <p className="mt-1 rounded-lg border border-border bg-background/50 px-3 py-2 text-sm leading-relaxed">
        “{response}”
      </p>
      <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
        <span className="font-medium text-foreground">Why this works: </span>
        {card.whyItWorks}
      </p>
      <div className="mt-2 space-y-1">
        {card.supporting.map((s) => (
          <p key={s.label} className="text-[11px] text-muted-foreground">
            <span className="font-medium text-foreground">{s.label}: </span>
            {s.detail}
          </p>
        ))}
      </div>
      <p className="mt-2 text-[10px] text-muted-foreground">
        Source: {card.source} · confidence {card.confidence}%
      </p>
      <div className="mt-2 flex items-center gap-2">
        <Meter value={card.confidence} />
        <span className="font-mono text-[10px] text-muted-foreground">{card.confidence}%</span>
      </div>

      {battle && card.battleCard ? (
        <div className="mt-3 rounded-lg border border-primary/30 bg-primary/5 p-3">
          <p className="flex items-center gap-1.5 text-xs font-semibold">
            <Swords className="size-3.5 text-primary" />
            Battle card · {card.battleCard.competitor}
          </p>
          <ul className="mt-2 space-y-1 text-[11px] text-muted-foreground">
            {card.battleCard.points.map((p) => (
              <li key={p}>• {p}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-3 flex flex-wrap gap-1.5">
        <ActionBtn
          onClick={() => {
            void navigator.clipboard?.writeText(response);
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
          }}
        >
          {copied ? <Check className="size-3" /> : null}
          Use response
        </ActionBtn>
        <ActionBtn
          onClick={() => {
            void navigator.clipboard?.writeText(response);
            setCopied(true);
          }}
        >
          <Copy className="size-3" /> Copy
        </ActionBtn>
        <ActionBtn
          onClick={() => setAlt((a) => (a + 1) % (card.alternatives.length + 1))}
        >
          Show alternative
        </ActionBtn>
        {card.battleCard ? (
          <ActionBtn onClick={() => setBattle((b) => !b)}>
            <Swords className="size-3" /> View battle card
          </ActionBtn>
        ) : null}
        <ActionBtn onClick={() => setFeedback("useful")} active={feedback === "useful"}>
          <ThumbsUp className="size-3" /> Useful
        </ActionBtn>
        <ActionBtn onClick={() => setFeedback("inaccurate")} active={feedback === "inaccurate"}>
          <ThumbsDown className="size-3" /> Inaccurate
        </ActionBtn>
        <ActionBtn onClick={() => setDismissed(true)}>
          <X className="size-3" /> Dismiss
        </ActionBtn>
      </div>
    </motion.div>
  );
}

function ActionBtn({
  children,
  onClick,
  active,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-[10px] font-medium transition-colors",
        active
          ? "border-primary/40 bg-primary/15 text-primary"
          : "border-border text-muted-foreground hover:bg-secondary hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
