import { z } from "zod";

export const ManagerAdvisorSchema = z.object({
  topPriorities: z
    .array(
      z.object({
        problem: z.string(),
        evidence: z.string(),
        agentsAffected: z.array(z.string()).default([]),
        businessImpact: z.string(),
        recommendedAction: z.string(),
        priority: z.enum(["Critical", "High", "Medium", "Low"]),
      }),
    )
    .min(1)
    .max(5),
  agentsNeedingAttention: z
    .array(
      z.object({
        agent: z.string(),
        issue: z.string(),
        evidence: z.string(),
        recommendedCoaching: z.string(),
        callsToReview: z.array(z.string()).default([]),
      }),
    )
    .default([]),
  topPerformers: z
    .array(
      z.object({
        agent: z.string(),
        usefulBehavior: z.string(),
        playbookCandidate: z.boolean(),
        evidence: z.string(),
      }),
    )
    .default([]),
  objectionTrends: z.object({
    increasing: z.array(z.string()).default([]),
    resolvedWellBy: z.array(z.string()).default([]),
    strugglingAgents: z.array(z.string()).default([]),
    teachNow: z.string(),
  }),
  coachingPlan: z
    .array(
      z.object({
        who: z.string(),
        skill: z.string(),
        reason: z.string(),
        exercise: z.string(),
        deadline: z.string(),
      }),
    )
    .default([]),
  processProblems: z
    .array(
      z.object({
        problem: z.string(),
        evidence: z.string(),
        systemic: z.boolean(),
      }),
    )
    .default([]),
  managerActionPlan: z.object({
    today: z.array(z.string()).default([]),
    thisWeek: z.array(z.string()).default([]),
    watch: z.array(z.string()).default([]),
  }),
});

export type ManagerAdvisorOutput = z.infer<typeof ManagerAdvisorSchema>;
