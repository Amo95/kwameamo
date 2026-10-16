"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import StreakStar from "@/components/StreakStar";

const SEEN_KEY = "streak-intro-seen";
const EXIT_MS = 800;
const FLY_MS = 750;
const KEYS = ["Enter", " ", "Escape"];

// Darker faces stacked behind the top face give the star thickness while it turns.
const SIDE = {
  "--star-1": "#a16207",
  "--star-2": "#a16207",
  "--star-3": "#854d0e",
  "--star-4": "#854d0e",
  "--star-5": "#713f12",
  "--star-edge": "#713f12",
} as CSSProperties;
const DEPTHS = [7, 6, 5, 4, 3, 2, 1].map((k) => -k * 1.6);

const SPARKS = Array.from({ length: 10 }, (_, i) => {
  const angle = (i / 10) * Math.PI * 2;
  const distance = 120 + (i % 3) * 20;
  return {
    "--dx": `${+(Math.cos(angle) * distance).toFixed(1)}px`,
    "--dy": `${+(Math.sin(angle) * distance).toFixed(1)}px`,
    animationDelay: `${3 + (i % 4) * 0.04}s`,
  } as CSSProperties;
});

function fullyVisible(rect: DOMRect): boolean {
  return rect.width > 0 && rect.top >= 0 && rect.left >= 0 && rect.bottom <= innerHeight && rect.right <= innerWidth;
}

export default function StreakIntro({ days, isBest }: { days: number; isBest: boolean }) {
  const [phase, setPhase] = useState<"open" | "closing" | "done">("open");
  const dialogRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const spinnerRef = useRef<HTMLDivElement>(null);
  const faceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    const root = document.documentElement;
    // Already seen in this tab: the head script or an earlier visit set the class, so CSS hides it.
    if (!dialog || (root.classList.contains("intro-seen") && !dialog.hasAttribute("data-open"))) return;
    dialog.setAttribute("data-open", "");
    root.classList.add("intro-seen");
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {}

    const overflow = root.style.overflow;
    root.style.overflow = "hidden";
    dialog.focus({ preventScroll: true });
    let leaving = false;

    const leave = () => {
      if (leaving) return;
      leaving = true;
      root.style.overflow = overflow;
      setPhase("closing");

      const home = document.querySelector<HTMLElement>("[data-streak-star]");
      const to = home?.getBoundingClientRect();
      const svg = faceRef.current?.firstElementChild;
      const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
      let flyer: HTMLDivElement | null = null;
      if (home && to && svg && stageRef.current && !reduce && fullyVisible(to)) {
        const from = stageRef.current.getBoundingClientRect();
        flyer = document.createElement("div");
        flyer.style.cssText = "position:fixed;z-index:70;pointer-events:none";
        flyer.append(svg.cloneNode(true));
        document.body.append(flyer);
        spinnerRef.current?.style.setProperty("visibility", "hidden");
        home.style.visibility = "hidden";
        const box = (r: DOMRect) => ({ left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px` });
        flyer.animate(
          [
            { ...box(from), transform: "rotate(0deg)" },
            { ...box(to), transform: "rotate(360deg)" },
          ],
          { duration: FLY_MS, easing: "cubic-bezier(.65,0,.25,1)", fill: "forwards" }
        );
      }
      setTimeout(() => {
        if (home) home.style.visibility = "";
        flyer?.remove();
        setPhase("done");
      }, EXIT_MS);
    };

    const onKey = (e: KeyboardEvent) => {
      if (KEYS.includes(e.key)) {
        e.preventDefault();
        leave();
      } else if (e.key === "Tab" && !leaving) {
        e.preventDefault();
      }
    };
    dialog.addEventListener("click", leave);
    document.addEventListener("keydown", onKey);
    return () => {
      dialog.removeEventListener("click", leave);
      document.removeEventListener("keydown", onKey);
      if (!leaving) root.style.overflow = overflow;
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${days}-day coding streak`}
      tabIndex={-1}
      className={`streak-intro fixed inset-0 z-[60] grid cursor-pointer place-items-center px-4 outline-none backdrop-blur-[6px] transition-opacity duration-500 ease-in-out${
        phase === "closing" ? " pointer-events-none opacity-0" : ""
      }`}
    >
      <div className="flex flex-col items-center gap-[22px] text-center">
        <div
          ref={stageRef}
          aria-hidden="true"
          className="relative h-[140px] w-[140px] perspective-[900px] sm:h-[180px] sm:w-[180px]"
        >
          <div className="pointer-events-none absolute -inset-[40%] rounded-full bg-[radial-gradient(circle,rgba(250,204,21,.35),rgba(250,204,21,0)_60%)] animate-[streak-fade_.8s_ease_2.4s_both]" />
          <div
            ref={spinnerRef}
            className="relative h-full w-full transform-3d animate-[streak-spin_1.8s_cubic-bezier(.2,.75,.25,1)_both] motion-reduce:animate-none motion-reduce:[transform:rotateX(10deg)]"
          >
            {DEPTHS.map((z) => (
              <div key={z} className="absolute inset-0" style={{ ...SIDE, transform: `translateZ(${z}px)` }}>
                <StreakStar className="block h-full w-full" />
              </div>
            ))}
            <div ref={faceRef} className="absolute inset-0 [transform:translateZ(0)]">
              <StreakStar className="block h-full w-full" />
            </div>
          </div>
          {SPARKS.map((style, i) => (
            <span
              key={i}
              className="absolute left-1/2 top-1/2 -m-[3px] h-[6px] w-[6px] rounded-full bg-[var(--star-2)] opacity-0 animate-[streak-spark_.9s_ease-out_both] motion-reduce:hidden"
              style={style}
            />
          ))}
        </div>
        <p className="text-[44px] font-[650] leading-tight tracking-[-0.03em] text-foreground animate-[streak-rise_.5s_ease_.7s_both]">
          {`${days}-day streak`}
        </p>
        <p className="-mt-3 text-[15px] text-muted animate-[streak-fade_.5s_ease_.9s_both]">
          {isBest ? "Coding every day. My longest run this year." : "Coding every day."}
        </p>
        <p className="text-[13px] text-muted/70 animate-[streak-fade_.6s_ease_1.8s_both]">
          <span className="[@media(hover:none)]:hidden">Click anywhere to enter</span>
          <span className="hidden [@media(hover:none)]:inline">Tap anywhere to enter</span>
        </p>
      </div>
    </div>
  );
}
