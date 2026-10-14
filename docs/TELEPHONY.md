# Telephone implementation

Use [the current real-call setup guide](engineering/REAL_CALL_SETUP.md). Outbound click-to-call is implemented with request reservation, role/consent/suppression checks and mandatory signed callbacks, but has not been tested against an actual provider account. Persistent audio runs in `scripts/voice-worker.ts`, separately from the web deployment. New recording is disabled pending a reviewed consent workflow. Parent-leg status is distinct from prospect answer state. Do not describe this as a verified live calling system until the documented smoke test passes.
