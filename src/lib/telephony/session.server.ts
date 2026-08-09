import { createClient } from "@supabase/supabase-js";
import { getRequest } from "@tanstack/react-start/server";
import type { AppRole } from "@/lib/permissions";

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

function publishableKey() {
  return process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
}

export async function getRequestUserId(): Promise<string> {
  const request = getRequest();
  const authHeader = request?.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) throw new Error("Unauthorized");
  const token = authHeader.slice(7);
  if (token.split(".").length !== 3) throw new Error("Unauthorized");

  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = publishableKey();
  if (!url || !key) throw new Error("Supabase env missing");

  const supabase = createClient(url, key, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) throw new Error("Unauthorized");
  return data.user.id;
}

export async function getAdminClient() {
  const { createClient: create } = await import("@supabase/supabase-js");
  const url = process.env.SUPABASE_URL;
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
  if (!url || !secret) throw new Error("Supabase server keys missing");
  return create(url, secret, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function loadMembershipForUser(userId: string) {
  const admin = await getAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("full_name, active_company_id, company_id, phone, phone_e164, phone_verified_at, dialer_device")
    .eq("id", userId)
    .maybeSingle();

  const companyId = profile?.active_company_id ?? profile?.company_id;
  if (!companyId) throw new Error("No active company");

  const { data: membership } = await admin
    .from("company_memberships")
    .select("id, role, status")
    .eq("user_id", userId)
    .eq("company_id", companyId)
    .eq("status", "active")
    .maybeSingle();

  if (!membership) throw new Error("Not a member of this company");

  return {
    admin,
    userId,
    companyId,
    role: asRole(membership.role) as AppRole,
    profile: {
      fullName: profile?.full_name as string | null,
      phone: (profile?.phone_e164 || profile?.phone) as string | null,
      phoneVerifiedAt: profile?.phone_verified_at as string | null,
      dialerDevice: (profile?.dialer_device as string) || "phone",
    },
  };
}
