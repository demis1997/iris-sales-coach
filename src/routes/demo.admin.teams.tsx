import { createFileRoute } from "@tanstack/react-router";
import { DemoPage } from "@/components/demo/demo-shell";
import { PageHeader, ProductButton, ProductCard, StatusBadge } from "@/components/product/ui";
import { APEX_TEAM_ADMIN } from "@/data/demo/org";

export const Route = createFileRoute("/demo/admin/teams")({
  component: AdminTeamsPage,
});

function AdminTeamsPage() {
  return (
    <DemoPage>
      <PageHeader
        eyebrow="Admin · Teams"
        title="Team structure"
        subtitle="Four desks · 12 agents each · aligned to Apex Markets campaigns."
        actions={
          <ProductButton
            onClick={() => {
              /* demo */
            }}
          >
            Create Team
          </ProductButton>
        }
      />

      <div className="grid gap-4 md:grid-cols-2">
        {APEX_TEAM_ADMIN.map((team) => (
          <ProductCard
            key={team.id}
            title={team.name}
            subtitle={`Manager: ${team.manager}`}
            action={<StatusBadge tone="live">{team.agents} agents</StatusBadge>}
          >
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-[11px] uppercase tracking-wider text-[#8A9BB5]">Focus</dt>
                <dd className="mt-1 text-[#F7FAFF]">{team.focus}</dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-wider text-[#8A9BB5]">Campaign</dt>
                <dd className="mt-1 text-[#F7FAFF]">{team.focus}</dd>
              </div>
            </dl>
            <div className="mt-4 flex flex-wrap gap-2">
              {["Assign Manager", "Move Users", "Assign Campaign"].map((label) => (
                <button
                  key={label}
                  type="button"
                  className="rounded-lg border border-white/[0.08] px-3 py-1.5 text-xs font-semibold text-[#8A9BB5] hover:text-[#F7FAFF]"
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
