/** Organisation onboarding — save/resume in localStorage. */

export type OnboardingState = {
  step: number;
  organisationName: string;
  industry: string;
  teams: { name: string; office: string }[];
  users: { name: string; email: string; role: string }[];
  callSource: string;
  crm: string;
  playbookUploaded: boolean;
  playbookName: string;
  scorecard: {
    discovery: boolean;
    listening: boolean;
    objectionHandling: boolean;
    closing: boolean;
    compliance: boolean;
  };
  firstCallId: string | null;
  firstCallMode: "demo" | "upload" | null;
  completed: boolean;
  updatedAt: string;
};

const KEY = "iris-onboarding-state";

export const ONBOARDING_STEPS = [
  { id: "org", title: "Create organisation", optional: false },
  { id: "industry", title: "Choose industry", optional: false },
  { id: "teams", title: "Add teams and users", optional: false },
  { id: "call-source", title: "Connect call source", optional: true },
  { id: "crm", title: "Connect CRM", optional: true },
  { id: "playbook", title: "Upload playbook", optional: true },
  { id: "scorecard", title: "Configure scorecard", optional: false },
  { id: "first-call", title: "Analyse first call", optional: false },
  { id: "insight", title: "First Iris insight", optional: false },
] as const;

export function defaultOnboardingState(): OnboardingState {
  return {
    step: 0,
    organisationName: "",
    industry: "",
    teams: [{ name: "", office: "" }],
    users: [{ name: "", email: "", role: "representative" }],
    callSource: "",
    crm: "",
    playbookUploaded: false,
    playbookName: "",
    scorecard: {
      discovery: true,
      listening: true,
      objectionHandling: true,
      closing: true,
      compliance: false,
    },
    firstCallId: null,
    firstCallMode: null,
    completed: false,
    updatedAt: new Date().toISOString(),
  };
}

export function loadOnboarding(): OnboardingState {
  if (typeof window === "undefined") return defaultOnboardingState();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return defaultOnboardingState();
    return { ...defaultOnboardingState(), ...(JSON.parse(raw) as OnboardingState) };
  } catch {
    return defaultOnboardingState();
  }
}

export function saveOnboarding(state: OnboardingState) {
  const next = { ...state, updatedAt: new Date().toISOString() };
  if (typeof window !== "undefined") {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  }
  return next;
}

export function clearOnboarding() {
  if (typeof window !== "undefined") window.localStorage.removeItem(KEY);
}

export function validateOnboardingStep(state: OnboardingState, step: number): string | null {
  switch (step) {
    case 0:
      return state.organisationName.trim().length >= 2 ? null : "Enter an organisation name.";
    case 1:
      return state.industry ? null : "Select an industry.";
    case 2: {
      if (!state.teams.some((t) => t.name.trim())) return "Add at least one team.";
      if (!state.users.some((u) => u.name.trim() && u.email.includes("@"))) {
        return "Add at least one user with a valid email.";
      }
      return null;
    }
    case 3:
    case 4:
    case 5:
      return null; // optional
    case 6:
      return Object.values(state.scorecard).some(Boolean)
        ? null
        : "Enable at least one scorecard dimension.";
    case 7:
      return state.firstCallId ? null : "Select a demo call or upload a recording.";
    case 8:
      return null;
    default:
      return null;
  }
}
