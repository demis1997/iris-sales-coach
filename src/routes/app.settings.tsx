import { createFileRoute } from "@tanstack/react-router";
import { PageHeading, Panel, PanelHeader, Chip } from "@/components/iris/primitives";

export const Route = createFileRoute("/app/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Iris Rep Workspace" },
      { name: "description", content: "Coaching preferences, methodology and recording settings." },
      { property: "og:title", content: "Settings — Iris Rep Workspace" },
      { property: "og:description", content: "Coaching preferences, methodology and recording settings." },
    ],
  }),
  component: SettingsPage,
});

function Row({
  title,
  desc,
  children,
}: {
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border px-5 py-4 last:border-0">
      <div className="max-w-md">
        <p className="text-sm font-medium">{title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>
      </div>
      {children}
    </div>
  );
}

function Toggle({ on = false }: { on?: boolean }) {
  return (
    <span
      className={`relative h-5 w-9 rounded-full transition-colors ${on ? "gradient-surface" : "bg-secondary"}`}
    >
      <span
        className={`absolute top-0.5 size-4 rounded-full bg-background transition-all ${on ? "left-4.5" : "left-0.5"}`}
      />
    </span>
  );
}

function SettingsPage() {
  return (
    <>
      <PageHeading title="Settings" subtitle="Personal preferences for your Iris workspace" />

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel>
          <PanelHeader title="Coaching" />
          <Row title="Coach after every call" desc="Receive an AI debrief within 60 seconds of hanging up.">
            <Toggle on />
          </Row>
          <Row title="Weekly AI summary" desc="A Friday recap of skill progression and goals.">
            <Toggle on />
          </Row>
          <Row title="Tone of coaching" desc="How direct Iris should be with feedback.">
            <div className="flex gap-1">
              {["Gentle", "Balanced", "Direct"].map((t) => (
                <span
                  key={t}
                  className={`rounded-lg px-3 py-1.5 text-xs ${
                    t === "Direct" ? "bg-secondary text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {t}
                </span>
              ))}
            </div>
          </Row>
        </Panel>

        <Panel>
          <PanelHeader title="Methodology" subtitle="Applied when scoring your calls" />
          <div className="flex flex-wrap gap-2 p-5">
            {["SPIN", "Challenger", "BANT", "MEDDIC"].map((m) => (
              <span
                key={m}
                className={`rounded-lg border px-3 py-1.5 text-xs ${
                  m === "MEDDIC"
                    ? "border-primary/50 bg-primary/10 text-primary"
                    : "border-border text-muted-foreground"
                }`}
              >
                {m}
              </span>
            ))}
          </div>
          <Row title="Compliance pack" desc="Financial promotions & risk disclosure checks.">
            <Chip tone="good">Active</Chip>
          </Row>
          <Row title="Language" desc="Transcription and coaching language.">
            <span className="text-xs text-muted-foreground">English (UK)</span>
          </Row>
        </Panel>

        <Panel>
          <PanelHeader title="Recording" />
          <Row title="Auto-record outbound calls" desc="Connected to Aircall · Forex desk queue.">
            <Toggle on />
          </Row>
          <Row title="Record internal calls" desc="Team calls are excluded from scoring by default.">
            <Toggle />
          </Row>
          <Row title="Retention" desc="How long recordings are stored.">
            <span className="text-xs text-muted-foreground">24 months</span>
          </Row>
        </Panel>

        <Panel>
          <PanelHeader title="Notifications" />
          <Row title="Score below 70" desc="Alert me when a call needs review.">
            <Toggle on />
          </Row>
          <Row title="Leaderboard changes" desc="When my rank moves up or down.">
            <Toggle on />
          </Row>
          <Row title="Goal reminders" desc="Daily nudge if I'm behind pace.">
            <Toggle />
          </Row>
        </Panel>
      </div>
    </>
  );
}
