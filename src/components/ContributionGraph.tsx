"use client";

import Link from "next/link";
import { useState } from "react";
import { createPortal } from "react-dom";
import type { ContributionDay, ContributionWeek } from "@/lib/github";
import type { StreakStats } from "@/lib/streak";
import StreakStar from "@/components/StreakStar";

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

function Stat({ value, caption, star = false }: { value: string; caption: string; star?: boolean }) {
  return (
    <div>
      <p className="flex items-center gap-2 text-[24px] font-semibold leading-none tracking-tight text-foreground">
        {star && <StreakStar className="h-[26px] w-[26px] shrink-0" />}
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
  onHover: (day: ContributionDay | null, cell?: HTMLElement) => void;
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

export default function ContributionGraph({
  totalContributions,
  weeks,
  currentWeek,
  profileUrl,
  stats,
  live,
}: ContributionGraphProps) {
  const [tooltip, setTooltip] = useState<Tooltip | null>(null);

  const year = weeks[0]?.contributionDays[0]?.date.slice(0, 4);
  const summary = `${totalContributions.toLocaleString("en-US")} contributions in ${year}`;
  // Phones show the 26 weeks up to now, so the cells stay readable.
  const phoneStart = Math.max(0, Math.min(currentWeek - PHONE_WEEKS + 1, weeks.length - PHONE_WEEKS));
  const phoneWeeks = weeks.slice(phoneStart, phoneStart + PHONE_WEEKS);

  const handleHover = (day: ContributionDay | null, cell?: HTMLElement) => {
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
            star
            value={plural(stats.current, "day")}
            caption={`coding streak · ${stats.current === stats.best ? "your best" : `best ${stats.best}`}`}
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

      <div className="mt-4 hidden sm:block">
        <Calendar weeks={weeks} label={summary} runStart={stats.runStart} onHover={handleHover} />
      </div>
      <div className="mt-4 sm:hidden">
        <Calendar weeks={phoneWeeks} label={summary} runStart={stats.runStart} onHover={handleHover} />
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
            <span className="rounded-md border border-border px-[7px] leading-snug text-foreground">{live.name}</span>
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
