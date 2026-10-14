import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/auth-provider";
import { Panel, PageHeading } from "@/components/iris/primitives";
import { normalizeE164 } from "@/lib/telephony/phone";
export type SalesLead = {
  id: string;
  name: string;
  phone_e164: string;
  status: string;
  marketing_consent: string;
  consent_reference: string | null;
};
export function LeadDirectory() {
  const { session } = useAuth();
  const company = session?.activeCompanyId;
  const db = supabase as SupabaseClient;
  const queries = useQueryClient();
  const [name, setName] = useState(""),
    [phone, setPhone] = useState(""),
    [consent, setConsent] = useState(false),
    [reference, setReference] = useState(""),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  const [leadId, setLeadId] = useState(""),
    [title, setTitle] = useState(""),
    [due, setDue] = useState(""),
    [kind, setKind] = useState("task");
  const { data: leads = [], error: loadError } = useQuery({
    queryKey: ["sales-leads", company],
    enabled: !!company,
    queryFn: async () => {
      const result = await db
        .from("sales_leads")
        .select("id,name,phone_e164,status,marketing_consent,consent_reference")
        .eq("company_id", company)
        .order("created_at", { ascending: false })
        .limit(100);
      if (result.error) throw new Error("Leads unavailable; check migration and access");
      return result.data as SalesLead[];
    },
  });
  const { data: followups = [] } = useQuery({
    queryKey: ["lead-followups", company],
    enabled: !!company,
    queryFn: async () => {
      const result = await db
        .from("lead_followups")
        .select("id,title,kind,due_at,status")
        .eq("company_id", company)
        .order("due_at")
        .limit(50);
      if (result.error) throw new Error("Follow-ups unavailable");
      return result.data as {
        id: string;
        title: string;
        kind: string;
        due_at: string;
        status: string;
      }[];
    },
  });
  async function run(action: () => Promise<void>) {
    setBusy(true);
    setError("");
    try {
      await action();
      await queries.invalidateQueries({ queryKey: ["sales-leads", company] });
      await queries.invalidateQueries({ queryKey: ["lead-followups", company] });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Operation failed");
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <PageHeading
        title="Leads & follow-ups"
        subtitle="Internal organization records · external FXBO synchronization is not connected"
      />
      {(error || loadError) && (
        <p role="alert" className="mb-4 text-destructive">
          {error || loadError?.message}
        </p>
      )}
      <Panel className="mb-4 p-5">
        <h2 className="font-semibold">Create lead</h2>
        <form
          className="mt-3 grid gap-3 md:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault();
            void run(async () => {
              if (!company || !session) throw new Error("Sign in first");
              const result = await db.from("sales_leads").insert({
                company_id: company,
                owner_user_id: session.userId,
                name: name.trim(),
                phone_e164: normalizeE164(phone),
                marketing_consent: consent ? "granted" : "unknown",
                consent_reference: consent ? reference : null,
              });
              if (result.error)
                throw new Error("Lead could not be created; check duplicates and access");
              setName("");
              setPhone("");
            });
          }}
        >
          <label>
            Name
            <input
              required
              maxLength={120}
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="block w-full rounded border border-border bg-secondary p-2"
            />
          </label>
          <label>
            International phone
            <input
              required
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className="block w-full rounded border border-border bg-secondary p-2"
            />
          </label>
          <label>
            <input
              type="checkbox"
              checked={consent}
              onChange={(event) => setConsent(event.target.checked)}
            />{" "}
            Marketing consent independently verified by operator
          </label>
          <label>
            Consent record reference
            <input
              required={consent}
              minLength={consent ? 8 : undefined}
              maxLength={500}
              value={reference}
              onChange={(event) => setReference(event.target.value)}
              className="block w-full rounded border border-border bg-secondary p-2"
            />
          </label>
          <button disabled={busy} className="rounded bg-primary px-4 py-2 text-primary-foreground">
            Save internal lead
          </button>
        </form>
      </Panel>
      <Panel className="mb-4 p-5">
        <h2 className="font-semibold">Accessible leads</h2>
        {leads.length === 0 ? (
          <p className="mt-3 text-muted-foreground">
            No actual leads yet. Sample contacts are not mixed into this list.
          </p>
        ) : (
          leads.map((lead) => (
            <div
              key={lead.id}
              className="mt-3 flex flex-wrap items-center gap-3 border-b border-border pb-3"
            >
              <strong>{lead.name}</strong>
              <span>{lead.phone_e164}</span>
              <span className="text-xs">Consent: {lead.marketing_consent}</span>
              <select
                aria-label={`Status for ${lead.name}`}
                value={lead.status}
                onChange={(event) =>
                  void run(async () => {
                    const result = await db
                      .from("sales_leads")
                      .update({ status: event.target.value, updated_at: new Date().toISOString() })
                      .eq("company_id", company)
                      .eq("id", lead.id);
                    if (result.error) throw new Error("Status update failed");
                  })
                }
                className="rounded border border-border bg-secondary p-2"
              >
                {[
                  "new",
                  "qualified",
                  "follow_up",
                  "demo_booked",
                  "onboarding",
                  "reactivation",
                  "declined",
                ].map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
              <button
                onClick={() =>
                  void run(async () => {
                    const result = await db
                      .from("sales_leads")
                      .update({ marketing_consent: "withdrawn" })
                      .eq("company_id", company)
                      .eq("id", lead.id);
                    if (result.error) throw new Error("Consent withdrawal failed");
                  })
                }
              >
                Withdraw consent
              </button>
            </div>
          ))
        )}
      </Panel>
      <Panel className="p-5">
        <h2 className="font-semibold">Schedule an internal follow-up</h2>
        <form
          className="mt-3 grid gap-3 md:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault();
            void run(async () => {
              if (!session) throw new Error("Sign in first");
              const result = await db.from("lead_followups").insert({
                company_id: company,
                lead_id: leadId,
                owner_user_id: session.userId,
                kind,
                title,
                due_at: new Date(due).toISOString(),
              });
              if (result.error) throw new Error("Follow-up creation failed");
              setTitle("");
            });
          }}
        >
          <label>
            Lead
            <select
              required
              value={leadId}
              onChange={(event) => setLeadId(event.target.value)}
              className="block rounded border border-border bg-secondary p-2"
            >
              <option value="">Choose a lead</option>
              {leads.map((lead) => (
                <option value={lead.id} key={lead.id}>
                  {lead.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Type
            <select
              value={kind}
              onChange={(event) => setKind(event.target.value)}
              className="block rounded border border-border bg-secondary p-2"
            >
              <option value="task">Task</option>
              <option value="appointment">Internal appointment</option>
            </select>
          </label>
          <label>
            Title
            <input
              required
              maxLength={200}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="block rounded border border-border bg-secondary p-2"
            />
          </label>
          <label>
            Time in your browser's local timezone
            <input
              required
              type="datetime-local"
              value={due}
              onChange={(event) => setDue(event.target.value)}
              className="block rounded border border-border bg-secondary p-2"
            />
          </label>
          <button
            disabled={busy || !leads.length}
            className="rounded bg-primary px-4 py-2 text-primary-foreground"
          >
            Save follow-up
          </button>
        </form>
        <p className="mt-3 text-xs text-muted-foreground">
          These are internal records. Saving an appointment does not create an external calendar
          event or confirm a customer invitation.
        </p>
        {followups.map((item) => (
          <p className="mt-2" key={item.id}>
            {item.kind} · {item.title} · {new Date(item.due_at).toLocaleString()} · {item.status}
          </p>
        ))}
      </Panel>
    </>
  );
}
