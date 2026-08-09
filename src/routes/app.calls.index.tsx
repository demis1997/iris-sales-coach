import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Search, Upload } from "lucide-react";
import { PageHeading, Panel, Chip } from "@/components/iris/primitives";
import { useAuth } from "@/components/auth/auth-provider";
import { listCalls, uploadCallRecording } from "@/lib/calls";

export const Route = createFileRoute("/app/calls/")({
  head: () => ({
    meta: [
      { title: "Calls — Artemis Rep Workspace" },
      { name: "description", content: "Upload and review analyzed calls." },
    ],
  }),
  component: CallsPage,
});

function CallsPage() {
  const { session, demoMode } = useAuth();
  const queryClient = useQueryClient();
  const [q, setQ] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [contactName, setContactName] = useState("");

  const { data: rows = [], isLoading, error, refetch } = useQuery({
    queryKey: ["calls", session?.activeCompanyId, session?.userId],
    queryFn: () => listCalls({ agentOnly: session?.authz.role === "rep" }),
    enabled: Boolean(session?.activeCompanyId) && !demoMode,
    refetchInterval: 8000,
  });

  const filtered = rows.filter((c) =>
    `${c.contact_name ?? ""} ${c.contact_company ?? ""}`.toLowerCase().includes(q.toLowerCase()),
  );

  async function onUpload(file: File | null) {
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      const { callId } = await uploadCallRecording({
        file,
        contactName: contactName || undefined,
      });
      await queryClient.invalidateQueries({ queryKey: ["calls"] });
      window.location.href = `/app/calls/${callId}`;
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  if (demoMode) {
    return (
      <>
        <PageHeading title="Calls" subtitle="Sign in with Supabase configured to upload and store real recordings." />
        <Panel className="p-6 text-sm text-muted-foreground">
          Demo mode: call upload requires a live company session. Complete Step 1 auth first.
        </Panel>
      </>
    );
  }

  return (
    <>
      <PageHeading
        title="Calls"
        subtitle={isLoading ? "Loading…" : `${rows.length} call${rows.length === 1 ? "" : "s"} in your company`}
      />

      <Panel className="mb-4 p-4">
        <p className="text-sm font-medium">Upload a recording</p>
        <p className="mt-1 text-xs text-muted-foreground">
          MP3, WAV, M4A, MP4, WebM · max 100MB · private company storage · analysis runs after upload
        </p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            placeholder="Contact / prospect name (optional)"
            className="flex-1 rounded-lg border border-border bg-secondary/40 px-3 py-2 text-sm outline-none"
          />
          <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
            {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
            {uploading ? "Uploading…" : "Choose file"}
            <input
              type="file"
              accept="audio/*,video/mp4,video/webm,.mp3,.wav,.m4a,.mp4,.webm"
              className="hidden"
              disabled={uploading}
              onChange={(e) => void onUpload(e.target.files?.[0] ?? null)}
            />
          </label>
        </div>
        {uploadError ? <p className="mt-2 text-xs text-destructive">{uploadError}</p> : null}
      </Panel>

      <Panel className="overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 border-b border-border px-4 py-3">
          <div className="flex min-w-[200px] flex-1 items-center gap-2 rounded-lg border border-border bg-secondary/40 px-3 py-1.5">
            <Search className="size-3.5 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search prospect or company"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {error ? (
          <div className="p-6 text-sm text-destructive">
            {(error as Error).message}{" "}
            <button type="button" className="underline" onClick={() => void refetch()}>
              Retry
            </button>
          </div>
        ) : null}

        {!isLoading && filtered.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            No calls yet. Upload your first recording to create a real call record.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-[11px] tracking-wider text-muted-foreground uppercase">
                  {["Date", "Prospect", "Outcome", "Score", "Recording", "Analysis", ""].map((h) => (
                    <th key={h} className="px-5 py-3 font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} className="border-b border-border/70 hover:bg-secondary/20">
                    <td className="px-5 py-3 text-xs text-muted-foreground">
                      {new Date(c.created_at).toLocaleString()}
                    </td>
                    <td className="px-5 py-3">
                      <p className="font-medium">{c.contact_name ?? "Untitled"}</p>
                      <p className="text-xs text-muted-foreground">{c.contact_company}</p>
                    </td>
                    <td className="px-5 py-3">
                      <Chip tone="neutral">{c.outcome ?? "—"}</Chip>
                    </td>
                    <td className="px-5 py-3 font-mono text-xs">
                      {c.overall_score != null ? Math.round(Number(c.overall_score)) : "—"}
                    </td>
                    <td className="px-5 py-3 text-xs">{c.recording_status}</td>
                    <td className="px-5 py-3 text-xs">{c.analysis_status}</td>
                    <td className="px-5 py-3 text-right">
                      <Link to="/app/calls/$callId" params={{ callId: c.id }} className="text-xs text-primary hover:underline">
                        Open
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </>
  );
}
