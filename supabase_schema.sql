-- Drop existing 'links' table if it exists (Clean slate for MVP)
drop table if exists public.links;

-- Create 'categories' table
create table public.categories (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  color text default '#6366F1', -- Default indigo color
  user_id uuid references auth.users
);

-- Create 'archives' table (Generic storage for Links and Memos)
create table public.archives (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  type text not null check (type in ('link', 'memo')), -- 'link' or 'memo'
  title text, -- Optional for links (if URL serves as title), Required for memos?
  content text, -- Description for links, Markdown body for Memos
  url text, -- Only for links
  image_url text, -- OG Image for links
  tags text[],
  category_id uuid references public.categories(id),
  user_id uuid references auth.users
);

-- Enable Row Level Security (RLS)
alter table public.categories enable row level security;
alter table public.archives enable row level security;

-- Policies for Categories
create policy "Enable read access for all users" on public.categories for select using (true);
create policy "Enable insert for all users" on public.categories for insert with check (true);
create policy "Enable delete for all users" on public.categories for delete using (true);

-- Policies for Archives
create policy "Enable read access for all users" on public.archives for select using (true);
create policy "Enable insert for all users" on public.archives for insert with check (true);
create policy "Enable update for all users" on public.archives for update using (true);
create policy "Enable delete for all users" on public.archives for delete using (true);

-- Optional: Realtime
alter publication supabase_realtime add table public.categories;
alter publication supabase_realtime add table public.archives;

-- Insert some default categories
insert into public.categories (name, color) values 
('Work', '#3B82F6'), -- Blue
('Ideas', '#F59E0B'), -- Amber
('Reading', '#10B981'); -- Emerald
