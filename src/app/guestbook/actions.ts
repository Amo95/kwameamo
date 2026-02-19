"use server";

import { supabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";

export async function getNotes() {
  const { data, error } = await supabaseAdmin
    .from("guestbook")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching notes:", error);
    return [];
  }

  return data || [];
}

export async function addNote(formData: FormData) {
  const name = formData.get("name") as string;
  const message = formData.get("message") as string;
  const colour = formData.get("colour") as string;

  if (!name || !message) {
    return { error: "Name and message are required" };
  }

  if (message.length > 100) {
    return { error: "Message must be 100 characters or less" };
  }

  const { error } = await supabaseAdmin.from("guestbook").insert([
    {
      name,
      message,
      colour,
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
