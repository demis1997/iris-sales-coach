import type {
  CoachingItem,
  Playbook,
  PlaybookVersion,
  RepresentativeSkillScore,
  RoleplaySession,
  SkillName,
  TrainingAssignment,
  TrainingModule,
} from "@/lib/demo/types";
import {
  analysisByCallId,
  calls,
  coachingItems as seedCoaching,
  ORG_ID,
  playbooks as seedPlaybooks,
  users,
} from "@/lib/demo/seed";

const SKILLS: SkillName[] = [
  "Discovery",
  "Listening",
  "Confidence",
  "Pitch delivery",
  "Product knowledge",
  "Objection handling",
  "Empathy",
  "Closing",
  "Next-step discipline",
  "Playbook adherence",
];

/** Mutable coaching store — demo "server" state with tenant checks. */
let coachingStore: CoachingItem[] = structuredClone(seedCoaching);
let playbookStore: Playbook[] = structuredClone(seedPlaybooks);
let playbookVersions: PlaybookVersion[] = [
  {
    id: "pv-01",
    playbookId: "pb-01",
    organisationId: ORG_ID,
    version: 1,
    changedAt: "2026-06-01",
    changedBy: "u-01",
    summary: "Initial Value Before Price draft",
  },
  {
    id: "pv-02",
    playbookId: "pb-01",
    organisationId: ORG_ID,
    version: 2,
    changedAt: "2026-06-20",
    changedBy: "u-01",
    summary: "Added recommended phrases from top calls",
  },
  {
    id: "pv-03",
    playbookId: "pb-01",
    organisationId: ORG_ID,
    version: 3,
    changedAt: "2026-07-10",
    changedBy: "u-dir",
    summary: "Tightened phrases to avoid",
  },
  {
    id: "pv-04",
    playbookId: "pb-02",
    organisationId: ORG_ID,
    version: 1,
    changedAt: "2026-06-12",
    changedBy: "u-01",
    summary: "Spreads objection v1",
  },
  {
    id: "pv-05",
    playbookId: "pb-02",
    organisationId: ORG_ID,
    version: 2,
    changedAt: "2026-07-05",
    changedBy: "u-02",
    summary: "Added fill-quality reframe",
  },
  {
    id: "pv-06",
    playbookId: "pb-03",
    organisationId: ORG_ID,
    version: 1,
    changedAt: "2026-06-08",
    changedBy: "u-dir",
    summary: "Next-step discipline baseline",
  },
  {
    id: "pv-07",
    playbookId: "pb-03",
    organisationId: ORG_ID,
    version: 2,
    changedAt: "2026-07-12",
    changedBy: "u-dir",
    summary: "Require calendar owner",
  },
  {
    id: "pv-08",
    playbookId: "pb-04",
    organisationId: ORG_ID,
    version: 4,
    changedAt: "2026-07-18",
    changedBy: "u-admin",
    summary: "Updated disclosure wording",
  },
];

export const trainingModules: TrainingModule[] = [
  {
    id: "tm-01",
    organisationId: ORG_ID,
    title: "Value Before Price fundamentals",
    skill: "Discovery",
    type: "lesson",
    difficulty: "Beginner",
    estimatedMinutes: 25,
    relatedPlaybookId: "pb-01",
    relatedCallId: "c-1841",
    content: "Lesson: delay commercial terms until pain is quantified.",
  },
  {
    id: "tm-02",
    organisationId: ORG_ID,
    title: "Spreads objection roleplay",
    skill: "Objection handling",
    type: "roleplay",
    difficulty: "Intermediate",
    estimatedMinutes: 20,
    relatedPlaybookId: "pb-02",
    relatedCallId: "c-1840",
    content: "Practise acknowledge → quantify → reframe.",
  },
  {
    id: "tm-03",
    organisationId: ORG_ID,
    title: "Next-step discipline assessment",
    skill: "Next-step discipline",
    type: "assessment",
    difficulty: "Beginner",
    estimatedMinutes: 15,
    relatedPlaybookId: "pb-03",
    relatedCallId: null,
    content: "Score your last five closes for calendar holds.",
  },
  {
    id: "tm-04",
    organisationId: ORG_ID,
    title: "New-hire week 1 path",
    skill: "Discovery",
    type: "onboarding",
    difficulty: "Beginner",
    estimatedMinutes: 90,
    relatedPlaybookId: "pb-01",
    relatedCallId: "c-1834",
    content: "Listen to three best-call examples and complete discovery checklist.",
  },
  {
    id: "tm-05",
    organisationId: ORG_ID,
    title: "Disclosure checklist walkthrough",
    skill: "Playbook adherence",
    type: "lesson",
    difficulty: "Intermediate",
    estimatedMinutes: 18,
    relatedPlaybookId: "pb-04",
    relatedCallId: "c-1835",
    content: "Required disclosures for regulated conversations.",
  },
];

