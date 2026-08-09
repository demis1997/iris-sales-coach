import { z } from "zod";

export const WeeklyAgentSchema = z.object({
  yourWeek: z.object({
    calls: z.number().int().nonnegative(),
    conversions: z.number().int().nonnegative(),
    keyImprovement: z.string(),
    primaryWeakness: z.string(),
  }),
  whatImproved: z.array(z.string()).default([]),
  whatIsHoldingYouBack: z.string(),
  bestCall: z.object({
    callId: z.string().optional(),
    why: z.string(),
  }),
  callToReview: z.object({
    callId: z.string().optional(),
    why: z.string(),
  }),
  nextWeekGoal: z.string(),
  practice: z.object({
    scenario: z.string(),
  }),
});

export type WeeklyAgentOutput = z.infer<typeof WeeklyAgentSchema>;
