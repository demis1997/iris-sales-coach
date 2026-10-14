import { useQuery } from "@tanstack/react-query";
import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/auth-provider";
import { Panel, PageHeading, StatCard } from "@/components/iris/primitives";
export function CallDashboard() {
  const { session } = useAuth();
  const company = session?.activeCompanyId;
  const from = new Date().toISOString().slice(0, 7) + "-01T00:00:00Z";
  const { data, error, isLoading } = useQuery({
    queryKey: ["call-metrics", company, from],
    enabled: !!company,
    refetchInterval: 15000,
    queryFn: async () => {
      const result = await (supabase as SupabaseClient).rpc("call_metrics", {
        _company: company,
        _from: from,
        _to: new Date().toISOString(),
      });
      if (result.error) throw new Error("Metrics unavailable; check migration and access");
      return result.data as Record<string, number | null>;
    },
  });
  return (
    <>
      <PageHeading
        title="Call operations"
        subtitle="Real accessible database records · current UTC month · refreshes every 15 seconds"
      />
      {error ? (
        <Panel className="p-5">{error.message}</Panel>
      ) : isLoading ? (
        <Panel className="p-5">Loading actual call records…</Panel>
      ) : (
        <>
          <div className="grid gap-3 md:grid-cols-4">
            {[
              ["Telephone calls", "phoneCalls"],
              ["Active / pending", "active"],
              ["Completed parent legs", "completed"],
              ["Failed", "failed"],
              ["Missed", "missed"],
              ["Cancelled", "cancelled"],
              ["Parent-leg seconds", "totalProviderLegSeconds"],
              ["Mean AI score", "averageScore"],
              ["Qualified internal leads", "qualifiedLeads"],
              ["Scheduled internal appointments", "appointmentsBooked"],
            ].map(([label, key]) => (
              <StatCard
                key={key}
                label={label}
                value={data?.[key] == null ? "—" : String(Math.round(data[key]! * 10) / 10)}
              />
            ))}
          </div>
          <Panel className="mt-4 p-5 text-sm">
            <p>
              Calls and durations describe the Twilio parent leg, which rings the representative.
              Prospect answer rate and talk time require separate child-leg tracking. No revenue,
              funnel or billing estimates are fabricated.
            </p>
            <p className="mt-2">
              Lead qualification and appointments are internal operator-entered records. Campaign
              attribution and external CRM conversions are not yet available. Recording a conversion
              flag is distinct from independently verified CRM revenue.
            </p>
          </Panel>
        </>
      )}
    </>
  );
}
