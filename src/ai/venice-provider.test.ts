import assert from "node:assert/strict";
import test from "node:test";
import { z } from "zod";
import { VeniceProvider } from "@/ai/services/venice-provider";
import { createAIProvider } from "@/ai/services/ai-service";
import { parseDeepgram, transcribeAudio } from "@/lib/ai/transcription.server";
import { readBounded } from "@/lib/providers/http.server";
const args = {
  systemPrompt: "A JSON coach",
  userPrompt: "Observed conversation",
  schema: z.object({ summary: z.string() }),
  modelTier: "fast" as const,
  promptId: "call_analysis" as const,
  promptVersion: "1.0.0" as const,
};
const success = () =>
  Response.json({
    model: "test-model",
    choices: [{ message: { content: '{"summary":"Evidence only"}' } }],
    usage: { prompt_tokens: 10, completion_tokens: 5 },
  });
test("Venice adapter sends server bearer, configured model and parses validated structured output/usage", async () => {
  let calls = 0;
  const provider = new VeniceProvider({
    apiKey: "test-secret",
    model: "configured-model",
    inputUsdPerMillion: 1,
    outputUsdPerMillion: 2,
    fetch: async (input, init) => {
      calls++;
      assert.equal(input, "https://api.venice.ai/api/v1/chat/completions");
      assert.equal(new Headers(init?.headers).get("authorization"), "Bearer test-secret");
      const body = JSON.parse(init!.body as string);
      assert.equal(body.model, "configured-model");
      assert.ok(body.messages[0].content.includes("untrusted"));
      return success();
    },
  });
  const result = await provider.generateStructured(args);
  assert.equal(calls, 1);
  assert.equal(result.success, true);
  assert.equal(result.data.summary, "Evidence only");
  assert.equal(result.inputTokens, 10);
  assert.equal(result.estimatedCost, 0.00002);
});
test("Venice model fallback is explicit; provider rejection never fabricates analysis", async () => {
  const models: string[] = [];
  const provider = new VeniceProvider({
    apiKey: "test",
    model: "missing",
    fallbackModel: "fallback",
    fetch: async (_url, init) => {
      models.push(JSON.parse(init!.body as string).model);
      return models.length === 1 ? new Response("not found", { status: 404 }) : success();
    },
  });
  assert.equal((await provider.generateStructured(args)).success, true);
  assert.deepEqual(models, ["missing", "fallback"]);
  const failed = new VeniceProvider({
    apiKey: "test",
    model: "model",
    fetch: async () => new Response("SECRET transcript", { status: 401 }),
  });
  const result = await failed.generateStructured(args);
  assert.equal(result.success, false);
  assert.ok(!JSON.stringify(result).includes("SECRET"));
  assert.equal(result.data, undefined);
});
test("SSE parser survives split UTF-8/frames, reports usage and rejects truncated streams", async () => {
  const text =
    'data: {"choices":[{"delta":{"content":"Привет"}}]}\n\ndata: {"choices":[],"usage":{"prompt_tokens":2,"completion_tokens":3}}\n\ndata: [DONE]\n\n';
  const bytes = new TextEncoder().encode(text);
  const provider = new VeniceProvider({
    apiKey: "test",
    model: "model",
    fetch: async () =>
      new Response(
        new ReadableStream({
          start(controller) {
            for (const byte of bytes) controller.enqueue(Uint8Array.of(byte));
            controller.close();
          },
        }),
      ),
  });
  const events = [];
  for await (const chunk of provider.stream([{ role: "user", content: "Hello" }]))
    events.push(chunk);
  assert.equal(events[0].type, "text");
  assert.equal(events[1].type, "usage");
  assert.ok(JSON.stringify(events).includes("Привет"));
  const broken = new VeniceProvider({
    apiKey: "test",
    model: "model",
    fetch: async () => new Response(text.replace("data: [DONE]\n\n", "")),
  });
  await assert.rejects(async () => {
    for await (const _chunk of broken.stream([])) {
      /* drain */
    }
  }, /stream_interrupted/);
});
test("cancelled responses make no network request and unknown costs remain unknown", async () => {
  let calls = 0;
  const provider = new VeniceProvider({
    apiKey: "test",
    model: "model",
    fetch: async () => {
      calls++;
      return success();
    },
  });
  const controller = new AbortController();
  controller.abort();
  await assert.rejects(async () => {
    for await (const _chunk of provider.stream([], controller.signal)) {
      /* drain */
    }
  });
  assert.equal(calls, 0);
  assert.equal((await provider.generateStructured(args)).estimatedCost, null);
  assert.throws(() => createAIProvider("venice"), /configuration_missing/);
});
test("transcription requires a real provider; timestamps and anonymous speakers come from speech output", async () => {
  const audio = new Blob(["test-audio"], { type: "audio/mpeg" });
  await assert.rejects(() => transcribeAudio(audio, "en", ""), /no transcript was fabricated/);
  const payload = {
    results: {
      channels: [
        {
          alternatives: [
            { transcript: "Hello", words: [{ word: "Hello", start: 1.2, end: 1.8, speaker: 1 }] },
          ],
        },
      ],
    },
  };
  const speech = parseDeepgram(payload);
  assert.equal(speech.segments[0].start_ms, 1200);
  assert.equal(speech.segments[0].speaker_type, "unknown");
  const result = await transcribeAudio(audio, "ru", "test", async (_url, init) => {
    assert.equal(new Headers(init?.headers).get("authorization"), "Token test");
    return Response.json(payload);
  });
  assert.ok(result.text.includes("Speaker 1"));
  await assert.rejects(() => readBounded(new Response("123456"), 5), /too_large/);
});

test("Venice retry is bounded on overload and malformed output cannot become success", async () => {
  let calls = 0;
  const provider = new VeniceProvider({
    apiKey: "test",
    model: "model",
    fetch: async () => {
      calls++;
      return calls === 1 ? new Response("busy", { status: 503 }) : success();
    },
  });
  assert.equal((await provider.generateStructured(args)).success, true);
  assert.equal(calls, 2);
  const invalid = new VeniceProvider({
    apiKey: "test",
    model: "model",
    fetch: async () => Response.json({ choices: [{ message: { content: '{"summary":42}' } }] }),
  });
  assert.equal((await invalid.generateStructured(args)).success, false);
});
