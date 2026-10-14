# CRM integration status

`/crm/contacts` now reads and writes internal Supabase leads and follow-ups in the authenticated organization. Marketing-consent withdrawal adds durable suppression. Qualification states and internal task/appointment records are operator-entered, not AI-predicted business results. These records do not imply external FXBO or calendar synchronization.

FXBO is **not connected**. No official API contract or sandbox credentials were provided. The adapter interface supports capability discovery and idempotent call-activity submission. Tests use a named test double. A durable company/call-scoped outbox row is created atomically with completed analysis and remains `blocked / crm_provider_not_configured`; it is never reported as synchronized.

To implement FXBO, supply these through approved secure configuration/documentation channels:

1. Official API version, base URL, authentication/scopes and a non-production tenant.
2. Documented contact/lead search, create, update and pagination/filter schemas; stable external IDs and deduplication rules.
3. Activity/summary, lead status, task and appointment endpoints, timezone semantics, required fields and error schemas.
4. Idempotency guarantees or a documented external-key lookup mechanism. Never blindly retry uncertain creates.
5. Webhook event schemas, signing keys/algorithm, canonical signature calculation, timestamps, replay window and event IDs.
6. Rate limits, retry guidance, reconciliation cursors and deletion/retention semantics.

Next implement a configured adapter and leased outbox dispatcher with per-organization credentials, tenant-bound external-ID mappings, retries/dead-letter states and reconciliation. Current source provides the boundary and blocked outbox, not a completed CRM synchronization worker. No unsupported endpoint was invented. The internal contacts/follow-up screen uses actual records; other sample-only CRM screens remain unavailable in the live workspace.
