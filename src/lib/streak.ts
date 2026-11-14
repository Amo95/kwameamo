import type { ContributionWeek } from "@/lib/github";

export interface StreakStats {
  current: number;
  best: number;
  weeks: number;
  activeDays: number;
  runStart: string | null;
}

export function streakStats(weeks: ContributionWeek[], today: string): StreakStats {
  const past = weeks
    .map((w) => w.contributionDays.filter((d) => d.date <= today))
    .filter((days) => days.length > 0);
  const days = past.flat();

  let best = 0;
  let run = 0;
  for (const d of days) {
    run = d.contributionCount > 0 ? run + 1 : 0;
    best = Math.max(best, run);
  }

  // Count back from today, or from yesterday when today has no contributions yet.
  let end = days.length - 1;
  if (end >= 0 && days[end].date === today && days[end].contributionCount === 0) end--;
  let current = 0;
  while (end - current >= 0 && days[end - current].contributionCount > 0) current++;

  let weekEnd = past.length - 1;
  if (weekEnd >= 0 && !past[weekEnd].some((d) => d.contributionCount > 0)) weekEnd--;
  let streakWeeks = 0;
  while (weekEnd - streakWeeks >= 0 && past[weekEnd - streakWeeks].some((d) => d.contributionCount > 0)) {
    streakWeeks++;
  }

  return {
    current,
    best,
    weeks: streakWeeks,
    activeDays: days.filter((d) => d.contributionCount > 0).length,
    runStart: current >= 2 ? days[end - current + 1].date : null,
  };
}

export function showsStreakIntro(stats: StreakStats): boolean {
  return stats.current >= 2;
}

export type StarTier = "bronze" | "silver" | "gold";

/** The streak star's colour: bronze under a week, silver under a month, gold from 30 days. */
export function starTier(days: number): StarTier {
  return days < 7 ? "bronze" : days < 30 ? "silver" : "gold";
}

const MILESTONES = [
  { days: 3, label: "Warm up" },
  { days: 7, label: "One week" },
  { days: 30, label: "One month" },
  { days: 100, label: "Hundred" },
  { days: 365, label: "Full year" },
];

export interface Milestone {
  days: number;
  label: string;
  earned: boolean;
  /** The first one not earned yet, with how far along the best run is. */
  next: boolean;
  left: number;
  progress: number;
}

/** Streak milestones, earned by the best run this year. */
export function milestones(best: number): Milestone[] {
  const nextDays = MILESTONES.find((m) => best < m.days)?.days;
  return MILESTONES.map((m) => ({
    ...m,
    earned: best >= m.days,
    next: m.days === nextDays,
    left: Math.max(m.days - best, 0),
    progress: Math.min(best / m.days, 1),
  }));
}