let trainingAssignments: TrainingAssignment[] = [
  {
    id: "ta-01",
    organisationId: ORG_ID,
    moduleId: "tm-01",
    userId: "u-03",
    assignedBy: "u-01",
    dueDate: "2026-08-05",
    status: "in_progress",
    score: null,
    completedAt: null,
  },
  {
    id: "ta-02",
    organisationId: ORG_ID,
    moduleId: "tm-02",
    userId: "u-05",
    assignedBy: "u-01",
    dueDate: "2026-08-03",
    status: "assigned",
    score: null,
    completedAt: null,
  },
  {
    id: "ta-03",
    organisationId: ORG_ID,
    moduleId: "tm-03",
    userId: "u-09",
    assignedBy: "u-08",
    dueDate: "2026-08-04",
    status: "assigned",
    score: null,
    completedAt: null,
  },
  {
    id: "ta-04",
    organisationId: ORG_ID,
    moduleId: "tm-04",
    userId: "u-04",
    assignedBy: "u-01",
    dueDate: "2026-08-10",
    status: "completed",
    score: 86,
    completedAt: "2026-07-27",
  },
  {
    id: "ta-05",
    organisationId: ORG_ID,
    moduleId: "tm-05",
    userId: "u-04",
    assignedBy: "u-01",
    dueDate: "2026-08-02",
    status: "in_progress",
    score: null,
    completedAt: null,
  },
  {
    id: "ta-06",
    organisationId: ORG_ID,
    moduleId: "tm-01",
    userId: "u-02",
    assignedBy: "u-01",
    dueDate: "2026-07-25",
    status: "completed",
    score: 92,
    completedAt: "2026-07-24",
  },
];

let roleplaySessions: RoleplaySession[] = [
  {
    id: "rp-01",
    organisationId: ORG_ID,
    userId: "u-05",
    scenario: "Pricing objection",
    persona: "Cost-sensitive desk head",
    difficulty: "Intermediate",
    objection: "Your spreads are higher",
    mode: "text",
    status: "completed",
    overallScore: 71,
    strengths: ["Acknowledged the concern", "Asked for current cost"],
    missedOpportunities: ["Did not quantify fill-quality upside"],
    suggestedResponse:
      "Acknowledge the spread gap, ask for current average cost per lot, then reframe with execution evidence before proposing a trial.",
    createdAt: "2026-07-26T10:00:00.000Z",
  },
];

function assertOrg(organisationId: string) {
  if (organisationId !== ORG_ID) throw new Error("TENANT_ISOLATION_VIOLATION");
}

export function listCoaching(organisationId: string) {
  assertOrg(organisationId);
  return coachingStore.filter((c) => c.organisationId === organisationId);
}

export function updateCoaching(
  organisationId: string,
  id: string,
  patch: Partial<CoachingItem>,
): CoachingItem {
  assertOrg(organisationId);
  const idx = coachingStore.findIndex((c) => c.id === id && c.organisationId === organisationId);
  if (idx < 0) throw new Error("NOT_FOUND");
  const next = { ...coachingStore[idx]!, ...patch };
  if (patch.status === "completed" && !next.completedAt) {
    next.completedAt = new Date().toISOString().slice(0, 10);
    next.progress = 100;
  }
  coachingStore = coachingStore.map((c, i) => (i === idx ? next : c));
  return next;
}

export function createCoaching(
  organisationId: string,
  item: Omit<CoachingItem, "id" | "organisationId">,
) {
  assertOrg(organisationId);
  const created: CoachingItem = {
    ...item,
    id: `coach-${Date.now()}`,
    organisationId,
  };
  coachingStore = [created, ...coachingStore];
  return created;
}

