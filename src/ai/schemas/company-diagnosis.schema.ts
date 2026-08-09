import { z } from "zod";

export const CompanyDiagnosisSchema = z.object({
  findings: z.array(
    z.object({
      area: z.enum([
        "PEOPLE",
        "PROCESS",
        "LEAD_QUALITY",
        "PRODUCT",
        "PRICING",
        "TRAINING",
        "MANAGEMENT",
        "FOLLOW_UP",
        "COMPLIANCE",
      ]),
      finding: z.string(),
      evidence: z.string(),
      confidence: z.number().min(0).max(1),
      scope: z.string(),
      estimatedImpact: z.string(),
      recommendedExperiment: z.string(),
    }),
  ),
});

export type CompanyDiagnosisOutput = z.infer<typeof CompanyDiagnosisSchema>;
