/** Iris domain types for the authenticated product / demo seed. */

export type Role = "representative" | "manager" | "director" | "executive" | "admin";

export type CallOutcome = "Closed" | "Follow-up" | "Lost" | "No answer" | "Qualified";
export type CallType = "Outbound" | "Inbound" | "Follow-up" | "Discovery";
export type Sentiment = "Positive" | "Neutral" | "Mixed" | "Negative";
export type RiskLevel = "Low" | "Medium" | "High";
export type AnalysisStatus = "Analyzed" | "Processing" | "Failed";
export type CoachingStatus = "None" | "Pending" | "Assigned" | "Completed";
export type MarkerType =
  | "objection"
  | "pricing"
  | "competitor"
  | "positive"
  | "negative"
  | "interruption"
  | "next_step"
  | "compliance";

export type Organisation = {
  id: string;
  name: string;
  industry: string;
  timezone: string;
  settings: {
    languages: string[];
    recordingConsentRequired: boolean;
    retentionDays: number | null;
  };
  createdAt: string;
};

export type Team = {
  id: string;
  organisationId: string;
  managerId: string;
  name: string;
  office: string;
};

export type User = {
  id: string;
  organisationId: string;
  teamId: string;
  role: Role;
  name: string;
  email: string;
  status: "active" | "invited" | "disabled";
  title: string;
  createdAt: string;
};

export type ConversationHealth = "Strong" | "Stable" | "At risk" | "Critical";
export type RiskReason =
  | "Pricing hesitation"
  | "Decision-maker absent"
  | "Competitor evaluation"
  | "No agreed next step"
  | "Weak urgency"
  | "Compliance concern"
  | "Repeated objection"
  | "No recent engagement";

export type Deal = {
  id: string;
  organisationId: string;
  representativeId: string;
  teamId: string;
  accountName: string;
  title: string;
  stage: string;
  value: number;
  currency: "EUR";
  expectedCloseDate: string;
  riskLevel: RiskLevel;
  forecastConfidence: number;
  nextStep: string;
  crmSource: string;
  conversationHealth: ConversationHealth;
  lastInteraction: string;
  riskReasons: RiskReason[];
  stakeholders: string[];
  crmSyncStatus: "Synced" | "Pending" | "Needs mapping";
  irisRecommendation: string;
};

export type Call = {
  id: string;
  organisationId: string;
  teamId: string;
  representativeId: string;
  dealId: string | null;
  externalId: string | null;
  source: "upload" | "aircall" | "zoom" | "teams" | "twilio" | "demo";
  recordingUrl: string | null;
  prospect: string;
  company: string;
  startedAt: string; // ISO
  durationSec: number;
  language: string;
  callType: CallType;
  outcome: CallOutcome;
  analysisStatus: AnalysisStatus;
  coachingStatus: CoachingStatus;
  reviewed: boolean;
};

export type CallAnalysis = {
  id: string;
  callId: string;
  organisationId: string;
  overallScore: number;
  discoveryScore: number;
  listeningScore: number;
  confidenceScore: number;
  pitchScore: number;
  objectionHandlingScore: number;
  closingScore: number;
  playbookScore: number;
  sentiment: Sentiment;
  talkRatio: number;
  interruptions: number;
  strengths: { text: string; timestampSec: number }[];
  weaknesses: { text: string; timestampSec: number }[];
  recommendations: string[];
  topics: string[];
  objections: string[];
  competitors: string[];
  nextSteps: string[];
  risks: string[];
  dealIntel: {
    buyerNeeds: string[];
    painPoints: string[];
    objections: string[];
    decisionCriteria: string[];
    competitors: string[];
    budgetSignals: string;
    urgency: string;
    stakeholders: string[];
    agreedNextStep: string;
    riskLevel: RiskLevel;
  };
};

export type TranscriptSegment = {
  id: string;
  callId: string;
  organisationId: string;
  speaker: "rep" | "prospect";
  speakerName: string;
  startTime: number;
  endTime: number;
  text: string;
  sentiment: Sentiment;
  tags: MarkerType[];
};

export type TimelineMarker = {
  callId: string;
  type: MarkerType;
  atSec: number;
  label: string;
};

export type CoachingItemStatus =
  "suggested" | "assigned" | "in_progress" | "completed" | "dismissed";

