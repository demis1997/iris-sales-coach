import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { MarketingLayout } from "@/components/marketing/layout";
import { ContentCard, PageHero, Section } from "@/components/marketing/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IrisMark } from "@/components/iris/app-shell";
import { pageHead } from "@/lib/seo";
import { track } from "@/lib/analytics";
import { loginWithEmail, requestPasswordReset } from "@/lib/auth/demo-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () =>
    pageHead({
      title: "Log in — Iris",
      description:
        "Sign in to Iris. Demo workspaces are available while production authentication ships.",
      path: "/login",
    }),
  component: LoginPage,
});

function LoginPage() {
  const [email, setEmail] = useState("maya.okonkwo@apexmarkets.demo");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  return (
    <MarketingLayout>
      <PageHero
        eyebrow="Log in"
        title="Sign in to Iris"
        lede="Production authentication (SSO, MFA, invitations) is part of the enterprise roadmap. Demo login maps work emails to Apex Markets seed users and persists the session in this browser."
      />
      <Section>
        <ContentCard className="mx-auto max-w-md">
          <IrisMark />
          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setError(null);
              track("login_clicked", { source: "login_form", emailDomain: email.split("@")[1] });
              const result = loginWithEmail(email);
              if (!result.ok) {
                setError(result.error);
                return;
              }
              void navigate({ to: "/app" });
            }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="email">Work email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
              />
              <p className="text-xs text-muted-foreground">
                Password auth is not enforced in this demo build.
              </p>
            </div>
            {error ? (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            ) : null}
            <Button type="submit" className="w-full">
              Continue to demo workspace
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => {
                const r = requestPasswordReset(email);
                toast.message(r.error);
              }}
            >
              Forgot password
            </Button>
          </form>
          <div className="mt-6 space-y-2 border-t border-border pt-4 text-sm">
            <p className="text-muted-foreground">Or open a demo view directly:</p>
            <div className="flex flex-col gap-2">
              <Button variant="outline" asChild>
                <Link
                  to="/onboarding"
                  onClick={() => track("login_clicked", { source: "onboarding" })}
                >
                  Start organisation onboarding
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/app" onClick={() => track("login_clicked", { source: "rep_demo" })}>
                  Product workspace
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/ceo" onClick={() => track("login_clicked", { source: "exec_demo" })}>
                  Legacy executive workspace
                </Link>
              </Button>
            </div>
            <p className="pt-2 text-xs text-muted-foreground">
              Demo accounts: maya.okonkwo@apexmarkets.demo (executive),
              jordan.ellis@apexmarkets.demo (admin), alex.moreau@apexmarkets.demo (manager),
              priya.nair@apexmarkets.demo (representative).
            </p>
          </div>
        </ContentCard>
      </Section>
    </MarketingLayout>
  );
}
