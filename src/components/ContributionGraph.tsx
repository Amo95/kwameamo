"use client";

import { useState } from "react";

interface ContributionDay {
  date: string;
  contributionCount: number;
  contributionLevel: "NONE" | "FIRST_QUARTILE" | "SECOND_QUARTILE" | "THIRD_QUARTILE" | "FOURTH_QUARTILE";
}

interface ContributionWeek {
  contributionDays: ContributionDay[];
}

interface ContributionGraphProps {
  totalContributions: number;
  weeks: ContributionWeek[];
}

function formatDate(dateString: string): string {
  const date = new Date(dateString + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ContributionGraph({
  totalContributions,
  weeks,
}: ContributionGraphProps) {
  const [tooltip, setTooltip] = useState<{
    text: string;
    x: number;
    y: number;
  } | null>(null);

  return (
    <div>
      <p className="text-[13px] text-muted sm:text-[14px]">
        {totalContributions.toLocaleString()} contributions in the last year
      </p>

      <div className="relative mt-3 overflow-x-auto" data-graph>
        <div
          className="grid gap-[3px]"
          style={{
            gridTemplateColumns: `repeat(${weeks.length}, 12px)`,
            gridTemplateRows: "repeat(7, 12px)",
          }}
        >
          {weeks.map((week, weekIndex) =>
            week.contributionDays.map((day, dayIndex) => (
              <div
                key={`${weekIndex}-${dayIndex}`}
                className="rounded-sm"
                style={{
                  gridColumn: weekIndex + 1,
                  gridRow: dayIndex + 1,
                  width: 12,
                  height: 12,
                  backgroundColor: `var(--color-contrib-${day.contributionLevel.toLowerCase()})`,
                }}
                onMouseEnter={(e) => {
                  const cell = e.currentTarget;
                  const container = cell.closest("[data-graph]") as HTMLElement;
                  if (!container) return;
                  const containerRect = container.getBoundingClientRect();
                  const cellRect = cell.getBoundingClientRect();
                  setTooltip({
                    text: `${day.contributionCount} contribution${day.contributionCount !== 1 ? "s" : ""} on ${formatDate(day.date)}`,
                    x: cellRect.left - containerRect.left + cellRect.width / 2,
                    y: cellRect.top - containerRect.top,
                  });
                }}
                onMouseLeave={() => setTooltip(null)}
              />
            ))
          )}
        </div>

        {tooltip && (
          <div
            className="absolute z-50 rounded-md bg-foreground px-2 py-1 text-[11px] text-background shadow-lg pointer-events-none whitespace-nowrap"
            style={{
              left: tooltip.x,
              top: tooltip.y - 32,
              transform: "translateX(-50%)",
            }}
          >
            {tooltip.text}
          </div>
        )}
      </div>
    </div>
  );
}