export function listPlaybooks(organisationId: string) {
  assertOrg(organisationId);
  return playbookStore.filter((p) => p.organisationId === organisationId);
}

export function listPlaybookVersions(organisationId: string, playbookId: string) {
  assertOrg(organisationId);
  return playbookVersions
    .filter((v) => v.organisationId === organisationId && v.playbookId === playbookId)
    .sort((a, b) => b.version - a.version);
}

export function mutatePlaybook(organisationId: string, id: string, patch: Partial<Playbook>) {
  assertOrg(organisationId);
  const idx = playbookStore.findIndex((p) => p.id === id && p.organisationId === organisationId);
  if (idx < 0) throw new Error("NOT_FOUND");
  const current = playbookStore[idx]!;
  const next = { ...current, ...patch };
  if (patch.status || patch.purpose || patch.recommendedPhrases) {
    const version = current.version + 1;
    next.version = version;
    playbookVersions = [
      {
        id: `pv-${Date.now()}`,
        playbookId: id,
        organisationId,
        version,
        changedAt: new Date().toISOString().slice(0, 10),
        changedBy: "u-01",
        summary: patch.status ? `Status → ${patch.status}` : "Content updated",
      },
      ...playbookVersions,
    ];
  }
  playbookStore = playbookStore.map((p, i) => (i === idx ? next : p));
  return next;
}

export function duplicatePlaybook(organisationId: string, id: string) {
  const src = listPlaybooks(organisationId).find((p) => p.id === id);
  if (!src) throw new Error("NOT_FOUND");
  const copy: Playbook = {
    ...structuredClone(src),
    id: `pb-${Date.now()}`,
    name: `${src.name} (copy)`,
    status: "draft",
    version: 1,
  };
  playbookStore = [copy, ...playbookStore];
  return copy;
}

