import test from "node:test";
import assert from "node:assert/strict";
import { Conversation } from "@/lib/voice/conversation";

test("barge-in drops obsolete audio even when TTS ignores cancellation", async () => {
  let release!: () => void;
  const pending = new Promise<void>((resolve) => {
    release = resolve;
  });
  const audio: number[] = [],
    events: string[] = [];
  const conversation = new Conversation(
    {
      stream: async function* () {
        yield { type: "text", text: "Hello." };
      },
      speak: async function* () {
        await pending;
        yield Uint8Array.of(1);
      },
      audio: (bytes) => audio.push(bytes[0]),
      clear: () => events.push("clear"),
      event: (event) => events.push(event.type),
    },
    "safe system",
  );
  const turn = conversation.accept("Hello");
  await new Promise((resolve) => setImmediate(resolve));
  conversation.interrupt();
  release();
  await turn;
  assert.deepEqual(audio, []);
  assert.ok(events.includes("clear"));
  assert.ok(!events.includes("response_generated"));
});
test("failed or unsafe responses clear audio and request human escalation", async () => {
  const events: string[] = [];
  let audio = 0;
  const conversation = new Conversation(
    {
      stream: async function* () {
        yield { type: "text", text: "Guaranteed profits!" };
      },
      speak: async function* () {
        yield Uint8Array.of(1);
      },
      audio: () => audio++,
      clear: () => {},
      event: (event) => events.push(event.type),
    },
    "safe system",
  );
  await conversation.accept("What are the returns?");
  assert.equal(audio, 0);
  assert.ok(events.includes("human_handoff_required"));
  conversation.close();
  await conversation.accept("more");
  assert.equal(audio, 0);
});

test("complete unpaid voice pipeline uses transcript context, emits audio and records observed latency", async () => {
  const audio: number[] = [],
    events: string[] = [];
  const conversation = new Conversation(
    {
      stream: async function* (messages) {
        assert.ok(messages.some((message) => message.content === "Can I book a demo?"));
        yield { type: "text", text: "An agent can help you arrange a demo." };
      },
      speak: async function* (text) {
        assert.ok(text.includes("demo"));
        yield Uint8Array.of(7, 8);
      },
      audio: (bytes) => audio.push(...bytes),
      clear: () => {},
      event: (event) => events.push(event.type),
    },
    "Use only approved product facts",
  );
  await conversation.accept("Can I book a demo?");
  assert.deepEqual(audio, [7, 8]);
  assert.ok(events.includes("response_generated"));
  assert.ok(events.includes("latency"));
  conversation.close();
});
