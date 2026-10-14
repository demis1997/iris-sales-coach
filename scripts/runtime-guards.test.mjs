import assert from "node:assert/strict";
import test from "node:test";
import { spawnSync } from "node:child_process";
// Disabled workers must exit before constructing clients or making paid requests.
for (const [script, expected] of [
  ["analysis-worker.ts", /ARTEMIS_ENABLE_PAID_AI/],
  ["voice-worker.ts", /enable|enabled/i],
  ["reconcile-calls.ts", /explicitly enabled/],
]) {
  test(`disabled ${script} exits before provider setup`, () => {
    const run = spawnSync(
      process.execPath,
      [
        "--experimental-strip-types",
        "--experimental-transform-types",
        "--import",
        "./scripts/register-ai-alias.mjs",
        `scripts/${script}`,
      ],
      {
        encoding: "utf8",
        timeout: 10000,
        env: {
          PATH: process.env.PATH,
          ARTEMIS_ENABLE_PAID_AI: "false",
          ARTEMIS_ENABLE_REAL_CALLS: "false",
          ARTEMIS_ENABLE_VOICE: "false",
        },
      },
    );
    assert.equal(run.error, undefined);
    assert.equal(run.status, 1);
    assert.match(run.stderr, expected);
    assert.doesNotMatch(run.stderr, /fetch failed|ECONNREFUSED/);
  });
}
