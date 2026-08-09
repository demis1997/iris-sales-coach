/**
 * Verifies Step 1 env + optional Supabase reachability.
 * Usage: npm run verify:step1
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

function loadEnvFile(path) {
  if (!existsSync(path)) return {};
  const out = {};
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const i = trimmed.indexOf("=");
    const key = trimmed.slice(0, i).trim();
    const value = trimmed.slice(i + 1).trim();
    out[key] = value;
  }
  return out;
}

const env = { ...loadEnvFile(resolve(process.cwd(), ".env")), ...process.env };

const required = [
  "VITE_SUPABASE_URL",
  "VITE_SUPABASE_PUBLISHABLE_KEY",
  "SUPABASE_URL",
  "SUPABASE_PUBLISHABLE_KEY",
];

const optional = ["SUPABASE_SERVICE_ROLE_KEY"];

let ok = true;

console.log("Step 1 — accounts env check\n");

for (const key of required) {
  const value = (env[key] || "").trim();
  if (!value) {
    console.log(`✗ ${key} is EMPTY`);
    ok = false;
  } else {
    console.log(`✓ ${key} set (${value.length} chars)`);
  }
}

for (const key of optional) {
  const value = (env[key] || "").trim();
  console.log(value ? `✓ ${key} set (${value.length} chars)` : `○ ${key} empty (needed for admin/server jobs)`);
}

const secret = (env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SECRET_KEY || "").trim();
if (!secret && !(env.SUPABASE_SERVICE_ROLE_KEY || "").trim()) {
  // already reported above via optional
} else if (secret && !(env.SUPABASE_SERVICE_ROLE_KEY || "").trim()) {
  console.log(`✓ SUPABASE_SECRET_KEY usable as service role (${secret.length} chars)`);
}

const url = (env.VITE_SUPABASE_URL || env.SUPABASE_URL || "").trim();
const key = (env.VITE_SUPABASE_PUBLISHABLE_KEY || env.SUPABASE_PUBLISHABLE_KEY || "").trim();

if (url && key) {
  try {
    const res = await fetch(`${url.replace(/\/$/, "")}/auth/v1/health`, {
      headers: { apikey: key },
    });
    console.log(`\nAuth health: HTTP ${res.status}${res.ok ? " ✓" : " (check project status)"}`);
  } catch (err) {
    console.log(`\nAuth health request failed: ${err instanceof Error ? err.message : err}`);
    ok = false;
  }
}

console.log(
  ok
    ? "\nReady: apply migrations (see docs/STEP1_ACCOUNTS.md), then register at /auth."
    : "\nBlocked: fill empty keys in .env from Supabase → Project Settings → API, then re-run.",
);

process.exit(ok ? 0 : 1);
