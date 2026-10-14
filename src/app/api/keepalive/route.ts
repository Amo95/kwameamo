import { supabaseAdmin } from "@/lib/supabase-admin";

// Called daily by Vercel Cron (vercel.json). One tiny query reaches Postgres,
// which stops the free Supabase project from pausing after a quiet week.
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { error } = await supabaseAdmin.from("guestbook").select("id").limit(1);
  if (error) {
    console.error("Keepalive query failed:", error);
    return new Response("Database unreachable", { status: 503 });
  }

  return new Response("OK");
}
