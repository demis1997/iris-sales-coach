import { z } from "zod";

export const ObjectionAnalysisSchema = z.object({
  objections: z
    .array(
      z.object({
        category: z.string(),
        customerObjection: z.string(),
        timestamp: z.string().optional(),
        agentResponse: z.string(),
        effectiveness: z.number().min(0).max(100),
        why: z.string(),
        resolved: z.enum(["true", "false", "uncertain"]),
        betterResponse: z.string(),
        followUpImplication: z.string(),
      }),
    )
    .default([]),
});

export type ObjectionAnalysisOutput = z.infer<typeof ObjectionAnalysisSchema>;
