import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type GuestbookNote = {
  id: string;
  name: string;
  message: string;
  colour: string;
  created_at: string;
  likes: number;
  /** 👋 and 🔥 counts (supabase/2026-11-14-wall-reactions.sql); missing before that runs. */
  waves?: number;
  fires?: number;
  avatar?: string | null;
};
