"use client";

import { useCallback, useState } from "react";
import type { Project } from "@/lib/projects";
import ProjectModal from "@/components/ProjectModal";

function initials(title: string): string {
  return title.split(/[\s-]+/).filter(Boolean).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

/** Every project as one row: a round picture, the name, one line and its kind. A click opens the details. */
export default function ProjectList({ projects }: { projects: Project[] }) {
  const [open, setOpen] = useState<Project | null>(null);
  const close = useCallback(() => setOpen(null), []);
  return (
    <>
      <ul className="flex flex-col gap-1.5 overflow-hidden rounded-3xl">
        {projects.map((p) => (
          <li key={p.title} className="bg-panel">
            <button
              type="button"
              onClick={() => setOpen(p)}
              aria-haspopup="dialog"
              className="group grid w-full grid-cols-[44px_minmax(0,1fr)_auto] items-center gap-3.5 px-4 py-3.5 text-left transition-colors hover:bg-panel-2 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent sm:gap-4 sm:px-5"
            >
              {p.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.image} alt="" className="h-11 w-11 rounded-full object-cover object-top" />
              ) : (
                <span aria-hidden="true" className="grid h-11 w-11 place-items-center rounded-full bg-panel-2 text-[13px] font-semibold text-muted">
                  {initials(p.title)}
                </span>
              )}
              <span className="min-w-0">
                <b className="block truncate text-[15px] font-semibold text-foreground">{p.title.replace(/ - .*$/, "")}</b>
                <small className="block text-[13.5px] leading-snug text-muted">{p.short ?? p.description}</small>
              </span>
              <span className="whitespace-nowrap text-[12px] text-muted">
                <span className="max-sm:hidden">{p.tag}</span>
                <span aria-hidden="true" className="ml-1.5 inline-block transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none">&rarr;</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      {open && <ProjectModal project={open} onClose={close} />}
    </>
  );
}
