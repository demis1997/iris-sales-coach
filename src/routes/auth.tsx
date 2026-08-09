import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Loader2, Mail, Sparkles } from "lucide-react";
import { ArtemisMark } from "@/components/iris/app-shell";
import { Panel } from "@/components/iris/primitives";
import { isSupabaseConfigured } from "@/integrations/supabase/config";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { loadAuthSession } from "@/lib/auth-session";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Artemis AI" },
      {
        name: "description",
        content: "Sign in to Artemis AI with a magic link, Google, Microsoft, or email and password.",
      },
      { property: "og:title", content: "Sign in — Artemis AI" },
      { property: "og:description", content: "Access your revenue operating system." },
    ],
  }),
  component: AuthPage,
});

type Mode = "magic" | "password" | "signup";

async function redirectAfterAuth(navigate: ReturnType<typeof useNavigate>) {
  const session = await loadAuthSession();
  if (!session) return;
  if (session.membership && !session.membership.onboardingCompletedAt) {
    void navigate({ to: "/onboarding", replace: true });
    return;
  }
  const role = session.authz.role;
  if (role === "owner" || role === "admin" || role === "ceo") {
    void navigate({ to: "/ceo", replace: true });
    return;
  }
  if (role === "manager" || role === "qa" || role === "team_leader") {
    void navigate({ to: "/manager", replace: true });
    return;
  }
  void navigate({ to: "/app", replace: true });
}

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("magic");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ tone: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) void redirectAfterAuth(navigate);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) void redirectAfterAuth(navigate);
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!isSupabaseConfigured()) {
      setMsg({
        tone: "err",
        text: "Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to .env, then restart the dev server.",
      });
      return;
    }
    setBusy(true);
    setMsg(null);
    try {
      if (mode === "magic") {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: { emailRedirectTo: window.location.origin + "/auth" },
        });
        if (error) throw error;
        setMsg({ tone: "ok", text: "Magic link sent — check your inbox." });
      } else if (mode === "password") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin + "/onboarding",
            data: {
              company_name: company || undefined,
              full_name: email.split("@")[0],
            },
          },
        });
        if (error) throw error;
        setMsg({
          tone: "ok",
          text: "Account created — confirm your email if required, then continue onboarding.",
        });
      }
    } catch (err) {
      setMsg({ tone: "err", text: err instanceof Error ? err.message : "Something went wrong." });
    } finally {
      setBusy(false);
    }
  }

  async function oauth(provider: "google" | "microsoft") {
    setMsg(null);
    if (!isSupabaseConfigured()) {
      setMsg({
        tone: "err",
        text: "Supabase is not configured. Add your project keys to .env first.",
      });
      return;
    }
    const result = await lovable.auth.signInWithOAuth(provider, {
      redirect_uri: window.location.origin + "/auth",
    });
    if (result.error) {
      setMsg({
        tone: "err",
        text: `${provider === "google" ? "Google" : "Microsoft"} sign-in failed. Try again.`,
      });
      return;
    }
    if (result.redirected) return;
    await redirectAfterAuth(navigate);
  }

  return (
    <main className="aurora grid min-h-screen place-items-center px-5 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <ArtemisMark className="justify-center" />
          <h1 className="mt-5 text-2xl font-semibold tracking-tight">Your revenue operating system</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Every call analyzed, every rep coached, every deal predicted.
          </p>
        </div>

        <Panel className="p-6">
          {!isSupabaseConfigured() ? (
            <p className="mb-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
              Demo mode: Supabase keys are missing from <code className="text-[11px]">.env</code>. You can
              still browse product pages. Auth and onboarding need{" "}
              <code className="text-[11px]">VITE_SUPABASE_URL</code> and{" "}
              <code className="text-[11px]">VITE_SUPABASE_PUBLISHABLE_KEY</code>.
            </p>
          ) : null}
          <div className="mb-5 flex gap-1 rounded-xl bg-secondary/50 p-1 text-xs">
            {(
              [
                ["magic", "Magic link"],
                ["password", "Password"],
                ["signup", "Create account"],
              ] as const
            ).map(([m, label]) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  setMode(m);
                  setMsg(null);
                }}
                className={`flex-1 rounded-lg px-3 py-2 transition-colors ${
                  mode === m ? "bg-background text-foreground" : "text-muted-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <form onSubmit={(e) => void submit(e)} className="space-y-3">
            <label className="block">
              <span className="text-xs text-muted-foreground">Work email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="mt-1 w-full rounded-xl border border-border bg-secondary/40 px-3 py-2.5 text-sm outline-none focus:border-primary/50"
              />
            </label>

            {mode !== "magic" ? (
              <label className="block">
                <span className="text-xs text-muted-foreground">Password</span>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="mt-1 w-full rounded-xl border border-border bg-secondary/40 px-3 py-2.5 text-sm outline-none focus:border-primary/50"
                />
              </label>
            ) : null}

            {mode === "signup" ? (
              <label className="block">
                <span className="text-xs text-muted-foreground">Company name</span>
                <input
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Your company"
                  className="mt-1 w-full rounded-xl border border-border bg-secondary/40 px-3 py-2.5 text-sm outline-none focus:border-primary/50"
                />
              </label>
            ) : null}

            <button
              type="submit"
              disabled={busy}
              className="flex w-full items-center justify-center gap-2 rounded-xl gradient-surface px-4 py-2.5 text-sm font-semibold text-background disabled:opacity-60"
            >
              {busy ? <Loader2 className="size-4 animate-spin" /> : <Mail className="size-4" />}
              {mode === "magic" ? "Send magic link" : mode === "password" ? "Sign in" : "Start free"}
            </button>
          </form>

          {mode === "password" ? (
            <Link
              to="/forgot-password"
              className="mt-3 inline-block text-xs text-muted-foreground hover:underline"
            >
              Forgot password?
            </Link>
          ) : null}

          <div className="my-5 flex items-center gap-3 text-[11px] text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
          </div>

          <div className="grid gap-2">
            <button
              type="button"
              onClick={() => void oauth("google")}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-secondary/40 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
            >
              Continue with Google <ArrowRight className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => void oauth("microsoft")}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-secondary/40 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
            >
              Continue with Microsoft <ArrowRight className="size-3.5" />
            </button>
          </div>

          {msg ? (
            <p className={`mt-4 text-xs ${msg.tone === "ok" ? "text-success" : "text-destructive"}`}>
              {msg.text}
            </p>
          ) : null}

          <p className="mt-5 flex items-start gap-1.5 text-[11px] text-muted-foreground">
            <Sparkles className="mt-0.5 size-3 shrink-0 text-primary" />
            Creating an account provisions your company, owner membership, default team, and trial.
          </p>
        </Panel>
      </div>
    </main>
  );
}
