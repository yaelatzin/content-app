import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

/*
====================================================
  ESQUEMA SQL — Ejecuta esto en Supabase SQL Editor
  supabase.com → tu proyecto → SQL Editor → New query
====================================================

-- 1. WORKSTREAMS
create table workstreams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz default now()
);

-- 2. PROJECTS
create table projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  workstream_id uuid references workstreams(id) on delete set null,
  started date,
  due date,
  completed date,
  status text check (status in ('Not Started','In Progress','Completed','Cancelled')) default 'Not Started',
  owner_email text,
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz default now()
);

-- 3. TASKS
create table tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  project_id uuid references projects(id) on delete cascade,
  done boolean default false,
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz default now()
);

-- 4. NOTES
create table notes (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  project_id uuid references projects(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz default now()
);

-- 5. ROW LEVEL SECURITY (cada usuario solo ve sus datos)
alter table workstreams enable row level security;
alter table projects enable row level security;
alter table tasks enable row level security;
alter table notes enable row level security;

create policy "Users own workstreams" on workstreams for all using (auth.uid() = user_id);
create policy "Users own projects"    on projects    for all using (auth.uid() = user_id);
create policy "Users own tasks"       on tasks       for all using (auth.uid() = user_id);
create policy "Users own notes"       on notes       for all using (auth.uid() = user_id);

-- 6. DATOS INICIALES (opcional — tus proyectos reales)
-- Ejecuta DESPUÉS de crear tu cuenta en la app y obtener tu user_id
-- (lo ves en Authentication → Users en el dashboard de Supabase)

*/
