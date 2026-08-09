import { z } from "zod";

export const NextBestActionSchema = z.object({
  nextAction: z.string(),
  priority: z.enum(["Critical", "High", "Medium", "Low"]),
  when: z.string(),
  why: z.string(),
  channel: z.enum(["Call", "Email", "WhatsApp", "SMS", "Meeting", "Other"]),
  message: z.string().optional(),
  dealRisk: z.enum(["Low", "Medium", "High"]),
  humanReviewRequired: z.boolean(),
});

export type NextBestActionOutput = z.infer<typeof NextBestActionSchema>;
