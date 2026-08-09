import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { roleHasPermission } from "@/lib/permissions";
import { normalizeE164 } from "@/lib/telephony/phone";

const phoneInput = z.object({ phone: z.string().min(6).max(32) });
const codeInput = z.object({
  phone: z.string().min(6).max(32),
  code: z.string().min(4).max(10),
});
const callerIdInput = z.object({
  callerId: z.string().min(6).max(32),
  enabled: z.boolean().optional(),
});
const placeCallInput = z.object({
  to: z.string().min(6).max(32),
  contactName: z.string().max(120).optional(),
  contactCompany: z.string().max(120).optional(),
});

export const getTelephonyStatus = createServerFn({ method: "GET" }).handler(async () => {
  const { getRequestUserId, loadMembershipForUser } = await import("@/lib/telephony/session.server");
  const { isTwilioConfigured, defaultPlatformCallerId } = await import("@/lib/telephony/twilio.server");

  const userId = await getRequestUserId();
  const ctx = await loadMembershipForUser(userId);

  const { data: telephony } = await ctx.admin
    .from("company_telephony_settings")
    .select("enabled, caller_id_e164, record_calls, provider")
    .eq("company_id", ctx.companyId)
    .maybeSingle();

  const callerId = telephony?.caller_id_e164 || defaultPlatformCallerId();
  const canManage = roleHasPermission(ctx.role, "integrations.manage");

  return {
    twilioConfigured: isTwilioConfigured(),
    canManageCompanyTelephony: canManage,
    company: {
      enabled: Boolean(telephony?.enabled && callerId),
      callerIdE164: telephony?.caller_id_e164 ?? null,
      effectiveCallerId: callerId,
      recordCalls: telephony?.record_calls ?? true,
      provider: telephony?.provider ?? "twilio",
    },
    employee: {
      phoneE164: ctx.profile.phone,
      phoneVerified: Boolean(ctx.profile.phoneVerifiedAt),
      phoneVerifiedAt: ctx.profile.phoneVerifiedAt,
      dialerDevice: ctx.profile.dialerDevice,
    },
  };
});

export const startPhoneVerification = createServerFn({ method: "POST" })
  .validator((data: unknown) => phoneInput.parse(data))
  .handler(async ({ data }) => {
    const { getRequestUserId, loadMembershipForUser } = await import("@/lib/telephony/session.server");
    const {
      isTwilioConfigured,
      getTwilioClient,
      generateOtp,
      hashOtp,
      defaultPlatformCallerId,
    } = await import("@/lib/telephony/twilio.server");

    if (!isTwilioConfigured()) {
      throw new Error("Calling is not configured yet. Ask your admin to connect Twilio.");
    }

    const userId = await getRequestUserId();
    const ctx = await loadMembershipForUser(userId);
    const phone = normalizeE164(data.phone);
    const client = getTwilioClient();

    const verifySid = process.env.TWILIO_VERIFY_SERVICE_SID;
    if (verifySid) {
      await client.verify.v2.services(verifySid).verifications.create({
        to: phone,
        channel: "sms",
      });
      await ctx.admin
        .from("profiles")
        .update({ phone_e164: phone, phone: phone, updated_at: new Date().toISOString() })
        .eq("id", userId);
      return { ok: true as const, mode: "twilio_verify" as const, phone };
    }

    const code = generateOtp();
    const from = defaultPlatformCallerId();
    if (!from) throw new Error("TWILIO_PHONE_NUMBER is required to send verification SMS");

    await client.messages.create({
      to: phone,
      from,
      body: `Artemis AI verification code: ${code}. Valid for 10 minutes.`,
    });

    const expires = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    await ctx.admin.from("phone_verification_challenges").insert({
      user_id: userId,
      phone_e164: phone,
      code_hash: hashOtp(code),
      expires_at: expires,
    });

    await ctx.admin
      .from("profiles")
      .update({ phone_e164: phone, phone: phone, phone_verified_at: null, updated_at: new Date().toISOString() })
      .eq("id", userId);

    return { ok: true as const, mode: "sms_otp" as const, phone };
  });

