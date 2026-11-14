"use client";

import { useState, useSyncExternalStore } from "react";
import type { GuestbookNote } from "@/lib/supabase";
import { REACTIONS, readReacted, toggleReacted, type ReactionKey, type Reacted } from "@/lib/reactions";
import { reactToNote } from "@/app/guestbook/actions";
import NoteCard from "@/components/NoteCard";

// What this browser reacted with lives in localStorage; every note re-reads it when it changes.
const KEY = "wall-reactions";
const LEGACY = "liked-notes";
const listeners = new Set<() => void>();
let cache: { raw: string | null; legacy: string | null; value: Reacted } | null = null;

function read(): Reacted {
  try {
    const raw = localStorage.getItem(KEY), legacy = localStorage.getItem(LEGACY);
    if (!cache || cache.raw !== raw || cache.legacy !== legacy) cache = { raw, legacy, value: readReacted(raw, legacy) };
    return cache.value;
  } catch {
    return {};
  }
}

function save(next: Reacted) {
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
    localStorage.removeItem(LEGACY);
  } catch {}
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

const EMPTY: Reacted = {};

export default function StickyNote({ note, rotation }: { note: GuestbookNote; rotation: number }) {
  const reacted = useSyncExternalStore(subscribe, read, () => EMPTY);
  const mine = reacted[note.id] ?? [];
  const [counts, setCounts] = useState<Record<ReactionKey, number>>({
    wave: note.waves ?? 0,
    heart: note.likes ?? 0,
    fire: note.fires ?? 0,
  });
  const [busy, setBusy] = useState<ReactionKey | null>(null);

  const react = async (key: ReactionKey) => {
    if (busy) return;
    const on = !mine.includes(key);
    // Show it at once, then settle on the server's count, or undo if it failed.
    setBusy(key);
    save(toggleReacted(read(), note.id, key, on));
    setCounts((c) => ({ ...c, [key]: Math.max(c[key] + (on ? 1 : -1), 0) }));
    const result = await reactToNote(note.id, key, on);
    if ("count" in result && typeof result.count === "number") {
      const count = result.count;
      setCounts((c) => ({ ...c, [key]: count }));
    } else {
      save(toggleReacted(read(), note.id, key, !on));
      setCounts((c) => ({ ...c, [key]: Math.max(c[key] + (on ? -1 : 1), 0) }));
    }
    setBusy(null);
  };

  const date = new Date(note.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <NoteCard
      colour={note.colour}
      message={note.message}
      name={note.name}
      avatar={note.avatar || note.name}
      date={date}
      rotation={rotation}
      actions={
        <div className="flex gap-1">
          {REACTIONS.map((r) => {
            const pressed = mine.includes(r.key);
            return (
              <button
                key={r.key}
                type="button"
                onClick={() => react(r.key)}
                aria-pressed={pressed}
                aria-label={`${r.label}, ${counts[r.key]}`}
                className={`h-6 whitespace-nowrap rounded-full px-[7px] text-[12px] tabular-nums transition-[background-color,transform] duration-150 active:scale-95 motion-reduce:transition-none ${
                  pressed
                    ? "bg-[color-mix(in_srgb,var(--note-ink)_18%,transparent)] font-semibold"
                    : "bg-[color-mix(in_srgb,var(--note-ink)_8%,transparent)] hover:bg-[color-mix(in_srgb,var(--note-ink)_13%,transparent)]"
                }`}
              >
                <span aria-hidden="true">{r.emoji}</span> {counts[r.key]}
              </button>
            );
          })}
        </div>
      }
    />
  );
}
