import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Loader2, Mail, Sparkles } from "lucide-react";
import { IrisMark } from "@/components/iris/app-shell";
import { Panel } from "@/components/iris/primitives";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Artemis AI AI Revenue OS" },
      { name: "description", content: "Sign in to Artemis AI with a magic link, Google or email and password." },
      { property: "og:title", content: "Sign in — Artemis AI AI Revenue OS" },
      { property: "og:description", content: "Access your revenue operating system." },
    ],
  }),
  component: AuthPage,
});

type Mode = "magic" | "password" | "signup";

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("magic");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ tone: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/app", replace: true });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) navigate({ to: "/app", replace: true });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      if (mode === "magic") {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: { emailRedirectTo: window.location.origin + "/app" },
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
            emailRedirectTo: window.location.origin + "/app",
            data: { company_name: company || undefined },
          },
        });
        if (error) throw error;
        setMsg({ tone: "ok", text: "Account created — confirm your email to continue." });
      }
    } catch (err) {
      setMsg({ tone: "err", text: err instanceof Error ? err.message : "Something went wrong." });
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    setMsg(null);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setMsg({ tone: "err", text: "Google sign-in failed. Try again." });
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/app", replace: true });
  }

  return (
    <main className="aurora grid min-h-screen place-items-center px-5 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <IrisMark className="justify-center" />
          <h1 className="mt-5 text-2xl font-semibold tracking-tight">
            Your revenue operating system
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Every call analyzed, every rep coached, every deal predicted.
          </p>
        </div>

        <Panel className="p-6">
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

          <form onSubmit={submit} className="space-y-3">
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
                  placeholder="Feldman Capital"
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

          <div className="my-5 flex items-center gap-3 text-[11px] text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
          </div>

          <button
            onClick={google}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-secondary/40 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
          >
            Continue with Google <ArrowRight className="size-3.5" />
          </button>

          {msg ? (
            <p
              className={`mt-4 text-xs ${msg.tone === "ok" ? "text-success" : "text-destructive"}`}
            >
              {msg.text}
            </p>
          ) : null}

          <p className="mt-5 flex items-start gap-1.5 text-[11px] text-muted-foreground">
            <Sparkles className="mt-0.5 size-3 shrink-0 text-primary" />
            SSO and Microsoft sign-in are available on Enterprise plans.
          </p>
        </Panel>
      </div>
    </main>
  );
}
