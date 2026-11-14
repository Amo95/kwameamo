"use server";

import { supabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { createHmac } from "node:crypto";
import { isReaction } from "@/lib/reactions";
import type { GuestbookNote } from "@/lib/supabase";

const COLOURS = ["yellow", "pink", "blue", "green", "purple"];
const AVATAR_SEED = /^[a-z0-9]{1,16}$/;
const NOTE_ID = /^[0-9a-f-]{36}$/i;
const NOTES_PER_HOUR = 3;

// A keyed hash of the visitor's IP, only to limit notes per visitor. Null when there is no IP (local dev).
async function visitorHash(): Promise<string | null> {
  const h = await headers();
  const ip = h.get("x-real-ip") ?? h.get("x-forwarded-for")?.split(",")[0]?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!ip || !key) return null;
  return createHmac("sha256", key).update(`wall:${ip}`).digest("hex");
}

// Never "*": the row also holds ip_hash, which must not reach the page.
const NOTE_COLUMNS = "id, name, message, colour, created_at, likes, waves, fires, avatar";
const OLD_COLUMNS = "id, name, message, colour, created_at, likes";

export async function getNotes(): Promise<GuestbookNote[]> {
  const query = (columns: string) =>
    supabaseAdmin.from("guestbook").select(columns).order("created_at", { ascending: false }).limit(100);
  let { data, error } = await query(NOTE_COLUMNS);
  // Before supabase/2026-11-14-wall-reactions.sql has run there are no 👋, 🔥 or avatar columns: show the notes anyway.
  if (error?.code === "42703") ({ data, error } = await query(OLD_COLUMNS));

  if (error) {
    console.error("Error fetching notes:", error);
    return [];
  }

  return (data ?? []) as unknown as GuestbookNote[];
}

export async function addNote(formData: FormData) {
  // Server actions are public endpoints, so check everything here, not just in the form.
  const name = String(formData.get("name") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const colour = String(formData.get("colour") ?? "");
  const avatar = String(formData.get("avatar") ?? "");

  if (!name || !message) {
    return { error: "Name and message are required" };
  }

  if (name.length > 30) {
    return { error: "Name must be 30 characters or less" };
  }

  if (message.length > 100) {
    return { error: "Message must be 100 characters or less" };
  }

  const ipHash = await visitorHash();
  if (ipHash) {
    const since = new Date(Date.now() - 3600_000).toISOString();
    const { count, error: countError } = await supabaseAdmin
      .from("guestbook")
      .select("id", { count: "exact", head: true })
      .eq("ip_hash", ipHash)
      .gte("created_at", since);
    if (countError) {
      console.error("Error checking the note limit:", countError);
      return { error: "Failed to add note" };
    }
    if ((count ?? 0) >= NOTES_PER_HOUR) {
      return { error: "You've left a few notes already. Try again in an hour." };
    }
  }

  const { error } = await supabaseAdmin.from("guestbook").insert([
    {
      name,
      message,
      colour: COLOURS.includes(colour) ? colour : "yellow",
      avatar: AVATAR_SEED.test(avatar) ? avatar : null,
      ip_hash: ipHash,
    },
  ]);

  if (error) {
    console.error("Error adding note:", error);
    return { error: "Failed to add note" };
  }

  revalidatePath("/guestbook");
  return { success: true };
}

/** Turns one reaction on a note up or down, counted in the database in one statement. */
export async function reactToNote(noteId: string, kind: string, on: boolean) {
  if (typeof noteId !== "string" || !NOTE_ID.test(noteId) || !isReaction(kind) || typeof on !== "boolean") {
    return { error: "Couldn't react to that note" };
  }
  const { data, error } = await supabaseAdmin.rpc("react_to_note", { p_id: noteId, p_kind: kind, p_delta: on ? 1 : -1 });
  if (error || typeof data !== "number") {
    console.error("Error reacting to note:", error);
    return { error: "Couldn't react to that note" };
  }
  revalidatePath("/guestbook");
  return { success: true, count: data };
}
