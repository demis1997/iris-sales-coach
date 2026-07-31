# Iris security notes

## Honest posture

This build is a **product demo**. It does not claim SOC 2, ISO 27001, GDPR certification, or PCI compliance. See `/security` for architecture intent vs roadmap.

## Tenant isolation

- Session organisation id is derived from the authenticated/demo user (`ORG_ID` for Apex Markets).
- `assertSameOrganisation` / `assertOrg` throw on mismatch.
- Cross-tenant access is covered in `src/lib/demo/iris.quality.test.ts`.
- Do **not** accept organisation id from query strings or request bodies as authoritative.

## Authentication (current)

- Demo email → user mapping in `demo-auth.ts`
- Session in `sessionStorage` (not httpOnly cookies)
- Disabled users cannot log in
- Password field is decorative; reset is explicitly unavailable
- Production needs SSO/MFA, secure cookies, CSRF strategy, and server session validation

## Authorisation

RBAC in `rbac.ts` / `permissions.ts`. Query helpers enforce permissions for calls, coaching, pipeline, reports, integrations, and settings. Frontend route guards are UX only.

## Secrets

- No hardcoded API keys in the repo
- AI keys: `IRIS_AI_API_KEY` server-side only — never `VITE_`
- `redactForLogs` strips emails/tokens from audit metadata

## Audit logging

`recordAudit` captures sensitive demo actions (login, logout, call view, coaching assign, invites). Production should persist append-only server-side.

## Uploads & input

- Onboarding “upload” is simulated client-side (filename only)
- Forms validated with Zod where used (book-demo)
- Sanitize/escape any future HTML rendering of user content
- Rate limiting and CSRF belong on real server endpoints (not present in static demo APIs)

## Integrations

Statuses must remain truthful. Only Available connectors can be marked Connected after explicit demo configuration. Planned/In development never imply live data sync.

## Incident contact

Responsible disclosure: security@iris.sales (as published on `/security`).
