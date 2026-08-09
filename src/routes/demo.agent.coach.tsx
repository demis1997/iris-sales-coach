import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DemoPage } from "@/components/demo/demo-shell";
import { useDemoQuery } from "@/components/demo/use-demo-query";
import { Chip, PageHeading, Panel, PanelHeader } from "@/components/iris/primitives";
import { demoService } from "@/lib/demo/demo-service";

const QUESTIONS = [
  "Why did I lose my last call?",
  "How should I handle withdrawal objections?",
  "What am I doing differently from top performers?",
  "What should I focus on today?",
];

export const Route = createFileRoute("/demo/agent/coach")({
  component: AskRelayPage,
});

function AskRelayPage() {
  const [q, setQ] = useState<string | null>(null);
  const [answer, setAnswer] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function ask(question: string) {
    setQ(question);
    setBusy(true);
    setAnswer(null);
    const res = await demoService.askRelay(question);
    setAnswer(res);
    setBusy(false);
  }

  return (
    <DemoPage>
      <PageHeading title="Ask Artemis" subtitle="Personal coach · deterministic demo answers" action={<Chip tone="iris">Simulated AI</Chip>} />
      <Panel>
        <PanelHeader title="Suggested questions" />
        <div className="flex flex-wrap gap-2 p-5">
          {QUESTIONS.map((question) => (
            <button
              key={question}
              type="button"
              onClick={() => void ask(question)}
              className="rounded-xl border border-border px-3 py-2 text-left text-xs hover:bg-secondary"
            >
              {question}
            </button>
          ))}
        </div>
        {(q || answer || busy) && (
          <div className="space-y-3 border-t border-border p-5 text-sm">
            {q ? <p className="font-medium">You: {q}</p> : null}
            {busy ? <p className="text-muted-foreground">Thinking…</p> : null}
            {answer ? (
              <div className="rounded-xl bg-primary/10 p-4 text-muted-foreground">
                <p className="mb-1 text-xs font-medium text-primary">Artemis</p>
                {answer}
              </div>
            ) : null}
          </div>
        )}
      </Panel>
    </DemoPage>
  );
}
