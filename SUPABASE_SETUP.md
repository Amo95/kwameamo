# Supabase Setup for Guestbook

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Create a new project
4. Wait for the project to be provisioned

## 2. Create the Guestbook Table

In the Supabase dashboard:

1. Go to **Table Editor** in the left sidebar
2. Click **New Table**
3. Set table name to: `guestbook`
4. Add the following columns:

| Column Name | Type | Default Value | Extra Options |
|------------|------|---------------|---------------|
| id | uuid | `gen_random_uuid()` | Primary Key |
| name | text | - | - |
| message | text | - | - |
| colour | text | - | - |
| created_at | timestamptz | `now()` | - |

5. Click **Save**

## 3. SQL Alternative

Or run this SQL in the **SQL Editor**:

```sql
create table public.guestbook (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  message text not null,
  colour text not null,
  created_at timestamptz default now() not null
);

-- Enable Row Level Security (RLS)
alter table public.guestbook enable row level security;

-- Allow anyone to read notes
create policy "Enable read access for all users"
on public.guestbook for select
to anon, authenticated
using (true);

-- Allow anyone to insert notes
create policy "Enable insert access for all users"
on public.guestbook for insert
to anon, authenticated
with check (true);
```

## 4. Get Your API Keys

1. Go to **Project Settings** → **API**
2. Copy the following:
   - **Project URL** (e.g., `https://xxx.supabase.co`)
   - **anon public** key (under "Project API keys")

## 5. Set Environment Variables

Create a `.env.local` file in the portfolio root directory:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

Replace `your_project_url_here` and `your_anon_key_here` with the values from step 4.

## 6. Restart the Dev Server

```bash
npm run dev
```

## 7. Test the Guestbook

1. Navigate to `http://localhost:3000/guestbook`
2. Click the **+** button to add a note
3. Fill in your name and message
4. Submit!

Your guestbook is now live! 🎉
