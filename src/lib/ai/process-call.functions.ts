import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { assertCallAccess } from "@/lib/security/call-access";

export const processCallAnalysis = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({
        callId: z.string().uuid(),
        companyId: z.string().uuid(),
        transcriptText: z.string().min(20).max(120000).optional(),
      })
      .strict()
      .parse(data),
  )
  .handler(async ({ data }) => {
    const { getRequestUserId, loadMembershipForUser } =
      await import("@/lib/telephony/session.server");
    const ctx = await loadMembershipForUser(await getRequestUserId());
    if (data.companyId !== ctx.companyId) throw new Error("Call not found");
    const { data: call, error } = await ctx.admin
      .from("calls")
      .select("company_id, agent_user_id")
      .eq("id", data.callId)
      .eq("company_id", ctx.companyId)
      .is("deleted_at", null)
      .maybeSingle();
    if (error) throw new Error("Call lookup failed");
    assertCallAccess(ctx, call);
    const { assertCanDial } = await import("@/lib/security/call-access");
    assertCanDial(ctx.role);
    const { consumeProviderLimit } = await import("@/lib/security/provider-limit.server");
    await consumeProviderLimit(ctx, "analysis_enqueue", 20, 3600);
    const { enqueueCallAnalysis } = await import("@/lib/ai/analysis.server");
    return enqueueCallAnalysis({ ...data, companyId: ctx.companyId });
  });
