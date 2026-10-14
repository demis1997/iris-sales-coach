import twilio from "twilio";
import { createHmac, timingSafeEqual, createHash, randomInt } from "node:crypto";

export function isTwilioConfigured(): boolean {
  return Boolean(
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    (process.env.TWILIO_PHONE_NUMBER || process.env.TWILIO_CALLER_ID),
  );
}

export function getTwilioClient() {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!sid || !token)
    throw new Error("Twilio is not configured (TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN)");
  return twilio(sid, token);
}

export function defaultPlatformCallerId(): string | null {
  return process.env.TWILIO_PHONE_NUMBER || process.env.TWILIO_CALLER_ID || null;
}

export function appPublicUrl(): string {
  const url = process.env.APP_URL || process.env.VITE_PUBLIC_SITE_URL || "http://localhost:8080";
  return url.replace(/\/$/, "");
}

function signingSecret(): string {
  const secret = process.env.TELEPHONY_SIGNING_SECRET || process.env.TWILIO_AUTH_TOKEN;
  if (!secret || secret.length < 24) throw new Error("Telephony signing secret is not configured");
  return secret;
}

export function signTelephonyPayload(parts: string[]): string {
  return createHmac("sha256", signingSecret()).update(parts.join("|")).digest("hex").slice(0, 40);
}

export function verifyTelephonyPayload(
  parts: string[],
  signature: string | null | undefined,
): boolean {
  if (!signature) return false;
  try {
    const expected = signTelephonyPayload(parts);
    const a = Buffer.from(expected);
    const b = Buffer.from(signature);
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function hashOtp(code: string): string {
  return createHash("sha256").update(`${signingSecret()}:${code}`).digest("hex");
}

export function generateOtp(): string {
  return String(randomInt(100000, 999999));
}

export function validateTwilioRequest(request: Request, body: URLSearchParams): boolean {
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  if (!authToken) return false;
  const signature = request.headers.get("x-twilio-signature") || "";
  const incoming = new URL(request.url);
  // Prefer public APP_URL so signature matches what Twilio signed (proxy-safe).
  const url = `${appPublicUrl()}${incoming.pathname}${incoming.search}`;
  const params: Record<string, string> = {};
  body.forEach((value, key) => {
    params[key] = value;
  });
  return twilio.validateRequest(authToken, signature, url, params);
}

export function twiml(xmlBody: string): Response {
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><Response>${xmlBody}</Response>`, {
    status: 200,
    headers: { "Content-Type": "text/xml; charset=utf-8" },
  });
}

/** Validate account-owned Twilio media only; never send Basic credentials to arbitrary URLs. */
export function recordingMediaUrl(
  recordingUrl: string,
  recordingSid: string,
  accountSid: string,
): string {
  if (!/^AC[a-fA-F0-9]{32}$/.test(accountSid) || !/^RE[a-fA-F0-9]{32}$/.test(recordingSid))
    throw new Error("invalid_recording_identity");
  const url = new URL(recordingUrl);
  const expected = `/2010-04-01/Accounts/${accountSid}/Recordings/${recordingSid}`;
  if (
    url.origin !== "https://api.twilio.com" ||
    url.pathname !== expected ||
    url.search ||
    url.hash ||
    url.username ||
    url.password
  )
    throw new Error("invalid_recording_origin");
  return url.href + ".mp3";
}

export async function readTwilioForm(request: Request): Promise<URLSearchParams> {
  if (!request.headers.get("content-type")?.startsWith("application/x-www-form-urlencoded"))
    throw new Error("invalid_webhook_content_type");
  const { readBounded } = await import("@/lib/providers/http.server");
  const bytes = await readBounded(new Response(request.body), 16384);
  return new URLSearchParams(new TextDecoder().decode(bytes));
}
