import { ContactMethods } from "@/components/contact/ContactMethods";
import { Container } from "@/components/layout/Container";
import { CopyrightYear } from "@/components/layout/CopyrightYear";
import { SiteNav } from "@/components/layout/SiteNav";
import { site } from "@/data/site";

export function SiteFooter() {
  return (
    <footer data-page-chrome="" className="surface-burgundy mt-auto bg-burgundy text-ivory">
      <Container className="grid gap-12 border-t border-gold/40 py-14 md:grid-cols-[1.2fr_1fr_1fr] md:py-16">
        <div>
          <p className="font-display text-3xl leading-tight md:text-4xl">{site.honorificName}</p>
          <p className="mt-3 max-w-xs font-sans text-sm leading-6 text-sandstone">{site.designation}</p>
        </div>
        <nav aria-label="Footer">
          <p className="font-sans text-[0.68rem] uppercase tracking-[0.2em] text-sandstone">Record</p>
          <SiteNav
            tone="burgundy"
            className="mt-5 grid gap-3"
            linkClassName="inline-block tracking-[0.14em]"
          />
        </nav>
        <div>
          <p className="font-sans text-[0.68rem] uppercase tracking-[0.2em] text-sandstone">Contact</p>
          <ContactMethods tone="burgundy" compact className="mt-5" />
        </div>
      </Container>
      <Container className="border-t border-ivory/15 py-6">
        <p className="font-sans text-xs tracking-[0.08em] text-sandstone">
          © <CopyrightYear /> {site.name}
        </p>
      </Container>
    </footer>
  );
}