export function generatePlaybookFromTopCalls(organisationId: string) {
  assertOrg(organisationId);
  const top = calls
    .filter((c) => c.organisationId === organisationId && c.analysisStatus === "Analyzed")
    .map((c) => ({ c, score: analysisByCallId[c.id]?.overallScore ?? 0 }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
  const created: Playbook = {
    id: `pb-gen-${Date.now()}`,
    organisationId,
    teamId: null,
    name: "AI draft: Top-call behaviours",
    category: "AI-discovered best practices",
    scope: "ai_discovered",
    purpose: "Generated from highest-scoring seeded calls — review before activating.",
    applicableCallTypes: ["Outbound", "Discovery", "Follow-up"],
    requiredBehaviours: ["Value before price", "Live next-step booking", "Acknowledge objections"],
    recommendedPhrases: [
      "Before numbers — how many lots are you averaging monthly?",
      "Let's lock a time so we keep momentum",
    ],
    phrasesToAvoid: ["Feel free to call me when you've decided"],
    exampleCallIds: top.map((t) => t.c.id),
    adoptionScore: 0,
    impactTrend: [0, 0, 0, 0, 0],
    ownerId: "u-exec",
    status: "draft",
    version: 1,
  };
  playbookStore = [created, ...playbookStore];
  playbookVersions = [
    {
      id: `pv-gen-${Date.now()}`,
      playbookId: created.id,
      organisationId,
      version: 1,
      changedAt: new Date().toISOString().slice(0, 10),
      changedBy: "u-exec",
      summary: "Generated from top-performing calls (demo)",
    },
    ...playbookVersions,
  ];
  return created;
}

export function listTrainingModules(organisationId: string) {
  assertOrg(organisationId);
  return trainingModules.filter((m) => m.organisationId === organisationId);
}

export function listTrainingAssignments(organisationId: string) {
  assertOrg(organisationId);
  return trainingAssignments.filter((a) => a.organisationId === organisationId);
}

export function updateTrainingAssignment(
  organisationId: string,
  id: string,
  patch: Partial<TrainingAssignment>,
) {
  assertOrg(organisationId);
  trainingAssignments = trainingAssignments.map((a) =>
    a.id === id && a.organisationId === organisationId ? { ...a, ...patch } : a,
  );
  return trainingAssignments.find((a) => a.id === id)!;
}

export function listRoleplays(organisationId: string, userId?: string) {
  assertOrg(organisationId);
  return roleplaySessions.filter(
    (r) => r.organisationId === organisationId && (!userId || r.userId === userId),
  );
}

export function saveRoleplay(session: RoleplaySession) {
  assertOrg(session.organisationId);
  roleplaySessions = [session, ...roleplaySessions.filter((r) => r.id !== session.id)];
  return session;
}

/** Skill scores derived from call analyses so profiles match Calls / Team / Overview. */
export function getSkillProfile(organisationId: string, userId: string): RepresentativeSkillScore {
  assertOrg(organisationId);
  const mine = calls.filter(
    (c) =>
      c.organisationId === organisationId &&
      c.representativeId === userId &&
      c.analysisStatus === "Analyzed",
  );
  const analyses = mine.map((c) => analysisByCallId[c.id]).filter(Boolean);
  const avg = (xs: number[]) =>
    xs.length ? Math.round(xs.reduce((a, b) => a + b, 0) / xs.length) : 0;

  const skills: Record<SkillName, number> = {
    Discovery: avg(analyses.map((a) => a!.discoveryScore)),
    Listening: avg(analyses.map((a) => a!.listeningScore)),
    Confidence: avg(analyses.map((a) => a!.confidenceScore)),
    "Pitch delivery": avg(analyses.map((a) => a!.pitchScore)),
    "Product knowledge": avg(
      analyses.map((a) => Math.round((a!.pitchScore + a!.playbookScore) / 2)),
    ),
    "Objection handling": avg(analyses.map((a) => a!.objectionHandlingScore)),
    Empathy: avg(analyses.map((a) => Math.round((a!.listeningScore + a!.confidenceScore) / 2))),
    Closing: avg(analyses.map((a) => a!.closingScore)),
    "Next-step discipline": avg(
      analyses.map((a) =>
        a!.nextSteps.length
          ? Math.min(100, a!.closingScore + 5)
          : Math.max(40, a!.closingScore - 15),
      ),
    ),
    "Playbook adherence": avg(analyses.map((a) => a!.playbookScore)),
  };

  const overallScore = avg(analyses.map((a) => a!.overallScore));
  const closed = mine.filter((c) => c.outcome === "Closed").length;
  const conversionRate = mine.length ? Math.round((closed / mine.length) * 100) : 0;
  const previousOverall = Math.max(40, overallScore - 6);
  const previousConversion = Math.max(0, conversionRate - 4);

  const sortedSkills = [...SKILLS].sort((a, b) => skills[b] - skills[a]);
  const user = users.find((u) => u.id === userId);

  return {
    organisationId,
    userId,
    skills,
    overallScore,
    previousOverall,
    conversionRate,
    previousConversion,
    communicationStyle: {
      directVsConsultative:
        skills.Discovery >= 80 ? "Consultative" : skills.Confidence >= 85 ? "Direct" : "Balanced",
      conciseVsDetailed: skills.Listening >= 80 ? "Detailed" : "Concise",
      questionVsPresentation:
        skills.Discovery >= skills["Pitch delivery"] ? "Question-led" : "Presentation-led",
      energy:
        skills.Confidence >= 85 ? "High-energy" : skills.Listening >= 80 ? "Calm" : "Balanced",
    },
    strengths: sortedSkills.slice(0, 3).map((s) => s),
    improvementAreas: sortedSkills
      .slice(-3)
      .reverse()
      .map((s) => s),
    trend: [
      { week: "W1", score: previousOverall - 4, conversion: previousConversion - 2 },
      { week: "W2", score: previousOverall - 1, conversion: previousConversion },
      {
        week: "W3",
        score: Math.round((previousOverall + overallScore) / 2),
        conversion: Math.round((previousConversion + conversionRate) / 2),
      },
      { week: "W4", score: overallScore, conversion: conversionRate },
    ],
  };
}

export function getTeamSkillHeatmap(organisationId: string, userIds: string[]) {
  return userIds.map((id) => {
    const profile = getSkillProfile(organisationId, id);
    return {
      userId: id,
      name: users.find((u) => u.id === id)?.name ?? id,
      skills: profile.skills,
      overall: profile.overallScore,
    };
  });
}

export { SKILLS, trainingAssignments };
