import type { DemoAgent, RepSkillProfile } from "@/lib/demo/types";
import { DEMO_TEAMS } from "@/data/demo/teams";

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function skills(partial: Partial<RepSkillProfile> & Pick<RepSkillProfile, "strongest" | "fastestImproving" | "focusThisWeek">): RepSkillProfile {
  return {
    confidence: 78,
    discovery: 80,
    listening: 76,
    productKnowledge: 82,
    objectionHandling: 74,
    closing: 72,
    compliance: 94,
    ...partial,
  };
}

/** Named roster — metrics stay consistent across every demo screen. */
const ROSTER: Array<{
  id: string;
  name: string;
  teamId: string;
  calls: number;
  reached: number;
  ftds: number;
  conversion: number;
  deposits: number;
  aiScore: number;
  trend: number;
  coachingStatus: DemoAgent["coachingStatus"];
  skills: RepSkillProfile;
}> = [
  // Alpha — Maria is hero agent
  {
    id: "agt-maria",
    name: "Maria Georgiou",
    teamId: "team-alpha",
    calls: 19,
    reached: 14,
    ftds: 4,
    conversion: 21,
    deposits: 18500,
    aiScore: 88,
    trend: 6,
    coachingStatus: "on_track",
    skills: skills({
      confidence: 84,
      discovery: 91,
      listening: 82,
      productKnowledge: 89,
      objectionHandling: 74,
      closing: 76,
      compliance: 96,
      strongest: "Discovery",
      fastestImproving: "Objection handling +12",
      focusThisWeek: "Closing",
    }),
  },
  {
    id: "agt-leo",
    name: "Leo Andreou",
    teamId: "team-alpha",
    calls: 22,
    reached: 16,
    ftds: 5,
    conversion: 22.7,
    deposits: 22100,
    aiScore: 90,
    trend: 8,
    coachingStatus: "on_track",
    skills: skills({ discovery: 88, closing: 86, strongest: "Closing", fastestImproving: "Listening", focusThisWeek: "VIP handling" }),
  },
  {
    id: "agt-sofia",
    name: "Sofia Markou",
    teamId: "team-alpha",
    calls: 18,
    reached: 13,
    ftds: 3,
    conversion: 16.7,
    deposits: 12400,
    aiScore: 84,
    trend: 3,
    coachingStatus: "assigned",
    skills: skills({ closing: 71, strongest: "Compliance", fastestImproving: "Discovery", focusThisWeek: "Closing" }),
  },
  {
    id: "agt-chris",
    name: "Chris Nicolaou",
    teamId: "team-alpha",
    calls: 20,
    reached: 15,
    ftds: 2,
    conversion: 10,
    deposits: 6200,
    aiScore: 71,
    trend: -4,
    coachingStatus: "overdue",
    skills: skills({ compliance: 68, closing: 64, strongest: "Product knowledge", fastestImproving: "Listening", focusThisWeek: "Compliance" }),
  },
  {
    id: "agt-elena-a",
    name: "Elena Costa",
    teamId: "team-alpha",
    calls: 17,
    reached: 12,
    ftds: 3,
    conversion: 17.6,
    deposits: 14100,
    aiScore: 85,
    trend: 5,
    coachingStatus: "on_track",
    skills: skills({ listening: 90, strongest: "Listening", fastestImproving: "Closing", focusThisWeek: "Objections" }),
  },
  {
    id: "agt-andreas",
    name: "Andreas Michael",
    teamId: "team-alpha",
    calls: 21,
    reached: 15,
    ftds: 4,
    conversion: 19,
    deposits: 16800,
    aiScore: 87,
    trend: 4,
    coachingStatus: "on_track",
    skills: skills({ productKnowledge: 93, strongest: "Product knowledge", fastestImproving: "Closing", focusThisWeek: "Discovery" }),
  },
  {
    id: "agt-natalie",
    name: "Natalie Ioannou",
    teamId: "team-alpha",
    calls: 16,
    reached: 11,
    ftds: 2,
    conversion: 12.5,
    deposits: 7800,
    aiScore: 79,
    trend: 1,
    coachingStatus: "assigned",
    skills: skills({ closing: 68, strongest: "Compliance", fastestImproving: "Objection handling", focusThisWeek: "Closing" }),
  },
  {
    id: "agt-mark-e",
    name: "Mark Evans",
    teamId: "team-alpha",
    calls: 19,
    reached: 14,
    ftds: 3,
    conversion: 15.8,
    deposits: 11200,
    aiScore: 82,
    trend: 2,
    coachingStatus: "on_track",
    skills: skills({ confidence: 88, strongest: "Confidence", fastestImproving: "Discovery", focusThisWeek: "Listening" }),
  },
  {
    id: "agt-george",
    name: "George Kyriakou",
    teamId: "team-alpha",
    calls: 15,
    reached: 10,
    ftds: 2,
    conversion: 13.3,
    deposits: 9100,
    aiScore: 80,
    trend: 0,
    coachingStatus: "none",
    skills: skills({ strongest: "Compliance", fastestImproving: "Closing", focusThisWeek: "Discovery" }),
  },
  {
    id: "agt-anna",
    name: "Anna Demetriou",
    teamId: "team-alpha",
    calls: 18,
    reached: 13,
    ftds: 4,
    conversion: 22.2,
    deposits: 19600,
    aiScore: 89,
    trend: 7,
    coachingStatus: "on_track",
    skills: skills({ discovery: 92, closing: 84, strongest: "Discovery", fastestImproving: "Closing", focusThisWeek: "VIP" }),
  },
  {
    id: "agt-paul",
    name: "Paul Christou",
    teamId: "team-alpha",
    calls: 14,
    reached: 9,
    ftds: 1,
    conversion: 7.1,
    deposits: 3500,
    aiScore: 73,
    trend: -2,
    coachingStatus: "assigned",
    skills: skills({ closing: 61, strongest: "Compliance", fastestImproving: "Discovery", focusThisWeek: "Closing" }),
  },
  {
    id: "agt-iris",
    name: "Iris Papadaki",
    teamId: "team-alpha",
    calls: 17,
    reached: 12,
    ftds: 3,
    conversion: 17.6,
    deposits: 13200,
    aiScore: 84,
    trend: 3,
    coachingStatus: "on_track",
    skills: skills({ strongest: "Listening", fastestImproving: "Objection handling", focusThisWeek: "Closing" }),
  },

  // Velocity — Daniel is story agent (volume, weak conversion)
  {
    id: "agt-daniel",
    name: "Daniel Petrou",
    teamId: "team-velocity",
    calls: 28,
    reached: 21,
    ftds: 2,
    conversion: 7.1,
    deposits: 5400,
    aiScore: 68,
    trend: -14,
    coachingStatus: "overdue",
    skills: skills({
      confidence: 79,
      discovery: 81,
      listening: 70,
      productKnowledge: 86,
      objectionHandling: 62,
      closing: 54,
      compliance: 91,
      strongest: "Product knowledge",
      fastestImproving: "Discovery",
      focusThisWeek: "Closing",
    }),
  },
];

