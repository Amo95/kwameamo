import { test } from "node:test";
import assert from "node:assert/strict";
import { displayName, isRecent, timeAgo } from "./activity.ts";

const NOW = new Date("2026-10-15T12:00:00Z");
const MIN = 60000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

function ago(ms: number): Date {
  return new Date(NOW.getTime() - ms);
}

test("displayName maps approved repos case-insensitively", () => {
  assert.equal(displayName("ShowUp-Co/ShowUp"), "ShowUp");
  assert.equal(displayName("amo95/supawake"), "SupaWake");
  assert.equal(displayName("invoica-app/invoica"), "Invoica");
  assert.equal(displayName("infusi-gh/oncall"), "Oncall");
});

test("displayName returns null for unapproved repos", () => {
  assert.equal(displayName("amo95/kwameamo"), null);
});

test("timeAgo wording", () => {
  assert.equal(timeAgo(ago(30000), NOW), "just now");
  assert.equal(timeAgo(ago(MIN), NOW), "1 minute ago");
  assert.equal(timeAgo(ago(12 * MIN), NOW), "12 minutes ago");
  assert.equal(timeAgo(ago(HOUR), NOW), "1 hour ago");
  assert.equal(timeAgo(ago(2 * HOUR), NOW), "2 hours ago");
  assert.equal(timeAgo(ago(23 * HOUR), NOW), "23 hours ago");
  assert.equal(timeAgo(ago(30 * HOUR), NOW), "yesterday");
  assert.equal(timeAgo(ago(3 * DAY), NOW), "3 days ago");
});

test("clock skew counts as just now and recent", () => {
  const future = new Date(NOW.getTime() + 5000);
  assert.equal(timeAgo(future, NOW), "just now");
  assert.equal(isRecent(future, NOW), true);
});

test("isRecent is true within 7 days", () => {
  assert.equal(isRecent(ago(6 * DAY + 23 * HOUR), NOW), true);
  assert.equal(isRecent(ago(7 * DAY + MIN), NOW), false);
});
