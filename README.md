# Iris / Artemis AI sales coach

A React and TanStack Start application for company workspaces, call uploads, structured AI coaching, and telephony workflows. The repository contains Supabase migrations and role checks, a provider abstraction, versioned prompts and Zod output schemas. These are implementation capabilities; production integrations and improved sales outcomes are not established by the local tests.

## Local development

Use Node.js 22.20 or newer compatible with the committed npm lockfile.

```sh
npm ci --ignore-scripts
cp .env.example .env
npm run dev
```

Follow [setup](docs/SETUP.md) for Supabase configuration and migrations. Keep service-role and provider credentials server-side and out of Git. The mock AI tests below do not require a provider key; the complete application requires its configured services.

## Deterministic checks

```sh
npm run test:unit
npm run test:ai
```

The permission tests and ten AI tests use deterministic mock responses. They exercise tenant boundaries, prompt/schema contracts and task routing; they do not measure real model quality, actual inference cost, telephony delivery, or production security. CI runs these checks without provider credentials. No paid model calls are required.

## Implementation and runbooks

- [Architecture](docs/ARCHITECTURE.md)
- [Setup](docs/SETUP.md)
- [Production checklist](docs/PRODUCTION.md)
- [Telephony](docs/TELEPHONY.md)
- [Account verification](docs/STEP1_ACCOUNTS.md)
- AI providers, prompts and schemas: `src/ai/`
- Database migrations: `supabase/migrations/`

During the 7 October 2026 maintenance pass, locked installation, the permission test, all ten mock AI tests and `npm run build` passed. `npm run lint` failed with 1,074 errors and 12 warnings, mostly existing formatting issues; this broader cleanup remains outstanding. CI runs the passing tests and build, and does not claim a clean lint gate. Applying database migrations or configuring telephony requires manual integration validation.

## Attribution

The application was built with [Lovable](https://lovable.dev). Preserve its connected history and the guidance in [AGENTS.md](AGENTS.md); do not force-push or rewrite published commits.
