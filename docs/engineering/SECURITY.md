# Security assessment — local implementation

This is a source audit and test-backed hardening report, not a penetration-test certification or a production approval.

## Fixed boundaries

- Public analysis/coaching paths authenticate current Supabase users before paid or privileged actions. Active membership and explicit call ownership/company checks are required; caller-supplied company IDs cannot select another tenant.
- Live AI does not substitute fixtures/stub output. Missing STT/provider configuration fails explicitly. Transcription timestamps come from the speech provider; anonymous speakers are not fabricated agent/customer identities.
- Twilio signatures are mandatory; no known fallback HMAC secret. Recording URLs must match the configured account/recording SID on api.twilio.com; redirects, credentials in URLs, query strings and oversized/timed-out downloads are rejected. Webhook bodies are bounded.
- Call creation reserves a unique company/user request key before provider creation. Unknown provider outcomes do not auto-redial. Marketing-consent attestation, number suppression, role checks and durable provider rate limits precede calls.
- Composite tenant/call FKs, call-scoped read policies and protected provider fields reduce service/RLS inconsistency. Verification challenge writes and verified-phone fields are server-managed. Jobs and AI analyses cannot be manufactured directly by browser SQL clients.
- Audio upgrade signatures plus expiring one-use session tokens bind streams to known provider call IDs. Payload, queue, context, lifetime and connection bounds apply. Generation fencing rejects obsolete audio after interruption. Conversational input authorizes no tools or financial actions.
- Analysis queue ownership is fenced; stale workers cannot commit. Final transcript/analysis/audit/outbox updates occur in one SQL transaction. AI conversion predictions do not overwrite recorded conversions.
- API keys remain server environment variables. Logs use event metadata rather than transcript/provider error bodies. Private audio URLs are short-lived and RLS-filtered.

## Release blockers and residual risks

1. **No deployed integration/security verification:** PGlite tests use test Auth/Storage fixtures, not real Supabase JWT, Storage, PostgREST or Realtime behavior. No real provider account, call or recording test has run. Verify two-organization isolation using actual sessions, including all legacy tables, team relationships, invites, role revocation and service handlers.
2. **Voice is experimental:** no Twilio media protocol end-to-end smoke, playout acknowledgement, tested reconnect/recovery, latency SLO or language-accuracy measurement. Customer-facing AI may generate unsuitable language despite system prompts/phrase checks. Approval, product/jurisdiction review and adversarial testing are required.
3. **Consent/recording:** operator attestation is not a consent registry. Recording is intentionally disabled; recording authorization, jurisdiction, withdrawal and retention workflows remain to implement. Human handoff/opt-out pattern matching is limited and not a complete multilingual classifier.
4. **Provider ambiguity:** a crashed process between reservation and provider acknowledgement can leave a created/provider_unknown call without a SID. A provider-side reconciliation operation/manual runbook is required; no blind retries. Parent-leg state cannot prove prospect answer.
5. **Privacy lifecycle:** encryption at rest depends on verified hosting/Storage configuration. No tested retention/deletion worker, legal hold, full export/deletion flow, managed key rotation or formal PII-redaction policy exists. Live transcripts, event rows and queue transcripts are sensitive and need explicit retention.
6. **Authorization coverage:** team reads are deliberately conservative in service handlers; full manager team scope and the legacy membership/invitation mutation surface need integration testing. Platform-admin grants are not an exemption from explicit tenant checks. Provider number assignment needs platform-controlled provisioning.
7. **Operations:** no production secrets/monitoring account configured, no externally anchored audit log, no tested backup/restore or worker restart during provider calls. Process-local audio ownership is not a distributed durable real-time session store.
8. **CRM/business workflows:** FXBO integration, campaign automation, external appointment confirmation, reconciliation, CRM OAuth/webhooks, approval-gated tools and billing reconciliation are incomplete. UI blocks sample-only live features.
9. **Migration integrity:** existing cross-tenant child rows, duplicate provider IDs or duplicate enabled numbers must be reconciled before constraints apply; migration failure must not trigger automatic deletion. Historical concatenated SQL files omit new migrations.

See VERIFICATION.md for actual command outcomes. Dependency audit results are time-sensitive and do not imply absence of application vulnerabilities. No real customer data was used.

## Call erasure continuation

Service-only SQL and authenticated owner/admin server functions now support call erasure requests and legal holds. Expiring checksum-bound plans, organization/path checks, grace periods, exact object manifests and leased finalization protect physical cleanup. Unit tests use Storage doubles; PostgreSQL tests exercise actual migration functions. No real Storage deletion was attempted. See CALL_ERASURE.md for partial-failure semantics and remaining retention, export, external-copy and staging verification gaps.
