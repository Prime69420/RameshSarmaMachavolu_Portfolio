# Machavolu Ramesh Sarma

Foundation for the personal record of Sri Machavolu Ramesh Sarma, Vedic Scholar and Agama Vidwan.

The public record is published: the homepage, the inner pages, the gallery, and the enquiry page.

The Pratishtha archive and private administration pages read from Supabase. Setup is described in [docs/supabase-setup.md](docs/supabase-setup.md). Without those environment variables, the public archive shows that the database is unavailable and the rest of the site continues to work. Published Pratishtha photographs also appear in the gallery from the same storage paths.

## Enquiries

The contact page collects a name, email address, optional mobile number, subject and message. Submissions are posted to `/api/enquiry`. The handler validates the input, rate-limits the request, rejects a filled honeypot, and stores the row with the server-only `SUPABASE_SERVICE_ROLE_KEY`. Visitors cannot read the `enquiries` table. Administrators review messages at `/admin/enquiries`.

Email notification uses `RESEND_API_KEY` and `RESEND_FROM_EMAIL`. The sender must be an address on a domain verified in Resend, not the Gmail recipient. If the database save succeeds and the email does not, the enquiry is kept and the page says the notification was not sent. If the database save fails, nothing is described as received.

Apply `supabase/migrations/20261111130000_enquiries.sql` before expecting a live submission to be stored. The setup notes are in [docs/supabase-setup.md](docs/supabase-setup.md).

## Develop

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production check

```bash
npm run build
npm start
```
