import { z } from "zod";

export const KeyMomentTypeSchema = z.enum([
  "BUYING_SIGNAL",
  "OBJECTION",
  "DISCOVERY",
  "MISSED_OPPORTUNITY",
  "GOOD_PRACTICE",
  "COMPLIANCE_RISK",
  "CLOSING_OPPORTUNITY",
  "CUSTOMER_CONCERN",
  "NEXT_STEP",
]);

export const CallAnalysisSchema = z.object({
  summary: z.string(),
  detailedSummary: z.string(),
  primaryCustomerObjective: z.string(),
  productsDiscussed: z.array(z.string()).default([]),
  commitments: z.array(z.string()).default([]),
  unresolvedIssues: z.array(z.string()).default([]),
  customerSignals: z.object({
    interestLevel: z.enum(["low", "medium", "high", "unknown"]).default("unknown"),
    buyingIntent: z.enum(["low", "medium", "high", "unknown"]).default("unknown"),
    objections: z.array(z.string()).default([]),
    questions: z.array(z.string()).default([]),
    concerns: z.array(z.string()).default([]),
    timingSignals: z.array(z.string()).default([]),
    trustSignals: z.array(z.string()).default([]),
    competitorMentions: z.array(z.string()).default([]),
  }),
  stagesOccurred: z.array(z.string()).default([]),
  outcome: z.object({
    category: z.string(),
    converted: z.boolean(),
    confidence: z.number().min(0).max(1),
    primaryReason: z.string(),
    followUpRequired: z.boolean(),
    nextBestAction: z.string(),
  }),
  keyMoments: z
    .array(
      z.object({
        timestamp: z.string(),
        speaker: z.string(),
        type: KeyMomentTypeSchema,
        description: z.string(),
        whyItMatters: z.string(),
      }),
    )
    .default([]),
});

export type CallAnalysisOutput = z.infer<typeof CallAnalysisSchema>;
