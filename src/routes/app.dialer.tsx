import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Delete,
  Mic,
  MicOff,
  Pause,
  PhoneCall,
  PhoneForwarded,
  PhoneOff,
  Users,
  Voicemail,
} from "lucide-react";
import { LiveCoachPanel } from "@/components/iris/live-coach-panel";
import { PageHeading, Panel, PanelHeader, Chip, Meter } from "@/components/iris/primitives";
import { liveCoachSession } from "@/lib/revenue-intelligence-data";
import {
  campaigns,
  dialPadQueue,
  dispositions,
  liveTranscript,
} from "@/lib/revenue-os-data";

export const Route = createFileRoute("/app/dialer")({
  head: () => ({
    meta: [
      { title: "Softphone & Live AI Coaching — Iris AI" },
      {
        name: "description",
        content: "Cloud softphone with dial pad, queues, campaigns and real-time AI coaching cards during every call.",
      },
      { property: "og:title", content: "Softphone & Live AI Coaching — Iris AI" },
      { property: "og:description", content: "Real-time AI coaching while you are on the call." },
    ],
  }),
  component: DialerPage,
});

const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"];

function DialerPage() {
  const [number, setNumber] = useState("+357 99 ");
  const [onCall, setOnCall] = useState(true);
  const [muted, setMuted] = useState(false);
  const [held, setHeld] = useState(false);
  const [seconds, setSeconds] = useState(232);
  const [visible, setVisible] = useState(1);

  useEffect(() => {
    if (!onCall || held) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [onCall, held]);

  useEffect(() => {
    if (!onCall) return;
    const max = liveCoachSession.suggestions.length;
    const t = setInterval(() => setVisible((v) => (v >= max ? max : v + 1)), 4200);
    return () => clearInterval(t);
  }, [onCall]);

  const mmss = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  return (
    <>
      <PageHeading
        title="Softphone"
        subtitle={`Cloud calling with contextual live AI coaching · linked deal ${liveCoachSession.dealId}`}
      />

      <div className="mb-4 flex flex-wrap gap-2 text-xs">
        <Chip tone="iris">Campaign: {liveCoachSession.campaign}</Chip>
        <Chip tone="good">Contact: {liveCoachSession.contact}</Chip>
        <Link to="/app/certifications" className="text-primary hover:underline">
          Campaign certification status →
        </Link>
      </div>

      <div className="grid gap-4 xl:grid-cols-[340px_1fr_380px]">
        {/* Softphone */}
        <Panel className="p-5">
          <div className="rounded-xl border border-border bg-secondary/30 p-4 text-center">
            <p className="text-xs text-muted-foreground">
              {onCall ? "Connected · Feldman Capital" : "Ready to dial"}
            </p>
            <p className="mt-1 font-mono text-2xl">{onCall ? mmss : number}</p>
            {onCall ? (
              <p className="mt-1 text-xs text-muted-foreground">
                Marcus Feldman · caller ID +357 22 000 118
              </p>
            ) : null}
            <div className="mt-3 flex justify-center gap-2">
              <Chip tone={onCall ? "good" : "neutral"}>{held ? "On hold" : onCall ? "Recording" : "Idle"}</Chip>
              <Chip tone="iris">AI live</Chip>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            {keys.map((k) => (
              <button
                key={k}
                onClick={() => setNumber((n) => n + k)}
                className="rounded-xl border border-border bg-secondary/30 py-3 font-mono text-base transition-colors hover:bg-secondary"
              >
                {k}
              </button>
            ))}
          </div>

          <div className="mt-3 flex gap-2">
            <button
              onClick={() => setNumber((n) => n.slice(0, -1))}
              className="grid flex-1 place-items-center rounded-xl border border-border bg-secondary/30 py-2.5 text-muted-foreground hover:bg-secondary"
            >
              <Delete className="size-4" />
            </button>
            <button
              onClick={() => setOnCall((v) => !v)}
              className={`flex flex-[2] items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold ${
                onCall ? "bg-destructive/20 text-destructive" : "gradient-surface text-background"
              }`}
            >
              {onCall ? <PhoneOff className="size-4" /> : <PhoneCall className="size-4" />}
              {onCall ? "End call" : "Call"}
            </button>
          </div>

          <div className="mt-3 grid grid-cols-4 gap-2 text-[11px]">
            {(
              [
                [muted ? MicOff : Mic, muted ? "Unmute" : "Mute", () => setMuted((v) => !v)],
                [Pause, held ? "Resume" : "Hold", () => setHeld((v) => !v)],
                [PhoneForwarded, "Transfer", () => {}],
                [Users, "Conference", () => {}],
              ] as const
            ).map(([Icon, label, fn], i) => (
              <button
                key={i}
                onClick={fn}
                className="flex flex-col items-center gap-1 rounded-xl border border-border bg-secondary/30 py-2.5 text-muted-foreground transition-colors hover:text-foreground"
              >
                <Icon className="size-4" />
                {label}
              </button>
            ))}
          </div>

          <div className="mt-4">
            <p className="mb-2 text-[11px] tracking-wider text-muted-foreground uppercase">
              Disposition
            </p>
            <div className="flex flex-wrap gap-1.5">
              {dispositions.map((d) => (
                <button
                  key={d}
                  className="rounded-lg border border-border px-2 py-1 text-[11px] text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <button className="mt-4 flex w-full items-center gap-2 rounded-xl border border-border px-3 py-2 text-xs text-muted-foreground hover:bg-secondary">
            <Voicemail className="size-3.5" /> Voicemail · 3 new
          </button>
        </Panel>

        {/* Transcript */}
        <div className="space-y-4">
          <Panel>
            <PanelHeader
              title="Live transcript"
              subtitle="Speaker-separated · analyzed in real time"
              action={
                <Chip tone="good">Sentiment {liveCoachSession.metrics.sentiment}%</Chip>
              }
            />
            <div className="space-y-3 p-5">
              {liveTranscript.map((l, i) => (
                <div key={i} className={`flex gap-3 ${l.who === "rep" ? "flex-row-reverse" : ""}`}>
                  <span className="mt-1 font-mono text-[10px] text-muted-foreground">{l.at}</span>
                  <div className="max-w-[80%]">
                    <p className="mb-1 text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
                      {l.who === "rep" ? "Agent" : "Customer"}
                    </p>
                    <p
                      className={`rounded-2xl px-4 py-2.5 text-sm ${
                        l.who === "rep"
                          ? "bg-primary/15"
                          : "border border-border bg-secondary/30 text-muted-foreground"
                      }`}
                    >
                      {l.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel>
            <PanelHeader title="Campaigns" subtitle="Predictive, power and progressive dialing" />
            <div className="divide-y divide-border">
              {campaigns.map((c) => (
                <div key={c.name} className="grid gap-2 px-5 py-4 sm:grid-cols-[1fr_auto]">
                  <div>
                    <p className="text-sm font-medium">{c.name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {c.mode} dialer · {c.contacted.toLocaleString()} of {c.leads.toLocaleString()}{" "}
                      contacted · {c.connect}% connect · {c.booked} booked
                    </p>
                    <div className="mt-2 max-w-xs">
                      <Meter value={(c.contacted / c.leads) * 100} />
                    </div>
                  </div>
                  <div className="sm:text-right">
                    <Chip tone={c.live ? "good" : "neutral"}>{c.live ? "Running" : "Paused"}</Chip>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        {/* Live AI — keeps dialer controls free on the left */}
        <div className="space-y-4">
          {onCall ? <LiveCoachPanel visibleCount={visible} /> : (
            <Panel className="p-6 text-sm text-muted-foreground">
              Start a call to open the live AI coaching panel. Softphone controls stay available.
            </Panel>
          )}

          <Panel>
            <PanelHeader title="Call queue" subtitle="Skill routed · time-zone aware" />
            <div className="divide-y divide-border">
              {dialPadQueue.map((q) => (
                <div key={q.name} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-sm">{q.name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {q.company} · {q.tz} · {q.attempts} attempts
                    </p>
                  </div>
                  <Chip tone={q.intent === "High" ? "good" : q.intent === "Medium" ? "warn" : "neutral"}>
                    {q.intent}
                  </Chip>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </>
  );
}
