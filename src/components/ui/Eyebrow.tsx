import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Eyebrow({
  children,
  className,
  tone = "dark",
}: {
  children: ReactNode;
  className?: string;
  tone?: "dark" | "light";
}) {
  return (
    <p
      className={cn(
        "flex items-center gap-3 font-sans text-[0.72rem] uppercase tracking-[0.28em]",
        tone === "light" ? "text-sandstone" : "text-charcoal",
        className,
      )}
    >
      <span aria-hidden="true" className="h-px w-8 bg-gold" />
      {children}
    </p>
  );
}
