# Call erasure and legal holds

This implementation is local and has not been run against deployed Supabase Storage. Physical deletion is disabled by default. It is an operator workflow, not automatic age-based retention or a complete person-wide deletion service.

## Request and hold

Authenticated `requestCallErasure` and `setCallLegalHold` server functions resolve the current organization and require an active owner/admin. The SQL functions are service-role only and independently check the actor's membership. Requests require a case/reference of 8–128 characters. Use a non-sensitive case identifier.

Requests reject held calls, active calls, active voice sessions and running analysis. They hide the call and cancel queued analysis. Requesting again returns the same task. Browser clients cannot directly change legal holds. A hold blocks planning and claiming; after a worker claims deletion, hold changes are rejected because object deletion may already have begun.

The existing retention policy's `soft_delete_grace_days` controls the delay (default 30 days, minimum one). Recording/transcript age policies are not automatically executed. Administrative request/hold UI is not yet provided; these server functions are the application integration boundary.

## Reviewable operator execution

Apply migrations to an approved staging environment first. Supply server-side Supabase configuration as described in LOCAL_DEVELOPMENT.md. Planning queries records but does not remove objects:

```sh
mkdir -p .local
npm run privacy:erasure -- plan --company ORGANIZATION_UUID --out .local/erasure-plan.json
```

The file is created exclusively with owner-only permissions, expires after 15 minutes, and lists exact recording IDs and paths for at most 50 calls. Treat it as private data. Review its organization, calls and recording manifest. The printed SHA-256 binds the apply command to that exact parsed plan; it is an approval checksum, not an authentication credential.

Only after explicit authorization for those deletions:

```sh
ARTEMIS_ENABLE_ERASURE=true npm run privacy:erasure -- apply --plan .local/erasure-plan.json --approved-sha256 REVIEWED_SHA256
```

Do not use these commands on real data as part of unattended testing. This development session has executed neither command against a configured service.

The worker rejects expired/tampered plans, duplicate paths, traversal, or paths outside the exact organization/call folder. SQL rechecks eligibility and recording manifest before issuing a five-minute lease. Storage removal happens in batches of 100, followed by a lease-fenced database transaction. A failed storage operation does not finalize database deletion. Retry handles already absent objects; verify that behavior against the staging Storage version before production use.

The final transaction deletes the call and its dependent transcript, analysis, events, recordings metadata, voice sessions and outbox. Legacy suggestions are removed, direct skill evidence is redacted, and matching audit resource metadata is redacted. A restricted organization-scoped receipt retains the call UUID, case reference, count and completion time.

## Limits and required staging tests

Storage and PostgreSQL do not share a transaction: partial storage deletion can occur before a failure. The call stays hidden and retryable. Lease loss or changed metadata prevents database finalization; investigate repeated failures rather than bypassing fences. Storage objects outside registered metadata, external CRM/provider copies, exports, backups, derived aggregates without a direct call reference and person-wide records are outside this workflow. Receipts and private plan files need their own reviewed retention schedule.

Before release, validate actual Storage deletion/missing-object retries, request authorization through deployed sessions, two-organization isolation, legal holds, concurrent workers, worker termination mid-batch and database recovery. Recording-consent capture, automatic retention/export workflows and provider-side deletion remain release blockers.
