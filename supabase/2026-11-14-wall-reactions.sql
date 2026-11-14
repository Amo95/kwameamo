-- The Wall: 👋 and 🔥 reactions beside the heart (likes), counted safely, and a per-visitor note limit.
-- Run once in the Supabase SQL Editor, BEFORE deploying the code that uses it. Safe to run twice.

-- The avatar a visitor picks (the setup notes list it, but the live table may not have it yet).
alter table public.guestbook add column if not exists avatar text;
alter table public.guestbook add column if not exists waves integer not null default 0;
alter table public.guestbook add column if not exists fires integer not null default 0;
-- A keyed hash of the visitor's IP, only to limit notes per visitor. Never the IP itself.
alter table public.guestbook add column if not exists ip_hash text;
create index if not exists guestbook_ip_hash_created_at on public.guestbook (ip_hash, created_at);

-- One reaction up or down in a single statement, so two at the same moment both count.
create or replace function public.react_to_note(p_id uuid, p_kind text, p_delta integer)
returns integer
language plpgsql
set search_path = public
as $$
declare
  n integer;
begin
  if p_delta not in (-1, 1) then
    raise exception 'delta must be 1 or -1';
  end if;
  if p_kind = 'heart' then
    update guestbook set likes = greatest(likes + p_delta, 0) where id = p_id returning likes into n;
  elsif p_kind = 'wave' then
    update guestbook set waves = greatest(waves + p_delta, 0) where id = p_id returning waves into n;
  elsif p_kind = 'fire' then
    update guestbook set fires = greatest(fires + p_delta, 0) where id = p_id returning fires into n;
  else
    raise exception 'unknown reaction';
  end if;
  return n;
end;
$$;

-- Only the server (service role) may call it, never the public anon key.
revoke execute on function public.react_to_note(uuid, text, integer) from public, anon, authenticated;
grant execute on function public.react_to_note(uuid, text, integer) to service_role;
