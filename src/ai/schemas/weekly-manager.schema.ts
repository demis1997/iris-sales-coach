import { z } from "zod";

export const WeeklyManagerSchema = z.object({
  lastWeekInOneSentence: z.string(),
  whatImproved: z.array(z.string()).default([]),
  whatGotWorse: z.array(z.string()).default([]),
  agentsToPayAttentionTo: z.array(z.string()).length(3),
  biggestLostSaleReason: z.string(),
  bestBehaviorToCopy: z.string(),
  coachingPriorities: z.array(z.string()).default([]),
  top3ManagerActionsThisWeek: z.array(z.string()).length(3),
});

export type WeeklyManagerOutput = z.infer<typeof WeeklyManagerSchema>;
