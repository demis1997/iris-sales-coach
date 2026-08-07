import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { ArtemisMark } from "@/components/iris/app-shell";
import { Panel } from "@/components/iris/primitives";
import { supabase } from "@/integrations/supabase/client";
import { acceptInvitation } from "@/lib/auth-session";
import { useAuth } from "@/components/auth/auth-provider";

export const Route = createFileRoute("/invite/$token")({
  head: () => ({
    meta: [{ title: "Accept invitation — Artemis AI" }],
  }),
  component: InvitePage,
});

function InvitePage() {
  const { token } = Route.useParams();
  const navigate = useNavigate();
  const { session, loading, refresh } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (loading || !session) return;
    void (async () => {
      setBusy(true);
      setErr(null);
      try {
        await acceptInvitation(token);
        await refresh();
        void navigate({ to: "/app", replace: true });
      } catch (error) {
        setErr(error instanceof Error ? error.message : "Could not accept invitation.");
      } finally {
        setBusy(false);
      }
    })();
  }, [loading, session, token, navigate, refresh]);

  async function createAccount() {
    setBusy(true);
    setErr(null);
    setMsg(null);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/invite/${token}`,
          data: { invitation_token: token, skip_company: "true" },
        },
      });
      if (error) throw error;
      setMsg("Account created. Confirm your email if required, then return to this link.");
    } catch (error) {
      setErr(error instanceof Error ? error.message : "Sign-up failed.");
    } finally {
      setBusy(false);
    }
  }

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error) {
      setErr(error instanceof Error ? error.message : "Sign-in failed.");
      setBusy(false);
    }
  }

  if (loading || (session && busy && !err)) {
    return (
      <main className="grid min-h-screen place-items-center">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Joining company…
        </div>
      </main>
    );
  }

  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <div className="w-full max-w-md">
        <ArtemisMark className="justify-center" />
        <Panel className="mt-6 p-6">
          <h1 className="text-xl font-semibold">Join your company</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in or create an account with the invited email. You will join the existing company — a new
            tenant is not created.
          </p>
          {err ? <p className="mt-3 text-sm text-red-500">{err}</p> : null}
          {msg ? <p className="mt-3 text-sm text-emerald-600">{msg}</p> : null}
          {!session ? (
            <form className="mt-4 grid gap-3" onSubmit={(e) => void signIn(e)}>
              <input
                type="email"
                required
                placeholder="Email"
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                required
                minLength={8}
                placeholder="Password"
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="submit"
                disabled={busy}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
              >
                Sign in & accept
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => void createAccount()}
                className="rounded-lg border border-border px-4 py-2 text-sm"
              >
                Create account & accept
              </button>
            </form>
          ) : null}
          <Link to="/auth" className="mt-4 inline-block text-xs text-muted-foreground hover:underline">
            Back to sign in
          </Link>
        </Panel>
      </div>
    </main>
  );
}
