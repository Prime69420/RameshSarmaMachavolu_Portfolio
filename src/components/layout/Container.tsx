import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Container({
  children,
  className,
  as,
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}) {
  const Tag = as ?? "div";

  return <Tag className={cn("mx-auto w-full max-w-6xl px-6 md:px-10", className)}>{children}</Tag>;
}
