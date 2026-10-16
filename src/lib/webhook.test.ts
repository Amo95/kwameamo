import { test } from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { approvedPush, verifySignature } from "./webhook.ts";

const SECRET = "test-secret";
const BODY = '{ "a" :1 }';

function sign(body: string, secret: string): string {
  return "sha256=" + createHmac("sha256", secret).update(body).digest("hex");
}

test("verifySignature accepts a valid signature over the exact raw body", () => {
  assert.equal(verifySignature(BODY, sign(BODY, SECRET), SECRET), true);
});

test("verifySignature rejects wrong secret, missing, unprefixed or short headers", () => {
  assert.equal(verifySignature(BODY, sign(BODY, "other"), SECRET), false);
  assert.equal(verifySignature(BODY, null, SECRET), false);
  const hex = sign(BODY, SECRET).slice("sha256=".length);
  assert.equal(verifySignature(BODY, hex, SECRET), false);
  assert.equal(verifySignature(BODY, "sha256=abc", SECRET), false);
});

function push(overrides: Record<string, unknown> = {}) {
  return {
    repository: { full_name: "showup-co/showup" },
    sender: { login: "Amo95" },
    deleted: false,
    ...overrides,
  };
}

test("approvedPush returns the lowercase repo for the owner on an approved repo", () => {
  assert.equal(approvedPush("push", push()), "showup-co/showup");
  assert.equal(
    approvedPush("push", push({ repository: { full_name: "ShowUp-Co/ShowUp" } })),
    "showup-co/showup",
  );
});

test("approvedPush compares the owner case-insensitively", () => {
  assert.equal(approvedPush("push", push({ sender: { login: "amo95" } })), "showup-co/showup");
});

test("approvedPush ignores other senders", () => {
  assert.equal(approvedPush("push", push({ sender: { login: "teammate" } })), null);
  assert.equal(approvedPush("push", push({ sender: { login: "dependabot[bot]" } })), null);
});

test("approvedPush ignores unapproved repos and branch deletions", () => {
  assert.equal(approvedPush("push", push({ repository: { full_name: "Amo95/kwameamo" } })), null);
  assert.equal(approvedPush("push", push({ deleted: true })), null);
});

test("approvedPush ignores other events", () => {
  assert.equal(approvedPush("ping", push()), null);
  assert.equal(approvedPush("issues", push()), null);
  assert.equal(approvedPush(null, push()), null);
});

test("approvedPush tolerates malformed payloads", () => {
  assert.equal(approvedPush("push", {}), null);
  assert.equal(approvedPush("push", null), null);
  assert.equal(approvedPush("push", "text"), null);
  assert.equal(approvedPush("push", push({ repository: { full_name: 5 } })), null);
  assert.equal(approvedPush("push", push({ sender: "Amo95" })), null);
});
