import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { roleHasPermission } from "@/lib/permissions";
async function administrator() {
  const { getRequestUserId, loadMembershipForUser } =
    await import("@/lib/telephony/session.server");
  const ctx = await loadMembershipForUser(await getRequestUserId());
  if (!roleHasPermission(ctx.role, "calls.delete") || !["owner", "admin"].includes(ctx.role))
    throw new Error("Company administrator required");
  return ctx;
}
export const requestCallErasure = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({ callId: z.string().uuid(), approvalReference: z.string().min(8).max(128) })
      .strict()
      .parse(data),
  )
  .handler(async ({ data }) => {
    const ctx = await administrator();
    const result = await ctx.admin.rpc("request_call_erasure", {
      _company: ctx.companyId,
      _call: data.callId,
      _actor: ctx.userId,
      _reference: data.approvalReference,
    });
    if (result.error)
      throw new Error("Erasure request rejected; check legal hold or active processing");
    return {
      taskId: result.data as string,
      state: "queued" as const,
      note: "Call hidden; physical removal requires grace period and separately approved manifest execution",
    };
  });
export const setCallLegalHold = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z.object({ callId: z.string().uuid(), held: z.boolean() }).strict().parse(data),
  )
  .handler(async ({ data }) => {
    const ctx = await administrator();
    const result = await ctx.admin.rpc("set_call_legal_hold", {
      _company: ctx.companyId,
      _call: data.callId,
      _actor: ctx.userId,
      _held: data.held,
    });
    if (result.error)
      throw new Error("Legal hold update rejected; erasure may already be in progress");
    return { ok: true as const };
  });
