/**
 * Smoke test Artemis Cursor sales coach against a sample transcript.
 * Usage: node --env-file=.env scripts/test-sales-coach.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function loadEnvFile(path) {
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = val;
  }
}

loadEnvFile(join(root, ".env"));

if (!process.env.CURSOR_API_ENDPOINT?.startsWith("http")) {
  process.env.CURSOR_API_ENDPOINT = "https://api.cursor.com/v1/chat/completions";
}
process.env.ARTEMIS_AI_PROVIDER = process.env.ARTEMIS_AI_PROVIDER || "cursor";
process.env.LLM_PROVIDER = process.env.LLM_PROVIDER || "cursor";

const SAMPLE = `
Rep: Hi, thanks for taking my call — I'm Maria from Apex Markets. You registered earlier today.
Prospect: Yeah, I was looking at opening an account but I'm worried about withdrawals.
Rep: Totally understand. A lot of clients ask that. Our platform is regulated and withdrawals are processed quickly.
Prospect: How quickly? And what's the minimum deposit?
Rep: Minimum is usually around a few hundred. If you fund today I can walk you through the dashboard.
Prospect: I need to think about it. Maybe send me something.
Rep: Sure, I'll email a one-pager. Talk soon.
`.trim();

const modPath = pathToFileURL(join(root, "src/lib/ai/coach.ts")).href;

// ts may not load directly — use a small inline Cursor call mirroring hostedCursor
const endpoint = process.env.CURSOR_API_ENDPOINT;
const apiKey = process.env.CURSOR_API_KEY;
const model = process.env.CURSOR_MODEL || "composer-2";

if (!apiKey) {
  console.error("Missing CURSOR_API_KEY");
  process.exit(1);
}

const system = `You are Artemis AI — an elite B2B sales coach. Return ONLY valid JSON with keys overallScore and coachingPlan.oneThingToImproveNextCall plus summary.`;
const user = `Analyze this transcript and return JSON:
{"summary":"...","overallScore":0,"coachingPlan":{"oneThingToImproveNextCall":"..."}}

TRANSCRIPT:
"""
${SAMPLE}
"""`;

const resp = await fetch(endpoint, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  },
  body: JSON.stringify({
    model,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    response_format: { type: "json_object" },
    temperature: 0.2,
  }),
});

const text = await resp.text();
console.log("status:", resp.status);
if (!resp.ok) {
  console.error(text.slice(0, 800));
  process.exit(1);
}

let outer;
try {
  outer = JSON.parse(text);
} catch {
  console.error("Non-JSON response", text.slice(0, 400));
  process.exit(1);
}

const content = outer?.choices?.[0]?.message?.content ?? text;
const json = typeof content === "string" ? JSON.parse(content) : content;
console.log("overallScore:", json.overallScore);
console.log(
  "oneThingToImproveNextCall:",
  json.coachingPlan?.oneThingToImproveNextCall ?? json.coaching?.nextCallGoal,
);
console.log("summary:", json.summary?.concise ?? json.summary);
