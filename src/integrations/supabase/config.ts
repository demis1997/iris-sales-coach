/** Shared Supabase env detection — safe to call during SSR and client render. */

export function getSupabaseEnv(): { url: string | undefined; key: string | undefined } {
  const url =
    (typeof import.meta !== "undefined" && import.meta.env?.["VITE_SUPABASE_URL"]) ||
    (typeof process !== "undefined" ? process.env?.["SUPABASE_URL"] : undefined) ||
    (typeof import.meta !== "undefined" && import.meta.env?.["NEXT_PUBLIC_SUPABASE_URL"]) ||
    (typeof process !== "undefined" ? process.env?.["NEXT_PUBLIC_SUPABASE_URL"] : undefined);

  const key =
    (typeof import.meta !== "undefined" && import.meta.env?.["VITE_SUPABASE_PUBLISHABLE_KEY"]) ||
    (typeof process !== "undefined" ? process.env?.["SUPABASE_PUBLISHABLE_KEY"] : undefined) ||
    (typeof import.meta !== "undefined" && import.meta.env?.["NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"]) ||
    (typeof import.meta !== "undefined" && import.meta.env?.["NEXT_PUBLIC_SUPABASE_ANON_KEY"]) ||
    (typeof process !== "undefined" ? process.env?.["NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"] : undefined) ||
    (typeof process !== "undefined" ? process.env?.["NEXT_PUBLIC_SUPABASE_ANON_KEY"] : undefined);

  const cleanUrl = typeof url === "string" && url.trim() ? url.trim() : undefined;
  const cleanKey = typeof key === "string" && key.trim() ? key.trim() : undefined;
  return { url: cleanUrl, key: cleanKey };
}

export function isSupabaseConfigured(): boolean {
  const { url, key } = getSupabaseEnv();
  return Boolean(url && key);
}
