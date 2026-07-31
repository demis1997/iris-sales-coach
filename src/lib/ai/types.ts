/**
 * AI provider abstraction.
 * Demo provider is deterministic. Production providers plug in via env — never ship secrets to the client.
 */

import type { AccessContext } from "@/lib/demo/queries";
import type { Call, CallAnalysis, RoleplaySession } from "@/lib/demo/types";

export type AiProviderName = "demo" | "production";

export type CallAnalysisRequest = {
  call: Call;
  transcriptText: string;
};

export type CoachingGenerationRequest = {
  callId: string;
  analysis: CallAnalysis;
  skillHint?: string;
};

export type FollowUpEmailRequest = {
  call: Call;
  analysis: CallAnalysis;
  recipientName: string;
};

export type CrmUpdateRequest = {
  call: Call;
  analysis: CallAnalysis;
  dealId: string | null;
};

export type AskIrisRequest = {
  ctx: AccessContext;
  question: string;
  callId?: string;
};

export type PlaybookGenerationRequest = {
  organisationId: string;
  theme: string;
  exampleCallIds: string[];
};

export type RoleplayFeedbackRequest = {
  scenario: string;
  difficulty: string;
  objection: string;
  transcript: string;
};

export type AiProvider = {
  name: AiProviderName;
  analyseCall: (
    req: CallAnalysisRequest,
  ) => Promise<Partial<CallAnalysis> & { overallScore: number }>;
  generateCoaching: (req: CoachingGenerationRequest) => Promise<{
    skill: string;
    evidence: string;
    recommendation: string;
    suggestedExercise: string;
  }>;
  generateFollowUpEmail: (req: FollowUpEmailRequest) => Promise<{ subject: string; body: string }>;
  generateCrmUpdate: (req: CrmUpdateRequest) => Promise<{
    nextStep: string;
    sentiment: string;
    risk: string;
    summary: string;
  }>;
  askIris: (req: AskIrisRequest) => Promise<string>;
  generatePlaybook: (req: PlaybookGenerationRequest) => Promise<{
    name: string;
    purpose: string;
    recommendedPhrases: string[];
    phrasesToAvoid: string[];
  }>;
  roleplayFeedback: (
    req: RoleplayFeedbackRequest,
  ) => Promise<
    Pick<
      RoleplaySession,
      "overallScore" | "strengths" | "missedOpportunities" | "suggestedResponse"
    >
  >;
};

export function getConfiguredProviderName(): AiProviderName {
  const raw =
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_AI_PROVIDER) ||
    (typeof process !== "undefined" && process.env?.IRIS_AI_PROVIDER) ||
    "demo";
  return raw === "production" ? "production" : "demo";
}
