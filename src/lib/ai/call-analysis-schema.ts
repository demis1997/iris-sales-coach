import { z } from "zod";

export const callAnalysisSchema = z.object({
  summary: z.object({
    concise: z.string(),
    detailed: z.string(),
    customerIntent: z.string().optional(),
    customerNeeds: z.array(z.string()).default([]),
    productsDiscussed: z.array(z.string()).default([]),
    keyFacts: z.array(z.string()).default([]),
  }),
  outcome: z.object({
    category: z.string(),
    converted: z.boolean(),
    conversionConfidence: z.number().min(0).max(1),
    primaryReason: z.string().optional(),
    followUpRequired: z.boolean().default(false),
  }),
  overallScore: z.number().min(0).max(100),
  scores: z.record(
    z.object({
      score: z.number().min(0).max(100),
      explanation: z.string(),
      evidence: z.string().optional(),
      improvement: z.string().optional(),
    }),
  ),
  objections: z
    .array(
      z.object({
        category: z.string(),
        text: z.string(),
        severity: z.enum(["low", "medium", "high"]).default("medium"),
        resolved: z.boolean().default(false),
        betterResponse: z.string().optional(),
      }),
    )
    .default([]),
  coaching: z.object({
    strengths: z.array(z.string()).default([]),
    weaknesses: z.array(z.string()).default([]),
    topImprovements: z.array(z.string()).default([]),
    nextCallGoal: z.string().optional(),
    managerAction: z.string().optional(),
  }),
  nextActions: z
    .array(
      z.object({
        action: z.string(),
        priority: z.enum(["low", "medium", "high"]).default("medium"),
        channel: z.string().optional(),
        suggestedMessage: z.string().optional(),
      }),
    )
    .default([]),
  missedOpportunities: z.array(z.string()).default([]),
  complianceFlags: z
    .array(
      z.object({
        rule: z.string(),
        severity: z.enum(["low", "medium", "high"]).default("medium"),
        evidence: z.string().optional(),
      }),
    )
    .default([]),
  customerAnalysis: z
    .object({
      interestLevel: z.string().optional(),
      sentiment: z.string().optional(),
      buyingIntent: z.string().optional(),
      conversionProbability: z.number().min(0).max(1).optional(),
    })
    .default({}),
});

export type CallAnalysisResult = z.infer<typeof callAnalysisSchema>;