export type CoachingItem = {
  id: string;
  organisationId: string;
  userId: string;
  managerId: string;
  skill: string;
  evidence: string;
  recommendation: string;
  suggestedExercise: string;
  status: CoachingItemStatus;
  dueDate: string;
  completedAt: string | null;
  impactEstimate: "High" | "Medium" | "Low";
  relatedCallIds: string[];
  progress: number; // 0–100
  notes: string;
  behaviourImproved: boolean | null;
  planId: string;
};

export type SkillName =
  | "Discovery"
  | "Listening"
  | "Confidence"
  | "Pitch delivery"
  | "Product knowledge"
  | "Objection handling"
  | "Empathy"
  | "Closing"
  | "Next-step discipline"
  | "Playbook adherence";

export type RepresentativeSkillScore = {
  organisationId: string;
  userId: string;
  skills: Record<SkillName, number>;
  overallScore: number;
  previousOverall: number;
  conversionRate: number;
  previousConversion: number;
  communicationStyle: {
    directVsConsultative: "Direct" | "Balanced" | "Consultative";
    conciseVsDetailed: "Concise" | "Balanced" | "Detailed";
    questionVsPresentation: "Question-led" | "Balanced" | "Presentation-led";
    energy: "Calm" | "Balanced" | "High-energy";
  };
  strengths: string[];
  improvementAreas: string[];
  trend: { week: string; score: number; conversion: number }[];
};

export type PlaybookStatus = "draft" | "active" | "archived";
export type PlaybookScope = "company" | "team" | "ai_discovered";

export type PlaybookVersion = {
  id: string;
  playbookId: string;
  organisationId: string;
  version: number;
  changedAt: string;
  changedBy: string;
  summary: string;
};

export type Playbook = {
  id: string;
  organisationId: string;
  teamId: string | null;
  name: string;
  category: string;
  scope: PlaybookScope;
  purpose: string;
  applicableCallTypes: string[];
  requiredBehaviours: string[];
  recommendedPhrases: string[];
  phrasesToAvoid: string[];
  exampleCallIds: string[];
  adoptionScore: number;
  impactTrend: number[];
  ownerId: string;
  status: PlaybookStatus;
  version: number;
};

export type TrainingModule = {
  id: string;
  organisationId: string;
  title: string;
  skill: string;
  type: "lesson" | "roleplay" | "assessment" | "onboarding";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedMinutes: number;
  relatedPlaybookId: string | null;
  relatedCallId: string | null;
  content: string;
};

export type TrainingAssignment = {
  id: string;
  organisationId: string;
  moduleId: string;
  userId: string;
  assignedBy: string;
  dueDate: string;
  status: "assigned" | "in_progress" | "completed";
  score: number | null;
  completedAt: string | null;
};

export type RoleplaySession = {
  id: string;
  organisationId: string;
  userId: string;
  scenario: string;
  persona: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  objection: string;
  mode: "voice" | "text";
  status: "setup" | "active" | "completed";
  overallScore: number | null;
  strengths: string[];
  missedOpportunities: string[];
  suggestedResponse: string;
  createdAt: string;
};

export type Alert = {
  id: string;
  organisationId: string;
  type: string;
  severity: "info" | "warning" | "critical";
  title: string;
  description: string;
  relatedEntityId: string | null;
  createdAt: string;
  resolvedAt: string | null;
};

export type Insight = {
  id: string;
  organisationId: string;
  title: string;
  body: string;
  createdAt: string;
  scope: "org" | "team" | "user";
  teamId?: string;
  userId?: string;
};

export type IntegrationRecord = {
  id: string;
  organisationId: string;
  provider: string;
  status: "Connected" | "Available" | "In development" | "Planned" | "Requires configuration";
  configuration: Record<string, unknown>;
  lastSyncedAt: string | null;
};

export type AuditLog = {
  id: string;
  organisationId: string;
  userId: string;
  action: string;
  resource: string;
  timestamp: string;
  metadata: Record<string, unknown>;
};

export type Lead = {
  id: string;
  name: string;
  email: string;
  company: string;
  title: string;
  teamSize: string;
  industry: string;
  callVolume: string;
  crm: string;
  callingPlatform: string;
  challenge: string;
  preferredContactMethod: string;
  createdAt: string;
};

export type DateRangeKey = "7d" | "30d" | "quarter" | "custom";

export type SessionFilters = {
  dateRange: DateRangeKey;
  customFrom?: string;
  customTo?: string;
  teamId: string | "all";
};
