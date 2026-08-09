import { z } from "zod";

export const WeeklyExecutiveSchema = z.object({
  executiveSummary: z.string(),
  revenue: z.string(),
  why: z.string(),
  biggestOpportunity: z.string(),
  biggestRisk: z.string(),
  teams: z.string(),
  management: z.string(),
  customerSignal: z.string(),
  threeDecisionsOrActions: z.array(z.string()).length(3),
});

export type WeeklyExecutiveOutput = z.infer<typeof WeeklyExecutiveSchema>;
