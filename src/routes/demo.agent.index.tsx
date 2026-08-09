import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { DemoLoading, DemoPage } from "@/components/demo/demo-shell";
import { useDemoQuery } from "@/components/demo/use-demo-query";
import { Chip, PageHeading, Panel, PanelHeader, StatCard } from "@/components/iris/primitives";
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
      <PageHeading
        title="Good morning, Maria."
        subtitle="Here's what will make your calls better today."
        action={<Chip tone="iris">Demo Workspace</Chip>}
      />

      <Panel className="p-5">
        <p className="text-xs text-muted-foreground">Today's goal</p>
        <p className="mt-1 text-sm font-semibold">Improve closing on high-intent prospects.</p>
        <p className="mt-2 text-xs text-muted-foreground">
          Current skill: Closing {agent.skills.closing} → target 80
        </p>
      </Panel>

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label="Calls today" value={`${agent.calls}`} />
        <StatCard label="FTDs" value={`${agent.ftds}`} />
        <StatCard label="Conversion" value={`${agent.conversion}%`} />
      </div>

      <Panel>
        <PanelHeader title="Your latest call" subtitle={`${call.contactLabel} · ${call.startedAt} · Score ${call.aiScore}`} />
        <div className="grid gap-4 p-5 lg:grid-cols-2">
          <div>
            <p className="text-xs font-medium text-success">What you did well</p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>✓ Strong discovery</li>
              <li>✓ Built rapport</li>
              <li>✓ Explained platform clearly</li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-medium text-warning">What cost you the sale</p>
            <p className="mt-2 text-sm text-muted-foreground">
              You continued explaining after the prospect gave a buying signal.
            </p>
            <p className="mt-2 font-mono text-xs text-primary">08:14</p>
          </div>
        </div>
        <div className="border-t border-border px-5 py-4 text-sm">
          <p className="font-medium">Try this instead</p>
          <p className="mt-2 text-xs text-muted-foreground">Prospect: “Okay, that sounds pretty good.”</p>
          <p className="mt-1 text-xs text-destructive">You said: “Great, and another feature we offer…”</p>
          <p className="mt-1 text-xs text-success">Better: “Great. Shall we get your account set up now?”</p>
          <Link to="/demo/calls/$callId" params={{ callId: call.id }} className="mt-3 inline-flex text-xs text-primary hover:underline">
            Open full review →
          </Link>
        </div>
      </Panel>

      <div className="flex flex-wrap gap-2">
        <Link to="/demo/agent/coach" className="rounded-xl gradient-surface px-4 py-2 text-xs font-semibold text-background">
          Ask Artemis
        </Link>
        <Link to="/demo/agent/dna" className="rounded-xl border border-border px-4 py-2 text-xs">
          Rep DNA
        </Link>
        <Link to="/demo/agent/practice" className="rounded-xl border border-border px-4 py-2 text-xs">
          Practice roleplay
        </Link>
      </div>
    </DemoPage>
  );
}
