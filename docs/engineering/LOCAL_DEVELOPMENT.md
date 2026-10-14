# Local development

Use Node 22.20.x. `npm ci --ignore-scripts`, then `npm run dev`. Without Supabase configuration, use `/demo/agent/live`; it is labelled simulation. No service key is needed for demo. No secret is committed.

For database development, provision a disposable Supabase project separately, copy `.env.example` to ignored `.env` and set publishable/server credentials. Apply numbered files under `supabase/migrations` in chronological order; do not use the old concatenated apply_all.sql as a replacement for the new migrations. Supabase Auth and Storage schemas must already exist. Enum values in the old migrations may require separate committed enum additions before dependent statements; the database test explicitly does this.

New migrations enforce composite foreign keys and unique number/provider identifiers. Inspect inconsistent legacy rows first; a failing migration should stop, not silently discard customer data. New hardening disables existing recording settings, restricts browser writes and protects phone-verification fields. Test the existing onboarding/invite and upload flows against the disposable project before any production apply.

Start analysis only after explicit approval for paid provider requests:

```sh
npm run worker:analysis
```

It refuses to run unless `ARTEMIS_ENABLE_PAID_AI=true`. Use `npm run worker:voice` only with configured speech/LLM/Twilio test accounts and explicit enablement. Neither worker is launched by unit tests or ordinary app startup.

`npm test` runs permissions, versioned AI prompt fixtures, mocked provider/state/security/CRM/interruption tests and actual PostgreSQL-WASM migration/RLS/queue tests. Test-double results never certify external provider compatibility.
