import { useEffect, useId, useRef, useState } from "react";
import { Loader2, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useSession } from "@/components/app/session";
import { SUGGESTED_PROMPTS } from "@/lib/demo/ask-iris";
import { askIrisSafe } from "@/lib/ai";
import { cn } from "@/lib/utils";

export function AskIrisPanel({
  open,
  onOpenChange,
  callId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  callId?: string;
}) {
  const { access, allowed } = useSession();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const titleId = useId();
  const inputId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    setMessages([
      {
        role: "assistant",
        content: callId
          ? "Ask about this call’s score, objections, next steps, or recommended playbook."
          : "Ask what is happening across your visible scope — coaching, risk, or performance.",
      },
    ]);
    const t = window.setTimeout(() => closeRef.current?.focus(), 0);
    return () => window.clearTimeout(t);
  }, [open, callId]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  if (!open || !allowed("ask_iris")) return null;

  async function send(text: string) {
    const q = text.trim();
    if (!q) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: q }]);
    setLoading(true);
    try {
      const result = await askIrisSafe({ ctx: access, question: q, callId });
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: result.ok ? result.answer : result.error,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="Close Ask Iris"
        onClick={() => onOpenChange(false)}
      />
      <div
        ref={panelRef}
        className="relative flex h-full w-full max-w-md flex-col border-l border-border bg-card shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary" aria-hidden />
            <div>
              <p id={titleId} className="text-sm font-semibold">
                Ask Iris
              </p>
              <p className="text-[11px] text-muted-foreground">
                Demo responses · model-ready layer
              </p>
            </div>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Close Ask Iris panel"
            className="rounded-md p-1 focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="size-4 text-muted-foreground" />
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5 border-b border-border p-3">
          {(callId
            ? SUGGESTED_PROMPTS
            : SUGGESTED_PROMPTS.slice(0, 3).concat([
                "Which opportunities are most likely to be lost?",
                "What do our top performers do differently?",
              ])
          ).map((p) => (
            <button
              key={p}
              type="button"
              className="rounded-md border border-border px-2 py-1 text-[11px] text-muted-foreground hover:bg-secondary hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
              onClick={() => void send(p)}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite">
          {messages.map((m, i) => (
            <div
              key={i}
              className={cn(
                "rounded-lg px-3 py-2 text-sm leading-relaxed",
                m.role === "assistant"
                  ? "bg-secondary/40 text-foreground"
                  : "ml-6 bg-primary/10 text-foreground",
              )}
            >
              {m.content}
            </div>
          ))}
          {loading ? (
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="size-3.5 animate-spin" aria-hidden /> Thinking…
            </p>
          ) : null}
        </div>

        <form
          className="border-t border-border p-3"
          onSubmit={(e) => {
            e.preventDefault();
            void send(input);
          }}
        >
          <Label htmlFor={inputId} className="sr-only">
            Ask Iris a question
          </Label>
          <Textarea
            id={inputId}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={3}
            placeholder="Ask Iris…"
            disabled={loading}
          />
          <Button type="submit" className="mt-2 w-full" disabled={loading || !input.trim()}>
            Send
          </Button>
        </form>
      </div>
    </div>
  );
}
