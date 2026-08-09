import { createFileRoute, Link } from "@tanstack/react-router";
import { DemoLoading, DemoPage } from "@/components/demo/demo-shell";
import { useDemoQuery } from "@/components/demo/use-demo-query";
import { Chip, PageHeading, Panel, PanelHeader } from "@/components/iris/primitives";
import { demoService } from "@/lib/demo/demo-service";

export const Route = createFileRoute("/demo/contacts/$contactId")({
  component: ContactPage,
});

function ContactPage() {
  const { contactId } = Route.useParams();
  const { data: contact, loading } = useDemoQuery(() => demoService.getContact(contactId), [contactId]);
  if (loading) {
    return (
      <div className="artemis-product min-h-screen px-4 py-8">
        <DemoLoading />
      </div>
    );
  }
  if (!contact) {
    return (
      <div className="artemis-product min-h-screen">
        <div className="mx-auto max-w-[1440px] px-4 py-7 md:px-8">
          <DemoPage>
            <PageHeading title="Contact" subtitle="Not in featured demo set" />
            <p className="text-sm text-muted-foreground">
              Open a featured call contact such as Client 10482.
            </p>
            <Link to="/demo/ceo/opportunities" className="text-sm text-primary hover:underline">
              Back to opportunities
            </Link>
          </DemoPage>
        </div>
      </div>
    );
  }
  return (
    <div className="artemis-product min-h-screen">
      <div className="mx-auto max-w-[1440px] px-4 py-7 md:px-8">
      <DemoPage>
      <PageHeading title={contact.label} subtitle={`${contact.country} · ${contact.leadSource}`} action={<Chip tone="iris">Demo</Chip>} />
      <div className="grid gap-4 md:grid-cols-2">
        <Panel className="space-y-2 p-5 text-sm">
          <Row k="Status" v={contact.status} />
          <Row k="Assigned agent" v={contact.agentName} />
          <Row k="Intent" v={contact.intent.replace("_", " ")} />
          <Row k="Primary objection" v={contact.primaryObjection} />
          <Row k="Est. value" v={`€${contact.estimatedValue.toLocaleString()}`} />
        </Panel>
        <Panel>
          <PanelHeader title="Timeline" />
          <div className="divide-y divide-border">
            {contact.callIds.map((id) => (
              <Link key={id} to="/demo/calls/$callId" params={{ callId: id }} className="block px-5 py-3 text-sm text-primary hover:underline">
                Call {id}
              </Link>
            ))}
          </div>
        </Panel>
      </div>
    </DemoPage>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-2">
      <span className="text-muted-foreground">{k}</span>
      <span className="font-medium">{v}</span>
    </div>
  );
}
