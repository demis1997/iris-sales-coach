import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DemoPage } from "@/components/demo/demo-shell";
import { Chip, PageHeading, Panel, PanelHeader } from "@/components/iris/primitives";

type PracticeSearch = {
  scenario?: string;
};

const SCRIPTS: Record<string, { title: string; turns: { who: "ai" | "you"; text: string }[] }> = {
  default: {
    title: "Skeptical investor · Trust / Withdrawals",
    turns: [
      {
        who: "ai",
        text: "Hi — I'm interested in opening an account but I've had bad experiences with withdrawals.",
      },
      {
        who: "you",
        text: "That's completely fair. Can I walk you through how withdrawals work here before anything else?",
      },
      { who: "ai", text: "Okay… but how long does it actually take once I'm verified?" },
      {
        who: "you",
        text: "For verified accounts we process same day in most cases, and I'll send the steps in writing.",
      },
    ],
  },
  "high-intent-trust": {
    title: "High-intent prospect after trust objection",
    turns: [
      { who: "ai", text: "Okay, that actually makes sense." },
      {
        who: "you",
        text: "Great. Would you like me to walk you through getting the account ready now?",
      },
      { who: "ai", text: "Yes — what do I need to do first?" },
      {
        who: "you",
        text: "We'll complete a quick verification, then I can send the funding steps. Shall we start KYC together now?",
      },
    ],
  },
};

export const Route = createFileRoute("/demo/agent/practice")({
  validateSearch: (search: Record<string, unknown>): PracticeSearch => ({
    scenario: typeof search.scenario === "string" ? search.scenario : undefined,
  }),
  component: RoleplayPage,
});

function RoleplayPage() {
  const { scenario } = Route.useSearch();
  const script = SCRIPTS[scenario ?? ""] ?? SCRIPTS.default;
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setStep(0);
    setDone(false);
  }, [scenario]);

  function next() {
    if (step >= script.turns.length - 1) {
      setDone(true);
      toast.success("Roleplay complete (demo)");
      return;
    }
    setStep((s) => s + 1);
  }

  return (
    <DemoPage>
      <PageHeading
        title="Practice with AI customer"
        subtitle={`Scenario: ${script.title}`}
        action={<Chip tone="iris">Simulated</Chip>}
      />
      {!done ? (
        <Panel>
          <PanelHeader title="Live practice" subtitle={`Turn ${step + 1} / ${script.turns.length}`} />
          <div className="space-y-3 p-5">
            {script.turns.slice(0, step + 1).map((l, i) => (
              <div
                key={i}
                className={`rounded-xl px-3 py-2 text-sm ${l.who === "ai" ? "border border-border bg-secondary/30" : "bg-primary/10"}`}
              >
                <p className="text-[10px] uppercase text-muted-foreground">
                  {l.who === "ai" ? "Prospect" : "You"}
                </p>
                <p className="mt-1">{l.text}</p>
              </div>
            ))}
            <button
              type="button"
              onClick={next}
              className="product-btn-primary"
            >
              {step === 0 ? "Start practice" : step >= script.turns.length - 1 ? "Finish" : "Continue"}
            </button>
          </div>
        </Panel>
      ) : (
        <Panel className="p-5">
          <p className="text-sm font-semibold">Score 84</p>
          <p className="mt-2 text-sm text-muted-foreground">Strength: Closing into commitment</p>
          <p className="text-sm text-muted-foreground">Needs work: Keep trust proof ready in writing</p>
          <p className="mt-3 text-xs text-muted-foreground">
            Demo coaching: When buying intent peaks after a trust objection, invite the next concrete step —
            don't add more product features.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded-xl border border-border px-3 py-1.5 text-xs"
              onClick={() => {
                setDone(false);
                setStep(0);
              }}
            >
              Practice again
            </button>
            <Link
              to="/demo/agent/live"
              search={{ mode: "midcall" }}
              className="rounded-xl border border-border px-3 py-1.5 text-xs"
            >
              Back to Sales Workspace
            </Link>
          </div>
        </Panel>
      )}
    </DemoPage>
  );
}
