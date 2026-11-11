The gallery and contact pages are finished and linked from the public header and footer.

**Gallery** reads published Pratishtha photographs from the existing `pratishtha_media` records and signs their current storage paths. It does not copy those files, and unpublished records stay out of the public gallery. The other seven categories stay in the shared gallery list. All eight are empty right now, and each one says photographs will be added rather than showing a stock or broken image. Category filters work. The lightbox has previous, next, and Escape-to-close controls, but it could not be opened because no published photograph exists yet.

**Contact** is an enquiry form with the eight requested categories. Name, phone, category, location, and message are required. Email is optional and is checked when it is filled in. A valid submission stays on the page: it is not sent and not stored. Live delivery needs `enquiryEndpoint` in `src/data/enquiry.ts` set to a same-origin handler such as `/api/enquiry`, with that handler implemented on the server. No keys belong in that file.

No telephone number, email address, postal address, or social account is published. The footer still marks contact details and social accounts as placeholders.

Personal Sadhana and Temple Contributions remain linked from the homepage and from the matching gallery categories. The public pages checked do not show admin, login, or dashboard links.

`npm run lint` and `npm run build` both completed with no errors. Gallery and contact have no horizontal overflow at 390px or 1440px.

**Files modified**
- `src/app/gallery/page.tsx`
- `src/components/gallery/GalleryArchive.tsx`
- `src/data/gallery.ts`
- `src/lib/pratishtha/queries.ts`
- `src/app/actions/pratishthas.ts`
- `src/app/contact/page.tsx`
- `src/data/enquiry.ts`
- `README.md`

**Still outstanding**
- No authentic photographs have been supplied for any gallery category.
- No published Pratishtha record currently has a photograph, so the Temple Pratishthas section is empty until one is added and published.
- No verified contact details have been supplied.
- The enquiry form will not deliver messages until the endpoint above is configured.