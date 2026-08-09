import { z } from "zod";

export const LiveCopilotSchema = z.object({
  suggestions: z
    .array(
      z.object({
        type: z.string(),
        priority: z.enum(["low", "medium", "high", "critical"]),
        shortTitle: z.string(),
        reason: z.string(),
        suggestedAction: z.string(),
        optionalPhrase: z.string().optional(),
        expiresAfterSeconds: z.number().int().positive().optional(),
      }),
    )
    .max(2)
    .default([]),
});

export type LiveCopilotOutput = z.infer<typeof LiveCopilotSchema>;
