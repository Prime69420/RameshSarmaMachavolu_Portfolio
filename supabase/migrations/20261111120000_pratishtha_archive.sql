-- Pratishtha Kainkaryam archive.
-- Public visitors can read published rows only.
-- Administrator membership is granted by a trusted SQL operation, never by a signed-in user.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- to_tsvector(regconfig, text) looks up the text-search configuration, so that
-- cast is not immutable and cannot be used in a generated column.
create or replace function public.pratishthas_refresh_search_vector()
returns trigger
language plpgsql
set search_path = public, pg_catalog
as $$
begin
  new.search_vector :=
    setweight(to_tsvector('simple'::regconfig, coalesce(new.title, '')), 'A') ||
    setweight(to_tsvector('simple'::regconfig, coalesce(new.temple_name, '')), 'A') ||
    setweight(to_tsvector('simple'::regconfig, coalesce(new.pratishtha_name, '')), 'A') ||
    setweight(to_tsvector('simple'::regconfig, coalesce(new.city, '')), 'A') ||
    setweight(to_tsvector('simple'::regconfig, coalesce(new.state, '')), 'A') ||
    setweight(to_tsvector('simple'::regconfig, coalesce(new.country, '')), 'A') ||
    setweight(to_tsvector('simple'::regconfig, coalesce(array_to_string(new.devatas, ' '), '')), 'A') ||
    setweight(to_tsvector('simple'::regconfig, coalesce(new.description, '')), 'B') ||
    setweight(to_tsvector('simple'::regconfig, coalesce(new.ritual_type, '')), 'B');
  return new;
end;
$$;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

comment on table public.admin_users is
  'Administrator accounts. Insert rows only from the Supabase SQL editor or another trusted database role.';

create table if not exists public.pratishthas (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null,
  temple_name text,
  pratishtha_name text,
  devatas text[] not null default '{}',
  city text,
  state text,
  country text,
  year integer,
  event_date date,
  description text,
  ritual_type text,
  status text not null default 'draft',
  featured boolean not null default false,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint pratishthas_title_length check (char_length(btrim(title)) between 2 and 180),
  constraint pratishthas_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' and char_length(slug) <= 96),
  constraint pratishthas_slug_unique unique (slug),
  constraint pratishthas_status_check check (status in ('draft', 'published')),
  constraint pratishthas_year_check check (year is null or year between 1 and 9999),
  constraint pratishthas_display_order_check check (display_order between -999999 and 999999),
  search_vector tsvector not null default ''::tsvector
);

alter table public.pratishthas
  add column if not exists search_vector tsvector not null default ''::tsvector;

create index if not exists pratishthas_status_idx on public.pratishthas (status);
create index if not exists pratishthas_country_idx on public.pratishthas (country);
create index if not exists pratishthas_state_idx on public.pratishthas (state);
create index if not exists pratishthas_city_idx on public.pratishthas (city);
create index if not exists pratishthas_year_idx on public.pratishthas (year);
create index if not exists pratishthas_updated_idx on public.pratishthas (updated_at desc, id);
create index if not exists pratishthas_list_idx on public.pratishthas (featured desc, display_order, title, id);
create index if not exists pratishthas_devatas_idx on public.pratishthas using gin (devatas);
create index if not exists pratishthas_search_idx on public.pratishthas using gin (search_vector);

drop trigger if exists pratishthas_set_updated_at on public.pratishthas;
create trigger pratishthas_set_updated_at
before update on public.pratishthas
for each row execute function public.set_updated_at();

drop trigger if exists pratishthas_search_vector on public.pratishthas;
create trigger pratishthas_search_vector
before insert or update on public.pratishthas
for each row execute function public.pratishthas_refresh_search_vector();

update public.pratishthas
set title = title
where search_vector = ''::tsvector;

create table if not exists public.pratishtha_media (
  id uuid primary key default gen_random_uuid(),
  pratishtha_id uuid not null references public.pratishthas (id) on delete cascade,
  storage_path text not null,
  alt_text text not null default '',
  caption text,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  constraint pratishtha_media_path_check check (char_length(btrim(storage_path)) > 0),
  constraint pratishtha_media_alt_check check (char_length(alt_text) <= 200),
  constraint pratishtha_media_caption_check check (caption is null or char_length(caption) <= 300),
  constraint pratishtha_media_order_check check (display_order between -999999 and 999999)
);

create index if not exists pratishtha_media_order_idx
  on public.pratishtha_media (pratishtha_id, display_order, created_at);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
  );
$$;

comment on function public.is_admin() is
  'True only when the current Supabase Auth user was enrolled in admin_users by a trusted role.';

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

alter table public.admin_users enable row level security;
alter table public.pratishthas enable row level security;
alter table public.pratishtha_media enable row level security;

