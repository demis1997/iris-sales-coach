import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArtemisMark } from "@/components/iris/app-shell";
import { Panel } from "@/components/iris/primitives";
import { supabase } from "@/integrations/supabase/client";
import { isSupabaseConfigured } from "@/integrations/supabase/config";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [{ title: "Reset password — Artemis AI" }],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!isSupabaseConfigured()) {
      setErr("Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to .env.");
      return;
    }
    setBusy(true);
    setMsg(null);
    setErr(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth`,
      });
      if (error) throw error;
      setMsg("If an account exists for that email, a reset link has been sent.");
    } catch (error) {
      setErr(error instanceof Error ? error.message : "Could not send reset email.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <div className="w-full max-w-md">
        <ArtemisMark className="justify-center" />
        <Panel className="mt-6 p-6">
          <h1 className="text-xl font-semibold">Reset password</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your email and we will send a secure reset link.
          </p>
          <form className="mt-4 grid gap-3" onSubmit={(e) => void submit(e)}>
            <input
              type="email"
              required
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {err ? <p className="text-sm text-red-500">{err}</p> : null}
            {msg ? <p className="text-sm text-emerald-600">{msg}</p> : null}
            <button
              type="submit"
              disabled={busy}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60"
            >
              Send reset link
            </button>
          </form>
          <Link to="/auth" className="mt-4 inline-block text-xs text-muted-foreground hover:underline">
            Back to sign in
          </Link>
        </Panel>
      </div>
    </main>
  );
}
