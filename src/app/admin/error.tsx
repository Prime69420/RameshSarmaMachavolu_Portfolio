"use client";

import { Container } from "@/components/layout/Container";

export default function AdminError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <Container className="py-16">
      <h1 className="font-display text-4xl text-burgundy">Administration is temporarily unavailable</h1>
      <p className="mt-4 max-w-xl leading-7 text-charcoal/80">This page could not be opened. Please try again.</p>
      <button type="button" onClick={reset} className="mt-6 bg-burgundy px-6 py-3 font-sans text-[0.72rem] uppercase tracking-[0.2em] text-ivory">
        Try again
      </button>
    </Container>
  );
}
