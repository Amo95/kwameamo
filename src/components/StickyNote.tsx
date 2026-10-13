"use client";

import { useState, useSyncExternalStore } from "react";
import type { GuestbookNote } from "@/lib/supabase";
import { likeNote, unlikeNote } from "@/app/guestbook/actions";

const PASTEL_COLORS = {
  yellow: "bg-yellow-200 dark:bg-yellow-300",
  pink: "bg-pink-200 dark:bg-pink-300",
  blue: "bg-blue-200 dark:bg-blue-300",
  green: "bg-green-200 dark:bg-green-300",
  purple: "bg-purple-200 dark:bg-purple-300",
};

// Liked note ids live in localStorage; every note on the page re-reads them when they change.
const listeners = new Set<() => void>();

function getLikedNotes(): string[] {
  try {
    return JSON.parse(localStorage.getItem("liked-notes") || "[]");
  } catch {
    return [];
  }
}

function setLikedNote(noteId: string, liked: boolean) {
  const ids = getLikedNotes().filter((id) => id !== noteId);
  if (liked) ids.push(noteId);
  localStorage.setItem("liked-notes", JSON.stringify(ids));
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

interface StickyNoteProps {
  note: GuestbookNote;
  rotation: number;
}

export default function StickyNote({ note, rotation }: StickyNoteProps) {
  const liked = useSyncExternalStore(
    subscribe,
    () => getLikedNotes().includes(note.id),
    () => false
  );
  const [likeCount, setLikeCount] = useState(note.likes ?? 0);
  const [animating, setAnimating] = useState(false);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setAnimating(true);
    setTimeout(() => setAnimating(false), 300);

    // Update right away, then undo if the server call fails.
    const next = !liked;
    setLikedNote(note.id, next);
    setLikeCount((c) => Math.max(c + (next ? 1 : -1), 0));
    const result = await (next ? likeNote(note.id) : unlikeNote(note.id));
    if (result.error) {
      setLikedNote(note.id, !next);
      setLikeCount((c) => Math.max(c + (next ? -1 : 1), 0));
    }
  };

  const colorClass =
    PASTEL_COLORS[note.colour as keyof typeof PASTEL_COLORS] ||
    PASTEL_COLORS.yellow;

  const date = new Date(note.created_at);
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      className={`group relative h-44 w-full rounded-md p-4 shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl sm:h-48 sm:p-5 ${colorClass}`}
      style={{ rotate: `${rotation}deg` }}
    >
      {/* Note content */}
      <div className="flex h-full flex-col justify-between">
        <div>
          <p className="break-words font-serif text-[14px] leading-relaxed text-gray-800 sm:text-[15px]">
            {note.message}
          </p>
        </div>

        <div className="flex items-end justify-between">
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://api.navii.dev/avatar/${encodeURIComponent(note.avatar || note.name)}?size=24`}
              alt=""
              className="h-6 w-6 shrink-0 rounded-full"
              loading="lazy"
            />
            <div>
              <p className="text-[12px] font-semibold text-gray-700 sm:text-[13px]">
                {note.name}
              </p>
              <p className="text-[10px] text-gray-600 sm:text-[11px]">{formattedDate}</p>
            </div>
          </div>

          <button
            onClick={handleLike}
            className={`flex items-center gap-1 transition-transform duration-200 ${
              "cursor-pointer hover:scale-110"
            } ${animating ? "scale-125" : ""}`}
            aria-label={liked ? "Unlike this note" : "Like this note"}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill={liked ? "#ef4444" : "none"}
              stroke={liked ? "#ef4444" : "#6b7280"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-colors duration-200"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <span className="text-[11px] text-gray-600">{likeCount}</span>
          </button>
        </div>
      </div>

      {/* Tape effect at top */}
      <div className="absolute left-1/2 top-0 h-5 w-12 -translate-x-1/2 -translate-y-2.5 bg-white/40 opacity-60 blur-[1px] sm:h-6 sm:w-16 sm:-translate-y-3" />
    </div>
  );
}
