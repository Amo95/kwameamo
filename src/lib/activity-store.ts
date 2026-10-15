import "server-only";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { PROJECTS } from "@/lib/activity";

export async function recordPush(repo: string, at: Date): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from("github_activity")
    .upsert({ repo, pushed_at: at.toISOString() }, { onConflict: "repo" });
  if (error) {
    console.error("Recording push failed:", error);
    return false;
  }
  return true;
}

export async function getLatestActivity(): Promise<{ repo: string; pushedAt: Date } | null> {
  const { data, error } = await supabaseAdmin
    .from("github_activity")
    .select("repo, pushed_at")
    .in("repo", Object.keys(PROJECTS))
    .order("pushed_at", { ascending: false })
    .limit(1);
  if (error) {
    console.error("Reading activity failed:", error);
    return null;
  }
  const row = data?.[0];
  return row ? { repo: row.repo, pushedAt: new Date(row.pushed_at) } : null;
}
