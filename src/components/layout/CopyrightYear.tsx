import { Suspense } from "react";
import { connection } from "next/server";

async function Year() {
  await connection();
  return new Date().getFullYear();
}

export function CopyrightYear() {
  return (
    <Suspense fallback={<span className="inline-block w-[2.6em]" />}>
      <Year />
    </Suspense>
  );
}
