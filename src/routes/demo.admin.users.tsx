import { createFileRoute } from "@tanstack/react-router";
import { UserPlus, Users } from "lucide-react";
import { useState } from "react";
import { DemoPage } from "@/components/demo/demo-shell";
import { PageHeader, ProductButton, ProductCard, StatusBadge } from "@/components/product/ui";
import { APEX_ADMIN_USERS, APEX_ORG } from "@/data/demo/org";

export const Route = createFileRoute("/demo/admin/users")({
  component: AdminUsersPage,
});

function AdminUsersPage() {
  const [toast, setToast] = useState<string | null>(null);

  function demoAction(label: string) {
    setToast(`${label} — demo only (no changes persisted)`);
    window.setTimeout(() => setToast(null), 2800);
  }

  return (
    <DemoPage>
      <PageHeader
        eyebrow="Admin · Users"
        title="User management"
        subtitle="Provision agents, managers and executives across Apex Markets desks."
        actions={
          <div className="flex flex-wrap gap-2">
            <ProductButton variant="secondary" onClick={() => demoAction("Bulk invite")}>
              Bulk Invite
            </ProductButton>
            <ProductButton onClick={() => demoAction("Add user")}>
              <UserPlus className="size-4" />
              Add User
            </ProductButton>
          </div>
        }
      />

      {toast ? (
        <div className="mb-4 rounded-xl border border-[#2EE6A6]/30 bg-[#2EE6A6]/10 px-4 py-2 text-sm text-[#2EE6A6]">
          {toast}
        </div>
      ) : null}

      <ProductCard
        title={`${APEX_ADMIN_USERS.length} directory users shown`}
        subtitle={`Full org: ${APEX_ORG.activeUsers} active seats`}
        action={
          <span className="inline-flex items-center gap-1.5 text-xs text-[#8A9BB5]">
            <Users className="size-3.5" />
            Apex Markets
          </span>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[880px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/[0.07] text-[11px] uppercase tracking-[0.14em] text-[#8A9BB5]">
                <th className="pb-3 font-medium">Name</th>
                <th className="pb-3 font-medium">Role</th>
                <th className="pb-3 font-medium">Team</th>
                <th className="pb-3 font-medium">Ext</th>
                <th className="pb-3 font-medium">Phone</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Calls</th>
                <th className="pb-3 font-medium">Last active</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {APEX_ADMIN_USERS.map((u) => (
                <tr key={u.id} className="border-b border-white/[0.05] last:border-0">
                  <td className="py-3 pr-3 font-medium text-[#F7FAFF]">{u.name}</td>
                  <td className="py-3 pr-3 text-[#8A9BB5]">{u.role}</td>
                  <td className="py-3 pr-3 text-[#8A9BB5]">{u.team}</td>
                  <td className="py-3 pr-3 text-[#8A9BB5]">{u.extension}</td>
                  <td className="py-3 pr-3 font-mono text-xs text-[#F7FAFF]">{u.phoneNumber}</td>
                  <td className="py-3 pr-3">
                    <StatusBadge
                      tone={
                        u.status === "Active" ? "live" : u.status === "Invited" ? "warn" : "neutral"
                      }
                    >
                      {u.status}
                    </StatusBadge>
                  </td>
                  <td className="py-3 pr-3 text-[#F7FAFF]">{u.callsToday}</td>
                  <td className="py-3 pr-3 text-[#8A9BB5]">{u.lastActive}</td>
                  <td className="py-3">
                    <div className="flex flex-wrap gap-1">
                      {["Role", "Team", "Number", "Deactivate"].map((a) => (
                        <button
                          key={a}
                          type="button"
                          onClick={() => demoAction(`${a} · ${u.name}`)}
                          className="rounded-lg border border-white/[0.08] px-2 py-1 text-[10px] font-semibold text-[#8A9BB5] hover:text-[#F7FAFF]"
                        >
                          {a}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ProductCard>
    </DemoPage>
  );
}
