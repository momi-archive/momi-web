-- Enable Update Policy for Categories
create policy "Enable update for all users" on public.categories for update using (true);

-- (Verify other policies exist)
-- select * from pg_policies where tablename = 'categories';
