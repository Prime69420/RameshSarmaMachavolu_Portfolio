-- Private enquiries submitted from the public contact form.
-- Visitors cannot read or write this table. The server inserts with the service role.
-- Administrators enrolled in admin_users may read rows and change status only.

create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  subject text not null,
  message text not null,
  status text not null default 'new',
  created_at timestamptz not null default now(),
  constraint enquiries_name_check check (char_length(btrim(name)) between 2 and 120),
  constraint enquiries_email_check check (
    email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
    and char_length(email) <= 254
  ),
  constraint enquiries_phone_check check (phone is null or char_length(btrim(phone)) between 1 and 32),
  constraint enquiries_subject_check check (char_length(btrim(subject)) between 2 and 160),
  constraint enquiries_message_check check (char_length(btrim(message)) between 10 and 5000),
  constraint enquiries_status_check check (status in ('new', 'read', 'replied', 'archived'))
);

create index if not exists enquiries_created_idx on public.enquiries (created_at desc, id desc);
create index if not exists enquiries_email_created_idx on public.enquiries (email, created_at desc);
create index if not exists enquiries_status_idx on public.enquiries (status);

comment on table public.enquiries is
  'Private contact enquiries. Public roles have no access. Administrators may read and change status.';

create or replace function public.enquiries_protect_content()
returns trigger
language plpgsql
set search_path = public, pg_catalog
as $$
begin
  if new.id is distinct from old.id
    or new.name is distinct from old.name
    or new.email is distinct from old.email
    or new.phone is distinct from old.phone
    or new.subject is distinct from old.subject
    or new.message is distinct from old.message
    or new.created_at is distinct from old.created_at
  then
    raise exception 'enquiry content is immutable';
  end if;
  return new;
end;
$$;

drop trigger if exists enquiries_protect_content on public.enquiries;
create trigger enquiries_protect_content
before update on public.enquiries
for each row execute function public.enquiries_protect_content();

alter table public.enquiries enable row level security;

revoke all on table public.enquiries from public, anon, authenticated;
grant select, update on table public.enquiries to authenticated;

drop policy if exists "administrators read enquiries" on public.enquiries;
create policy "administrators read enquiries"
on public.enquiries
for select
to authenticated
using (public.is_admin());

drop policy if exists "administrators update enquiries" on public.enquiries;
create policy "administrators update enquiries"
on public.enquiries
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());
