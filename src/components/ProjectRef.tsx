"use client";

import { useCallback, useState } from "react";
import type { Project } from "@/lib/projects";
import { RefPicture, refClass } from "@/components/InlineRef";
import ProjectModal from "@/components/ProjectModal";

/**
 * A project named in the text. Hovering shows a small preview (pointer devices only, after a short pause so passing
 * over it does nothing); a click or tap opens the details.
 */
export default function ProjectRef({ project }: { project: Project }) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  return (
    <>
      <button type="button" className={refClass} onClick={() => setOpen(true)} aria-haspopup="dialog">
        {project.image && <RefPicture src={project.image} />}
        {project.title}
        {project.image && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-[calc(100%+10px)] left-1/2 z-20 hidden w-[250px] origin-bottom -translate-x-1/2 translate-y-1 scale-[.97] overflow-hidden whitespace-normal rounded-2xl bg-background text-left opacity-0 shadow-[0_18px_50px_-18px_rgba(0,0,0,0.28)] transition-[opacity,transform] duration-200 ease-[cubic-bezier(.23,1,.32,1)] group-hover/ref:translate-y-0 group-hover/ref:scale-100 group-hover/ref:opacity-100 group-hover/ref:delay-150 [@media(hover:hover)]:block motion-reduce:transition-none"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={project.image} alt="" className="block aspect-video w-full object-cover object-top" />
            <span className="block px-3 pt-2.5 text-[13.5px] font-semibold text-foreground">{project.title}</span>
            <span className="block px-3 pb-2.5 pt-0.5 text-[12px] font-normal leading-snug text-muted">{project.short}</span>
            <span className="block bg-panel px-3 py-2 text-[11.5px] font-normal text-muted">Click to read more</span>
          </span>
        )}
      </button>
      {open && <ProjectModal project={project} onClose={close} />}
    </>
  );
}
