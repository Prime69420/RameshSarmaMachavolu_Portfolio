"use client";

import { useActionState } from "react";
import { signIn } from "@/app/actions/auth";

const fieldClass = "mt-2 w-full border-0 border-b border-sandstone bg-transparent py-3 font-sans text-base text-charcoal";

export function LoginForm({ nextPath }: { nextPath: string }) {
  const [state, action, pending] = useActionState(signIn, null);

  return (
    <form action={action} className="mt-10 max-w-md">
      <input type="hidden" name="next" value={nextPath} />
      <label className="block font-sans text-[0.72rem] uppercase tracking-[0.16em] text-charcoal" htmlFor="admin-email">
        Email
      </label>
      <input id="admin-email" name="email" type="email" autoComplete="username" required className={fieldClass} />
      <label className="mt-8 block font-sans text-[0.72rem] uppercase tracking-[0.16em] text-charcoal" htmlFor="admin-password">
        Password
      </label>
      <input id="admin-password" name="password" type="password" autoComplete="current-password" required className={fieldClass} />
      {state?.ok === false ? (
        <p role="alert" className="mt-6 text-sm leading-6 text-burgundy">
          {state.error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="mt-8 inline-flex bg-burgundy px-6 py-3 font-sans text-[0.72rem] uppercase tracking-[0.2em] text-ivory disabled:opacity-50"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
