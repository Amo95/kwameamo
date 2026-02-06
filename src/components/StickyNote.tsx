"use client";

import { useState } from "react";
import type { GuestbookNote } from "@/lib/supabase";

const PASTEL_COLORS = {
  yellow: "bg-yellow-200 dark:bg-yellow-300",
  pink: "bg-pink-200 dark:bg-pink-300",
  blue: "bg-blue-200 dark:bg-blue-300",
  green: "bg-green-200 dark:bg-green-300",
  purple: "bg-purple-200 dark:bg-purple-300",
};

interface StickyNoteProps {
  note: GuestbookNote;
  rotation: number;
}

export default function StickyNote({ note, rotation }: StickyNoteProps) {
  const [isDragging, setIsDragging] = useState(false);

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
      className={`group relative h-44 w-full rounded-md p-4 shadow-md transition-all duration-200 hover:shadow-xl sm:h-48 sm:p-5 ${colorClass}`}
      style={{
        transform: `rotate(${rotation}deg) ${isDragging ? "" : ""}`,
        cursor: isDragging ? "grabbing" : "grab",
      }}
      onMouseEnter={(e) => {
        if (!isDragging) {
          e.currentTarget.style.transform = `rotate(${rotation}deg) translateY(-2px)`;
        }
      }}
      onMouseLeave={(e) => {
        setIsDragging(false);
        if (!isDragging) {
          e.currentTarget.style.transform = `rotate(${rotation}deg) translateY(0)`;
        }
      }}
      onMouseDown={() => setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}
    >
      {/* Note content */}
      <div className="flex h-full flex-col justify-between">
        <div>
          <p className="break-words font-serif text-[14px] leading-relaxed text-gray-800 sm:text-[15px]">
            {note.message}
          </p>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-[12px] font-semibold text-gray-700 sm:text-[13px]">
              — {note.name}
            </p>
            <p className="text-[10px] text-gray-600 sm:text-[11px]">{formattedDate}</p>
          </div>
        </div>
      </div>

      {/* Tape effect at top */}
      <div className="absolute left-1/2 top-0 h-5 w-12 -translate-x-1/2 -translate-y-2.5 bg-white/40 opacity-60 blur-[1px] sm:h-6 sm:w-16 sm:-translate-y-3" />
    </div>
  );
}
