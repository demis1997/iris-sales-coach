import { z } from "zod";
import type { AppRole } from "@/lib/permissions";

export const companyStepSchema = z.object({
  name: z.string().min(2).max(120),
  industry: z.string().min(1).max(80),
  country: z.string().min(2).max(80),
  timezone: z.string().min(1).max(80),
  companySize: z.string().min(1).max(40),
  primaryUseCase: z.string().min(1).max(120),
  expectedAgentCount: z.coerce.number().int().min(1).max(10000),
  primaryLanguage: z.string().min(2).max(16),
  additionalLanguages: z.array(z.string()).default([]),
});

export const salesProcessStepSchema = z.object({
  productOrService: z.string().min(2).max(500),
  targetCustomer: z.string().min(2).max(500),
  typicalCallType: z.string().min(1).max(80),
  primaryOutcomes: z.array(z.string()).min(1),
  commonObjections: z.array(z.string()).default([]),
  requiredDisclosures: z.array(z.string()).default([]),
  prohibitedClaims: z.array(z.string()).default([]),
  idealCallStructure: z.string().max(2000).optional(),
  conversionEvent: z.string().min(1).max(80),
});

export const teamInviteSchema = z.object({
  email: z.string().email(),
  role: z.enum([
    "owner",
    "admin",
    "ceo",
    "manager",
    "qa",
    "team_leader",
    "rep",
    "viewer",
    "trainer",
  ] as [AppRole, ...AppRole[]]),
  teamName: z.string().min(1).max(80).optional(),
});

export const aiConfigStepSchema = z.object({
  coachingTone: z.enum(["supportive", "direct", "strict"]),
  scoringStrictness: z.enum(["lenient", "balanced", "strict"]),
  complianceSensitivity: z.enum(["low", "standard", "high"]),
  defaultLanguage: z.string().min(2).max(16),
  autoCreateCoachingTasks: z.boolean(),
});

export type CompanyStep = z.infer<typeof companyStepSchema>;
export type SalesProcessStep = z.infer<typeof salesProcessStepSchema>;
export type TeamInvite = z.infer<typeof teamInviteSchema>;
export type AiConfigStep = z.infer<typeof aiConfigStepSchema>;

export type OnboardingWizardState = {
  step: number;
  company?: CompanyStep;
  salesProcess?: SalesProcessStep;
  invites?: TeamInvite[];
  callsSetup?: {
    method: "telephony" | "voip" | "upload" | "demo";
    note?: string;
  };
  ai?: AiConfigStep;
  crm?: {
    provider: "hubspot" | "salesforce" | "zoho" | "pipedrive" | "webhook" | "skip";
  };
};
