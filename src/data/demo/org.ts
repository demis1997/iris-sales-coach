/**
 * Shared Apex Markets org facts used across Admin / Agent / Manager / CEO demos.
 * Keep counts consistent: 48 users, 4 teams × 12 agents, 7 campaigns, 34 numbers.
 */
import { DEMO_COMPANY, DEMO_KPIS } from "@/data/demo/company";
import { DEMO_TEAMS } from "@/data/demo/teams";

export const APEX_ORG = {
  ...DEMO_COMPANY,
  plan: "Artemis Enterprise",
  activeUsers: DEMO_COMPANY.agents,
  phoneNumbers: 34,
  activeCampaigns: 7,
  callsThisMonth: 82_491,
  voiceMinutes: 146_238,
  storageGb: 218,
  aiAnalyzedCalls: 79_842,
  systemStatus: "All systems operational" as const,
  callsToday: DEMO_KPIS.callsToday,
  activeAgentsToday: DEMO_KPIS.activeAgents,
};

export const APEX_ACTIVITY = [
  { id: "a1", text: "3 new agents added to Alpha Desk", time: "12 min ago" },
  { id: "a2", text: "UK Reactivation campaign updated", time: "41 min ago" },
  { id: "a3", text: "+44 20 7946 0182 assigned to London Sales", time: "1 hr ago" },
  { id: "a4", text: "German routing rule changed", time: "2 hr ago" },
  { id: "a5", text: "New Compliance Playbook published", time: "Yesterday" },
];

export type ApexPhoneNumber = {
  id: string;
  number: string;
  country: string;
  type: "Local" | "National" | "Toll-free";
  assignedTo: string;
  campaign: string;
  status: "Active" | "Reserved" | "Unassigned";
  monthlyUsage: string;
};

export const APEX_PHONE_NUMBERS: ApexPhoneNumber[] = [
  {
    id: "num-uk-1",
    number: "+44 20 7946 0182",
    country: "United Kingdom",
    type: "Local",
    assignedTo: "UK Acquisition",
    campaign: "UK Reactivation",
    status: "Active",
    monthlyUsage: "18.4k min",
  },
  {
    id: "num-cy-1",
    number: "+357 25 123456",
    country: "Cyprus",
    type: "Local",
    assignedTo: "Cyprus Retention",
    campaign: "VIP Retention",
    status: "Active",
    monthlyUsage: "9.2k min",
  },
  {
    id: "num-de-1",
    number: "+49 30 901820",
    country: "Germany",
    type: "Local",
    assignedTo: "German Acquisition",
    campaign: "Germany Acquisition",
    status: "Active",
    monthlyUsage: "14.1k min",
  },
  {
    id: "num-fr-1",
    number: "+33 1 84 88 0120",
    country: "France",
    type: "Local",
    assignedTo: "EU Overflow",
    campaign: "EU New Registrations",
    status: "Active",
    monthlyUsage: "6.8k min",
  },
  {
    id: "num-uk-2",
    number: "+44 161 408 2201",
    country: "United Kingdom",
    type: "Local",
    assignedTo: "Unassigned",
    campaign: "—",
    status: "Reserved",
    monthlyUsage: "0 min",
  },
];

export type ApexCampaign = {
  id: string;
  name: string;
  leads: number;
  agents: number;
  callsToday: number;
  conversion: number;
  status: "Running" | "Paused" | "Draft";
  dialMode: "Manual" | "Power" | "Progressive" | "Predictive";
  team: string;
  callerId: string;
};

export const APEX_CAMPAIGNS: ApexCampaign[] = [
  {
    id: "camp-uk-react",
    name: "UK Reactivation",
    leads: 8420,
    agents: 14,
    callsToday: 2831,
    conversion: 6.4,
    status: "Running",
    dialMode: "Progressive",
    team: "Alpha Desk",
    callerId: "+44 20 7946 0182",
  },
  {
    id: "camp-de-acq",
    name: "Germany Acquisition",
    leads: 5190,
    agents: 10,
    callsToday: 1820,
    conversion: 5.8,
    status: "Running",
    dialMode: "Power",
    team: "Velocity Desk",
    callerId: "+49 30 901820",
  },
  {
    id: "camp-vip",
    name: "VIP Retention",
    leads: 1120,
    agents: 7,
    callsToday: 742,
    conversion: 12.6,
    status: "Running",
    dialMode: "Manual",
    team: "Retention Desk",
    callerId: "+357 25 123456",
  },
  {
    id: "camp-eu-new",
    name: "EU New Registrations",
    leads: 6340,
    agents: 12,
    callsToday: 2104,
    conversion: 7.1,
    status: "Running",
    dialMode: "Progressive",
    team: "Prime Desk",
    callerId: "+33 1 84 88 0120",
  },
  {
    id: "camp-uk-acq",
    name: "UK Acquisition",
    leads: 4210,
    agents: 8,
    callsToday: 980,
    conversion: 5.2,
    status: "Paused",
    dialMode: "Predictive",
    team: "Alpha Desk",
    callerId: "+44 20 7946 0182",
  },
  {
    id: "camp-cy-ret",
    name: "Cyprus Retention",
    leads: 890,
    agents: 4,
    callsToday: 310,
    conversion: 9.4,
    status: "Running",
    dialMode: "Manual",
    team: "Retention Desk",
    callerId: "+357 25 123456",
  },
  {
    id: "camp-weekend",
    name: "Weekend High Intent",
    leads: 1560,
    agents: 6,
    callsToday: 0,
    conversion: 0,
    status: "Draft",
    dialMode: "Power",
    team: "Prime Desk",
    callerId: "+44 161 408 2201",
  },
];

