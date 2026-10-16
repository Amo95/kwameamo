import { createHmac, timingSafeEqual } from "node:crypto";
import { OWNER_LOGIN, PROJECTS } from "./activity.ts";

const PREFIX = "sha256=";

export function verifySignature(rawBody: string, header: string | null, secret: string): boolean {
  if (!header || !header.startsWith(PREFIX)) return false;
  const expected = Buffer.from(createHmac("sha256", secret).update(rawBody).digest("hex"));
  const given = Buffer.from(header.slice(PREFIX.length));
  return given.length === expected.length && timingSafeEqual(given, expected);
}

function obj(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null ? (value as Record<string, unknown>) : null;
}

// Returns the lowercase repo full name to record, or null to ignore.
export function approvedPush(event: string | null, payload: unknown): string | null {
  if (event !== "push") return null;
  const body = obj(payload);
  if (!body || body.deleted === true) return null;
  const repo = obj(body.repository)?.full_name;
  const sender = obj(body.sender)?.login;
  if (typeof repo !== "string" || typeof sender !== "string") return null;
  if (sender.toLowerCase() !== OWNER_LOGIN.toLowerCase()) return null;
  const key = repo.toLowerCase();
  return Object.hasOwn(PROJECTS, key) ? key : null;
}
