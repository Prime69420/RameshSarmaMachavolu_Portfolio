# Machavolu Ramesh Sarma

Foundation for the personal record of Sri Machavolu Ramesh Sarma, Vedic Scholar and Agama Vidwan.

The public record is published: the homepage, the inner pages, the gallery, and the enquiry page.

The Pratishtha archive and private administration pages read from Supabase. Setup is described in [docs/supabase-setup.md](docs/supabase-setup.md). Without those environment variables, the public archive shows that the database is unavailable and the rest of the site continues to work. Published Pratishtha photographs also appear in the gallery from the same storage paths.

## Enquiries

The contact form does not send or store a message while `enquiryEndpoint` in `src/data/enquiry.ts` is `null`. Before accepting live enquiries, set that value to a same-origin handler such as `/api/enquiry` and implement the handler on the server. Do not put keys or secrets in the client file. No telephone number, email address, or postal address is published because none has been supplied.

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
