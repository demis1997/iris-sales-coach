import type { SupabaseClient } from "@supabase/supabase-js";
export async function consumeProviderLimit(
  ctx: { admin: SupabaseClient; companyId: string; userId: string },
  action: string,
  limit: number,
  seconds: number,
) {
  const { data, error } = await ctx.admin.rpc("consume_provider_limit", {
    _company: ctx.companyId,
    _user: ctx.userId,
    _action: action,
    _limit: limit,
    _seconds: seconds,
  });
  if (error) throw new Error("Provider rate-limit storage unavailable; action blocked");
  if (data !== true) throw new Error("Rate limit reached; try again later");
}