export const confirmPhoneVerification = createServerFn({ method: "POST" })
  .validator((data: unknown) => codeInput.parse(data))
  .handler(async ({ data }) => {
    const { getRequestUserId, loadMembershipForUser } = await import("@/lib/telephony/session.server");
    const { getTwilioClient, hashOtp } = await import("@/lib/telephony/twilio.server");

    const userId = await getRequestUserId();
    const ctx = await loadMembershipForUser(userId);
    const phone = normalizeE164(data.phone);
    const code = data.code.trim();

    const verifySid = process.env.TWILIO_VERIFY_SERVICE_SID;
    if (verifySid) {
      const client = getTwilioClient();
      const check = await client.verify.v2.services(verifySid).verificationChecks.create({
        to: phone,
        code,
      });
      if (check.status !== "approved") throw new Error("Invalid or expired code");
    } else {
      const { data: challenge } = await ctx.admin
        .from("phone_verification_challenges")
        .select("*")
        .eq("user_id", userId)
        .eq("phone_e164", phone)
        .is("consumed_at", null)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!challenge) throw new Error("No verification in progress. Send a code first.");
      if (new Date(challenge.expires_at).getTime() < Date.now()) {
        throw new Error("Code expired. Send a new one.");
      }
      if ((challenge.attempts ?? 0) >= 5) throw new Error("Too many attempts. Send a new code.");

      await ctx.admin
        .from("phone_verification_challenges")
        .update({ attempts: (challenge.attempts ?? 0) + 1 })
        .eq("id", challenge.id);

      if (challenge.code_hash !== hashOtp(code)) throw new Error("Invalid code");

      await ctx.admin
        .from("phone_verification_challenges")
        .update({ consumed_at: new Date().toISOString() })
        .eq("id", challenge.id);
    }

    const verifiedAt = new Date().toISOString();
    await ctx.admin
      .from("profiles")
      .update({
        phone_e164: phone,
        phone: phone,
        phone_verified_at: verifiedAt,
        dialer_device: "phone",
        updated_at: verifiedAt,
      })
      .eq("id", userId);

    return { ok: true as const, phone, verifiedAt };
  });

export const saveCompanyTelephony = createServerFn({ method: "POST" })
  .validator((data: unknown) => callerIdInput.parse(data))
  .handler(async ({ data }) => {
    const { getRequestUserId, loadMembershipForUser } = await import("@/lib/telephony/session.server");

    const userId = await getRequestUserId();
    const ctx = await loadMembershipForUser(userId);
    if (!roleHasPermission(ctx.role, "integrations.manage")) {
      throw new Error("Only company owners/admins can set the company caller ID");
    }

    const callerId = normalizeE164(data.callerId);
    const enabled = data.enabled ?? true;
    const now = new Date().toISOString();

    const { error } = await ctx.admin.from("company_telephony_settings").upsert(
      {
        company_id: ctx.companyId,
        caller_id_e164: callerId,
        enabled,
        provider: "twilio",
        updated_at: now,
      },
      { onConflict: "company_id" },
    );
    if (error) throw error;

    return { ok: true as const, callerId, enabled };
  });

