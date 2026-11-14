import type { ReactNode } from "react";
import { hand } from "@/lib/fonts";

export const NOTE_COLOURS = ["yellow", "pink", "blue", "green", "purple"] as const;

export function noteColour(colour: string): string {
  return `var(--note-${(NOTE_COLOURS as readonly string[]).includes(colour) ? colour : "yellow"})`;
}

/**
 * A sticky note as it looks on the Wall: tape on top, a slight tilt, the message in handwriting, and it grows to fit
 * the message. `actions` sits bottom right (the reactions).
 */
export default function NoteCard({
  colour,
  message,
  name,
  avatar,
  date,
  rotation = 0,
  pinned = false,
  actions,
}: {
  colour: string;
  message: string;
  name: string;
  avatar: string;
  date: string;
  rotation?: number;
  pinned?: boolean;
  actions?: ReactNode;
}) {
  return (
    <article
      className={`relative rounded-md px-4 pb-3.5 pt-[18px] text-[var(--note-ink)] shadow-[0_10px_24px_-14px_rgba(0,0,0,0.35)] transition-transform duration-200 ease-[cubic-bezier(.23,1,.32,1)] hover:-translate-y-[3px] hover:!rotate-0 motion-reduce:transition-none dark:shadow-[0_10px_24px_-14px_rgba(0,0,0,0.9)]${
        pinned ? " outline-2 -outline-offset-[7px] outline-dashed outline-[color-mix(in_srgb,var(--note-ink)_30%,transparent)]" : ""
      }`}
      style={{ backgroundColor: noteColour(colour), rotate: `${rotation}deg` }}
    >
      {/* Tape */}
      <span aria-hidden="true" className="absolute -top-[9px] left-1/2 h-[18px] w-14 -translate-x-1/2 -rotate-2 rounded-[2px] bg-background/55 backdrop-blur-[1px]" />
      {pinned && (
        <span className="absolute right-2.5 top-2 text-[10.5px] font-semibold uppercase tracking-[0.06em] opacity-60">Pinned</span>
      )}
      <p className={`${hand.className} break-words text-[22px] leading-[1.2]`}>{message}</p>
      <footer className="mt-3.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://api.navii.dev/avatar/${encodeURIComponent(avatar)}?size=24`}
            alt=""
            className="h-6 w-6 shrink-0 rounded-full"
            loading="lazy"
          />
          <span className="min-w-0">
            <b className="block truncate text-[12.5px] font-semibold">{name}</b>
            <small className="block text-[11px] opacity-70">{date}</small>
          </span>
        </div>
        {actions}
      </footer>
    </article>
  );
}
