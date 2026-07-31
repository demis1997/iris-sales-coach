/**
 * Shared integration catalog — marketing + in-app use the same truthful statuses.
 * Never mark Connected unless a real (or explicit demo) connection exists.
 */

export type IntegrationStatus =
  "Connected" | "Available" | "In development" | "Planned" | "Requires configuration";

export type IntegrationCategory = "CRM" | "Communication" | "Productivity" | "Automation";

export type CrmFieldKey =
  | "Contact"
  | "Company"
  | "Deal"
  | "Stage"
  | "Value"
  | "Next step"
  | "Call summary"
  | "Sentiment"
  | "Risk"
  | "Follow-up task";

export type IntegrationDef = {
  id: string;
  name: string;
  category: IntegrationCategory;
  /** Public / default product status */
  status: Exclude<IntegrationStatus, "Connected">;
  description: string;
  permissions: string[];
  dataSynced: string[];
  setupSteps: string[];
  isCrm: boolean;
  defaultMapping?: Partial<Record<CrmFieldKey, string>>;
};

export const CRM_FIELDS: CrmFieldKey[] = [
  "Contact",
  "Company",
  "Deal",
  "Stage",
  "Value",
  "Next step",
  "Call summary",
  "Sentiment",
  "Risk",
  "Follow-up task",
];

