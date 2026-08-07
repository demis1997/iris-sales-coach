import { supabase } from "@/integrations/supabase/client";
import { isSupabaseConfigured } from "@/integrations/supabase/config";
import {
  type AppRole,
  type AuthzContext,
  authorize,
  type Permission,
  roleHasPermission,
} from "@/lib/permissions";
import type { OnboardingWizardState } from "@/lib/onboarding-schemas";

export type SessionMembership = {
  id: string;
  companyId: string;
  role: AppRole;
  status: string;
  companyName: string;
  companyPlan: string;
  onboardingCompletedAt: string | null;
};

export type AuthSession = {
  userId: string;
  email: string | null;
  fullName: string | null;
  activeCompanyId: string | null;
  membership: SessionMembership | null;
  memberships: SessionMembership[];
  authz: AuthzContext;
};

function asRole(value: string | null | undefined): AppRole {
  const allowed: AppRole[] = [
    "platform_admin",
    "owner",
    "admin",
    "ceo",
    "manager",
    "qa",
    "team_leader",
    "rep",
    "viewer",
    "trainer",
  ];
  if (value && (allowed as string[]).includes(value)) return value as AppRole;
  return "rep";
}

export async function getCurrentUserId(): Promise<string | null> {
  if (!isSupabaseConfigured()) return null;
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

export async function loadAuthSession(): Promise<AuthSession | null> {
  if (!isSupabaseConfigured()) return null;
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, active_company_id, company_id, email")
    .eq("id", user.id)
    .maybeSingle();

  let memberships: SessionMembership[] = [];

  const { data: membershipRows, error: membershipError } = await supabase
    .from("company_memberships")
    .select("id, company_id, role, status")
    .eq("user_id", user.id)
    .eq("status", "active");

  if (!membershipError && membershipRows?.length) {
    const companyIds = membershipRows.map((r) => r.company_id);
    const { data: companies } = await supabase
      .from("companies")
      .select("id, name, plan, onboarding_completed_at")
      .in("id", companyIds);

    const companyMap = new Map((companies ?? []).map((c) => [c.id, c]));
    memberships = membershipRows.map((row) => {
      const company = companyMap.get(row.company_id);
      return {
        id: row.id,
        companyId: row.company_id,
        role: asRole(row.role),
        status: row.status,
        companyName: company?.name ?? "Company",
        companyPlan: company?.plan ?? "trial",
        onboardingCompletedAt: company?.onboarding_completed_at ?? null,
      };
    });
  } else {
    const companyId = profile?.active_company_id ?? profile?.company_id ?? null;
    if (companyId) {
      const { data: roleRow } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("company_id", companyId)
        .maybeSingle();
      const { data: company } = await supabase
        .from("companies")
        .select("name, plan, onboarding_completed_at")
        .eq("id", companyId)
        .maybeSingle();
      memberships = [
        {
          id: "legacy",
          companyId,
          role: asRole(roleRow?.role),
          status: "active",
          companyName: company?.name ?? "Company",
          companyPlan: company?.plan ?? "trial",
          onboardingCompletedAt: company?.onboarding_completed_at ?? null,
        },
      ];
    }
  }

  const activeCompanyId =
    profile?.active_company_id ?? profile?.company_id ?? memberships[0]?.companyId ?? null;

  const membership =
    memberships.find((m) => m.companyId === activeCompanyId) ?? memberships[0] ?? null;

  const authz: AuthzContext = {
    userId: user.id,
    companyId: membership?.companyId ?? null,
    role: membership?.role ?? null,
    isMember: Boolean(membership),
  };

  return {
    userId: user.id,
    email: profile?.email ?? user.email ?? null,
    fullName: profile?.full_name ?? null,
    activeCompanyId: membership?.companyId ?? activeCompanyId,
    membership,
    memberships,
    authz,
  };
}

export function assertPermission(session: AuthSession, permission: Permission): void {
  authorize(session.authz, permission);
}

export function sessionCan(session: AuthSession | null, permission: Permission): boolean {
  if (!session?.authz.role) return false;
  return roleHasPermission(session.authz.role, permission);
}

export async function switchActiveCompany(companyId: string): Promise<void> {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error("Not signed in");

  const { data: membership, error } = await supabase
    .from("company_memberships")
    .select("id")
    .eq("user_id", userId)
    .eq("company_id", companyId)
    .eq("status", "active")
    .maybeSingle();

  if (error || !membership) throw new Error("You are not a member of that company.");

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ active_company_id: companyId, company_id: companyId })
    .eq("id", userId);

  if (updateError) throw updateError;
}

export async function createInvitation(input: {
  email: string;
  role: AppRole;
  teamId?: string | null;
}): Promise<{ token: string }> {
  const session = await loadAuthSession();
  if (!session?.activeCompanyId) throw new Error("Not signed in");
  assertPermission(session, "users.manage");

  const token = crypto.randomUUID().replace(/-/g, "") + crypto.randomUUID().replace(/-/g, "");
  const { error } = await supabase.from("invitations").insert({
    company_id: session.activeCompanyId,
    email: input.email.toLowerCase(),
    role: input.role,
    team_id: input.teamId ?? null,
    token,
    invited_by: session.userId,
    status: "pending",
  });
  if (error) throw error;

  await supabase.from("audit_logs").insert({
    company_id: session.activeCompanyId,
    actor_user_id: session.userId,
    action: "invitation.created",
    resource_type: "invitation",
    metadata: { email: input.email, role: input.role },
  });

  return { token };
}

