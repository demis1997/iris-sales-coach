import { z } from "zod";

const EvidenceItemSchema = z.object({
  behavior: z.string(),
  timestamp: z.string().optional(),
  evidence: z.string(),
  whyItHelped: z.string().optional(),
  whyItMattered: z.string().optional(),
  recommendation: z.string().optional(),
  howToRepeat: z.string().optional(),
  whatShouldHaveHappened: z.string().optional(),
});

export const AgentCoachingSchema = z.object({
  whatWentWell: z.array(EvidenceItemSchema).default([]),
  whatHurtCall: z.array(EvidenceItemSchema).default([]),
  missedOpportunities: z
    .array(
      z.object({
        timestamp: z.string().optional(),
        evidence: z.string(),
        recommendation: z.string(),
      }),
    )
    .default([]),
  coachingPriorities: z.array(z.string()).length(3),
  nextCallGoal: z.string(),
  replacementLanguage: z
    .array(
      z.object({
        situation: z.string(),
        phrase: z.string(),
      }),
    )
    .default([]),
  practiceExercise: z.object({
    title: z.string(),
    scenario: z.string(),
    successCriteria: z.string(),
  }),
});

export type AgentCoachingOutput = z.infer<typeof AgentCoachingSchema>;
