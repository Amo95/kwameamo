"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import type { ContributionDay, ContributionWeek } from "@/lib/github";
import { milestones, starTier, type StarTier, type StreakStats } from "@/lib/streak";
import StreakStar, { tierStyle } from "@/components/StreakStar";

interface ContributionGraphProps {
  totalContributions: number;
  weeks: ContributionWeek[];
  currentWeek: number;
  profileUrl: string;
  stats: StreakStats;
  live: { name: string; ago: string } | null;
}

type Tooltip = { text: string; x: number; y: number };

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAY_LABELS = [[1, "Mon"], [3, "Wed"], [5, "Fri"]] as const;
const LEVELS = ["none", "first_quartile", "second_quartile", "third_quartile", "fourth_quartile"];
const PHONE_WEEKS = 26;

function formatDate(dateString: string): string {
  const date = new Date(dateString + "T00:00:00Z");
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function plural(n: number, unit: string): string {
  return `${n} ${unit}${n === 1 ? "" : "s"}`;
}

function weekday(dateString: string): number {
  return new Date(dateString + "T00:00:00Z").getUTCDay();
}

// One label per month, on the first week that starts in it. When two labels collide, a label
// on the first column (a month that is mostly cut off) gives way; otherwise the later one is skipped.
function monthLabels(weeks: ContributionWeek[]) {
  const labels: { column: number; label: string }[] = [];
  weeks.forEach((week, i) => {
    const month = Number(week.contributionDays[0]?.date.slice(5, 7)) - 1;
    const prevMonth = Number(weeks[i - 1]?.contributionDays[0]?.date.slice(5, 7)) - 1;
    if (month === prevMonth || i > weeks.length - 2) return;
    const last = labels.at(-1);
    if (last && i - last.column < 3) {
      if (last.column !== 0) return;
      labels.pop();
    }
    labels.push({ column: i, label: MONTHS[month] });
  });
  return labels;
}

function Stat({ value, caption, star }: { value: string; caption: string; star?: StarTier }) {
  return (
    <div>
      <p className="flex items-center gap-2 text-[24px] font-semibold leading-none tracking-tight text-foreground">
        {star && (
          <span data-streak-star className="h-[26px] w-[26px] shrink-0" style={tierStyle(star)}>
            <StreakStar className="block h-full w-full" />
          </span>
        )}
        {value}
      </p>
      <p className="mt-[5px] text-[12px] text-muted">{caption}</p>
    </div>
  );
}

function Calendar({
  weeks,
  label,
  runStart,
  onHover,
}: {
  weeks: ContributionWeek[];
  label: string;
  runStart: string | null;
  onHover: (day: ContributionDay | null, cell?: Element) => void;
}) {
  return (
    <div
      role="img"
      aria-label={label}
      className="grid gap-[2px] sm:gap-[3px]"
      style={{ gridTemplateColumns: `auto repeat(${weeks.length}, minmax(0, 1fr))` }}
    >
      {monthLabels(weeks).map(({ column, label }) => (
        <span
          key={column}
          className="whitespace-nowrap pb-1 text-[10px] leading-none text-muted"
          style={{ gridRow: 1, gridColumn: `${column + 2} / span 3` }}
        >
          {label}
        </span>
      ))}
      {DAY_LABELS.map(([day, label]) => (
        <span
          key={label}
          className="self-center pr-1.5 text-[10px] leading-none text-muted"
          style={{ gridColumn: 1, gridRow: day + 2 }}
        >
          {label}
        </span>
      ))}
      {weeks.map((week, i) =>
        week.contributionDays.map((day) => (
          <div
            key={day.date}
            className={`aspect-square rounded-[2px]${runStart !== null && day.date < runStart ? " opacity-45" : ""}`}
            style={{
              gridColumn: i + 2,
              gridRow: weekday(day.date) + 2,
              backgroundColor: `var(--color-contrib-${day.contributionLevel.toLowerCase()})`,
            }}
            onMouseEnter={(e) => onHover(day, e.currentTarget)}
            onMouseLeave={() => onHover(null)}
          />
        ))
      )}
    </div>
  );
}


/** Streak milestones earned by the best run this year; the next one shows how many days are left. */
function Milestones({ best }: { best: number }) {
  return (
    <ul aria-label="Streak milestones" className="mt-4 grid grid-cols-5 gap-2 max-sm:grid-cols-3">
      {milestones(best).map((m) => (
        <li
          key={m.days}
          className="rounded-2xl bg-panel px-1.5 pb-2.5 pt-3 text-center"
          aria-label={`${m.days} days: ${m.earned ? "earned" : m.next ? `${m.left} more days` : "locked"}`}
        >
          <span className={`mx-auto mb-1.5 block h-8 w-8${m.earned ? "" : " opacity-30 grayscale"}`} style={tierStyle(starTier(m.days))}>
            <StreakStar className="block h-full w-full" shadow={m.earned} />
          </span>
          <b className={`block text-[12.5px] font-semibold${m.earned ? " text-foreground" : " text-muted"}`}>{m.days} days</b>
          <small className="block text-[11px] text-muted">{m.earned ? m.label : m.next ? `${m.left} more` : "Locked"}</small>
          {m.next && (
            <span aria-hidden="true" className="mx-2.5 mt-1.5 block h-[5px] overflow-hidden rounded-full bg-foreground/[0.07]">
              <span className="block h-full rounded-full bg-[var(--contrib-run)]" style={{ width: `${Math.round(m.progress * 100)}%` }} />
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

// 3D: weeks run to the right and slightly down, days go back and to the left, and busier days stand taller.
const UX = 6.8, UY = 2.1, VX = -3.9, VY = 2.5, STEP = 4.6, GAP = 0.84;
const LEVEL = { NONE: 0, FIRST_QUARTILE: 1, SECOND_QUARTILE: 2, THIRD_QUARTILE: 3, FOURTH_QUARTILE: 4 } as const;
const pt = (x: number, y: number) => `${x.toFixed(1)},${y.toFixed(1)}`;

function Skyline({
  weeks,
  label,
  runStart,
  onHover,
}: {
  weeks: ContributionWeek[];
  label: string;
  runStart: string | null;
  onHover: (day: ContributionDay | null, cell?: Element) => void;
}) {
  const ox = 7 * -VX + 6, oy = 40;
  const width = ox + weeks.length * UX + 8, height = oy + weeks.length * UY + 7 * VY + 8;
  const days = weeks
    .flatMap((week, w) => week.contributionDays.map((day) => ({ day, w, d: weekday(day.date) })))
    .sort((a, b) => a.w * UY + a.d * VY - (b.w * UY + b.d * VY));
  return (
    <svg role="img" aria-label={label} viewBox={`0 0 ${width} ${height}`} className="group/sky block h-auto w-full" onMouseLeave={() => onHover(null)}>
      {days.map(({ day, w, d }) => {
        const level = LEVEL[day.contributionLevel];
        const h = level === 0 ? 1 : 2 + level * STEP + Math.min(day.contributionCount, 14) * 0.45;
        const x = ox + w * UX + d * VX, y = oy + w * UY + d * VY;
        const b = [x + UX * GAP, y + UY * GAP], c = [x + (UX + VX) * GAP, y + (UY + VY) * GAP], e = [x + VX * GAP, y + VY * GAP];
        // The current streak stands out in gold; the days before it are a little quieter.
        const inRun = runStart !== null && day.date >= runStart && day.contributionCount > 0;
        const colour = inRun ? "var(--contrib-run)" : `var(--color-contrib-${day.contributionLevel.toLowerCase()})`;
        const dim = runStart !== null && day.date < runStart;
        return (
          <g
            key={day.date}
            className={`transition-opacity duration-150 group-hover/sky:opacity-55 hover:!opacity-100${dim ? " opacity-75" : ""}`}
            onMouseEnter={(ev) => onHover(day, ev.currentTarget)}
          >
            <polygon points={`${pt(e[0], e[1] - h)} ${pt(c[0], c[1] - h)} ${pt(c[0], c[1])} ${pt(e[0], e[1])}`} style={{ fill: `color-mix(in srgb, ${colour} 74%, #000)` }} />
            <polygon points={`${pt(b[0], b[1] - h)} ${pt(c[0], c[1] - h)} ${pt(c[0], c[1])} ${pt(b[0], b[1])}`} style={{ fill: `color-mix(in srgb, ${colour} 60%, #000)` }} />
            <polygon points={`${pt(x, y - h)} ${pt(b[0], b[1] - h)} ${pt(c[0], c[1] - h)} ${pt(e[0], e[1] - h)}`} style={{ fill: colour }} />
          </g>
        );
      })}
    </svg>
  );
}

const VIEW_KEY = "contrib-view";
const viewListeners = new Set<() => void>();
function subscribeView(listener: () => void) {
  viewListeners.add(listener);
  return () => { viewListeners.delete(listener); };
}
function readView(): "3d" | "flat" {
  try { return localStorage.getItem(VIEW_KEY) === "flat" ? "flat" : "3d"; } catch { return "3d"; }
}

export default function ContributionGraph({
  totalContributions,
  weeks,
  currentWeek,
  profileUrl,
  stats,
  live,
}: ContributionGraphProps) {
  const [tooltip, setTooltip] = useState<Tooltip | null>(null);
  // 3D by default; a visitor's Flat choice is remembered in this browser.
  const view = useSyncExternalStore(subscribeView, readView, () => "3d" as const);
  const pick = (v: "3d" | "flat") => {
    setTooltip(null);
    try { localStorage.setItem(VIEW_KEY, v); } catch {}
    viewListeners.forEach((l) => l());
  };

  const year = weeks[0]?.contributionDays[0]?.date.slice(0, 4);
  const summary = `${totalContributions.toLocaleString("en-US")} contributions in ${year}`;
  // Phones show the 26 weeks up to now, so the cells stay readable.
  const phoneStart = Math.max(0, Math.min(currentWeek - PHONE_WEEKS + 1, weeks.length - PHONE_WEEKS));
  const phoneWeeks = weeks.slice(phoneStart, phoneStart + PHONE_WEEKS);

  const handleHover = (day: ContributionDay | null, cell?: Element) => {
    if (!day || !cell) return setTooltip(null);
    const rect = cell.getBoundingClientRect();
    setTooltip({
      text: `${day.contributionCount} contribution${day.contributionCount !== 1 ? "s" : ""} on ${formatDate(day.date)}`,
      x: rect.left + rect.width / 2 + window.scrollX,
      y: rect.top + window.scrollY,
    });
  };

  return (
    <div>
      <div className="flex flex-wrap items-end gap-x-7 gap-y-3">
        {stats.current >= 2 ? (
          <Stat
            star={starTier(stats.current)}
            value={plural(stats.current, "day")}
            caption={`coding streak · ${stats.current === stats.best ? "new best" : `best ${stats.best}`}`}
          />
        ) : stats.best >= 2 ? (
          <Stat value={plural(stats.best, "day")} caption="best streak this year" />
        ) : null}
        {stats.weeks >= 1 ? (
          <Stat value={plural(stats.weeks, "week")} caption="in a row" />
        ) : stats.activeDays > 0 ? (
          <Stat value={plural(stats.activeDays, "day")} caption="active this year" />
        ) : null}
      </div>

      {stats.best > 0 && <Milestones best={stats.best} />}

      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-[12px] text-muted">
          {view === "3d" && stats.runStart ? (
            <><span aria-hidden="true" className="mr-1.5 inline-block h-2.5 w-2.5 rounded-[2px] bg-[var(--contrib-run)] align-[-1px]" />The current run, in gold</>
          ) : null}
        </p>
        <div role="group" aria-label="Grid view" className="inline-flex rounded-full bg-panel p-[3px] shadow-[0_0_0_4px_color-mix(in_srgb,var(--color-panel)_55%,transparent)]">
          {(["3d", "flat"] as const).map((v) => (
            <button
              key={v}
              type="button"
              aria-pressed={view === v}
              onClick={() => pick(v)}
              className="h-[26px] rounded-full px-3 text-[12px] text-muted transition-colors aria-pressed:bg-background aria-pressed:font-medium aria-pressed:text-foreground aria-pressed:shadow-[0_1px_3px_rgba(0,0,0,0.14)]"
            >
              {v === "3d" ? "3D" : "Flat"}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-3 hidden sm:block">
        {view === "3d"
          ? <Skyline weeks={weeks} label={summary} runStart={stats.runStart} onHover={handleHover} />
          : <Calendar weeks={weeks} label={summary} runStart={stats.runStart} onHover={handleHover} />}
      </div>
      <div className="mt-3 sm:hidden">
        {view === "3d"
          ? <Skyline weeks={phoneWeeks} label={summary} runStart={stats.runStart} onHover={handleHover} />
          : <Calendar weeks={phoneWeeks} label={summary} runStart={stats.runStart} onHover={handleHover} />}
      </div>

      <div className="mt-2 flex justify-end">
        <div className="flex items-center gap-[3px] text-[11px] text-muted" aria-hidden="true">
          <span className="mr-1">Less</span>
          {LEVELS.map((level) => (
            <span
              key={level}
              className="h-[10px] w-[10px] rounded-[2px]"
              style={{ backgroundColor: `var(--color-contrib-${level})` }}
            />
          ))}
          <span className="ml-1">More</span>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-[13px] sm:text-[14px]">
        {live && (
          <p className="flex items-center gap-2">
            <span className="h-[7px] w-[7px] shrink-0 rounded-full bg-green-500 ring-[3px] ring-green-500/20" aria-hidden="true" />
            <span className="text-muted">Building</span>
            <span className="rounded-md bg-panel px-[7px] leading-snug text-foreground">{live.name}</span>
            <span className="text-muted">{live.ago}</span>
          </p>
        )}
        <Link
          href={profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto text-muted transition-colors hover:text-foreground"
        >
          View profile &rarr;
        </Link>
      </div>

      {tooltip && createPortal(
        <div
          className="pointer-events-none whitespace-nowrap rounded-md px-2 py-1 text-[11px] shadow-lg"
          style={{
            position: "absolute",
            left: tooltip.x,
            top: tooltip.y - 32,
            transform: "translateX(-50%)",
            zIndex: 9999,
            backgroundColor: "var(--color-foreground)",
            color: "var(--color-background)",
          }}
        >
          {tooltip.text}
        </div>,
        document.body
      )}
    </div>
  );
}
