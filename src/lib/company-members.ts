import { supabase } from "@/integrations/supabase/client";
import { loadAuthSession, switchActiveCompany, type SessionMembership } from "@/lib/auth-session";
import type { AppRole } from "@/lib/permissions";

export type CompanyMember = {
  userId: string;
  fullName: string | null;
  email: string | null;
  role: AppRole;
  status: string;
  joinedAt: string;
};

export async function listCompanyMembers(companyId?: string): Promise<CompanyMember[]> {
  const session = await loadAuthSession();
  if (!session?.activeCompanyId && !companyId) return [];
  const cid = companyId ?? session!.activeCompanyId!;

  const { data: memberships, error } = await supabase
    .from("company_memberships")
    .select("user_id, role, status, joined_at")
    .eq("company_id", cid)
    .eq("status", "active")
    .order("joined_at", { ascending: true });

  if (error || !memberships?.length) return [];

  const userIds = memberships.map((m) => m.user_id);
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .in("id", userIds);

  const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));

  return memberships.map((m) => {
    const profile = profileMap.get(m.user_id);
    return {
      userId: m.user_id,
      fullName: profile?.full_name ?? null,
      email: profile?.email ?? null,
      role: m.role as AppRole,
      status: m.status,
      joinedAt: m.joined_at,
    };
  });
}

export async function listUserCompanies(): Promise<SessionMembership[]> {
  const session = await loadAuthSession();
  return session?.memberships ?? [];
}

export { switchActiveCompany };
