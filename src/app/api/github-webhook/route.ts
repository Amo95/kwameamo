import { recordPush } from "@/lib/activity-store";
import { approvedPush, verifySignature } from "@/lib/webhook";

const MAX_BYTES = 524288;

// GitHub push webhook. Keeps only the owner's pushes to approved repos.
export async function POST(request: Request) {
  const secret = process.env.GITHUB_WEBHOOK_SECRET;
  if (!secret) return new Response("Not configured", { status: 503 });

  if (Number(request.headers.get("content-length")) > MAX_BYTES) {
    return new Response("Too large", { status: 413 });
  }
  const raw = await request.text();
  if (raw.length > MAX_BYTES) return new Response("Too large", { status: 413 });

  if (!verifySignature(raw, request.headers.get("x-hub-signature-256"), secret)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const event = request.headers.get("x-github-event");
  if (event === "ping") return new Response("pong");

  let payload: unknown;
  try {
    payload = JSON.parse(raw);
  } catch {
    return new Response("Bad request", { status: 400 });
  }

  const repo = approvedPush(event, payload);
  if (!repo) return new Response("ignored", { status: 202 });

  const ok = await recordPush(repo, new Date());
  return ok ? new Response("recorded") : new Response("Failed", { status: 500 });
}
