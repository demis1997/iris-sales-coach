/** Artemis sales coach — Cursor chat completions prompts. */

export const SALES_COACH_SYSTEM = `You are Artemis AI — an elite B2B sales coach for high-volume sales teams.

You read call transcripts and produce structured coaching that helps the next conversation convert.

Rules:
- Be specific and evidence-based. Ground scores, strengths, weaknesses, and objections in short quotes from the transcript.
- Prefer coaching that helps close deals: discovery quality, pain quantification, value framing, objection handling, next-step control.
- Do not invent facts, products, prices, or outcomes that are not in the transcript.
- If the transcript is incomplete, noisy, or too short, say so in the summary and lower overallScore.
- Return ONLY valid JSON matching the requested schema. No markdown. No commentary outside JSON.
- Speakers may be labeled Agent/Customer, Rep/Prospect, or similar — treat sales-side as the rep.`;

export type SalesCoachPromptContext = {
  transcript: string;
  repName?: string;
  product?: string;
  callType?: string;
  icp?: string;
  contactName?: string;
  contactCompany?: string;
};

export function buildSalesCoachUserPrompt(ctx: SalesCoachPromptContext) {
  return `Analyze this sales call transcript and return coaching JSON with EXACTLY this schema:

{
  "summary": {
    "concise": "1-2 sentence summary",
    "detailed": "3-5 sentence narrative of what happened",
    "customerIntent": "what the customer wanted",
    "customerNeeds": ["need 1"],
    "productsDiscussed": ["product or offer mentioned"],
    "keyFacts": ["fact from the call"]
  },
  "outcome": {
    "category": "Converted|Follow-up|Not interested|No answer|Callback|Compliance review|Unknown",
    "converted": false,
    "conversionConfidence": 0.0,
    "primaryReason": "why this outcome",
    "followUpRequired": true
  },
  "overallScore": 0,
  "scores": {
    "opening": { "score": 0, "explanation": "...", "evidence": "short quote", "improvement": "..." },
    "discovery": { "score": 0, "explanation": "...", "evidence": "short quote", "improvement": "..." },
    "objection_handling": { "score": 0, "explanation": "...", "evidence": "short quote", "improvement": "..." },
    "closing": { "score": 0, "explanation": "...", "evidence": "short quote", "improvement": "..." },
    "compliance": { "score": 0, "explanation": "...", "evidence": "short quote or n/a" },
    "professionalism": { "score": 0, "explanation": "...", "evidence": "short quote" }
  },
  "objections": [
    {
      "category": "Price|Trust|Timing|Competition|Product|Other",
      "text": "customer objection in their words",
      "severity": "low|medium|high",
      "resolved": false,
      "betterResponse": "what the rep should say next time"
    }
  ],
  "coaching": {
    "strengths": ["strength with brief evidence"],
    "weaknesses": ["weakness with brief evidence"],
    "topImprovements": ["highest-leverage fix 1", "fix 2", "fix 3"],
    "nextCallGoal": "single clear goal for the next call",
    "managerAction": "what a manager should assign or review"
  },
  "nextActions": [
    {
      "action": "concrete follow-up",
      "priority": "low|medium|high",
      "channel": "email|phone|whatsapp|crm",
      "suggestedMessage": "short draft the rep can send"
    }
  ],
  "missedOpportunities": ["missed moment"],
  "complianceFlags": [
    { "rule": "rule name", "severity": "low|medium|high", "evidence": "quote if any" }
  ],
  "customerAnalysis": {
    "interestLevel": "low|medium|high",
    "sentiment": "positive|neutral|cautious|negative",
    "buyingIntent": "low|medium|high",
    "conversionProbability": 0.0
  }
}

CONTEXT:
- Rep name: ${ctx.repName || "unknown"}
- Product/offer: ${ctx.product || "unknown"}
- Call type: ${ctx.callType || "unknown"}
- Ideal customer profile: ${ctx.icp || "unknown"}
- Contact name: ${ctx.contactName || "unknown"}
- Contact company: ${ctx.contactCompany || "unknown"}

TRANSCRIPT:
"""
${String(ctx.transcript || "").trim()}
"""

Score overall call quality 0-100. Focus coaching on the one highest-leverage improvement for the next call.
Prefer empty arrays over inventing objections or compliance flags.`;
}
