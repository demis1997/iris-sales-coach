export type IntegrationStatus = "planned" | "in_progress" | "available";

export type IntegrationItem = {
  slug: string;
  name: string;
  category: "CRM" | "Telephony" | "Communication" | "Data";
  status: IntegrationStatus;
  blurb: string;
  workflow: string[];
};

export const INTEGRATIONS: IntegrationItem[] = [
  {
    slug: "hubspot",
    name: "HubSpot",
    category: "CRM",
    status: "planned",
    blurb: "Bring conversation intelligence and next actions into HubSpot deal workflows.",
    workflow: [
      "Call completes in Artemis",
      "Conversation is analyzed",
      "Summary and outcome sync to the contact/deal",
      "Next action / task created",
      "Deal risk signals updated",
    ],
  },
  {
    slug: "salesforce",
    name: "Salesforce",
    category: "CRM",
    status: "planned",
    blurb: "Connect call intelligence and coaching context to Salesforce opportunities.",
    workflow: [
      "Call analyzed in Artemis",
      "Structured summary available for CRM sync",
      "Opportunity fields / tasks updated (planned)",
      "Managers review evidence from Artemis",
    ],
  },
  {
    slug: "zoho",
    name: "Zoho",
    category: "CRM",
    status: "planned",
    blurb: "Planned Zoho connector for call logging and follow-up workflows.",
    workflow: ["Call completes", "Analysis generated", "CRM notes/tasks sync (planned)"],
  },
  {
    slug: "pipedrive",
    name: "Pipedrive",
    category: "CRM",
    status: "planned",
    blurb: "Planned Pipedrive connector for pipeline context and follow-ups.",
    workflow: ["Call completes", "Summary generated", "Deal activity updated (planned)"],
  },
  {
    slug: "twilio",
    name: "Twilio",
    category: "Telephony",
    status: "in_progress",
    blurb: "Telephony foundation in progress — click-to-call and caller ID for Artemis workspaces.",
    workflow: [
      "Configure company caller ID",
      "Verify employee phone",
      "Place outbound call from Artemis",
      "Capture call metadata for analysis workflows",
    ],
  },
  {
    slug: "aircall",
    name: "Aircall",
    category: "Telephony",
    status: "planned",
    blurb: "Planned telephony integration for teams already running Aircall.",
    workflow: ["Call completes in Aircall", "Recording/metadata ingested (planned)", "Artemis analyzes"],
  },
  {
    slug: "ringcentral",
    name: "RingCentral",
    category: "Telephony",
    status: "planned",
    blurb: "Planned RingCentral connector for conversation capture.",
    workflow: ["Call completes", "Ingest metadata/recording (planned)", "Analyze in Artemis"],
  },
  {
    slug: "rest-api",
    name: "Generic REST API",
    category: "Data",
    status: "planned",
    blurb: "API-first direction for custom CRM and data warehouse connections.",
    workflow: ["Authenticate", "Push/pull call and outcome objects", "Extend with webhooks"],
  },
  {
    slug: "webhooks",
    name: "Webhooks",
    category: "Data",
    status: "planned",
    blurb: "Event webhooks for call completed, analysis ready, and coaching assigned.",
    workflow: ["Subscribe to events", "Receive signed payloads (planned)", "Update downstream systems"],
  },
];

export function getIntegration(slug: string) {
  return INTEGRATIONS.find((i) => i.slug === slug);
}

export function statusLabel(status: IntegrationStatus) {
  if (status === "available") return "Available";
  if (status === "in_progress") return "In progress";
  return "Coming soon";
}
