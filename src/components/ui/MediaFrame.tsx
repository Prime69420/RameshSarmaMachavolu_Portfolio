import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function MediaFrame({
  children,
  className,
  label,
}: {
  children?: ReactNode;
  className?: string;
  label?: string;
}) {
  return (
    <figure className={cn("w-full", className)}>
      <div className="flex aspect-[4/5] w-full items-center justify-center bg-sandstone">{children}</div>
      {label ? (
        <figcaption className="mt-4 font-sans text-[0.72rem] uppercase tracking-[0.16em] text-charcoal/70">
          {label}
        </figcaption>
      ) : null}
    </figure>
  );
}
