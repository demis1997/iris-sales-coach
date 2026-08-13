/** Shared AI / analytics interfaces — MockAIService returns these; OpenAIService can later. */

export type DemoRole = "ceo" | "manager" | "agent" | "admin";

export type CallScore = {
  overall: number;
  opening: number;
  discovery: number;
  listening: number;
  productKnowledge: number;
  objectionHandling: number;
  closing: number;
  compliance: number;
};

export type CoachingRecommendation = {
  id: string;
  title: string;
  detail: string;
  timestamp?: string;
  priority: "high" | "medium" | "low";
};

export type ExecutiveInsight = {
  id: string;
  headline: string;
  body: string;
  impact?: string;
};

export type LiveSuggestion = {
  id: string;
  atMs: number;
  kind: "objection" | "trust" | "close" | "compliance" | "discovery";
  label: string;
  suggestion: string;
  script?: string;
};

export type RepSkillProfile = {
  confidence: number;
  discovery: number;
  listening: number;
  productKnowledge: number;
  objectionHandling: number;
  closing: number;
  compliance: number;
  strongest: string;
  fastestImproving: string;
  focusThisWeek: string;
};

export type NextBestAction = {
  title: string;
  reason: string;
  suggestedMessage?: string;
  due?: string;
};

export type AIAnalysis = {
  intent: "very_high" | "high" | "medium" | "low";
  outcome: string;
  conversionProbability: number;
  dealRisk: "high" | "medium" | "low";
  primaryObjection: string;
  recommendedAction: string;
  scores: CallScore;
  coaching: CoachingRecommendation[];
  nextBestAction: NextBestAction;
  summary: string;
};

export type DemoTeam = {
  id: string;
  name: string;
  managerId: string;
  managerName: string;
  deposits: number;
  ftds: number;
  conversion: number;
  calls: number;
  avgQuality: number;
  agents: number;
};

export type DemoAgent = {
  id: string;
  name: string;
  initials: string;
  teamId: string;
  teamName: string;
  role: "agent" | "manager" | "ceo";
  calls: number;
  reached: number;
  ftds: number;
  conversion: number;
  deposits: number;
  aiScore: number;
  trend: number;
  coachingStatus: "on_track" | "assigned" | "overdue" | "none";
  skills: RepSkillProfile;
  managerId?: string;
};

export type DemoManager = {
  id: string;
  name: string;
  teamId: string;
  teamName: string;
  teamConversionDelta: number;
  coachingCompletion: number;
};

export type TranscriptLine = {
  id: string;
  at: string;
  speaker: "agent" | "prospect" | "system";
  name: string;
  text: string;
  highlight?: "good" | "opportunity" | "risk" | "objection";
};

export type DemoCall = {
  id: string;
  contactId: string;
  contactLabel: string;
  agentId: string;
  agentName: string;
  teamId: string;
  teamName: string;
  startedAt: string;
  duration: string;
  outcome: string;
  intent: "very_high" | "high" | "medium" | "low";
  primaryObjection: string;
  estimatedValue: number;
  aiScore: number;
  direction: "outbound" | "inbound";
  lostReason?: string;
  storyBeat?: "daniel_lost_close" | "maria_followup" | "trust_win";
  analysis: AIAnalysis;
  transcript: TranscriptLine[];
};

export type DemoContact = {
  id: string;
  label: string;
  country: string;
  leadSource: string;
  agentId: string;
  agentName: string;
  status: string;
  intent: "very_high" | "high" | "medium" | "low";
  primaryObjection: string;
  estimatedValue: number;
  callIds: string[];
};

export type DemoOpportunity = {
  id: string;
  contactId: string;
  contactLabel: string;
  agentId: string;
  agentName: string;
  intent: "very_high" | "high" | "medium" | "low";
  lastCallAgo: string;
  primaryObjection: string;
  estimatedValue: number;
  nextAction: string;
  callId: string;
};

export type LiveFloorAgent = {
  agentId: string;
  name: string;
  status: "live" | "wrap" | "available" | "break";
  duration?: string;
  signal?: "high_intent" | "objection" | "compliance" | "ai_assisting" | null;
  callId?: string;
};

export type CoachingAssignment = {
  id: string;
  agentId: string;
  agentName: string;
  weakness: string;
  evidence: string;
  recommendation: string;
  assignment: string;
  due: string;
  status: "open" | "done";
};