export const INTEGRATIONS: IntegrationDef[] = [
  {
    id: "salesforce",
    name: "Salesforce",
    category: "CRM",
    status: "In development",
    description:
      "Sync opportunities, activities, and Iris conversation intelligence into Salesforce.",
    permissions: ["Read/write Opportunities", "Create Tasks", "Read Contacts & Accounts"],
    dataSynced: ["Deals", "Call summaries", "Sentiment", "Risk", "Follow-up tasks"],
    setupSteps: [
      "Authorize Salesforce org",
      "Map fields",
      "Choose sync direction",
      "Test with one deal",
    ],
    isCrm: true,
    defaultMapping: {
      Contact: "Contact.Email",
      Company: "Account.Name",
      Deal: "Opportunity.Name",
      Stage: "Opportunity.StageName",
      Value: "Opportunity.Amount",
      "Next step": "Opportunity.NextStep",
      "Call summary": "Task.Description",
      Sentiment: "custom__Sentiment__c",
      Risk: "custom__Iris_Risk__c",
      "Follow-up task": "Task",
    },
  },
  {
    id: "hubspot",
    name: "HubSpot",
    category: "CRM",
    status: "In development",
    description: "Push call insights and pipeline risk signals into HubSpot deals and timelines.",
    permissions: ["CRM objects read/write", "Timeline events"],
    dataSynced: ["Deals", "Contacts", "Call notes", "Tasks"],
    setupSteps: [
      "Connect HubSpot private app",
      "Select pipelines",
      "Map properties",
      "Enable sync",
    ],
    isCrm: true,
    defaultMapping: {
      Contact: "contact.email",
      Company: "company.name",
      Deal: "deal.dealname",
      Stage: "deal.dealstage",
      Value: "deal.amount",
      "Next step": "deal.hs_next_step",
      "Call summary": "engagement.note",
      Sentiment: "deal.iris_sentiment",
      Risk: "deal.iris_risk",
      "Follow-up task": "task",
    },
  },
  {
    id: "pipedrive",
    name: "Pipedrive",
    category: "CRM",
    status: "Planned",
    description: "Two-way deal and activity sync with Pipedrive.",
    permissions: ["Deals", "Activities", "Persons"],
    dataSynced: ["Deals", "Activities", "Notes"],
    setupSteps: ["Authorize Pipedrive", "Map pipeline stages", "Enable activity sync"],
    isCrm: true,
  },
  {
    id: "zoho",
    name: "Zoho CRM",
    category: "CRM",
    status: "Planned",
    description: "Connect Zoho CRM modules for deal health updates.",
    permissions: ["Modules read/write"],
    dataSynced: ["Deals", "Notes"],
    setupSteps: ["Authorize Zoho", "Select modules", "Map fields"],
    isCrm: true,
  },
  {
    id: "dynamics",
    name: "Microsoft Dynamics",
    category: "CRM",
    status: "Planned",
    description: "Enterprise Dynamics 365 opportunity and activity sync.",
    permissions: ["Dynamics CRM API"],
    dataSynced: ["Opportunities", "Activities"],
    setupSteps: ["Azure app registration", "Grant Dynamics scopes", "Map entities"],
    isCrm: true,
  },
  {
    id: "zoom",
    name: "Zoom",
    category: "Communication",
    status: "In development",
    description: "Ingest Zoom meeting recordings for analysis.",
    permissions: ["cloud_recording:read", "meeting:read"],
    dataSynced: ["Recordings", "Participants", "Meeting metadata"],
    setupSteps: ["Install Zoom app", "Grant recording access", "Select users/rooms"],
    isCrm: false,
  },
  {
    id: "teams",
    name: "Microsoft Teams",
    category: "Communication",
    status: "In development",
    description: "Analyse Teams call recordings with organisation consent.",
    permissions: ["OnlineMeetings.Read", "CallRecords.Read"],
    dataSynced: ["Recordings", "Participants"],
    setupSteps: ["Admin consent", "Select teams", "Enable recording ingest"],
    isCrm: false,
  },
  {
    id: "meet",
    name: "Google Meet",
    category: "Communication",
    status: "Planned",
    description: "Ingest Meet recordings from Google Workspace.",
    permissions: ["Drive recordings read"],
    dataSynced: ["Recordings"],
    setupSteps: ["Google Workspace admin consent", "Select drives"],
    isCrm: false,
  },
  {
    id: "aircall",
    name: "Aircall",
    category: "Communication",
    status: "In development",
    description: "Import Aircall voice recordings and metadata.",
    permissions: ["calls:read", "recordings:read"],
    dataSynced: ["Calls", "Recordings", "Tags"],
    setupSteps: ["Generate Aircall API key", "Select numbers", "Map users"],
    isCrm: false,
  },
  {
    id: "twilio",
    name: "Twilio",
    category: "Communication",
    status: "Planned",
    description: "Pull Twilio Voice recordings into Iris.",
    permissions: ["Recordings read"],
    dataSynced: ["Recordings", "Call SIDs"],
    setupSteps: ["Create API key", "Configure webhook", "Map accounts"],
    isCrm: false,
  },
  {
    id: "ringcentral",
    name: "RingCentral",
    category: "Communication",
    status: "Planned",
    description: "RingCentral call recording ingest.",
    permissions: ["ReadCallRecording"],
    dataSynced: ["Recordings"],
    setupSteps: ["Authorize RingCentral", "Select extensions"],
    isCrm: false,
  },
  {
    id: "dialpad",
    name: "Dialpad",
    category: "Communication",
    status: "Planned",
    description: "Dialpad recording and disposition sync.",
    permissions: ["recordings:read"],
    dataSynced: ["Recordings", "Dispositions"],
    setupSteps: ["Connect Dialpad", "Map users"],
    isCrm: false,
  },
  {
    id: "five9",
    name: "Five9",
    category: "Communication",
    status: "Planned",
    description: "Contact-centre recording ingest for Five9.",
    permissions: ["Recording API"],
    dataSynced: ["Recordings", "Campaign metadata"],
    setupSteps: ["Provision API user", "Select campaigns"],
    isCrm: false,
  },
  {
    id: "genesys",
    name: "Genesys",
    category: "Communication",
    status: "Planned",
    description: "Genesys Cloud conversation recording analysis.",
    permissions: ["recording:readonly"],
    dataSynced: ["Conversations", "Recordings"],
    setupSteps: ["OAuth client", "Select queues"],
    isCrm: false,
  },
  {
    id: "gmail",
    name: "Gmail",
    category: "Productivity",
    status: "Planned",
    description: "Draft and send follow-up emails from Iris insights.",
    permissions: ["gmail.compose"],
    dataSynced: ["Draft emails"],
    setupSteps: ["Google OAuth", "Enable compose"],
    isCrm: false,
  },
  {
    id: "outlook",
    name: "Outlook",
    category: "Productivity",
    status: "Planned",
    description: "Outlook mail drafts from coaching follow-ups.",
    permissions: ["Mail.ReadWrite"],
    dataSynced: ["Draft emails"],
    setupSteps: ["Microsoft OAuth", "Select mailbox"],
    isCrm: false,
  },
  {
    id: "slack",
    name: "Slack",
    category: "Productivity",
    status: "Planned",
    description: "Notify managers of coaching and risk alerts in Slack.",
    permissions: ["chat:write", "channels:read"],
    dataSynced: ["Alert notifications"],
    setupSteps: ["Install Slack app", "Choose channels"],
    isCrm: false,
  },
  {
    id: "notion",
    name: "Notion",
    category: "Productivity",
    status: "Planned",
    description: "Publish playbooks and coaching notes to Notion.",
    permissions: ["Insert content"],
    dataSynced: ["Playbook pages"],
    setupSteps: ["Connect Notion workspace", "Select parent page"],
    isCrm: false,
  },
  {
    id: "zapier",
    name: "Zapier",
    category: "Automation",
    status: "Planned",
    description: "Trigger Zaps from Iris events (call analysed, coaching assigned).",
    permissions: ["Webhook subscribe"],
    dataSynced: ["Event payloads"],
    setupSteps: ["Create Zap", "Use Iris trigger (when available)"],
    isCrm: false,
  },
  {
    id: "make",
    name: "Make",
    category: "Automation",
    status: "Planned",
    description: "Scenario automation from Iris webhooks.",
    permissions: ["Webhook"],
    dataSynced: ["Event payloads"],
    setupSteps: ["Create scenario", "Add webhook module"],
    isCrm: false,
  },
  {
    id: "webhooks",
    name: "Webhooks",
    category: "Automation",
    status: "Available",
    description:
      "Send signed HTTPS events when calls are analysed or coaching completes. Configure endpoints in the demo.",
    permissions: ["Outbound HTTPS to your URL"],
    dataSynced: ["call.analysed", "coaching.completed", "deal.risk_changed"],
    setupSteps: ["Add endpoint URL", "Copy signing secret", "Verify challenge", "Enable events"],
    isCrm: false,
  },
  {
    id: "api",
    name: "API",
    category: "Automation",
    status: "Available",
    description:
      "REST API keys for reading analyses and writing coaching assignments. Demo keys are illustrative only.",
    permissions: ["API key scoped to organisation"],
    dataSynced: ["Calls", "Analyses", "Coaching", "Deals (read)"],
    setupSteps: ["Generate API key", "Store secret securely", "Call documented endpoints"],
    isCrm: false,
  },
];

