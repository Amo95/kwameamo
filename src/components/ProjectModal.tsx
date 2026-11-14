"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Project } from "@/lib/projects";

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * A project's details: a big picture, what it is, what it does and what it's built with. The middle scrolls; the
 * buttons stay at the foot. A bottom sheet on phones. Escape, the close button or a click outside closes it, and focus
 * goes back to the name that opened it.
 */
export default function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const dialog = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const root = document.documentElement;
    const overflow = root.style.overflow;
    root.style.overflow = "hidden";
    const frame = requestAnimationFrame(() => setShown(true));
    dialog.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return onClose();
      if (e.key !== "Tab" || !dialog.current) return;
      // Keep Tab inside the dialog.
      const items = [...dialog.current.querySelectorAll<HTMLElement>(FOCUSABLE)];
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKey);
      root.style.overflow = overflow;
      opener?.focus({ preventScroll: true });
    };
  }, [onClose]);

  return createPortal(
    <div
      className={`fixed inset-0 z-[90] grid place-items-center bg-black/35 p-4 backdrop-blur-[3px] transition-opacity duration-200 max-sm:place-items-end max-sm:p-0 dark:bg-black/60 ${shown ? "opacity-100" : "opacity-0"}`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        ref={dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-title"
        className={`flex max-h-[min(86vh,760px)] w-full max-w-[560px] flex-col overflow-hidden rounded-3xl bg-background shadow-[0_18px_50px_-18px_rgba(0,0,0,0.35)] transition-transform duration-300 ease-[cubic-bezier(.23,1,.32,1)] motion-reduce:transition-none max-sm:max-h-[88vh] max-sm:max-w-none max-sm:rounded-b-none ${shown ? "translate-y-0 scale-100" : "translate-y-2.5 scale-[.98] max-sm:translate-y-10 max-sm:scale-100"}`}
      >
        <div className="overflow-y-auto overscroll-contain">
          <div className="relative">
            {project.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={project.image} alt="" className="block aspect-video w-full object-cover object-top" />
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-black/45 text-[18px] text-white transition-colors hover:bg-black/60"
            >
              ×
            </button>
            {project.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={project.image}
                alt=""
                className="absolute -bottom-[30px] left-[22px] h-16 w-16 rounded-full object-cover shadow-[0_0_0_4px_var(--color-background)]"
              />
            )}
          </div>
          <div className="px-[22px] pb-3 pt-[42px]">
            <h2 id="project-title" className="text-[22px] font-semibold tracking-tight text-foreground">{project.title}</h2>
            {project.kind && <p className="mt-0.5 text-[13px] text-muted">{project.kind}</p>}
            <p className="mt-3.5 text-[14.5px] leading-relaxed text-muted">{project.description}</p>
            {project.features && project.features.length > 0 && (
              <>
                <h3 className="mb-2 mt-5 font-mono text-[11.5px] font-medium uppercase tracking-[0.08em] text-muted">What it does</h3>
                <ul className="list-disc pl-[18px] text-[14px] leading-7 text-foreground">
                  {project.features.map((f) => <li key={f}>{f}</li>)}
                </ul>
              </>
            )}
            <h3 className="mb-2 mt-5 font-mono text-[11.5px] font-medium uppercase tracking-[0.08em] text-muted">Built with</h3>
            <div className="flex flex-wrap gap-1.5">
              {project.tech.map((t) => (
                <span key={t} className="rounded-full bg-panel px-2.5 py-[3px] text-[12px] text-muted">{t}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2.5 px-[22px] py-3.5 pb-[max(14px,env(safe-area-inset-bottom))]">
          <span className="mr-auto text-[12px] text-muted max-sm:hidden">
            {project.link ? "Scroll for more, or open it." : "Private for now."}
          </span>
          <button
            type="button"
            onClick={onClose}
            data-autofocus={project.link ? undefined : ""}
            className="inline-flex h-10 items-center rounded-full bg-panel px-[18px] text-[14px] font-medium text-foreground transition-colors hover:bg-panel-2 max-sm:h-[46px] max-sm:flex-1 max-sm:justify-center"
          >
            Close
          </button>
          {project.link ? (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              data-autofocus=""
              className="inline-flex h-10 items-center gap-1.5 rounded-full bg-foreground px-[18px] text-[14px] font-medium text-background transition-opacity hover:opacity-90 max-sm:h-[46px] max-sm:flex-1 max-sm:justify-center"
            >
              Open project <span aria-hidden="true">↗</span>
            </a>
          ) : (
            <span className="text-[13px] text-muted sm:hidden">Private repo</span>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
