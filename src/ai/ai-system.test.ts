/**
 * AI prompt system unit tests — run with: npm run test:ai
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getPromptById,
  listPromptIds,
  listPromptVersions,
  PROMPT_REGISTRY,
} from "@/ai/registry/prompt-registry";
import { createAIService } from "@/ai/services/ai-service";
import {
  PromptRenderError,
  listTemplateVariables,
  renderPrompt,
} from "@/ai/utils/prompt-renderer";
import { SchemaValidationError, validateSchema } from "@/ai/utils/schema-validator";
import { LiveCopilotSchema } from "@/ai/schemas/live-copilot.schema";
import { CallAnalysisSchema } from "@/ai/schemas/call-analysis.schema";

describe("prompt registry", () => {
  it("registers all 13 prompts at 1.0.0", () => {
    const ids = listPromptIds();
    assert.equal(ids.length, 13);
    for (const id of ids) {
      const p = getPromptById(id);
      assert.equal(p.version, "1.0.0");
      assert.ok(p.systemPrompt.length > 100);
      assert.ok(p.userPromptTemplate.length > 50);
      assert.ok(PROMPT_REGISTRY[id]);
    }
    assert.equal(listPromptVersions().length, 13);
  });
});

describe("prompt renderer", () => {
  it("interpolates variables and stringifies objects", () => {
    const out = renderPrompt("Hello {{name}} — {{meta}}", {
      name: "Maria",
      meta: { desk: "Alpha" },
    });
    assert.match(out, /Hello Maria/);
    assert.match(out, /"desk": "Alpha"/);
  });

  it("throws on missing variables", () => {
    assert.throws(
      () => renderPrompt("Hi {{name}} {{missing}}", { name: "x" }),
      (err: unknown) => err instanceof PromptRenderError && err.missing.includes("missing"),
    );
  });

  it("lists template variables", () => {
    const vars = listTemplateVariables("A {{a}} B {{b}} A {{a}}");
    assert.deepEqual(vars.sort(), ["a", "b"]);
  });
});

describe("schema validation", () => {
  it("accepts valid live copilot empty suggestions", () => {
    const data = validateSchema(LiveCopilotSchema, { suggestions: [] });
    assert.deepEqual(data.suggestions, []);
  });

  it("rejects invalid call analysis", () => {
    assert.throws(
      () => validateSchema(CallAnalysisSchema, { summary: 1 }),
      (err: unknown) => err instanceof SchemaValidationError,
    );
  });
});

describe("mock AI service", () => {
  const ai = createAIService("mock");

  it("analyzes a call with price objection fixture", async () => {
    const result = await ai.analyzeCall({
      company_context: { name: "Apex Markets" },
      product_context: { offer: "Trading account" },
      sales_playbook: { stages: ["Opening", "Discovery"] },
      transcript:
        "Rep: Thanks for taking my call.\nProspect: I'm interested but the price feels high.\nRep: Fair — I can send a summary.",
    });
    assert.equal(result.success, true);
    assert.equal(result.provider, "mock");
    assert.equal(result.promptId, "call_analysis");
    assert.equal(result.promptVersion, "1.0.0");
    assert.ok(result.data.summary.length > 0);
  });

  it("returns zero live suggestions when nothing meaningful is said", async () => {
    const result = await ai.getLiveSuggestions({
      rolling_transcript: "Rep: Hello.\nProspect: Hi.\nRep: How are you today?\nProspect: Fine.",
      customer_context: { name: "Client 10821" },
      call_stage: "Opening",
      retrieved_playbook: { tips: [] },
    });
    assert.equal(result.data.suggestions.length, 0);
  });

  it("returns a suggestion for a trust/price objection", async () => {
    const result = await ai.getLiveSuggestions({
      rolling_transcript:
        "Prospect: I'm worried about withdrawals and I lost money before.\nRep: Our platform is great, let me tell you about features.",
      customer_context: { name: "Client 10821" },
      call_stage: "Objection Handling",
      retrieved_playbook: { objections: ["withdrawals"] },
    });
    assert.ok(result.data.suggestions.length >= 1);
    assert.ok(result.data.suggestions.length <= 2);
  });

  it("coaches agent with exactly 3 priorities", async () => {
    const analysis = await ai.analyzeCall({
      company_context: {},
      product_context: {},
      sales_playbook: {},
      transcript: "Rep: Hi\nProspect: Price is expensive\nRep: Ok I'll email you",
    });
    const coaching = await ai.coachAgent({
      transcript: "Rep: Hi\nProspect: Price is expensive\nRep: Ok I'll email you",
      call_analysis: analysis.data,
      agent_profile: { strengths: [] },
      company_playbook: {},
      scorecard: {},
    });
    assert.equal(coaching.data.coachingPriorities.length, 3);
  });
});
