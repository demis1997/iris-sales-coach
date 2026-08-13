import { createFileRoute } from "@tanstack/react-router";
import { Pause, Play, Plus } from "lucide-react";
import { useState } from "react";
import { DemoPage } from "@/components/demo/demo-shell";
import { PageHeader, ProductButton, ProductCard, StatusBadge } from "@/components/product/ui";
import { APEX_CAMPAIGNS } from "@/data/demo/org";

export const Route = createFileRoute("/demo/admin/campaigns")({
  component: AdminCampaignsPage,
});

function AdminCampaignsPage() {
  const [toast, setToast] = useState<string | null>(null);

  function demoAction(label: string) {
    setToast(`${label} — demo only`);
    window.setTimeout(() => setToast(null), 2500);
  }

  return (
    <DemoPage>
      <PageHeader
        eyebrow="Admin · Campaigns"
        title="Campaign administration"
        subtitle="Dialing mode, lead lists, caller ID and AI playbooks for high-volume outbound."
        actions={
          <ProductButton onClick={() => demoAction("Create campaign")}>
            <Plus className="size-4" />
            Create Campaign
          </ProductButton>
        }
      />

      {toast ? (
        <div className="mb-4 rounded-xl border border-[#2EE6A6]/30 bg-[#2EE6A6]/10 px-4 py-2 text-sm text-[#2EE6A6]">
          {toast}
        </div>
      ) : null}

      <div className="grid gap-4">
        {APEX_CAMPAIGNS.map((c) => (
          <ProductCard
            key={c.id}
            title={c.name}
            subtitle={`${c.team} · ${c.dialMode} dialing · ${c.callerId}`}
            action={
              <StatusBadge
                tone={c.status === "Running" ? "live" : c.status === "Paused" ? "warn" : "neutral"}
              >
                {c.status}
              </StatusBadge>
            }
          >
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <Metric label="Leads" value={c.leads.toLocaleString()} />
              <Metric label="Agents" value={String(c.agents)} />
              <Metric label="Calls today" value={c.callsToday.toLocaleString()} />
              <Metric label="Conversion" value={`${c.conversion}%`} />
              <Metric label="Dial mode" value={c.dialMode} />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <ProductButton
                variant="secondary"
                onClick={() => demoAction(c.status === "Running" ? `Pause ${c.name}` : `Start ${c.name}`)}
              >
                {c.status === "Running" ? (
                  <>
                    <Pause className="size-3.5" /> Pause
                  </>
                ) : (
                  <>
                    <Play className="size-3.5" /> Start
                  </>
                )}
              </ProductButton>
              {["Edit", "Assign Agents", "Upload Leads"].map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => demoAction(`${label} · ${c.name}`)}
                  className="rounded-xl border border-white/[0.08] px-3 py-2 text-xs font-semibold text-[#8A9BB5] hover:text-[#F7FAFF]"
                >
                  {label}
                </button>
              ))}
            </div>
          </ProductCard>
        ))}
      </div>
    </DemoPage>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5">
      <p className="text-[11px] uppercase tracking-wider text-[#8A9BB5]">{label}</p>
      <p className="mt-1 text-sm font-semibold text-[#F7FAFF]">{value}</p>
    </div>
  );
}
