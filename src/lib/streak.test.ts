import { test } from "node:test";
import assert from "node:assert/strict";
import type { ContributionWeek } from "@/lib/github";
import { streakStats } from "./streak.ts";

const DAY = 86400000;

function addDays(date: string, n: number): string {
  return new Date(Date.parse(date) + n * DAY).toISOString().slice(0, 10);
}

function dayCount(from: string, to: string): number {
  return (Date.parse(to) - Date.parse(from)) / DAY + 1;
}

function ones(n: number): number[] {
  return Array(n).fill(1);
}

function zeros(n: number): number[] {
  return Array(n).fill(0);
}

// GitHub-shaped weeks: the first week is partial, a new week starts each Sunday.
function calendar(from: string, counts: number[], padTo?: string): ContributionWeek[] {
  const total = padTo ? Math.max(counts.length, dayCount(from, padTo)) : counts.length;
  const weeks: ContributionWeek[] = [];
  for (let i = 0; i < total; i++) {
    const date = addDays(from, i);
    const count = counts[i] ?? 0;
    if (!weeks.length || new Date(date).getUTCDay() === 0) weeks.push({ contributionDays: [] });
    weeks[weeks.length - 1].contributionDays.push({
      date,
      contributionCount: count,
      contributionLevel: count > 0 ? "FIRST_QUARTILE" : "NONE",
    });
  }
  return weeks;
}

const TODAY = "2026-10-15";

test("run into today", () => {
  const stats = streakStats(calendar("2026-10-01", [...zeros(10), ...ones(5)]), TODAY);
  assert.equal(stats.current, 5);
  assert.equal(stats.runStart, "2026-10-11");
});

test("today empty", () => {
  const stats = streakStats(calendar("2026-10-01", [...zeros(11), ...ones(3), 0]), TODAY);
  assert.equal(stats.current, 3);
  assert.equal(stats.runStart, "2026-10-12");
});

test("capped at Jan 1", () => {
  const stats = streakStats(calendar("2026-01-01", ones(dayCount("2026-01-01", TODAY))), TODAY);
  assert.equal(stats.current, 288);
  assert.equal(stats.best, 288);
  assert.equal(stats.runStart, "2026-01-01");
});

test("no streak", () => {
  const stats = streakStats(calendar("2026-10-01", [...ones(13), 0, 0]), TODAY);
  assert.equal(stats.current, 0);
  assert.equal(stats.runStart, null);
});

test("single day", () => {
  const stats = streakStats(calendar("2026-10-01", [...ones(5), ...zeros(9), 1]), TODAY);
  assert.equal(stats.current, 1);
  assert.equal(stats.runStart, null);
});

test("best from earlier", () => {
  // March 1 to Oct 15: 10-day run in March, a gap, then 4 days ending today
  const len = dayCount("2026-03-01", TODAY);
  const stats = streakStats(calendar("2026-03-01", [...ones(10), ...zeros(len - 14), ...ones(4)]), TODAY);
  assert.equal(stats.best, 10);
  assert.equal(stats.current, 4);
});

test("future padding ignored", () => {
  const counts = [...zeros(10), ...ones(5)];
  const plain = streakStats(calendar("2026-10-01", counts), TODAY);
  const padded = streakStats(calendar("2026-10-01", counts, "2026-12-31"), TODAY);
  assert.equal(padded.current, plain.current);
  assert.equal(padded.best, plain.best);
  assert.equal(padded.activeDays, plain.activeDays);
});

test("weeks, current week empty so far", () => {
  // Sun 2026-10-18 is today with 0; one active day in each of the 3 weeks before
  const counts = zeros(28);
  counts[1] = 1; // Mon 09-28 (week of 09-27)
  counts[9] = 1; // Tue 10-06 (week of 10-04)
  counts[17] = 1; // Wed 10-14 (week of 10-11)
  const stats = streakStats(calendar("2026-09-27", counts), "2026-10-18");
  assert.equal(stats.weeks, 3);
});

test("weeks broken", () => {
  const counts = [...ones(7), ...zeros(14)]; // active week of 09-27, then two empty weeks
  const stats = streakStats(calendar("2026-09-27", counts), "2026-10-15");
  assert.equal(stats.weeks, 0);
});

test("activeDays", () => {
  const counts = [1, 0, 3, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
  const stats = streakStats(calendar("2026-10-01", [...counts, 5, 5], "2026-10-31"), TODAY);
  assert.equal(stats.activeDays, 4);
});

test("quiet Jan 1: everything zero", () => {
  const stats = streakStats(calendar("2027-01-01", [0]), "2027-01-01");
  assert.equal(stats.current, 0);
  assert.equal(stats.best, 0);
  assert.equal(stats.weeks, 0);
  assert.equal(stats.activeDays, 0);
  assert.equal(stats.runStart, null);
});

test("stale data: last data day is not today, so no skip", () => {
  // Data ends 10-14 with 0; earlier days active; today is 10-15
  const counts = [...ones(5), 0];
  const stats = streakStats(calendar("2026-10-09", counts), "2026-10-15");
  assert.equal(stats.current, 0);
});
