import { createFileRoute } from "@tanstack/react-router";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { DemoPage } from "@/components/demo/demo-shell";
import { PageHeader, ProductButton, ProductCard, StatusBadge } from "@/components/product/ui";
import { APEX_ORG, APEX_PHONE_NUMBERS } from "@/data/demo/org";

export const Route = createFileRoute("/demo/admin/numbers")({
  component: AdminNumbersPage,
});

function AdminNumbersPage() {
  const [open, setOpen] = useState(false);
  const [purchased, setPurchased] = useState(false);

  return (
    <DemoPage>
      <PageHeader
        eyebrow="Admin · Phone Numbers"
        title="Artemis numbers"
        subtitle={`${APEX_ORG.phoneNumbers} numbers across Apex Markets — voice provisioning without another dialer.`}
        actions={
          <ProductButton onClick={() => setOpen(true)}>
            <Plus className="size-4" />
            Add Phone Number
          </ProductButton>
        }
      />

      <ProductCard title="Number inventory" subtitle="Customer-facing Artemis Voice inventory">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/[0.07] text-[11px] uppercase tracking-[0.14em] text-[#8A9BB5]">
                <th className="pb-3 font-medium">Number</th>
                <th className="pb-3 font-medium">Country</th>
                <th className="pb-3 font-medium">Type</th>
                <th className="pb-3 font-medium">Assigned to</th>
                <th className="pb-3 font-medium">Campaign</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Monthly usage</th>
              </tr>
            </thead>
            <tbody>
              {APEX_PHONE_NUMBERS.map((n) => (
                <tr key={n.id} className="border-b border-white/[0.05] last:border-0">
                  <td className="py-3 pr-3 font-mono text-xs font-medium text-[#F7FAFF]">
                    {n.number}
                  </td>
                  <td className="py-3 pr-3 text-[#8A9BB5]">{n.country}</td>
                  <td className="py-3 pr-3 text-[#8A9BB5]">{n.type}</td>
                  <td className="py-3 pr-3 text-[#F7FAFF]">{n.assignedTo}</td>
                  <td className="py-3 pr-3 text-[#8A9BB5]">{n.campaign}</td>
                  <td className="py-3 pr-3">
                    <StatusBadge tone={n.status === "Active" ? "live" : "neutral"}>
                      {n.status}
                    </StatusBadge>
                  </td>
                  <td className="py-3 text-[#8A9BB5]">{n.monthlyUsage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-[#8A9BB5]">
          Showing sample inventory. Full catalog in production includes all {APEX_ORG.phoneNumbers}{" "}
          numbers.
        </p>
      </ProductCard>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-labelledby="add-number-title"
            className="w-full max-w-md rounded-2xl border border-white/10 bg-[#132742] p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 id="add-number-title" className="text-lg font-semibold text-[#F7FAFF]">
                  Add phone number
                </h2>
                <p className="mt-1 text-sm text-[#8A9BB5]">
                  Demo provisioning — no real purchase occurs.
                </p>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={() => {
                  setOpen(false);
                  setPurchased(false);
                }}
                className="rounded-lg p-1 text-[#8A9BB5] hover:text-[#F7FAFF]"
              >
                <X className="size-5" />
              </button>
            </div>

            {purchased ? (
              <div className="mt-6 rounded-xl border border-[#2EE6A6]/30 bg-[#2EE6A6]/10 px-4 py-4 text-sm text-[#2EE6A6]">
                Number reserved in demo mode. In production this would provision an Artemis Voice
                number for your workspace.
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                <label className="block text-sm">
                  <span className="text-[#8A9BB5]">Country</span>
                  <select className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#0B1B33] px-3 py-2.5 text-[#F7FAFF]">
                    <option>United Kingdom</option>
                    <option>Germany</option>
                    <option>Cyprus</option>
                    <option>France</option>
                  </select>
                </label>
                <label className="block text-sm">
                  <span className="text-[#8A9BB5]">Number type</span>
                  <select className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#0B1B33] px-3 py-2.5 text-[#F7FAFF]">
                    <option>Local</option>
                    <option>National</option>
                    <option>Toll-free</option>
                  </select>
                </label>
                <label className="block text-sm">
                  <span className="text-[#8A9BB5]">Area</span>
                  <input
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#0B1B33] px-3 py-2.5 text-[#F7FAFF]"
                    placeholder="e.g. London"
                    defaultValue="London"
                  />
                </label>
                <div>
                  <p className="text-sm text-[#8A9BB5]">Capabilities</p>
                  <div className="mt-2 flex gap-3 text-sm text-[#F7FAFF]">
                    <span className="rounded-lg border border-[#2EE6A6]/40 bg-[#2EE6A6]/10 px-3 py-1.5">
                      Voice ✓
                    </span>
                    <span className="rounded-lg border border-[#2EE6A6]/40 bg-[#2EE6A6]/10 px-3 py-1.5">
                      SMS ✓
                    </span>
                  </div>
                </div>
                <ProductButton className="w-full justify-center" onClick={() => setPurchased(true)}>
                  Purchase Number
                </ProductButton>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </DemoPage>
  );
}