const FILL_NAMES: Record<string, string[]> = {
  "team-prime": [
    "Nikos Savva",
    "Helena Rossi",
    "James Clarke",
    "Olivia Bennett",
    "Petros Loizou",
    "Amelia Grant",
    "Yiannis Christoforou",
    "Chloe Adams",
    "Stelios Antoniou",
    "Freya Walsh",
    "Kostas Charalambous",
    "Mia Thompson",
  ],
  "team-velocity": [
    // daniel already listed
    "Alex Morgan-Rep",
    "Rita Demetri",
    "Tom Hughes",
    "Lara Phan",
    "Omar Hassan",
    "Jenny Cole",
    "Philippos N.",
    "Sara Klein",
    "Dimitris V.",
    "Nora Berg",
    "Luke Farrell",
  ],
  "team-retention": [
    "Helena Kyriacou",
    "Marco Silva",
    "Ava Richardson",
    "Panayiotis K.",
    "Isla Murray",
    "Felix Braun",
    "Christina P.",
    "Noah Patel",
    "Despina A.",
    "Ethan Brooks",
    "Georgia M.",
    "Ryan Cooper",
  ],
};

function hash(n: number) {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function fillTeam(teamId: string, names: string[], startIdx: number): typeof ROSTER {
  const team = DEMO_TEAMS.find((t) => t.id === teamId)!;
  return names.map((name, i) => {
    const n = startIdx + i;
    const h = hash(n);
    const calls = 14 + Math.floor(h * 12);
    const conversion =
      teamId === "team-velocity" ? 8 + h * 6 : teamId === "team-prime" ? 13 + h * 6 : 12 + h * 8;
    const ftds = Math.max(1, Math.round((calls * conversion) / 100));
    return {
      id: `agt-fill-${teamId}-${i}`,
      name: name.replace("-Rep", ""),
      teamId,
      calls,
      reached: Math.round(calls * (0.65 + h * 0.15)),
      ftds,
      conversion: Math.round(conversion * 10) / 10,
      deposits: Math.round(ftds * (3500 + h * 4000)),
      aiScore: Math.round(70 + h * 20),
      trend: Math.round((h - 0.45) * 16),
      coachingStatus: (h > 0.75 ? "assigned" : h > 0.55 ? "on_track" : h > 0.35 ? "none" : "assigned") as DemoAgent["coachingStatus"],
      skills: skills({
        closing: Math.round(60 + h * 30),
        discovery: Math.round(70 + h * 25),
        objectionHandling: Math.round(60 + h * 28),
        strongest: h > 0.5 ? "Discovery" : "Compliance",
        fastestImproving: "Objection handling",
        focusThisWeek: "Closing",
      }),
    };
  });
}

const ALL_RAW = [
  ...ROSTER,
  ...fillTeam("team-prime", FILL_NAMES["team-prime"], 100),
  ...fillTeam("team-velocity", FILL_NAMES["team-velocity"], 200),
  ...fillTeam("team-retention", FILL_NAMES["team-retention"], 300),
];

export const DEMO_AGENTS: DemoAgent[] = ALL_RAW.map((a) => {
  const team = DEMO_TEAMS.find((t) => t.id === a.teamId)!;
  return {
    ...a,
    initials: initials(a.name),
    teamName: team.name,
    role: "agent" as const,
    managerId: team.managerId,
  };
});

export function getAgent(id: string) {
  return DEMO_AGENTS.find((a) => a.id === id);
}

export function agentsForTeam(teamId: string) {
  return DEMO_AGENTS.filter((a) => a.teamId === teamId);
}
