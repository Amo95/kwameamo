"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function getNotes() {
  const { data, error } = await supabase
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

  const { error } = await supabase.from("guestbook").insert([
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
