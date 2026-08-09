import { z } from "zod";

export const ScoreCategoryStatusSchema = z.enum([
  "SCORED",
  "NOT_ENOUGH_EVIDENCE",
  "NOT_RELEVANT",
]);

export const CallScoringSchema = z.object({
  overallScore: z.number().min(0).max(100).nullable(),
  categories: z.array(
    z.object({
      name: z.string(),
      score: z.number().min(0).max(100).nullable(),
      status: ScoreCategoryStatusSchema,
      confidence: z.number().min(0).max(1),
      evidence: z.array(z.string()).default([]),
      timestamps: z.array(z.string()).default([]),
      explanation: z.string(),
      recommendedImprovement: z.string().optional(),
    }),
  ),
});

export type CallScoringOutput = z.infer<typeof CallScoringSchema>;
