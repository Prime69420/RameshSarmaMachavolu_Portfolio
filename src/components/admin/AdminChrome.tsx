import Link from "next/link";
import { signOut } from "@/app/actions/auth";
import { Container } from "@/components/layout/Container";

const linkClass = "font-sans text-[0.72rem] uppercase tracking-[0.16em] text-charcoal hover:text-burgundy";

export function AdminChrome({ email }: { email: string }) {
  return (
    <div className="border-b border-sandstone bg-ivory">
      <Container className="flex flex-col gap-4 py-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="font-sans text-[0.72rem] uppercase tracking-[0.16em] text-burgundy">Administration</p>
          <p className="mt-1 text-sm text-charcoal/70">{email}</p>
        </div>
        <nav aria-label="Administration" className="flex flex-wrap gap-x-5 gap-y-3">
          <Link href="/admin" className={linkClass}>
            Overview
          </Link>
          <Link href="/admin/pratishthas" className={linkClass}>
            Records
          </Link>
          <Link href="/admin/enquiries" className={linkClass}>
            Enquiries
          </Link>
          <Link href="/admin/pratishthas/new" className={linkClass}>
            Add Pratishtha
          </Link>
        </nav>
        <form action={signOut}>
          <button type="submit" className="font-sans text-[0.72rem] uppercase tracking-[0.16em] text-burgundy">
            Sign out
          </button>
        </form>
      </Container>
    </div>
  );
}

export function AdminMessage({ title, children }: { title: string; children: string }) {
  return (
    <Container className="py-16">
      <h1 className="font-display text-4xl text-burgundy">{title}</h1>
      <p className="mt-4 max-w-xl leading-7 text-charcoal/80">{children}</p>
    </Container>
  );
}
