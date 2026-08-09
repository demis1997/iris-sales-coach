import { DEMO_COMPANY, DEMO_FUNNEL, DEMO_KPIS, DEMO_LOSS_REASONS, EXECUTIVE_BRIEF, COACHING_ROI } from "@/data/demo/company";
import { DEMO_AGENTS, agentsForTeam, getAgent } from "@/data/demo/agents";
import { ALL_DEMO_CALLS, getCall } from "@/data/demo/calls";
import { DEMO_CONTACTS, DEMO_OPPORTUNITIES } from "@/data/demo/contacts";
import { DEMO_TEAMS, DEMO_MANAGERS } from "@/data/demo/teams";
import {
  ASK_RELAY_ANSWERS,
  DEMO_COACHING,
  LIVE_FLOOR,
  LIVE_SUGGESTIONS,
  MANAGER_ATTENTION,
  WINNING_PATTERNS,
} from "@/data/demo/coaching";

function delay<T>(value: T, ms = 280 + Math.floor(Math.random() * 280)): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

/** Mock demo API — swap internals for real backend later without rewriting UI. */
export const demoService = {
  getCompany: () => delay(DEMO_COMPANY),
  getKpis: () => delay(DEMO_KPIS),
  getExecutiveBrief: () => delay(EXECUTIVE_BRIEF),
  getFunnel: () => delay(DEMO_FUNNEL),
  getLossReasons: () => delay(DEMO_LOSS_REASONS),
  getCoachingRoi: () => delay(COACHING_ROI),
  getTeams: () => delay(DEMO_TEAMS),
  getTeam: (id: string) => delay(DEMO_TEAMS.find((t) => t.id === id) ?? null),
  getManagers: () => delay(DEMO_MANAGERS),
  getAgents: (teamId?: string) => delay(teamId ? agentsForTeam(teamId) : DEMO_AGENTS),
  getAgent: (id: string) => delay(getAgent(id) ?? null),
  getCalls: (opts?: { agentId?: string; teamId?: string }) =>
    delay(
      ALL_DEMO_CALLS.filter((c) => {
        if (opts?.agentId && c.agentId !== opts.agentId) return false;
        if (opts?.teamId && c.teamId !== opts.teamId) return false;
        return true;
      }),
    ),
  getCall: (id: string) => delay(getCall(id) ?? null),
  getCallAnalysis: (id: string) => delay(getCall(id)?.analysis ?? null),
  getOpportunities: () => delay(DEMO_OPPORTUNITIES),
  getContact: (id: string) => delay(DEMO_CONTACTS.find((c) => c.id === id) ?? null),
  getContacts: () => delay(DEMO_CONTACTS),
  getLiveFloor: () => delay(LIVE_FLOOR),
  getLiveSuggestions: () => delay(LIVE_SUGGESTIONS),
  getManagerAttention: () => delay(MANAGER_ATTENTION),
  getCoaching: () => delay(DEMO_COACHING),
  getWinningPatterns: () => delay(WINNING_PATTERNS),
  askRelay: (question: string) =>
    delay(
      ASK_RELAY_ANSWERS[question] ??
        "Demo response: Focus on resolving trust before asking for a deposit. Reference your last scored call for evidence.",
      450,
    ),
  getScatterAgents: () =>
    delay(
      DEMO_AGENTS.map((a) => ({
        id: a.id,
        name: a.name,
        quality: a.aiScore,
        conversion: a.conversion,
        deposits: a.deposits,
        teamName: a.teamName,
      })),
    ),
};

export type DemoService = typeof demoService;
