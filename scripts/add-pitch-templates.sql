-- Correr en Supabase → SQL Editor → New query → Run

create table if not exists public.pitch_templates (
  id integer primary key,
  title text not null,
  subtitle text not null default '',
  placeholder_name text not null default '',
  body text not null,
  categorias text[] not null default '{}',
  updated_at timestamptz not null default now()
);

comment on table public.pitch_templates is 'Pitches comerciales editables del CRM Guaina';

alter table public.pitch_templates enable row level security;

drop policy if exists "pitch_templates_all" on public.pitch_templates;
create policy "pitch_templates_all"
  on public.pitch_templates
  for all
  using (true)
  with check (true);
