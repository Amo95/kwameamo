// The Wall's reactions. Each is a counter column on the guestbook row; what this browser reacted with is kept in
// localStorage, so a visitor can take a reaction back.
export const REACTIONS = [
  { key: "wave", emoji: "👋", label: "Wave", column: "waves" },
  { key: "heart", emoji: "❤️", label: "Love", column: "likes" },
  { key: "fire", emoji: "🔥", label: "Fire", column: "fires" },
] as const;

export type ReactionKey = (typeof REACTIONS)[number]["key"];
export type Reacted = Record<string, ReactionKey[]>;

export function isReaction(value: unknown): value is ReactionKey {
  return REACTIONS.some((r) => r.key === value);
}

/** This browser's reactions from storage. `legacy` is the old list of liked note ids, read as hearts. */
export function readReacted(raw: string | null, legacy: string | null): Reacted {
  const out: Reacted = {};
  try {
    const parsed: unknown = JSON.parse(raw ?? "{}");
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      for (const [id, keys] of Object.entries(parsed)) {
        if (!Array.isArray(keys)) continue;
        const valid = keys.filter(isReaction);
        if (valid.length) out[id] = [...new Set(valid)];
      }
    }
  } catch {}
  try {
    const old: unknown = JSON.parse(legacy ?? "[]");
    if (Array.isArray(old)) {
      for (const id of old) {
        if (typeof id !== "string") continue;
        if (!(out[id] ?? []).includes("heart")) out[id] = [...(out[id] ?? []), "heart"];
      }
    }
  } catch {}
  return out;
}

/** `reacted` with one reaction on a note turned on or off. */
export function toggleReacted(reacted: Reacted, id: string, key: ReactionKey, on: boolean): Reacted {
  const rest = (reacted[id] ?? []).filter((k) => k !== key);
  const keys = on ? [...rest, key] : rest;
  const next = { ...reacted };
  if (keys.length) next[id] = keys;
  else delete next[id];
  return next;
}
