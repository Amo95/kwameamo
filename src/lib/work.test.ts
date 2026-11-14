import { test } from "node:test";
import assert from "node:assert/strict";
import { years } from "./work.ts";

test("years: just the years, now for a current role, one year once", () => {
  assert.equal(years("Dec 2025 - Oct 2026"), "2025 - 2026");
  assert.equal(years("Feb 2021 - Dec 2025"), "2021 - 2025");
  assert.equal(years("2025 - Present"), "2025 - now");
  assert.equal(years("Jan 2025 - Jul 2025"), "2025");
});
