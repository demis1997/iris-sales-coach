import { z } from "zod";

export const ExecutiveAdvisorSchema = z.object({
  whatChanged: z.array(z.string()).default([]),
  why: z.array(z.string()).default([]),
  revenueOpportunities: z
    .array(
      z.object({
        opportunity: z.string(),
        evidence: z.string(),
      }),
    )
    .default([]),
  organizationalIssues: z
    .array(
      z.object({
        issue: z.string(),
        evidence: z.string(),
        recommendedInvestigation: z.string(),
      }),
    )
    .default([]),
  structuralRecommendations: z
    .array(
      z.object({
        recommendation: z.string(),
        evidence: z.string(),
        expectedBenefit: z.string(),
        risk: z.string(),
        howToTest: z.string(),
      }),
    )
    .default([]),
  top3ActionsThisWeek: z.array(z.string()).length(3),
  risksToWatch: z.array(z.string()).default([]),
  opportunitiesToInvestigate: z.array(z.string()).default([]),
});

export type ExecutiveAdvisorOutput = z.infer<typeof ExecutiveAdvisorSchema>;
