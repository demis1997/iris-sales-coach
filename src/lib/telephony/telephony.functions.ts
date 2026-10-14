import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createHash } from "node:crypto";
import { assertCanDial } from "@/lib/security/call-access";
import { consumeProviderLimit } from "@/lib/security/provider-limit.server";
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
  leadId: z.string().uuid(),
  idempotencyKey: z.string().uuid(),
  marketingConsent: z.literal(true),
  consentReference: z.string().trim().min(8).max(500),
  to: z.string().min(6).max(32),
  contactName: z.string().max(120).optional(),
  contactCompany: z.string().max(120).optional(),
});

export const getTelephonyStatus = createServerFn({ method: "GET" }).handler(async () => {
  const { getRequestUserId, loadMembershipForUser } =
    await import("@/lib/telephony/session.server");
  const { isTwilioConfigured, defaultPlatformCallerId } =
    await import("@/lib/telephony/twilio.server");

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
      recordCalls: telephony?.record_calls ?? false,
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
    const { getRequestUserId, loadMembershipForUser } =
      await import("@/lib/telephony/session.server");
    const { isTwilioConfigured, getTwilioClient, generateOtp, hashOtp, defaultPlatformCallerId } =
      await import("@/lib/telephony/twilio.server");

    if (!isTwilioConfigured()) {
      throw new Error("Calling is not configured yet. Ask your admin to connect Twilio.");
    }

    const userId = await getRequestUserId();
    const ctx = await loadMembershipForUser(userId);
    if (process.env.ARTEMIS_ENABLE_REAL_CALLS !== "true")
      throw new Error("Paid telephony disabled by operator");
    await consumeProviderLimit(ctx, "phone_verification_send", 3, 3600);
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
        .update({
          phone_e164: phone,
          phone: phone,
          phone_verified_at: null,
          updated_at: new Date().toISOString(),
        })
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
      .update({
        phone_e164: phone,
        phone: phone,
        phone_verified_at: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    return { ok: true as const, mode: "sms_otp" as const, phone };
  });

export const confirmPhoneVerification = createServerFn({ method: "POST" })
  .validator((data: unknown) => codeInput.parse(data))
  .handler(async ({ data }) => {
    const { getRequestUserId, loadMembershipForUser } =
      await import("@/lib/telephony/session.server");
    const { getTwilioClient, hashOtp } = await import("@/lib/telephony/twilio.server");

    const userId = await getRequestUserId();
    const ctx = await loadMembershipForUser(userId);
    await consumeProviderLimit(ctx, "phone_verification_confirm", 10, 600);
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
    const { getRequestUserId, loadMembershipForUser } =
      await import("@/lib/telephony/session.server");

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
    const { getRequestUserId, loadMembershipForUser } =
      await import("@/lib/telephony/session.server");
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
    assertCanDial(ctx.role);
    if (process.env.ARTEMIS_ENABLE_REAL_CALLS !== "true")
      throw new Error("Real calling is disabled by the operator");

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
    if (!telephony?.enabled) {
      throw new Error("Calling is disabled for this company.");
    }

    const lead = await ctx.admin
      .from("sales_leads")
      .select("id, owner_user_id, phone_e164, marketing_consent, consent_reference")
      .eq("company_id", ctx.companyId)
      .eq("id", data.leadId)
      .maybeSingle();
    if (
      lead.error ||
      !lead.data ||
      (lead.data.owner_user_id !== userId && !roleHasPermission(ctx.role, "calls.view_all"))
    )
      throw new Error("Lead not found");
    if (
      lead.data.marketing_consent !== "granted" ||
      lead.data.consent_reference !== data.consentReference ||
      lead.data.phone_e164 !== normalizeE164(data.to)
    )
      throw new Error("Lead consent or destination does not match the approved record");
    const prospect = normalizeE164(data.to);
    const agentPhone = normalizeE164(ctx.profile.phone);
    const { data: suppressed, error: suppressionError } = await ctx.admin
      .from("contact_suppressions")
      .select("phone_e164")
      .eq("company_id", ctx.companyId)
      .eq("phone_e164", prospect)
      .maybeSingle();
    if (suppressionError) throw new Error("Suppression check unavailable; calling blocked");
    if (suppressed) throw new Error("This number is on the company do-not-call list");
    if (telephony?.record_calls)
      throw new Error(
        "Recording requires a reviewed consent workflow; disable recording before calling",
      );
    const fingerprint = createHash("sha256")
      .update(
        JSON.stringify({
          companyId: ctx.companyId,
          userId,
          prospect,
          agentPhone,
          callerId,
          consentReference: data.consentReference,
        }),
      )
      .digest("hex");
    async function existingRequest() {
      const { data: previous, error } = await ctx.admin
        .from("calls")
        .select("id, request_fingerprint, external_call_id, status")
        .eq("company_id", ctx.companyId)
        .eq("agent_user_id", userId)
        .eq("idempotency_key", data.idempotencyKey)
        .maybeSingle();
      if (error) throw new Error("Idempotency lookup failed");
      if (!previous) return null;
      if (previous.request_fingerprint !== fingerprint)
        throw new Error("Idempotency key was already used for another request");
      return {
        ok: true as const,
        callId: previous.id as string,
        twilioSid: previous.external_call_id as string | null,
        agentPhone,
        prospect,
        callerId,
        status: previous.status as string,
        reused: true,
      };
    }
    const previous = await existingRequest();
    if (previous) return previous;
    await consumeProviderLimit(ctx, "outbound_call", 10, 3600);
    const callId = crypto.randomUUID();
    const sig = signTelephonyPayload([callId, ctx.companyId, prospect]);
    const base = appPublicUrl();
    const qs = `callId=${callId}&companyId=${ctx.companyId}&to=${encodeURIComponent(prospect)}&sig=${sig}`;
    const voiceUrl = `${base}/api/twilio/voice?${qs}`;
    const statusUrl = `${base}/api/twilio/status?${qs}`;
    const recordingUrl = `${base}/api/twilio/recording?${qs}`;

    const { error: insertError } = await ctx.admin.from("calls").insert({
      id: callId,
      lead_id: data.leadId,
      company_id: ctx.companyId,
      provider: "twilio",
      direction: "outbound",
      status: "created",
      idempotency_key: data.idempotencyKey,
      request_fingerprint: fingerprint,
      consent_status: "operator_attested",
      consent_reference: data.consentReference,
      agent_user_id: userId,
      contact_name: data.contactName || prospect,
      contact_company: data.contactCompany || null,
      phone_number: prospect,
      started_at: new Date().toISOString(),
      recording_status: "skipped",
      transcription_status: "pending",
      analysis_status: "pending",
      metadata: {
        agent_phone: agentPhone,
        caller_id: callerId,
        mode: "click_to_call",
      },
    });
    if (insertError) {
      if (insertError.code === "23505") {
        const previous = await existingRequest();
        if (previous) return previous;
      }
      throw new Error("Call reservation failed");
    }

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
        record: false,
        timeout: 30,
        timeLimit: 1800,
        recordingStatusCallback: undefined,
        recordingStatusCallbackMethod: "POST",
      });

      await ctx.admin
        .from("calls")
        .update({
          external_call_id: twilioCall.sid,
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
        status: "created",
        reused: false,
      };
    } catch (err) {
      await ctx.admin
        .from("calls")
        .update({ status: "provider_unknown", updated_at: new Date().toISOString() })
        .eq("id", callId);
      throw new Error(
        "Provider outcome is unknown. Do not start another call; reconcile this request first.",
      );
    }
  });

