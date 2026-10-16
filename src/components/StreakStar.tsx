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

export default function StreakStar({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={`drop-shadow-[0_2px_2px_rgba(120,80,0,0.25)] dark:drop-shadow-[0_2px_2px_rgba(0,0,0,0.35)] ${className}`}
    >
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
