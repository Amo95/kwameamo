"use server";

import { supabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";

const COLOURS = ["yellow", "pink", "blue", "green", "purple"];
const AVATAR_SEED = /^[a-z0-9]{1,16}$/;
const NOTE_ID = /^[0-9a-f-]{36}$/i;

export async function getNotes() {
  const { data, error } = await supabaseAdmin
    .from("guestbook")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    console.error("Error fetching notes:", error);
    return [];
  }

  return data || [];
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

  const { error } = await supabaseAdmin.from("guestbook").insert([
    {
      name,
      message,
      colour: COLOURS.includes(colour) ? colour : "yellow",
      avatar: AVATAR_SEED.test(avatar) ? avatar : null,
    },
  ]);

  if (error) {
    console.error("Error adding note:", error);
    return { error: "Failed to add note" };
  }

  revalidatePath("/guestbook");
  return { success: true };
}

export async function likeNote(noteId: string) {
  if (typeof noteId !== "string" || !NOTE_ID.test(noteId)) {
    return { error: "Failed to like note" };
  }

  const { data: note, error: fetchError } = await supabaseAdmin
    .from("guestbook")
    .select("likes")
    .eq("id", noteId)
    .single();

  if (fetchError || !note) {
    console.error("Error fetching note for like:", fetchError);
    return { error: "Failed to like note" };
  }

  const newLikes = (note.likes ?? 0) + 1;
  const { error: updateError } = await supabaseAdmin
    .from("guestbook")
    .update({ likes: newLikes })
    .eq("id", noteId);

  if (updateError) {
    console.error("Error updating likes:", updateError);
    return { error: "Failed to like note" };
  }

  revalidatePath("/guestbook");
  return { success: true, likes: newLikes };
}

export async function unlikeNote(noteId: string) {
  if (typeof noteId !== "string" || !NOTE_ID.test(noteId)) {
    return { error: "Failed to unlike note" };
  }

  const { data: note, error: fetchError } = await supabaseAdmin
    .from("guestbook")
    .select("likes")
    .eq("id", noteId)
    .single();

  if (fetchError || !note) {
    console.error("Error fetching note for unlike:", fetchError);
    return { error: "Failed to unlike note" };
  }

  const newLikes = Math.max((note.likes ?? 0) - 1, 0);
  const { error: updateError } = await supabaseAdmin
    .from("guestbook")
    .update({ likes: newLikes })
    .eq("id", noteId);

  if (updateError) {
    console.error("Error updating likes:", updateError);
    return { error: "Failed to unlike note" };
  }

  revalidatePath("/guestbook");
  return { success: true, likes: newLikes };
}
