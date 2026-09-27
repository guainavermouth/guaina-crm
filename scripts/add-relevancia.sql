-- Correr en Supabase → SQL Editor → New query
alter table public.leads
  add column if not exists relevancia text;

comment on column public.leads.relevancia is 'Prioridad comercial: alta | media | baja';
