export function configurationStatus(env: Record<string, string | undefined>) {
  const required = ["SUPABASE_URL", "SUPABASE_PUBLISHABLE_KEY", "SUPABASE_SERVICE_ROLE_KEY"];
  if (env.ARTEMIS_ENABLE_REAL_CALLS === "true")
    required.push("TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_PHONE_NUMBER", "APP_URL");
  if (env.ARTEMIS_ENABLE_PAID_AI === "true") required.push("VENICE_API_KEY", "VENICE_MODEL");
  if (env.ARTEMIS_ENABLE_VOICE === "true")
    required.push("MEDIA_STREAM_PUBLIC_URL", "DEEPGRAM_API_KEY");
  const missing = required.filter((key) =>
    key === "SUPABASE_SERVICE_ROLE_KEY"
      ? !(env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SECRET_KEY)
      : !env[key],
  );
  const errors: string[] = [];
  if (env.NODE_ENV === "production" && env.APP_URL && !env.APP_URL.startsWith("https://"))
    errors.push("APP_URL must use HTTPS");
  if (
    env.ARTEMIS_ENABLE_VOICE === "true" &&
    (!env.MEDIA_STREAM_PUBLIC_URL?.startsWith("wss://") || env.ARTEMIS_ENABLE_PAID_AI !== "true")
  )
    errors.push("Voice requires WSS and explicit paid-AI enablement");
  return {
    configured: missing.length === 0 && errors.length === 0,
    missing,
    errors,
    realCallsEnabled: env.ARTEMIS_ENABLE_REAL_CALLS === "true",
    paidAIEnabled: env.ARTEMIS_ENABLE_PAID_AI === "true",
    providerConnectivity: "not_checked" as const,
  };
}
