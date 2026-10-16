export const OWNER_LOGIN = "Amo95";

export const PROJECTS: Record<string, string> = {
  "showup-co/showup": "ShowUp",
  "amo95/supawake": "SupaWake",
  "invoica-app/invoica": "Invoica",
  "infusi-gh/oncall": "Oncall",
};

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export function displayName(repo: string): string | null {
  return PROJECTS[repo.toLowerCase()] ?? null;
}

function plural(n: number, unit: string): string {
  return `${n} ${unit}${n === 1 ? "" : "s"} ago`;
}

export function timeAgo(pushedAt: Date, now: Date): string {
  const diff = now.getTime() - pushedAt.getTime();
  if (diff < MINUTE) return "just now";
  if (diff < HOUR) return plural(Math.floor(diff / MINUTE), "minute");
  if (diff < DAY) return plural(Math.floor(diff / HOUR), "hour");
  if (diff < 2 * DAY) return "yesterday";
  return plural(Math.floor(diff / DAY), "day");
}

export function isRecent(pushedAt: Date, now: Date): boolean {
  return now.getTime() - pushedAt.getTime() <= 7 * DAY;
}
