import { connection } from "next/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { signOut } from "@/app/actions/auth";
import { LoginForm } from "@/components/admin/LoginForm";
import { Container } from "@/components/layout/Container";
import { getSessionRole } from "@/lib/auth";
import { readParam } from "@/lib/pratishtha/url";

async function LoginScreen({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await connection();
  const params = await searchParams;
  const session = await getSessionRole();
  const nextPath = readParam(params.next);

  if (session.role === "admin") redirect(nextPath.startsWith("/admin") && !nextPath.startsWith("/admin/login") ? nextPath : "/admin");

  return (
    <Container className="py-16 md:py-24">
      <p className="font-sans text-[0.72rem] uppercase tracking-[0.16em] text-burgundy">Administration</p>
      <h1 className="mt-4 font-display text-5xl text-burgundy">Sign in</h1>
      {session.role === "unconfigured" ? (
        <p className="mt-6 max-w-xl leading-7 text-charcoal/80">
          Add NEXT_PUBLIC_SUPABASE_URL and either NEXT_PUBLIC_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, then restart the website. The setup steps are in docs/supabase-setup.md.
        </p>
      ) : null}
      {session.role === "unavailable" ? (
        <p className="mt-6 max-w-xl leading-7 text-charcoal/80">The archive database is temporarily unavailable.</p>
      ) : null}
      {session.role === "user" ? (
        <div className="mt-6 max-w-xl">
          <p className="leading-7 text-charcoal/80">This account is not an administrator.</p>
          <form action={signOut} className="mt-4">
            <button type="submit" className="font-sans text-[0.72rem] uppercase tracking-[0.16em] text-burgundy">
              Sign out
            </button>
          </form>
        </div>
      ) : null}
      {session.role === "anon" ? <LoginForm nextPath={nextPath.startsWith("/admin") ? nextPath : "/admin"} /> : null}
    </Container>
  );
}

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <Suspense fallback={<Container className="py-16"><p className="leading-7 text-charcoal/75">Loading sign in…</p></Container>}>
      <LoginScreen searchParams={searchParams} />
    </Suspense>
  );
}
