import type { Metadata } from "next";
import StickyNote from "@/components/StickyNote";
import NoteCard from "@/components/NoteCard";
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
  const reactions = notes.reduce((sum, n) => sum + (n.likes ?? 0) + (n.waves ?? 0) + (n.fires ?? 0), 0);

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
          {notes.length > 0 && (
            <p className="mt-3.5 flex flex-wrap justify-center gap-2 text-[12.5px] text-muted">
              <span className="rounded-full border border-border px-3 py-1">
                <b className="font-semibold text-foreground">{notes.length.toLocaleString("en-US")}</b> {notes.length === 1 ? "note" : "notes"}
              </span>
              <span className="rounded-full border border-border px-3 py-1">
                <b className="font-semibold text-foreground">{reactions.toLocaleString("en-US")}</b> {reactions === 1 ? "reaction" : "reactions"}
              </span>
              <span className="rounded-full border border-border px-3 py-1">Newest first</span>
            </p>
          )}
        </div>

        {/* Notes: each grows to fit its message; my note stays pinned first. */}
        <div className="columns-1 gap-6 pt-2 sm:columns-2 lg:columns-3">
          <div className="mb-6 break-inside-avoid">
            <NoteCard
              pinned
              colour="yellow"
              message="Thanks for stopping by. Say hi, leave a tip, or tell me what to build next."
              name="James"
              avatar="james"
              date="Pinned"
              rotation={-1.6}
            />
          </div>
          {notes.map((note) => (
            <div key={note.id} className="mb-6 break-inside-avoid">
              <StickyNote note={note} rotation={rotationFor(note.id)} />
            </div>
          ))}
        </div>
        {notes.length === 0 && (
          <p className="text-center text-[14px] text-muted sm:text-[15px]">No notes from visitors yet. Be the first to leave one.</p>
        )}
      </section>

      {/* Outside the animated section, so its fixed position is relative to the viewport */}
      <AddNoteButton />
    </>
  );
}
