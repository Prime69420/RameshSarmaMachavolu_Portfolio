import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

const sizes = {
  display: "text-display",
  title: "text-title",
  section: "text-section",
} as const;

export function Heading({
  as: Tag = "h2",
  size = "section",
  className,
  children,
  id,
}: {
  as?: "h1" | "h2" | "h3";
  size?: keyof typeof sizes;
  className?: string;
  children: ReactNode;
  id?: string;
}) {
  return (
    <Tag id={id} className={cn("font-display font-medium text-burgundy", sizes[size], className)}>
      {children}
    </Tag>
  );
}
