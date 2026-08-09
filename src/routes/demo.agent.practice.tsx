import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { DemoPage } from "@/components/demo/demo-shell";
import { Chip, PageHeading, Panel, PanelHeader } from "@/components/iris/primitives";

const SCRIPT = [
  { who: "ai", text: "Hi — I'm interested in opening an account but I've had bad experiences with withdrawals." },
  { who: "you", text: "That's completely fair. Can I walk you through how withdrawals work here before anything else?" },
  { who: "ai", text: "Okay… but how long does it actually take once I'm verified?" },
  { who: "you", text: "For verified accounts we process same day in most cases, and I'll send the steps in writing." },
];

export const Route = createFileRoute("/demo/agent/practice")({
  component: RoleplayPage,
});

function RoleplayPage() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  function next() {
    if (step >= SCRIPT.length - 1) {
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
        subtitle="Scenario: Skeptical investor · Hard · Trust / Risk / Withdrawals"
        action={<Chip tone="iris">Simulated</Chip>}
      />
      {!done ? (
        <Panel>
          <PanelHeader title="Live practice" subtitle={`Turn ${step + 1} / ${SCRIPT.length}`} />
          <div className="space-y-3 p-5">
            {SCRIPT.slice(0, step + 1).map((l, i) => (
              <div
                key={i}
                className={`rounded-xl px-3 py-2 text-sm ${l.who === "ai" ? "border border-border bg-secondary/30" : "bg-primary/10"}`}
              >
                <p className="text-[10px] uppercase text-muted-foreground">{l.who === "ai" ? "Prospect" : "You"}</p>
                <p className="mt-1">{l.text}</p>
              </div>
            ))}
            <button type="button" onClick={next} className="rounded-xl gradient-surface px-4 py-2 text-sm font-semibold text-background">
              {step === 0 ? "Start practice" : step >= SCRIPT.length - 1 ? "Finish" : "Continue"}
            </button>
          </div>
        </Panel>
      ) : (
        <Panel className="p-5">
          <p className="text-sm font-semibold">Score 78</p>
          <p className="mt-2 text-sm text-muted-foreground">Strength: Discovery</p>
          <p className="text-sm text-muted-foreground">Needs work: Trust objection depth</p>
          <p className="mt-3 text-xs text-muted-foreground">
            Demo coaching: Acknowledge fear, explain policy with a concrete timeframe, send written proof, then invite
            KYC — never pitch products while trust is unresolved.
          </p>
          <button
            type="button"
            className="mt-4 rounded-xl border border-border px-3 py-1.5 text-xs"
            onClick={() => {
              setDone(false);
              setStep(0);
            }}
          >
            Practice again
          </button>
        </Panel>
      )}
    </DemoPage>
  );
}