export type ApexAdminUser = {
  id: string;
  name: string;
  role: "Agent" | "Manager" | "Admin" | "CEO";
  team: string;
  extension: string;
  phoneNumber: string;
  status: "Active" | "Invited" | "Deactivated";
  callsToday: number;
  lastActive: string;
};

export const APEX_ADMIN_USERS: ApexAdminUser[] = [
  {
    id: "u-alex",
    name: "Alex Morgan",
    role: "CEO",
    team: "Leadership",
    extension: "100",
    phoneNumber: "—",
    status: "Active",
    callsToday: 0,
    lastActive: "Just now",
  },
  {
    id: "u-sarah",
    name: "Sarah Mitchell",
    role: "Manager",
    team: "Alpha Desk",
    extension: "201",
    phoneNumber: "+44 20 7946 0182",
    status: "Active",
    callsToday: 6,
    lastActive: "4 min ago",
  },
  {
    id: "u-maria",
    name: "Maria Georgiou",
    role: "Agent",
    team: "Alpha Desk",
    extension: "312",
    phoneNumber: "+44 20 7946 0182",
    status: "Active",
    callsToday: 41,
    lastActive: "Live",
  },
  {
    id: "u-daniel",
    name: "Daniel Costa",
    role: "Agent",
    team: "Velocity Desk",
    extension: "418",
    phoneNumber: "+49 30 901820",
    status: "Active",
    callsToday: 52,
    lastActive: "After call",
  },
  {
    id: "u-sofia",
    name: "Sofia Petrova",
    role: "Agent",
    team: "Velocity Desk",
    extension: "421",
    phoneNumber: "+49 30 901820",
    status: "Active",
    callsToday: 38,
    lastActive: "Live",
  },
  {
    id: "u-andreas",
    name: "Andreas Georgiou",
    role: "Manager",
    team: "Velocity Desk",
    extension: "202",
    phoneNumber: "+49 30 901820",
    status: "Active",
    callsToday: 3,
    lastActive: "22 min ago",
  },
  {
    id: "u-elena",
    name: "Elena Constantinou",
    role: "Manager",
    team: "Retention Desk",
    extension: "203",
    phoneNumber: "+357 25 123456",
    status: "Active",
    callsToday: 2,
    lastActive: "1 hr ago",
  },
  {
    id: "u-admin",
    name: "Chris Nadir",
    role: "Admin",
    team: "Operations",
    extension: "101",
    phoneNumber: "—",
    status: "Active",
    callsToday: 0,
    lastActive: "8 min ago",
  },
];

export const APEX_ROUTING_RULES = [
  {
    id: "route-uk",
    name: "UK Sales Number",
    number: "+44 20 7946 0182",
    flow: ["Business hours?", "Team Alpha queue", "If unavailable → UK Backup Queue"],
  },
  {
    id: "route-vip",
    name: "VIP Line",
    number: "+357 25 123456",
    flow: ["VIP Retention", "Priority routing", "Manager overflow"],
  },
  {
    id: "route-de",
    name: "German Number",
    number: "+49 30 901820",
    flow: ["German Team", "Overflow after 30s", "European Sales Queue"],
  },
];

export const APEX_TEAM_ADMIN = DEMO_TEAMS.map((t) => ({
  id: t.id,
  name: t.name,
  agents: t.agents,
  manager: t.managerName,
  focus:
    t.id === "team-alpha"
      ? "UK Reactivation"
      : t.id === "team-velocity"
        ? "German Acquisition"
        : t.id === "team-retention"
          ? "VIP Retention"
          : "EU New Registrations",
}));

export const PLATFORM_LAYERS = [
  {
    id: "voice",
    label: "CALL",
    title: "Artemis Voice",
    body: "Web softphone, numbers, routing, queues and campaign dialing — without another dialer.",
  },
  {
    id: "sales",
    label: "SELL",
    title: "Artemis Sales",
    body: "Leads, ownership, follow-ups and call history built for high-volume telephone sales.",
  },
  {
    id: "intelligence",
    label: "IMPROVE",
    title: "Artemis Intelligence",
    body: "Live coaching, scoring, objections, Rep DNA and playbooks from every conversation.",
  },
  {
    id: "manager",
    label: "MANAGE",
    title: "Artemis Manager OS",
    body: "Live floor, coaching queues, campaign control and QA in one workspace.",
  },
  {
    id: "executive",
    label: "OPTIMIZE",
    title: "Artemis Executive OS",
    body: "Revenue, conversion drivers and AI recommendations for leadership decisions.",
  },
] as const;