export const placeOutboundCall = createServerFn({ method: "POST" })
  .validator((data: unknown) => placeCallInput.parse(data))
  .handler(async ({ data }) => {
    const { getRequestUserId, loadMembershipForUser } = await import("@/lib/telephony/session.server");
    const {
      isTwilioConfigured,
      getTwilioClient,
      defaultPlatformCallerId,
      appPublicUrl,
      signTelephonyPayload,
    } = await import("@/lib/telephony/twilio.server");

    if (!isTwilioConfigured()) {
      throw new Error("Twilio is not configured on the server yet.");
    }

    const userId = await getRequestUserId();
    const ctx = await loadMembershipForUser(userId);

    if (!ctx.profile.phone || !ctx.profile.phoneVerifiedAt) {
      throw new Error("Verify your phone number before dialing.");
    }

    const { data: telephony } = await ctx.admin
      .from("company_telephony_settings")
      .select("enabled, caller_id_e164, record_calls")
      .eq("company_id", ctx.companyId)
      .maybeSingle();

    const callerId = telephony?.caller_id_e164 || defaultPlatformCallerId();
    if (!callerId) throw new Error("Company caller ID is not set. Ask an admin to enable calling.");
    if (telephony && telephony.enabled === false) {
      throw new Error("Calling is disabled for this company.");
    }

    const prospect = normalizeE164(data.to);
    const agentPhone = normalizeE164(ctx.profile.phone);
    const callId = crypto.randomUUID();
    const sig = signTelephonyPayload([callId, ctx.companyId, prospect]);
    const base = appPublicUrl();
    const qs = `callId=${callId}&companyId=${ctx.companyId}&to=${encodeURIComponent(prospect)}&sig=${sig}`;
    const voiceUrl = `${base}/api/twilio/voice?${qs}`;
    const statusUrl = `${base}/api/twilio/status?${qs}`;
    const recordingUrl = `${base}/api/twilio/recording?${qs}`;

    const { error: insertError } = await ctx.admin.from("calls").insert({
      id: callId,
      company_id: ctx.companyId,
      provider: "twilio",
      direction: "outbound",
      status: "ringing",
      agent_user_id: userId,
      contact_name: data.contactName || prospect,
      contact_company: data.contactCompany || null,
      phone_number: prospect,
      started_at: new Date().toISOString(),
      recording_status: telephony?.record_calls === false ? "skipped" : "pending",
      transcription_status: "pending",
      analysis_status: "pending",
      metadata: {
        agent_phone: agentPhone,
        caller_id: callerId,
        mode: "click_to_call",
      },
    });
    if (insertError) throw insertError;

    const client = getTwilioClient();
    try {
      const twilioCall = await client.calls.create({
        to: agentPhone,
        from: callerId,
        url: voiceUrl,
        method: "POST",
        statusCallback: statusUrl,
        statusCallbackMethod: "POST",
        statusCallbackEvent: ["initiated", "ringing", "answered", "completed"],
        record: telephony?.record_calls !== false,
        recordingStatusCallback: telephony?.record_calls === false ? undefined : recordingUrl,
        recordingStatusCallbackMethod: "POST",
      });

      await ctx.admin
        .from("calls")
        .update({
          external_call_id: twilioCall.sid,
          status: "ringing",
          updated_at: new Date().toISOString(),
        })
        .eq("id", callId);

      return {
        ok: true as const,
        callId,
        twilioSid: twilioCall.sid,
        agentPhone,
        prospect,
        callerId,
      };
    } catch (err) {
      await ctx.admin
        .from("calls")
        .update({ status: "failed", updated_at: new Date().toISOString() })
        .eq("id", callId);
      throw err instanceof Error ? err : new Error("Failed to place call");
    }
  });

export const hangupOutboundCall = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({ callId: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    const { getRequestUserId, loadMembershipForUser } = await import("@/lib/telephony/session.server");
    const { getTwilioClient, isTwilioConfigured } = await import("@/lib/telephony/twilio.server");

    if (!isTwilioConfigured()) throw new Error("Twilio is not configured");

    const userId = await getRequestUserId();
    const ctx = await loadMembershipForUser(userId);

    const { data: call } = await ctx.admin
      .from("calls")
      .select("id, external_call_id, agent_user_id")
      .eq("id", data.callId)
      .eq("company_id", ctx.companyId)
      .maybeSingle();

    if (!call?.external_call_id) throw new Error("Call not found");
    if (call.agent_user_id !== userId && !roleHasPermission(ctx.role, "calls.view_all")) {
      throw new Error("Cannot hang up this call");
    }

    const client = getTwilioClient();
    await client.calls(call.external_call_id).update({ status: "completed" });
    await ctx.admin
      .from("calls")
      .update({
        status: "completed",
        ended_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.callId);

    return { ok: true as const };
  });
