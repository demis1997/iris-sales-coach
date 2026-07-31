/**
 * Lead capture store for book-demo.
 * Client-side persistence for the demo product; swap `saveLead` for a server action later.
 */

export type DemoLead = {
  name: string;
  email: string;
  company: string;
  title: string;
  teamSize: string;
  industry: string;
  monthlyCalls: string;
  crm: string;
  dialer: string;
  challenge: string;
  contactMethod: string;
  submittedAt: string;
  source: "book-demo";
};

const LEAD_INDEX_KEY = "artemis-leads-index";
const leadKey = (email: string) => `artemis-demo:${email.toLowerCase()}`;

export type SaveLeadResult =
  { ok: true; duplicate: boolean; lead: DemoLead } | { ok: false; error: string };

export async function saveLead(
  values: Omit<DemoLead, "submittedAt" | "source">,
): Promise<SaveLeadResult> {
  try {
    // Integration point: POST /api/leads or CRM webhook. No secrets in the client.
    await new Promise((r) => setTimeout(r, 600));

    if (typeof window === "undefined") {
      return { ok: false, error: "Lead storage requires a browser session." };
    }

    const lead: DemoLead = {
      ...values,
      submittedAt: new Date().toISOString(),
      source: "book-demo",
    };

    const key = leadKey(values.email);
    const prior = window.localStorage.getItem(key);
    const duplicate = Boolean(prior);

    window.localStorage.setItem(key, JSON.stringify(lead));

    const index = JSON.parse(window.localStorage.getItem(LEAD_INDEX_KEY) ?? "[]") as string[];
    if (!index.includes(values.email.toLowerCase())) {
      index.push(values.email.toLowerCase());
      window.localStorage.setItem(LEAD_INDEX_KEY, JSON.stringify(index));
    }

    return { ok: true, duplicate, lead };
  } catch {
    return { ok: false, error: "Unable to save your request. Please try again." };
  }
}

export function getLeadByEmail(email: string): DemoLead | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(leadKey(email));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as DemoLead;
  } catch {
    return null;
  }
}
