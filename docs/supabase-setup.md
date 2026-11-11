# Pratishtha archive setup

The public website reads published Pratishtha records from Supabase. Administration uses the same project, with Row Level Security deciding who can write. Contact enquiries are inserted by the server with the service-role key, which bypasses Row Level Security. Do not commit `.env.local`, and do not paste a service-role key into chat or into any `NEXT_PUBLIC_` variable.

## 1. Create a Supabase project

In the Supabase dashboard, create a project and wait until the database is ready.

This step is manual.

## 2. Configure environment variables

Copy `.env.example` to `.env.local`.

From Project Settings → API, copy:

- Project URL into `NEXT_PUBLIC_SUPABASE_URL`
- The public client key into `NEXT_PUBLIC_SUPABASE_ANON_KEY`

If the dashboard shows a publishable key instead of a legacy anon key, put that publishable key in `NEXT_PUBLIC_SUPABASE_ANON_KEY`. You can instead put it in `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` and leave the anon variable empty. The application checks the anon variable first, then the publishable variable.

Leave the service-role key out of any `NEXT_PUBLIC_` variable. The contact form needs it in `SUPABASE_SERVICE_ROLE_KEY`, which only the server enquiry route reads.

Also add:

- `RESEND_API_KEY` for the enquiry notification
- `RESEND_FROM_EMAIL`, an address on a domain verified in Resend, such as `Machavolu Ramesh Sarma <enquiries@your-verified-domain>`

Do not use the Gmail recipient as the sender. Restart `npm run dev` after changing environment variables.

## 3. Apply the SQL migrations

In the Supabase dashboard, open the SQL Editor. Run the files in this order:

1. `supabase/migrations/20261111120000_pratishtha_archive.sql`
2. `supabase/migrations/20261111120100_seed_pratishthas.sql`
3. `supabase/migrations/20261111130000_enquiries.sql`

The first file creates the tables, indexes, `is_admin()`, Row Level Security policies, the private `pratishtha-media` storage bucket, and the storage policies. The second file inserts the supplied Pratishtha records as drafts. The third file creates the private `enquiries` table. Visitors cannot read or insert those rows. An administrator can read them and change their status. The website inserts new enquiries with the service-role key.

If you use the Supabase CLI later, these files are ordinary versioned migrations. The SQL Editor is enough; the CLI is not required.

Running the SQL is a manual dashboard step unless you apply it with the CLI yourself.

## 4. Create the first administrator

In the dashboard, open Authentication → Users and create a user with an email and password. This is the account that will sign in at `/admin/login`.

This step is manual. The website has no public registration page.

## 5. Enrol that account in `admin_users`

A signed-in user cannot add themselves as an administrator. There is no insert policy on `admin_users`.

In the SQL Editor, which runs with a trusted database role, replace the email and run:

```sql
insert into public.admin_users (user_id)
select id
from auth.users
where email = 'administrator@example.com';
```

Confirm one row was inserted. If the email does not match an Authentication user, the statement inserts nothing.

This step is manual.

## 6. Storage bucket and policies

The archive migration creates a private bucket named `pratishtha-media`. Uploads are limited to 8 MB and to JPEG, PNG, WebP, and AVIF. The migration also adds storage policies:

- Visitors can read an object only when a published Pratishtha record points at that object.
- Only an administrator can upload, replace, or delete objects.
- Draft photographs are not readable by the public, even if someone guesses the object path.

In the dashboard, open Storage and confirm the bucket `pratishtha-media` exists and is private. If the SQL Editor could not create it, create that private bucket yourself with the same 8 MB limit and the same MIME types, then re-run only the storage policy section of the first migration.

The public site requests short-lived signed URLs. It does not make the bucket public.

## 7. Initial records

The seed migration inserts 17 draft records from the supplied selection. Years, event dates, and street addresses that were not supplied are left empty. Statements that name several consecrations without separate temples stay as one record. Restricted Peetham material is not included.

Drafts do not appear on `/pratishtha-kainkaryam`. Sign in, open Records, review each draft, and publish the ones that should be public. A newly published record appears without rebuilding the website.

Re-running the seed will not duplicate rows. It will not restore a row whose slug was changed or deleted.

## 8. Run the website locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The archive is at `/pratishtha-kainkaryam`. Administration is at `/admin`.

Until at least one record is published, the public archive shows that no records are available. That is the expected empty state, not a failed database.

If the environment variables are missing or the database cannot be reached, the archive says it is temporarily unavailable. The other public pages do not depend on Supabase.

## 9. Deploy the environment variables to Vercel

In the Vercel project, open Settings → Environment Variables and add the same public variables used in `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`

Apply them to Production, Preview, and Development as needed, then redeploy. The service-role key and the Resend values are server-only. Do not mark them as exposed to the browser.

The database, storage bucket, policies, and administrator row live in Supabase. Deploying the website does not repeat those dashboard steps. Add and verify a sender domain in Resend before expecting an enquiry email to arrive.

## What the policies enforce

Public visitors, including signed-in users who are not administrators, can read rows whose status is `published` and the photographs attached to those rows. They cannot insert, update, delete, or publish records, and they cannot read `admin_users` except that a signed-in user can see their own administrator row if one exists.

Administrators can create, edit, publish, unpublish, and delete records, and can manage photographs. They can also read enquiries and change an enquiry's status. They cannot edit the enquiry text. `/admin` also checks the session on the server. A visitor who is not signed in is redirected to `/admin/login`. Hiding a button is not the security check. Public roles have no policy that lets them read or insert enquiries.

## Manual dashboard work

These cannot be completed from the repository:

- Create the Supabase project.
- Copy the project URL, the public anon or publishable key, and the server-only service-role key into `.env.local` and Vercel.
- Add `RESEND_API_KEY` and a verified `RESEND_FROM_EMAIL`.
- Run the three SQL files if you are not applying migrations another way.
- Create the Authentication user.
- Insert that user into `admin_users`.
- Confirm the private storage bucket if the migration could not create it.