export const hangupOutboundCall = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({ callId: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    const { getRequestUserId, loadMembershipForUser } =
      await import("@/lib/telephony/session.server");
    const { getTwilioClient, isTwilioConfigured } = await import("@/lib/telephony/twilio.server");

    if (!isTwilioConfigured()) throw new Error("Twilio is not configured");

    const userId = await getRequestUserId();
    const ctx = await loadMembershipForUser(userId);

    const { data: call } = await ctx.admin
      .from("calls")
      .select("id, external_call_id, agent_user_id, status")
      .eq("id", data.callId)
      .eq("company_id", ctx.companyId)
      .maybeSingle();

    if (!call?.external_call_id) throw new Error("Call not found");
    if (call.agent_user_id !== userId && !roleHasPermission(ctx.role, "calls.view_all")) {
      throw new Error("Cannot hang up this call");
    }

    const client = getTwilioClient();
    const finalStatus = ["created", "ringing", "provider_unknown"].includes(call.status)
      ? "canceled"
      : "completed";
    await client.calls(call.external_call_id).update({ status: finalStatus });
    await ctx.admin
      .from("calls")
      .update({
        status: finalStatus === "canceled" ? "cancelled" : "completed",
        ended_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.callId)
      .eq("company_id", ctx.companyId);

    return { ok: true as const };
  });

export const getOutboundCall = createServerFn({ method: "GET" })
  .validator((data: unknown) => z.object({ callId: z.string().uuid() }).strict().parse(data))
  .handler(async ({ data }) => {
    const { getRequestUserId, loadMembershipForUser } =
      await import("@/lib/telephony/session.server");
    const { assertCallAccess } = await import("@/lib/security/call-access");
    const ctx = await loadMembershipForUser(await getRequestUserId());
    const result = await ctx.admin
      .from("calls")
      .select("id, company_id, agent_user_id, status, duration_seconds, started_at, ended_at")
      .eq("id", data.callId)
      .eq("company_id", ctx.companyId)
      .is("deleted_at", null)
      .maybeSingle();
    if (result.error) throw new Error("Call lookup failed");
    assertCallAccess(ctx, result.data);
    return result.data!;
  });
