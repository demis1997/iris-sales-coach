import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useSession } from "@/components/app/session";
import { organisation, teams, users, DEMO_LABEL } from "@/lib/demo/seed";
import { roleLabel } from "@/lib/demo/rbac";
import { inviteUser } from "@/lib/auth/demo-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Chip } from "@/components/iris/primitives";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type SectionId =
  "organisation" | "users" | "analysis" | "recording" | "ai" | "security" | "billing";

const SECTIONS: { id: SectionId; label: string }[] = [
  { id: "organisation", label: "Organisation" },
  { id: "users", label: "Users" },
  { id: "analysis", label: "Analysis" },
  { id: "recording", label: "Recording" },
  { id: "ai", label: "AI" },
  { id: "security", label: "Security" },
  { id: "billing", label: "Billing" },
];

export function SettingsPage() {
  const { access, allowed, user, role, organisationName } = useSession();
  const [section, setSection] = useState<SectionId>("organisation");
  const [inviteEmail, setInviteEmail] = useState("");
  const [orgName, setOrgName] = useState(organisationName);
  const [timezone, setTimezone] = useState(organisation.timezone);
  const [languages, setLanguages] = useState("English, Greek");
  const [customInstructions, setCustomInstructions] = useState(
    "Prioritise next-step discipline and value-before-price coaching.",
  );

  const canOrg = allowed("settings:org");
  const canUsers = allowed("users:manage");
  const canSecurity = allowed("settings:security");
  const canBilling = allowed("settings:billing");

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Organisation, analysis, security, and billing controls for {organisationName}.
      </p>
      <p className="mt-2 text-xs text-muted-foreground">{DEMO_LABEL}</p>

      <div className="mt-6 flex flex-col gap-6 lg:flex-row">
        <nav className="flex flex-wrap gap-2 lg:w-48 lg:flex-col">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSection(s.id)}
              className={cn(
                "rounded-md px-3 py-2 text-left text-sm",
                section === s.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {s.label}
            </button>
          ))}
        </nav>

        <div className="min-w-0 flex-1 space-y-4">
          {section === "organisation" ? (
            <Panel title="Organisation">
              {!canOrg ? (
                <ReadOnly note="Organisation settings require an administrator.">
                  <Row label="Company" value={organisation.name} />
                  <Row label="Industry" value={organisation.industry} />
                  <Row label="Timezone" value={organisation.timezone} />
                  <Row label="Languages" value={organisation.settings.languages.join(", ")} />
                  <Row
                    label="Retention"
                    value={
                      organisation.settings.retentionDays
                        ? `${organisation.settings.retentionDays} days (configured intent)`
                        : "Not configured"
                    }
                  />
                </ReadOnly>
              ) : (
                <>
                  <Field label="Company profile">
                    <Input value={orgName} onChange={(e) => setOrgName(e.target.value)} />
                  </Field>
                  <Field label="Time zone">
                    <Input value={timezone} onChange={(e) => setTimezone(e.target.value)} />
                  </Field>
                  <Field label="Languages">
                    <Input value={languages} onChange={(e) => setLanguages(e.target.value)} />
                  </Field>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Teams & offices</p>
                    <ul className="mt-2 space-y-1 text-sm">
                      {teams.map((t) => (
                        <li key={t.id} className="flex justify-between border-b border-border py-2">
                          <span>{t.name}</span>
                          <span className="text-muted-foreground">{t.office}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => toast.success("Organisation profile saved (demo local state)")}
                  >
                    Save organisation
                  </Button>
                </>
              )}
            </Panel>
          ) : null}

          {section === "users" ? (
            <Panel title="Users">
              {!canUsers ? (
                <ReadOnly note="User administration requires an administrator.">
                  <Row label="You" value={`${user.name} · ${roleLabel(role)}`} />
                </ReadOnly>
              ) : (
                <>
                  <div className="flex flex-wrap gap-2">
                    <Input
                      className="max-w-xs"
                      placeholder="work@company.com"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                    />
                    <Button
                      size="sm"
                      onClick={() => {
                        if (!inviteEmail.includes("@")) {
                          toast.error("Enter a valid email");
                          return;
                        }
                        inviteUser({
                          organisationId: access.organisationId,
                          actorId: access.user.id,
                          email: inviteEmail,
                          role: "representative",
                          name: inviteEmail.split("@")[0] ?? "Invitee",
                        });
                        toast.success(`Invitation queued for ${inviteEmail} (demo)`);
                        setInviteEmail("");
                      }}
                    >
                      Invite user
                    </Button>
                  </div>
                  <table className="mt-4 w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs text-muted-foreground">
                        <th className="py-2">Name</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Last active</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users
                        .filter((u) => u.organisationId === access.organisationId)
                        .map((u) => (
                          <tr key={u.id} className="border-t border-border">
                            <td className="py-2">
                              <p>{u.name}</p>
                              <p className="text-xs text-muted-foreground">{u.email}</p>
                            </td>
                            <td>{roleLabel(u.role)}</td>
                            <td>
                              <Chip tone={u.status === "active" ? "good" : "neutral"}>
                                {u.status}
                              </Chip>
                            </td>
                            <td className="text-muted-foreground">
                              {u.status === "active" ? "2026-07-30" : "—"}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                  <p className="text-xs text-muted-foreground">
                    Permissions are role-based. Fine-grained permission editor: Coming soon.
                  </p>
                </>
              )}
            </Panel>
          ) : null}

          {section === "analysis" ? (
            <Panel title="Analysis">
              <p className="text-sm text-muted-foreground">
                Configure how Iris scores conversations for your floor.
              </p>
              <Checklist
                items={[
                  "Custom scorecards",
                  "Required call stages",
                  "Company terminology",
                  "Products",
                  "Competitors",
                  "Objections",
                ]}
              />
              <Button size="sm" variant="outline" asChild>
                <Link to="/app/playbooks">Manage playbooks</Link>
              </Button>
              <Button
                size="sm"
                className="ml-2"
                onClick={() => toast.success("Scorecard draft saved (demo)")}
              >
                Save scorecard draft
              </Button>
            </Panel>
          ) : null}

          {section === "recording" ? (
            <Panel title="Recording">
              <Row label="Consent settings" value="Configure with legal counsel — Coming soon UI" />
              <Row label="Recording sources" value="Upload + connector roadmap" />
              <Row label="Retention" value="Enterprise configurable — Contact sales" />
              <Row label="Redaction" value="Coming soon" />
            </Panel>
          ) : null}

          {section === "ai" ? (
            <Panel title="AI">
              <Field label="Custom instructions">
                <Textarea
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                  rows={4}
                />
              </Field>
              <Row label="Data-use controls" value="Organisation-scoped · see Security" />
              <Row label="Model preferences" value="Coming soon" />
              <Row label="Knowledge sources" value="Calls + playbooks (demo)" />
              <Button size="sm" onClick={() => toast.success("AI instructions saved (demo)")}>
                Save AI settings
              </Button>
            </Panel>
          ) : null}

          {section === "security" ? (
            <Panel title="Security">
              {!canSecurity ? (
                <ReadOnly note="Security settings require an administrator." />
              ) : (
                <>
                  <StatusRow label="SSO" status="Coming soon" />
                  <StatusRow label="MFA" status="Coming soon" />
                  <StatusRow label="Sessions" status="Demo role switcher only" />
                  <StatusRow label="Audit log" status="Coming soon" />
                  <StatusRow label="Data export" status="Contact sales / pilot process" />
                  <StatusRow label="Data deletion" status="Contact sales / pilot process" />
                  <Button size="sm" variant="outline" asChild>
                    <Link to="/security">View security posture</Link>
                  </Button>
                </>
              )}
            </Panel>
          ) : null}

          {section === "billing" ? (
            <Panel title="Billing">
              {!canBilling ? (
                <ReadOnly note="Billing requires an administrator." />
              ) : (
                <>
                  <Row label="Plan" value="Growth (illustrative demo)" />
                  <Row
                    label="Seats"
                    value={`${users.filter((u) => u.status === "active").length} active`}
                  />
                  <Row label="Analysed minutes (demo month)" value="~4,200" />
                  <Row label="Usage" value="Within illustrative allowance" />
                  <Row label="Invoices" value="Contact sales — no live billing connected" />
                  <Button size="sm" variant="outline" asChild>
                    <Link to="/pricing">View pricing</Link>
                  </Button>
                </>
              )}
            </Panel>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <h2 className="text-sm font-semibold">{title}</h2>
      <div className="mt-4 space-y-3">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-xs text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap justify-between gap-2 border-b border-border py-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span>{value}</span>
    </div>
  );
}

function StatusRow({ label, status }: { label: string; status: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border py-2 text-sm">
      <span>{label}</span>
      <Chip tone="neutral">{status}</Chip>
    </div>
  );
}

function Checklist({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 text-sm">
      {items.map((item) => (
        <li key={item} className="flex items-center gap-2">
          <input type="checkbox" defaultChecked className="accent-[var(--primary)]" />
          {item}
        </li>
      ))}
    </ul>
  );
}

function ReadOnly({ note, children }: { note?: string; children?: React.ReactNode }) {
  return (
    <div>
      {note ? <p className="mb-3 text-sm text-muted-foreground">{note}</p> : null}
      {children}
    </div>
  );
}
