import { supabaseAdmin } from "@/lib/supabase-admin";

// Called daily by Vercel Cron (vercel.json). One tiny query per database reaches
// Postgres, which stops each free Supabase project from pausing after a quiet week.
// ShowUp's landing site cannot deploy on the free plan, so its database is kept awake from here.
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const [portfolio, showup] = await Promise.all([pingGuestbook(), pingShowUp()]);
  const failed = [!portfolio && "portfolio", !showup && "showup"].filter(Boolean);
  if (failed.length > 0) {
    return new Response(`Database unreachable: ${failed.join(", ")}`, { status: 503 });
  }

  return new Response("OK");
}

async function pingGuestbook(): Promise<boolean> {
  const { error } = await supabaseAdmin.from("guestbook").select("id").limit(1);
  if (error) console.error("Keepalive query failed:", error);
  return !error;
}

async function pingShowUp(): Promise<boolean> {
  const url = process.env.SHOWUP_SUPABASE_URL;
  const key = process.env.SHOWUP_SUPABASE_ANON_KEY;
  if (!url || !key) {
    console.error("ShowUp keepalive is not configured");
    return false;
  }

  try {
    const res = await fetch(`${url}/rest/v1/waitlist?select=created_at&limit=1`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) console.error("ShowUp keepalive failed:", res.status);
    return res.ok;
  } catch (error) {
    console.error("ShowUp keepalive failed:", error);
    return false;
  }
}
