import { connection } from "next/server";
import { redirect } from "next/navigation";
import { Suspense, type ReactNode } from "react";
import { signOut } from "@/app/actions/auth";
import { AdminChrome, AdminMessage } from "@/components/admin/AdminChrome";
import { getSessionRole } from "@/lib/auth";

async function DashboardGate({ children }: { children: ReactNode }) {
  await connection();
  const session = await getSessionRole();
  if (session.role === "anon") redirect("/admin/login");
  if (session.role === "unconfigured") {
    return (
      <AdminMessage title="Database not configured">
        Add NEXT_PUBLIC_SUPABASE_URL and either NEXT_PUBLIC_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY. The setup steps are in docs/supabase-setup.md.
      </AdminMessage>
    );
  }
  if (session.role === "unavailable") {
    return <AdminMessage title="Database temporarily unavailable">The administration pages could not be loaded. Please try again later.</AdminMessage>;
  }
  if (session.role === "user") {
    return (
      <div>
        <AdminMessage title="Not an administrator">This account can sign in, but it cannot view or change the archive.</AdminMessage>
        <form action={signOut} className="px-6 pb-16 md:px-10">
          <button type="submit" className="font-sans text-[0.72rem] uppercase tracking-[0.16em] text-burgundy">
            Sign out
          </button>
        </form>
      </div>
    );
  }

  return (
    <>
      <AdminChrome email={session.email} />
      {children}
    </>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<p className="px-6 py-16 font-sans text-sm text-charcoal/70">Loading administration…</p>}>
      <DashboardGate>{children}</DashboardGate>
    </Suspense>
  );
}
