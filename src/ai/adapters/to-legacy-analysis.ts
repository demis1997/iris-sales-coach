import type { CallAnalysisOutput } from "@/ai/schemas/call-analysis.schema";
import type { AgentCoachingOutput } from "@/ai/schemas/agent-coaching.schema";
import type { CallAnalysisResult } from "@/lib/ai/call-analysis-schema";
import { callAnalysisSchema } from "@/lib/ai/call-analysis-schema";
import type { PostCallReview } from "@/lib/demo/live-call/types";

/**
 * Map the new call_analysis + agent_coaching outputs into the legacy
 * CallAnalysisResult shape used by processCallAnalysis / app call review UI.
 */
export function toLegacyCallAnalysis(
  analysis: CallAnalysisOutput,
  coaching?: AgentCoachingOutput,
): CallAnalysisResult {
  return callAnalysisSchema.parse({
    summary: {
      concise: analysis.summary,
      detailed: analysis.detailedSummary,
      customerIntent: analysis.primaryCustomerObjective,
      customerNeeds: analysis.customerSignals.concerns,
      productsDiscussed: analysis.productsDiscussed,
      keyFacts: [
        ...analysis.commitments.map((c) => `Commitment: ${c}`),
        ...analysis.unresolvedIssues.map((u) => `Unresolved: ${u}`),
      ],
    },
    outcome: {
      category: analysis.outcome.category,
      converted: analysis.outcome.converted,
      conversionConfidence: analysis.outcome.confidence,
      primaryReason: analysis.outcome.primaryReason,
      followUpRequired: analysis.outcome.followUpRequired,
    },
    overallScore: 70,
    scores: {
      discovery: {
        score: 65,
        explanation: "Derived from structured analysis pipeline.",
        evidence: analysis.keyMoments.find((m) => m.type === "DISCOVERY")?.description,
      },
      objection_handling: {
        score: 65,
        explanation: "See objections and key moments for evidence.",
        evidence: analysis.customerSignals.objections[0],
      },
      closing: {
        score: 65,
        explanation: analysis.outcome.nextBestAction,
      },
    },
    objections: analysis.customerSignals.objections.map((o) => ({
      category: "Other",
      text: o,
      severity: "medium" as const,
      resolved: false,
    })),
    coaching: {
      strengths: (coaching?.whatWentWell ?? []).map((w) => w.behavior),
      weaknesses: (coaching?.whatHurtCall ?? []).map((w) => w.behavior),
      topImprovements: coaching?.coachingPriorities ?? [analysis.outcome.nextBestAction],
      nextCallGoal: coaching?.nextCallGoal ?? analysis.outcome.nextBestAction,
      managerAction: coaching?.practiceExercise.title,
    },
    nextActions: [
      {
        action: analysis.outcome.nextBestAction,
        priority: "high" as const,
        channel: "email",
      },
    ],
    missedOpportunities: (coaching?.missedOpportunities ?? []).map((m) => m.evidence),
    complianceFlags: analysis.keyMoments
      .filter((m) => m.type === "COMPLIANCE_RISK")
      .map((m) => ({
        rule: m.description,
        severity: "medium" as const,
        evidence: m.timestamp,
      })),
    customerAnalysis: {
      interestLevel: analysis.customerSignals.interestLevel,
      sentiment: "cautious",
      buyingIntent: analysis.customerSignals.buyingIntent,
      conversionProbability: analysis.outcome.confidence,
    },
  });
}

export function toPostCallReview(
  analysis: CallAnalysisOutput,
  coaching?: AgentCoachingOutput,
): PostCallReview {
  const hurt = coaching?.whatHurtCall[0];
  const miss = coaching?.missedOpportunities[0];
  const phrase = coaching?.replacementLanguage[0];

  return {
    outcome: analysis.outcome.category,
    intent: analysis.primaryCustomerObjective,
    aiScore: 70,
    conversionProbability: Math.round(analysis.outcome.confidence * 100),
    primaryObjection: analysis.customerSignals.objections[0] || "None detected",
    nextBestAction: analysis.outcome.nextBestAction,
    didWell: (coaching?.whatWentWell ?? []).map((w) => w.behavior).slice(0, 4),
    missedAt: hurt?.timestamp || miss?.timestamp || "Key moment",
    missedClient: miss?.evidence || analysis.customerSignals.concerns[0] || hurt?.evidence || "",
    missedAgent: hurt?.behavior || "Continued without fully isolating the concern",
    missedInsight: coaching?.nextCallGoal || analysis.outcome.nextBestAction,
    tryInsteadOf: hurt?.behavior || "The weaker moment in the call",
    tryInstead: phrase?.phrase || hurt?.whatShouldHaveHappened || coaching?.coachingPriorities[0] || "",
    followUpTitle: analysis.outcome.nextBestAction,
    followUpReason: analysis.outcome.primaryReason,
    suggestedWhatsApp: `Thanks for the chat — next step: ${analysis.outcome.nextBestAction}.`,
  };
}