export async function acceptInvitation(token: string): Promise<{ companyId: string }> {
  const session = await loadAuthSession();
  if (!session) throw new Error("Not signed in");

  const { data: invite, error } = await supabase
    .from("invitations")
    .select("*")
    .eq("token", token)
    .eq("status", "pending")
    .maybeSingle();

  if (error || !invite) throw new Error("Invitation not found or expired.");
  if (new Date(invite.expires_at) < new Date()) {
    throw new Error("This invitation has expired.");
  }
  if (session.email && invite.email.toLowerCase() !== session.email.toLowerCase()) {
    throw new Error("Sign in with the invited email address to accept.");
  }

  const companyId = invite.company_id;
  const role = asRole(invite.role);

  const { error: memError } = await supabase.from("company_memberships").upsert(
    {
      company_id: companyId,
      user_id: session.userId,
      role,
      status: "active",
      invited_by: invite.invited_by,
    },
    { onConflict: "company_id,user_id" },
  );
  if (memError) throw memError;

  if (invite.team_id) {
    await supabase.from("team_members").upsert(
      {
        company_id: companyId,
        team_id: invite.team_id,
        user_id: session.userId,
      },
      { onConflict: "team_id,user_id" },
    );
  }

  await supabase
    .from("invitations")
    .update({ status: "accepted", accepted_at: new Date().toISOString() })
    .eq("id", invite.id);

  await supabase
    .from("profiles")
    .update({ active_company_id: companyId, company_id: companyId })
    .eq("id", session.userId);

  await supabase.from("audit_logs").insert({
    company_id: companyId,
    actor_user_id: session.userId,
    action: "invitation.accepted",
    resource_type: "invitation",
    resource_id: invite.id,
  });

  return { companyId };
}

export async function saveOnboardingProgress(input: {
  wizard: OnboardingWizardState;
  checklist?: Partial<{
    company_profile_done: boolean;
    sales_process_done: boolean;
    team_invites_done: boolean;
    calls_setup_done: boolean;
    ai_config_done: boolean;
    crm_setup_done: boolean;
    sample_call_done: boolean;
  }>;
}): Promise<void> {
  const session = await loadAuthSession();
  if (!session?.activeCompanyId) throw new Error("No active company");
  assertPermission(session, "onboarding.manage");

  const companyId = session.activeCompanyId;
  const company = input.wizard.company;
  if (company) {
    const { error } = await supabase
      .from("companies")
      .update({
        name: company.name,
        industry: company.industry,
        country: company.country,
        timezone: company.timezone,
        company_size: company.companySize,
        primary_use_case: company.primaryUseCase,
        expected_agent_count: company.expectedAgentCount,
        primary_language: company.primaryLanguage,
        additional_languages: company.additionalLanguages,
        updated_at: new Date().toISOString(),
      })
      .eq("id", companyId);
    if (error) throw error;
  }

  const ai = input.wizard.ai;
  if (ai) {
    const { error } = await supabase
      .from("company_ai_settings")
      .update({
        coaching_tone: ai.coachingTone,
        scoring_strictness: ai.scoringStrictness,
        compliance_sensitivity: ai.complianceSensitivity,
        default_language: ai.defaultLanguage,
        auto_create_coaching_tasks: ai.autoCreateCoachingTasks,
        updated_at: new Date().toISOString(),
      })
      .eq("company_id", companyId);
    if (error) throw error;
  }

  const { error } = await supabase
    .from("onboarding_checklists")
    .update({
      wizard_state: input.wizard,
      ...input.checklist,
      updated_at: new Date().toISOString(),
    })
    .eq("company_id", companyId);
  if (error) throw error;
}

export async function completeOnboarding(): Promise<void> {
  const session = await loadAuthSession();
  if (!session?.activeCompanyId) throw new Error("No active company");
  assertPermission(session, "onboarding.manage");

  const now = new Date().toISOString();
  const { error: checklistError } = await supabase
    .from("onboarding_checklists")
    .update({
      company_profile_done: true,
      sales_process_done: true,
      team_invites_done: true,
      calls_setup_done: true,
      ai_config_done: true,
      crm_setup_done: true,
      sample_call_done: true,
      completed_at: now,
      updated_at: now,
    })
    .eq("company_id", session.activeCompanyId);
  if (checklistError) throw checklistError;

  const { error: companyError } = await supabase
    .from("companies")
    .update({ onboarding_completed_at: now, updated_at: now })
    .eq("id", session.activeCompanyId);
  if (companyError) throw companyError;

  await supabase.from("audit_logs").insert({
    company_id: session.activeCompanyId,
    actor_user_id: session.userId,
    action: "onboarding.completed",
    resource_type: "company",
    resource_id: session.activeCompanyId,
  });
}

export async function loadOnboardingChecklist(): Promise<{
  completed: boolean;
  wizard: OnboardingWizardState;
} | null> {
  const session = await loadAuthSession();
  if (!session?.activeCompanyId) return null;

  const { data } = await supabase
    .from("onboarding_checklists")
    .select("*")
    .eq("company_id", session.activeCompanyId)
    .maybeSingle();

  if (!data) {
    return {
      completed: Boolean(session.membership?.onboardingCompletedAt),
      wizard: { step: 1 },
    };
  }

  return {
    completed: Boolean(data.completed_at) || Boolean(session.membership?.onboardingCompletedAt),
    wizard: (data.wizard_state as OnboardingWizardState) ?? { step: 1 },
  };
}
