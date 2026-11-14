"use client";

import { useEffect, useState, useTransition } from "react";
import { addNote } from "@/app/guestbook/actions";
import NoteCard, { NOTE_COLOURS, noteColour } from "@/components/NoteCard";

const AVATAR_COUNT = 8;
const MAX = 100;

function randomColour() {
  return NOTE_COLOURS[Math.floor(Math.random() * NOTE_COLOURS.length)];
}

function generateAvatarSeeds() {
  return Array.from({ length: AVATAR_COUNT }, () => Math.random().toString(36).substring(2, 10));
}

interface AddNoteModalProps {
  onClose: () => void;
}

/** Write a note and see it as it will look on the Wall. */
export default function AddNoteModal({ onClose }: AddNoteModalProps) {
  const [colour, setColour] = useState<string>(randomColour);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [avatarSeeds] = useState(generateAvatarSeeds);
  const [avatar, setAvatar] = useState(avatarSeeds[0]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);
    formData.set("colour", colour);
    formData.set("avatar", avatar);
    startTransition(async () => {
      const result = await addNote(formData);
      if (result?.error) setError(result.error);
      else onClose();
    });
  };

  const field =
    "min-h-[44px] w-full rounded-xl border border-border bg-background px-3 py-2.5 text-[14px] text-foreground placeholder-muted focus:border-foreground focus:outline-none";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm max-sm:items-end max-sm:p-0"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-note-title"
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-border bg-background p-5 shadow-xl sm:p-6 max-sm:rounded-b-none max-sm:border-b-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 id="add-note-title" className="text-lg font-semibold text-foreground sm:text-xl">Leave a note</h2>
            <p className="mt-0.5 text-[13.5px] text-muted">Short and kind. It shows up on the Wall straight away.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-border hover:text-foreground"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="grid gap-6 sm:grid-cols-[minmax(0,1fr)_240px]">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="name" className="mb-1 block text-[13px] font-medium text-foreground">Your name</label>
              <input
                type="text" id="name" name="name" required maxLength={30} autoFocus
                value={name} onChange={(e) => setName(e.target.value)}
                className={field} placeholder="Esi"
              />
            </div>

            <div>
              <label htmlFor="message" className="mb-1 block text-[13px] font-medium text-foreground">Message</label>
              <textarea
                id="message" name="message" required maxLength={MAX} rows={3}
                value={message} onChange={(e) => setMessage(e.target.value)}
                className={`${field} resize-none`} placeholder="Say hi, leave a tip…"
              />
              <p className="mt-1 flex justify-between text-[11.5px] text-muted">
                <span>Up to {MAX} characters</span>
                <span aria-live="polite">{MAX - message.length} left</span>
              </p>
            </div>

            <div>
              <span className="mb-2 block text-[13px] font-medium text-foreground">Avatar</span>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Avatar">
                {avatarSeeds.map((seed, i) => (
                  <button
                    key={seed}
                    type="button"
                    onClick={() => setAvatar(seed)}
                    aria-pressed={avatar === seed}
                    aria-label={`Avatar ${i + 1}`}
                    className={`h-10 w-10 overflow-hidden rounded-full border-2 transition-transform ${avatar === seed ? "scale-110 border-foreground" : "border-border hover:scale-105"}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`https://api.navii.dev/avatar/${seed}?size=40`} alt="" className="h-full w-full" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="mb-2 block text-[13px] font-medium text-foreground">Colour</span>
              <div className="flex gap-2" role="group" aria-label="Note colour">
                {NOTE_COLOURS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColour(c)}
                    aria-pressed={colour === c}
                    aria-label={c[0].toUpperCase() + c.slice(1)}
                    className={`h-9 w-9 rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,0.12)] transition-transform ${colour === c ? "scale-110 ring-2 ring-foreground ring-offset-2 ring-offset-background" : "hover:scale-105"}`}
                    style={{ backgroundColor: noteColour(c) }}
                  />
                ))}
              </div>
            </div>

            {error && <p className="text-[13px] text-red-500 dark:text-red-400" role="alert">{error}</p>}

            <button
              type="submit"
              disabled={isPending}
              className="mt-1 h-11 rounded-full bg-foreground px-5 text-[14px] font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {isPending ? "Pinning…" : "Pin it to the Wall"}
            </button>
          </form>

          <div className="max-sm:order-first">
            <p className="mb-3 text-center text-[12px] text-muted">How it will look</p>
            <NoteCard
              colour={colour}
              message={message || "Your note…"}
              name={name || "Your name"}
              avatar={avatar}
              date="Just now"
              rotation={1.2}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
