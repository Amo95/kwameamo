import type { Metadata } from "next";
import StickyNote from "@/components/StickyNote";
import AddNoteButton from "@/components/AddNoteButton";
import { getNotes } from "./actions";

export const metadata: Metadata = {
  title: "The Wall - James Kwame Amo",
  description: "Leave a note, say hi.",
};

// A fixed tilt per note, from -3 to +3 degrees, so notes never jump between renders.
function rotationFor(id: string): number {
  let hash = 0;
  for (const char of id) hash = (hash * 31 + char.charCodeAt(0)) | 0;
  return ((Math.abs(hash) % 61) - 30) / 10;
}

export default async function GuestbookPage() {
  const notes = await getNotes();

  return (
    <>
      <section className="flex flex-col gap-6 sm:gap-8 animate-fade-in-up">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            The Wall
          </h1>
          <p className="mt-2 text-[14px] text-muted sm:text-[15px]">
            Leave a note, say hi{" "}
            <span role="img" aria-label="wave">
              👋
            </span>
          </p>
        </div>

        {/* Notes grid */}
        {notes.length === 0 ? (
          <div className="py-8 sm:py-12 text-center">
            <p className="text-[14px] text-muted sm:text-[15px]">
              No notes yet. Be the first to leave one!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {notes.map((note) => (
              <StickyNote key={note.id} note={note} rotation={rotationFor(note.id)} />
            ))}
          </div>
        )}
      </section>

      {/* Outside the animated section, so its fixed position is relative to the viewport */}
      <AddNoteButton />
    </>
  );
}
