# Deployment checklist — do not deploy yet

- [ ] Complete every blocker in SECURITY.md and VERIFICATION.md, including approved real-provider smoke tests.
- [ ] Back up and test migrations on a dedicated Supabase staging project. Resolve legacy FK/unique violations without dropping customer records. Apply each migration exactly once; verify grants as authenticated and service_role users.
- [ ] Configure Supabase Auth URLs, HTTPS public origins, private Storage, Realtime publication/access and role revocation tests.
- [ ] Store server secrets in a managed secret store; only publishable Supabase configuration may use VITE_*. Keep paid features disabled until explicit operator approval.
- [ ] Deploy the existing web app to its supported TanStack/Lovable target. Do not silently change the hosting adapter or publish branch history.
- [ ] Deploy voice and analysis workers as supervised persistent Node 22.20 processes; install locked dependencies and mount no public secret files. Voice worker listens on loopback by default; a trusted TLS proxy must support long-lived WebSocket upgrades, bounded payloads and connection draining.
- [ ] Proxy `/media` to the voice worker; set its exact public WSS origin/path. Do not trust arbitrary forwarded Host headers. Restrict traffic and monitor per-connection resource limits. `/health` on the voice process indicates process/configuration only, not provider connectivity.
- [ ] Configure separate database/service credentials and provider budgets for staging/production. `/api/health` returns 503 on missing required configuration and never spends provider credits.
- [ ] Supervise analysis queue attempts, stale leases, dead letters, blocked CRM outbox, webhook failures and missing recordings. Set actionable alerts without logging transcripts/secrets.
- [ ] Verify graceful shutdown, network drops, provider outage/timeout, repeated callbacks and partial call creation. Add provider reconciliation for unknown outcomes.
- [ ] Implement retention/deletion and consent/recording policies before use with customer information. Obtain appropriate legal/compliance review for each deployment jurisdiction and forex activity.
- [ ] Finish documented FXBO adapter, per-organization credential mapping, dispatcher/reconciliation and externally confirmed CRM updates.
- [ ] Measure actual telephone latency and playout; define SLOs based on observed results. Test Russian voices/models rather than inferring multilingual support.
- [ ] CI must pass unpaid tests, build, typecheck, lint and dependency scan. It does not prove real-provider or production readiness.

No deployment, account creation, paid provider action, commit or push is performed by this implementation. User approval is required for each such external action.

Keep `ARTEMIS_ENABLE_ERASURE=false` during normal operation. Physical cleanup is a separately approved operator task; follow CALL_ERASURE.md and validate actual Storage behavior before enabling it.
