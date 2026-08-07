/**
 * Permission unit tests — run with: npm run test:unit
 * Uses Node strip-types; import path must include .ts for ESM resolution.
 */
import assert from "node:assert/strict";
import {
  authorize,
  AuthorizationError,
  can,
  permissionsForRole,
  roleHasPermission,
  workspacesForRole,
} from "./permissions.ts";

assert.ok(roleHasPermission("owner", "billing.manage"));
assert.ok(roleHasPermission("owner", "users.manage"));
assert.equal(roleHasPermission("rep", "billing.manage"), false);
assert.ok(roleHasPermission("rep", "calls.view_own"));
assert.equal(roleHasPermission("rep", "calls.view_all"), false);
assert.ok(roleHasPermission("manager", "coaching.assign"));
assert.ok(roleHasPermission("ceo", "analytics.company"));
assert.equal(roleHasPermission("ceo", "billing.manage"), false);
assert.ok(roleHasPermission("qa", "qa.manage"));
assert.equal(roleHasPermission("viewer", "users.manage"), false);

assert.ok(can({ role: "admin" }, "settings.manage"));
assert.equal(can({ role: null }, "settings.manage"), false);

assert.throws(
  () =>
    authorize(
      { userId: "u1", companyId: "c1", role: "rep", isMember: true },
      "billing.manage",
    ),
  AuthorizationError,
);

authorize(
  { userId: "u1", companyId: "c1", role: "owner", isMember: true },
  "billing.manage",
);

assert.deepEqual(workspacesForRole("rep"), ["app", "crm"]);
assert.ok(workspacesForRole("owner").includes("ceo"));
assert.ok(permissionsForRole("platform_admin").includes("platform.admin"));

console.log("permissions.test.ts: ok");
