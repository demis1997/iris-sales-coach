import { useEffect, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/auth-provider";
import { Panel, PanelHeader } from "@/components/iris/primitives";
type LiveEvent = {
  id: number;
  kind: string;
  payload: {
    speaker?: string;
    text?: string;
    stage?: string;
    latencyMs?: number;
    suggestions?: { shortTitle: string; suggestedAction: string; reason: string }[];
  };
};
export function LiveCoachingPanel({ callId }: { callId: string }) {
  const { session } = useAuth();
  const [events, setEvents] = useState<LiveEvent[]>([]),
    [status, setStatus] = useState("Connecting to live events…");
  useEffect(() => {
    const companyId = session?.activeCompanyId;
    if (!companyId) return;
    let active = true;
    const db = supabase as SupabaseClient;
    setEvents([]);
    void db
      .from("live_call_events")
      .select("id,kind,payload")
      .eq("company_id", companyId)
      .eq("call_id", callId)
      .order("id", { ascending: false })
      .limit(50)
      .then(({ data, error }) => {
        if (active) {
          if (error) setStatus("Live events unavailable; check migrations and worker");
          else
            setEvents((previous) =>
              Array.from(
                new Map(
                  [...(data ?? []).reverse(), ...previous].map((event) => [event.id, event]),
                ).values(),
              ).slice(-50),
            );
        }
      });
    const channel = db
      .channel(`live-call-${callId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "live_call_events",
          filter: `call_id=eq.${callId}`,
        },
        (event) => {
          if (active) {
            const row = event.new as LiveEvent;
            setEvents((previous) =>
              [...previous.filter((item) => item.id !== row.id), row].slice(-50),
            );
          }
        },
      )
      .subscribe((state) => {
        if (active)
          setStatus(
            state === "SUBSCRIBED"
              ? "Subscribed · awaiting actual worker events"
              : state === "CHANNEL_ERROR"
                ? "Live subscription unavailable"
                : state,
          );
      });
    return () => {
      active = false;
      void db.removeChannel(channel);
    };
  }, [callId, session?.activeCompanyId]);
  const transcript = events.filter((event) => event.kind === "transcript");
  const coaching = events.filter((event) => event.kind === "coaching").at(-1);
  return (
    <Panel className="mt-4">
      <PanelHeader title="Live transcript & silent coaching" subtitle={status} />
      <div className="space-y-3 p-5 text-sm">
        {transcript.length === 0 ? (
          <p className="text-muted-foreground">
            No audio transcript received. A configured, connected media worker is required. No
            sample conversation is displayed here.
          </p>
        ) : (
          transcript.slice(-10).map((event) => (
            <p key={event.id}>
              <strong>{event.payload.speaker}:</strong> {event.payload.text}
            </p>
          ))
        )}
        {coaching?.payload.suggestions?.map((suggestion, index) => (
          <div key={`${coaching.id}-${index}`} className="rounded border border-primary/30 p-3">
            <strong>{suggestion.shortTitle}</strong>
            <p>{suggestion.suggestedAction}</p>
            <p className="text-xs text-muted-foreground">{suggestion.reason}</p>
          </div>
        ))}
        {events
          .filter((event) => event.kind === "latency")
          .slice(-2)
          .map((event) => (
            <p className="text-xs text-muted-foreground" key={event.id}>
              {event.payload.stage}: {event.payload.latencyMs} ms · observed stage timing, not
              verified telephone round-trip latency
            </p>
          ))}
        <p className="text-xs text-muted-foreground">
          Suggestions assist the human rep and are never spoken into a coaching call.
        </p>
      </div>
    </Panel>
  );
}