revoke all on table public.admin_users from public, anon, authenticated;
grant select on table public.admin_users to authenticated;

grant select on table public.pratishthas to anon, authenticated;
grant insert, update, delete on table public.pratishthas to authenticated;
grant select on table public.pratishtha_media to anon, authenticated;
grant insert, update, delete on table public.pratishtha_media to authenticated;

drop policy if exists "read own administrator row" on public.admin_users;
create policy "read own administrator row"
on public.admin_users
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "public read published pratishthas" on public.pratishthas;
create policy "public read published pratishthas"
on public.pratishthas
for select
to anon, authenticated
using (status = 'published');

drop policy if exists "administrators read pratishthas" on public.pratishthas;
create policy "administrators read pratishthas"
on public.pratishthas
for select
to authenticated
using (public.is_admin());

drop policy if exists "administrators insert pratishthas" on public.pratishthas;
create policy "administrators insert pratishthas"
on public.pratishthas
for insert
to authenticated
with check (public.is_admin());

drop policy if exists "administrators update pratishthas" on public.pratishthas;
create policy "administrators update pratishthas"
on public.pratishthas
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "administrators delete pratishthas" on public.pratishthas;
create policy "administrators delete pratishthas"
on public.pratishthas
for delete
to authenticated
using (public.is_admin());

drop policy if exists "public read media of published pratishthas" on public.pratishtha_media;
create policy "public read media of published pratishthas"
on public.pratishtha_media
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.pratishthas
    where pratishthas.id = pratishtha_media.pratishtha_id
      and pratishthas.status = 'published'
  )
);

drop policy if exists "administrators read media" on public.pratishtha_media;
create policy "administrators read media"
on public.pratishtha_media
for select
to authenticated
using (public.is_admin());

drop policy if exists "administrators insert media" on public.pratishtha_media;
create policy "administrators insert media"
on public.pratishtha_media
for insert
to authenticated
with check (public.is_admin());

drop policy if exists "administrators update media" on public.pratishtha_media;
create policy "administrators update media"
on public.pratishtha_media
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "administrators delete media" on public.pratishtha_media;
create policy "administrators delete media"
on public.pratishtha_media
for delete
to authenticated
using (public.is_admin());

create or replace function public.search_pratishthas(
  q text default null,
  filter_country text default null,
  filter_state text default null,
  filter_city text default null,
  filter_devata text default null,
  filter_type text default null,
  filter_year integer default null,
  filter_status text default 'published',
  page_number integer default 1,
  page_size integer default 20
)
returns jsonb
language plpgsql
stable
security invoker
set search_path = public
as $$
declare
  clean_q text := nullif(btrim(replace(replace(coalesce(q, ''), '%', ''), '_', '')), '');
  clean_country text := nullif(btrim(replace(replace(coalesce(filter_country, ''), '%', ''), '_', '')), '');
  clean_state text := nullif(btrim(replace(replace(coalesce(filter_state, ''), '%', ''), '_', '')), '');
  clean_city text := nullif(btrim(replace(replace(coalesce(filter_city, ''), '%', ''), '_', '')), '');
  clean_devata text := nullif(btrim(replace(replace(coalesce(filter_devata, ''), '%', ''), '_', '')), '');
  clean_type text := nullif(btrim(replace(replace(coalesce(filter_type, ''), '%', ''), '_', '')), '');
  safe_page integer := greatest(coalesce(page_number, 1), 1);
  safe_size integer := least(greatest(coalesce(page_size, 20), 1), 50);
  result jsonb;
begin
  with filtered as (
    select p.*
    from public.pratishthas p
    where (filter_status is null or p.status = filter_status)
      and (clean_country is null or p.country ilike clean_country)
      and (clean_state is null or p.state ilike clean_state)
      and (clean_city is null or p.city ilike clean_city)
      and (clean_type is null or p.ritual_type ilike clean_type)
      and (filter_year is null or p.year = filter_year)
      and (
        clean_devata is null
        or exists (
          select 1
          from unnest(p.devatas) as devata
          where devata ilike clean_devata
        )
      )
      and (
        clean_q is null
        or p.search_vector @@ plainto_tsquery('simple', clean_q)
        or p.title ilike '%' || clean_q || '%'
        or coalesce(p.temple_name, '') ilike '%' || clean_q || '%'
        or coalesce(p.pratishtha_name, '') ilike '%' || clean_q || '%'
        or coalesce(p.description, '') ilike '%' || clean_q || '%'
        or coalesce(p.city, '') ilike '%' || clean_q || '%'
        or coalesce(p.state, '') ilike '%' || clean_q || '%'
        or coalesce(p.country, '') ilike '%' || clean_q || '%'
        or coalesce(p.ritual_type, '') ilike '%' || clean_q || '%'
        or exists (
          select 1
          from unnest(p.devatas) as devata
          where devata ilike '%' || clean_q || '%'
        )
      )
  )
  select jsonb_build_object(
    'total', (select count(*) from filtered),
    'rows', coalesce((
      select jsonb_agg(to_jsonb(page_row) - 'ord' order by page_row.ord)
      from (
        select
          row_number() over (
            order by f.featured desc, f.display_order asc, f.title asc, f.id asc
          ) as ord,
          f.id,
          f.title,
          f.slug,
          f.temple_name,
          f.pratishtha_name,
          f.devatas,
          f.city,
          f.state,
          f.country,
          f.year,
          f.event_date,
          f.description,
          f.ritual_type,
          f.status,
          f.featured,
          f.display_order,
          f.updated_at,
          (
            select m.storage_path
            from public.pratishtha_media m
            where m.pratishtha_id = f.id
            order by m.display_order asc, m.created_at asc, m.id asc
            limit 1
          ) as cover_path,
          (
            select m.alt_text
            from public.pratishtha_media m
            where m.pratishtha_id = f.id
            order by m.display_order asc, m.created_at asc, m.id asc
            limit 1
          ) as cover_alt
        from filtered f
        order by f.featured desc, f.display_order asc, f.title asc, f.id asc
        limit safe_size
        offset (safe_page - 1) * safe_size
      ) page_row
    ), '[]'::jsonb)
  )
  into result;

  return result;
