-- Create the links table
create table public.links (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  url text not null,
  title text,
  description text,
  image_url text,
  tags text[],
  user_id uuid references auth.users
);

-- Enable Row Level Security (RLS)
alter table public.links enable row level security;

-- Create a policy that allows anyone to read links (for MVP public access)
create policy "Enable read access for all users"
  on public.links for select
  using (true);

-- Create a policy that allows anyone to insert links (for MVP development)
-- CAUTION: In production, you should restrict this to authenticated users only!
create policy "Enable insert for all users"
  on public.links for insert
  with check (true);

-- Optional: Enable Realtime
alter publication supabase_realtime add table public.links;
