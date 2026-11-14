import type { CSSProperties } from "react";
import type { StarTier } from "@/lib/streak";

const CX = 12;
const CY = 12.6;

// Alternating outer and inner points of a five-pointed star, starting at the top.
const POINTS = Array.from({ length: 10 }, (_, i) => {
  const angle = -Math.PI / 2 + (i * Math.PI) / 5;
  const radius = i % 2 ? 5.2 : 11.5;
  return `${+(CX + radius * Math.cos(angle)).toFixed(2)},${+(CY + radius * Math.sin(angle)).toFixed(2)}`;
});

// Light from the upper left: faces turned away from it are darker, and one half of each point
// is a step darker again for the bevel. Values index --star-1 (lightest) to --star-5.
const SHADES = [0, 1, 2, 3, 3, 2, 1, 0, 0, 0].map((turn, face) => turn + (face % 2) + 1);

const SHADOW = "drop-shadow-[0_2px_2px_rgba(120,80,0,0.25)] dark:drop-shadow-[0_2px_2px_rgba(0,0,0,0.35)]";

export default function StreakStar({ className = "", shadow = true }: { className?: string; shadow?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={shadow ? `${SHADOW} ${className}` : className}>
      {POINTS.map((point, face) => (
        <polygon
          key={face}
          points={`${CX},${CY} ${point} ${POINTS[(face + 1) % POINTS.length]}`}
          style={{ fill: `var(--star-${SHADES[face]})` }}
        />
      ))}
      <polygon
        points={POINTS.join(" ")}
        fill="none"
        strokeWidth={0.6}
        strokeLinejoin="round"
        style={{ stroke: "var(--star-edge)" }}
      />
    </svg>
  );
}

// Bronze and silver faces, lightest to darkest, plus the edge; gold is the theme's own --star-* colours.
const TIERS: Record<Exclude<StarTier, "gold">, string[]> = {
  bronze: ["#f2c79b", "#e0a96d", "#c98a4b", "#a86b33", "#8a5426", "#6e421d"],
  silver: ["#f8fafc", "#e2e8f0", "#cbd5e1", "#94a3b8", "#64748b", "#475569"],
};

/** CSS variables that colour a StreakStar for a tier (nothing for gold). `side` gives the darker faces behind it. */
export function tierStyle(tier: StarTier, side = false): CSSProperties {
  if (tier === "gold") return {};
  const c = TIERS[tier];
  const shade = side ? [c[4], c[4], c[5], c[5], c[5], c[5]] : c;
  return {
    "--star-1": shade[0], "--star-2": shade[1], "--star-3": shade[2], "--star-4": shade[3], "--star-5": shade[4], "--star-edge": shade[5],
  } as CSSProperties;
}