end;
$$;

revoke all on function public.search_pratishthas(text, text, text, text, text, text, integer, text, integer, integer) from public;
grant execute on function public.search_pratishthas(text, text, text, text, text, text, integer, text, integer, integer) to anon, authenticated;

create or replace function public.published_filter_values()
returns jsonb
language sql
stable
security invoker
set search_path = public
as $$
  select jsonb_build_object(
    'countries', coalesce((
      select jsonb_agg(country order by country)
      from (
        select distinct country
        from public.pratishthas
        where status = 'published' and country is not null and btrim(country) <> ''
      ) countries
    ), '[]'::jsonb),
    'states', coalesce((
      select jsonb_agg(state order by state)
      from (
        select distinct state
        from public.pratishthas
        where status = 'published' and state is not null and btrim(state) <> ''
      ) states
    ), '[]'::jsonb),
    'cities', coalesce((
      select jsonb_agg(city order by city)
      from (
        select distinct city
        from public.pratishthas
        where status = 'published' and city is not null and btrim(city) <> ''
      ) cities
    ), '[]'::jsonb),
    'devatas', coalesce((
      select jsonb_agg(devata order by devata)
      from (
        select distinct btrim(devata_name) as devata
        from public.pratishthas
        cross join lateral unnest(devatas) as devata_name
        where status = 'published' and btrim(devata_name) <> ''
      ) devatas
    ), '[]'::jsonb),
    'types', coalesce((
      select jsonb_agg(ritual_type order by ritual_type)
      from (
        select distinct ritual_type
        from public.pratishthas
        where status = 'published' and ritual_type is not null and btrim(ritual_type) <> ''
      ) types
    ), '[]'::jsonb),
    'years', coalesce((
      select jsonb_agg(year order by year desc)
      from (
        select distinct year
        from public.pratishthas
        where status = 'published' and year is not null
      ) years
    ), '[]'::jsonb)
  );
$$;

revoke all on function public.published_filter_values() from public;
grant execute on function public.published_filter_values() to anon, authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'pratishtha-media',
  'pratishtha-media',
  false,
  8388608,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update
set public = false,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "public read published pratishtha photographs" on storage.objects;
drop policy if exists "administrators read pratishtha photographs" on storage.objects;
drop policy if exists "administrators upload pratishtha photographs" on storage.objects;
drop policy if exists "administrators update pratishtha photographs" on storage.objects;
drop policy if exists "administrators delete pratishtha photographs" on storage.objects;

create policy "public read published pratishtha photographs"
on storage.objects
for select
to anon, authenticated
using (
  bucket_id = 'pratishtha-media'
  and exists (
    select 1
    from public.pratishtha_media
    join public.pratishthas on pratishthas.id = pratishtha_media.pratishtha_id
    where pratishtha_media.storage_path = name
      and pratishthas.status = 'published'
  )
);

create policy "administrators read pratishtha photographs"
on storage.objects
for select
to authenticated
using (bucket_id = 'pratishtha-media' and public.is_admin());

create policy "administrators upload pratishtha photographs"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'pratishtha-media' and public.is_admin());

create policy "administrators update pratishtha photographs"
on storage.objects
for update
to authenticated
using (bucket_id = 'pratishtha-media' and public.is_admin())
with check (bucket_id = 'pratishtha-media' and public.is_admin());

create policy "administrators delete pratishtha photographs"
on storage.objects
for delete
to authenticated
using (bucket_id = 'pratishtha-media' and public.is_admin());
