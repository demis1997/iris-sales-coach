import { z } from "zod";

export const WinningBehaviorsSchema = z.object({
  patterns: z
    .array(
      z.object({
        behavior: z.string(),
        winningCallEvidence: z.array(z.string()).default([]),
        comparisonEvidence: z.array(z.string()).default([]),
        frequency: z.string(),
        confidence: z.number().min(0).max(1),
        possiblePlaybookUpdate: z.string(),
      }),
    )
    .default([]),
  notes: z.string().optional(),
});

export type WinningBehaviorsOutput = z.infer<typeof WinningBehaviorsSchema>;
