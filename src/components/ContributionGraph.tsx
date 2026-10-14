"use client";

import Link from "next/link";
import { useState } from "react";
import { createPortal } from "react-dom";
import type { ContributionDay, ContributionWeek } from "@/lib/github";

interface ContributionGraphProps {
  totalContributions: number;
  weeks: ContributionWeek[];
  currentWeek: number;
  profileUrl: string;
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

function Calendar({
  weeks,
  label,
  onHover,
}: {
  weeks: ContributionWeek[];
  label: string;
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
            className="aspect-square rounded-[2px]"
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
      <p className="text-[13px] text-muted sm:text-[14px]">{summary}</p>

      <div className="mt-3 hidden sm:block">
        <Calendar weeks={weeks} label={summary} onHover={handleHover} />
      </div>
      <div className="mt-3 sm:hidden">
        <Calendar weeks={phoneWeeks} label={summary} onHover={handleHover} />
      </div>

      <div className="mt-2 flex items-center justify-between gap-4">
        <Link
          href={profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[13px] text-muted transition-colors hover:text-foreground sm:text-[14px]"
        >
          View profile &rarr;
        </Link>
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
