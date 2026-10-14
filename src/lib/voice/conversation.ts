import type { ChatMessage, TextChunk } from "@/ai/services/venice-provider";
export type VoicePorts = {
  stream: (messages: ChatMessage[], signal: AbortSignal) => AsyncIterable<TextChunk>;
  speak: (text: string, signal: AbortSignal) => AsyncIterable<Uint8Array>;
  audio: (bytes: Uint8Array) => void;
  clear: () => void;
  event: (event: { type: string; text?: string; stage?: string; latencyMs?: number }) => void;
};
/** One response generation owns output. Interruption invalidates even providers that ignore abort. */
export class Conversation {
  private generation = 0;
  private controller?: AbortController;
  private history: ChatMessage[] = [];
  private closed = false;
  constructor(
    private readonly ports: VoicePorts,
    private readonly system: string,
  ) {}
  interrupt() {
    this.generation++;
    this.controller?.abort();
    this.ports.clear();
    this.ports.event({ type: "interrupted" });
  }
  close() {
    this.closed = true;
    this.interrupt();
  }
  async accept(text: string) {
    if (this.closed || !text.trim() || text.length > 8000) return;
    this.interrupt();
    const generation = this.generation;
    const controller = (this.controller = new AbortController());
    const current = () =>
      !this.closed && generation === this.generation && !controller.signal.aborted;
    this.history.push({ role: "user", content: text });
    this.history = this.history.slice(-20);
    this.ports.event({ type: "transcript", text });
    const started = Date.now();
    let buffer = "",
      whole = "",
      first = true;
    const speak = async (phrase: string) => {
      if (!current()) return;
      if (/\bguaranteed\s+(returns?|profits?)\b|гарантированн\S*\s+(доход|прибыл)/i.test(phrase))
        throw new Error("unsafe_financial_claim");
      const ttsStarted = Date.now();
      let firstAudio = true;
      for await (const bytes of this.ports.speak(phrase, controller.signal)) {
        if (!current()) return;
        if (firstAudio) {
          this.ports.event({
            type: "latency",
            stage: "tts_first_audio",
            latencyMs: Date.now() - ttsStarted,
          });
          firstAudio = false;
        }
        this.ports.audio(bytes);
      }
    };
    try {
      for await (const chunk of this.ports.stream(
        [{ role: "system", content: this.system }, ...this.history],
        controller.signal,
      )) {
        if (!current()) return;
        if (chunk.type !== "text") continue;
        if (first) {
          first = false;
          this.ports.event({
            type: "latency",
            stage: "llm_first_token",
            latencyMs: Date.now() - started,
          });
        }
        buffer += chunk.text;
        whole += chunk.text;
        if (whole.length > 8000) throw new Error("response_bounds");
        if (/[.!?。]\s*$/.test(buffer) || buffer.length >= 160) {
          await speak(buffer);
          buffer = "";
        }
      }
      if (buffer) await speak(buffer);
      if (current()) {
        this.history.push({ role: "assistant", content: whole });
        this.ports.event({ type: "response_generated", text: whole });
      }
    } catch {
      if (current()) {
        this.interrupt();
        this.ports.event({ type: "human_handoff_required" });
      }
    }
  }
}
