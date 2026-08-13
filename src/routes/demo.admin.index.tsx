import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, ListOrdered, Phone, Radio, Users } from "lucide-react";
import { DemoPage } from "@/components/demo/demo-shell";
import { KPICard, PageHeader, ProductCard, StatusBadge } from "@/components/product/ui";
import { APEX_ACTIVITY, APEX_ORG } from "@/data/demo/org";

export const Route = createFileRoute("/demo/admin/")({
  component: AdminOverviewPage,
});

function AdminOverviewPage() {
  return (
    <DemoPage>
      <PageHeader
        eyebrow="Admin · Overview"
        title="Platform control for Apex Markets"
        subtitle="Users, voice numbers, routing and campaigns — Artemis as the sales floor operating system."
        actions={<StatusBadge tone="live">All systems operational</StatusBadge>}
      />

      <div className="mb-4 rounded-2xl border border-white/[0.07] bg-[#132742]/50 px-5 py-4 text-sm text-[#8A9BB5]">
        <span className="font-semibold text-[#F7FAFF]">{APEX_ORG.name}</span>
        <span className="mx-2 text-white/20">·</span>
        Plan: <span className="text-[#F7FAFF]">{APEX_ORG.plan}</span>
        <span className="mx-2 text-white/20">·</span>
        Demo workspace — no live provisioning
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KPICard label="Active users" value={String(APEX_ORG.activeUsers)} hint="Across 4 desks" />
        <KPICard label="Phone numbers" value={String(APEX_ORG.phoneNumbers)} hint="Artemis Voice" />
        <KPICard
          label="Active campaigns"
          value={String(APEX_ORG.activeCampaigns)}
          hint="Dialer + queues"
        />
        <KPICard
          label="Calls this month"
          value={APEX_ORG.callsThisMonth.toLocaleString()}
          hint={`${APEX_ORG.voiceMinutes.toLocaleString()} voice minutes`}
        />
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KPICard label="Storage" value={`${APEX_ORG.storageGb} GB`} hint="Recordings + transcripts" />
        <KPICard
          label="AI analyzed calls"
          value={APEX_ORG.aiAnalyzedCalls.toLocaleString()}
          hint="Scored & coached"
        />
        <KPICard label="Calls today" value={APEX_ORG.callsToday.toLocaleString()} hint="Live floor" />
        <KPICard
          label="Agents online"
          value={`${APEX_ORG.activeAgentsToday}/${APEX_ORG.activeUsers}`}
          hint="Right now"
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <ProductCard
          title="Recent activity"
          subtitle="Organization events"
          action={
            <Link to="/demo/admin/users" className="text-xs font-semibold text-[#2EE6A6]">
              Manage users →
            </Link>
          }
        >
          <ul className="space-y-3">
            {APEX_ACTIVITY.map((a) => (
              <li
                key={a.id}
                className="flex items-start justify-between gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5"
              >
                <div className="flex gap-2.5">
                  <Activity className="mt-0.5 size-3.5 shrink-0 text-[#2EE6A6]" />
                  <p className="text-sm text-[#F7FAFF]">{a.text}</p>
                </div>
                <span className="shrink-0 text-[11px] text-[#8A9BB5]">{a.time}</span>
              </li>
            ))}
          </ul>
        </ProductCard>

        <ProductCard title="Quick actions" subtitle="Demo controls">
          <div className="grid gap-2">
            {(
              [
                { to: "/demo/admin/numbers" as const, label: "Add phone number", icon: Phone },
                { to: "/demo/admin/routing" as const, label: "Edit call routing", icon: Radio },
                { to: "/demo/admin/users" as const, label: "Invite users", icon: Users },
                { to: "/demo/admin/campaigns" as const, label: "Create campaign", icon: ListOrdered },
              ] as const
            ).map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] px-3 py-3 text-sm font-medium text-[#F7FAFF] transition hover:border-[#2EE6A6]/40"
              >
                <item.icon className="size-4 text-[#2EE6A6]" />
                {item.label}
              </Link>
            ))}
          </div>
        </ProductCard>
      </div>
    </DemoPage>
  );
}
