export const SALES_COACH_SYSTEM = `You are an elite B2B sales coach. You analyze sales call transcripts and give actionable coaching.

Rules:
- Be specific and evidence-based: every strength/improvement must cite a short quote from the transcript.
- Prefer coaching that helps close deals: discovery quality, pain quantification, value framing, objection handling, next-step control.
- Do not invent facts that are not in the transcript.
- If transcript is incomplete/noisy, say so in summary and reflect that in overallScore.
- Return ONLY valid JSON. No markdown.`;

export function buildSalesCoachUserPrompt({
  transcript,
  repName = "",
  product = "",
  callType = "",
  icp = "",
} = {}) {
  return `Analyze this sales call transcript and return coaching JSON with this schema:

{
  "summary": "2-4 sentence call summary",
  "overallScore": 0-100,
  "stage": "discovery|demo|negotiation|close|follow_up|unknown",
  "outcomeSignals": ["..."],
  "strengths": [{ "point": "...", "evidence": "quote" }],
  "improvements": [{ "point": "...", "evidence": "quote", "betterLine": "suggested alternative" }],
  "objectionHandling": [{ "objection": "...", "whatRepDid": "...", "betterApproach": "..." }],
  "talkListenBalance": { "repTalkPctEstimate": 0-100, "note": "..." },
  "nextSteps": ["..."],
  "coachingPlan": {
    "focusSkill": "discovery|objection_handling|closing|value_framing|listening",
    "drills": ["..."],
    "oneThingToImproveNextCall": "..."
  },
  "keyQuotes": [{ "speaker": "rep|prospect|unknown", "quote": "..." }]
}

CONTEXT:
- Rep name: ${repName || "unknown"}
- Product/offer: ${product || "unknown"}
- Call type: ${callType || "unknown"}
- Ideal customer profile: ${icp || "unknown"}

TRANSCRIPT:
"""
${String(transcript || "").trim()}
"""

Score overall call quality 0-100. Focus coaching on the one highest-leverage improvement for the next call.`;
}
