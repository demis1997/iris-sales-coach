import { createFileRoute, Link } from "@tanstack/react-router";
import { DemoLoading, DemoPage } from "@/components/demo/demo-shell";
import { useDemoQuery } from "@/components/demo/use-demo-query";
import { Panel, PanelHeader } from "@/components/iris/primitives";
import { AIInsight, KPICard, PageHeader, StatusBadge } from "@/components/product/ui";
import { DEMO_COMPANY } from "@/data/demo/company";
import { demoService } from "@/lib/demo/demo-service";

export const Route = createFileRoute("/demo/agent/")({
  component: AgentTodayPage,
});

function AgentTodayPage() {
  const { data: agent, loading } = useDemoQuery(() => demoService.getAgent(DEMO_COMPANY.defaultAgentId), []);
  const { data: call } = useDemoQuery(() => demoService.getCall(DEMO_COMPANY.mariaCallId), []);

  if (loading || !agent || !call) return <DemoLoading />;

  return (
    <DemoPage>
      <PageHeader
        title="Today"
        subtitle={`Good morning, ${agent.name.split(" ")[0]}. Ready to sell.`}
      />

      <Panel className="overflow-hidden">
        <div className="bg-gradient-to-r from-[#2EE6A6]/10 via-transparent to-[#18C4FF]/10 px-6 py-6 md:px-8 md:py-8">
          <StatusBadge tone="ai">Continue selling</StatusBadge>
          <h2 className="mt-3 text-[22px] font-semibold tracking-tight">Sales Workspace</h2>
          <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
            Open the live softphone + Artemis Copilot — what your salesperson sees while talking to a
            lead.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              to="/demo/agent/live"
              search={{ mode: "midcall" }}
              className="product-btn-primary"
            >
              Open Sales Workspace
            </Link>
            <Link
              to="/demo/agent/live"
              search={{ mode: "queue" }}
              className="product-btn-secondary"
            >
              Open Queue
            </Link>
          </div>
        </div>
      </Panel>

      <Panel className="p-6">
        <p className="text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
          Today's Goal
        </p>
        <p className="mt-2 text-[16px] font-semibold">Closing high-intent prospects</p>
        <p className="mt-2 text-[13px] text-muted-foreground">
          Current skill: Closing {agent.skills.closing} → target 80
        </p>
      </Panel>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KPICard label="Calls" value="19" />
        <KPICard label="FTDs" value="4" />
        <KPICard label="Conversion" value="21%" />
        <KPICard label="Deposits" value="€12,400" />
      </div>

      <AIInsight title="Artemis Coach" subtitle="Simulated AI coaching for today">
        <p className="text-[15px] leading-relaxed text-[#C5D0E0]">
          You're creating strong buying intent today, but you've missed the closing opportunity on 2
          calls.
        </p>
        <Link
          to="/demo/agent/live"
          search={{ mode: "midcall" }}
          className="mt-4 inline-flex text-[13px] font-semibold text-[#2EE6A6] hover:underline"
        >
          See why →
        </Link>
      </AIInsight>

      <Panel>
        <PanelHeader
          title="Your latest call"
          subtitle={`${call.contactLabel} · ${call.startedAt} · Score ${call.aiScore}`}
        />
        <div className="grid gap-5 p-6 lg:grid-cols-2">
          <div>
            <p className="text-[12px] font-semibold text-[#2EE6A6]">What you did well</p>
            <ul className="mt-2 space-y-1.5 text-[14px] text-muted-foreground">
              <li>✓ Strong discovery</li>
              <li>✓ Built rapport</li>
              <li>✓ Explained platform clearly</li>
            </ul>
          </div>
          <div>
            <p className="text-[12px] font-semibold text-[#F5B942]">What cost you the sale</p>
            <p className="mt-2 text-[14px] text-muted-foreground">
              You continued explaining after the prospect gave a buying signal.
            </p>
            <p className="mt-2 font-mono text-[12px] text-[#18C4FF]">08:14</p>
          </div>
        </div>
        <div className="border-t border-border px-6 py-4">
          <Link
            to="/demo/calls/$callId"
            params={{ callId: call.id }}
            className="text-[13px] font-semibold text-[#2EE6A6] hover:underline"
          >
            Open full review →
          </Link>
        </div>
      </Panel>

      <div className="flex flex-wrap gap-2">
        <Link to="/demo/agent/dna" className="product-btn-secondary !px-4 !py-2 text-xs">
          Rep DNA
        </Link>
        <Link to="/demo/agent/coach" className="product-btn-secondary !px-4 !py-2 text-xs">
          Coaching
        </Link>
        <Link to="/demo/agent/calls" className="product-btn-secondary !px-4 !py-2 text-xs">
          Calls
        </Link>
        <Link to="/demo/agent/practice" className="product-btn-secondary !px-4 !py-2 text-xs">
          Practice
        </Link>
      </div>
    </DemoPage>
  );
}