export function integrationsByCategory() {
  const map = new Map<IntegrationCategory, IntegrationDef[]>();
  for (const item of INTEGRATIONS) {
    const list = map.get(item.category) ?? [];
    list.push(item);
    map.set(item.category, list);
  }
  return map;
}

const STORAGE_KEY = "iris-integration-state";

export type IntegrationRuntimeState = {
  status: IntegrationStatus;
  lastSync: string | null;
  syncHistory: { at: string; result: "ok" | "error"; message: string }[];
  errorLogs: { at: string; message: string }[];
  mapping: Partial<Record<CrmFieldKey, string>>;
};

type Store = Record<string, IntegrationRuntimeState>;

function readStore(): Store {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}") as Store;
  } catch {
    return {};
  }
}

function writeStore(store: Store) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function getIntegrationRuntime(id: string): IntegrationRuntimeState {
  const def = INTEGRATIONS.find((i) => i.id === id);
  const stored = readStore()[id];
  if (stored) return stored;
  return {
    status: def?.status === "Available" ? "Requires configuration" : (def?.status ?? "Planned"),
    lastSync: null,
    syncHistory: [],
    errorLogs: [],
    mapping: def?.defaultMapping ?? {},
  };
}

export function saveIntegrationRuntime(id: string, patch: Partial<IntegrationRuntimeState>) {
  const store = readStore();
  store[id] = { ...getIntegrationRuntime(id), ...patch };
  writeStore(store);
  return store[id]!;
}

export function disconnectIntegration(id: string) {
  const def = INTEGRATIONS.find((i) => i.id === id);
  return saveIntegrationRuntime(id, {
    status: def?.status === "Available" ? "Requires configuration" : (def?.status ?? "Planned"),
    lastSync: null,
  });
}

/** Demo-only: mark Available integrations as Connected after configuration. */
export function connectDemoIntegration(id: string) {
  const def = INTEGRATIONS.find((i) => i.id === id);
  if (!def || (def.status !== "Available" && def.status !== "Requires configuration")) {
    throw new Error("Integration cannot be connected in demo until status is Available.");
  }
  const now = new Date().toISOString();
  return saveIntegrationRuntime(id, {
    status: "Connected",
    lastSync: now,
    syncHistory: [{ at: now, result: "ok", message: "Demo connection verified" }],
    errorLogs: [],
  });
}
