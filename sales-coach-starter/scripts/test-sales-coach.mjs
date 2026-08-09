/**
 * Smoke test: node scripts/test-sales-coach.mjs
 * Loads env from sales-coach-starter/.env or parent ../.env when present.
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { coachFromTranscript } from "../salesCoach/coach.js";

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
loadEnvFile(join(root, "..", ".env"));

if (!process.env.CURSOR_API_ENDPOINT) {
  process.env.CURSOR_API_ENDPOINT = "https://api.cursor.com/v1/chat/completions";
}
if (!process.env.CURSOR_MODEL) {
  process.env.CURSOR_MODEL = "composer-2";
}

const SAMPLE_TRANSCRIPT = `
Rep: Hi Sarah, thanks for taking the time — I'm Alex from Acme CRM. How's your afternoon?
Prospect: Busy, but I can give you 15 minutes. We looked at a few CRMs last year and nothing stuck.
Rep: Got it. So tell me a bit about your team — how many reps, and what's the biggest friction in your current process?
Prospect: We have about 25 AEs. Pipeline visibility is a mess; managers don't trust the forecast.
Rep: Yeah, that's common. Our product has dashboards and AI summaries. Pricing starts at around $80 a seat.
Prospect: $80 feels high. We also worry about adoption — last tool died because reps hated the UI.
Rep: Fair. A lot of customers say that. I can send a one-pager and we can reconnect next quarter if you want.
Prospect: Sure, send it over. I need to jump.
Rep: Great, I'll email that today. Thanks Sarah.
`.trim();

const { coaching } = await coachFromTranscript(SAMPLE_TRANSCRIPT, {
  repName: "Alex",
  product: "Acme CRM",
  callType: "discovery",
  icp: "Mid-market B2B sales teams, 10–100 AEs",
});

console.log("overallScore:", coaching?.overallScore);
console.log(
  "oneThingToImproveNextCall:",
  coaching?.coachingPlan?.oneThingToImproveNextCall,
);
if (process.env.DEBUG_LLM) {
  console.log(JSON.stringify(coaching, null, 2));
}
