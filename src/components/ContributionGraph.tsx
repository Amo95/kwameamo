"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div>
      <p className="text-[13px] text-muted sm:text-[14px]">
        {totalContributions.toLocaleString()} contributions in the last year
      </p>

      <div className="mt-3 overflow-x-auto">
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
                  const rect = e.currentTarget.getBoundingClientRect();
                  setTooltip({
                    text: `${day.contributionCount} contribution${day.contributionCount !== 1 ? "s" : ""} on ${formatDate(day.date)}`,
                    x: rect.left + rect.width / 2 + window.scrollX,
                    y: rect.top + window.scrollY,
                  });
                }}
                onMouseLeave={() => setTooltip(null)}
              />
            ))
          )}
        </div>
      </div>

      {mounted && tooltip && createPortal(
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
