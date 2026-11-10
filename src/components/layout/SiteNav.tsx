"use client";

import { Suspense, type MouseEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { destination, primaryNavigation } from "@/data/navigation";
import { cn } from "@/lib/cn";

function SiteNavList({
  className,
  linkClassName,
  onNavigate,
  tone = "ivory",
  pathname,
}: {
  className?: string;
  linkClassName?: string;
  onNavigate?: (event: MouseEvent<HTMLAnchorElement>) => void;
  tone?: "ivory" | "burgundy" | "menu";
  pathname: string | null;
}) {
  return (
    <ul className={className}>
      {primaryNavigation.map((item) => {
        const current = pathname === item.href;
        const classes = cn(
          "whitespace-nowrap transition-colors duration-200",
          tone === "menu" && "font-display text-[1.85rem] leading-none text-burgundy",
          tone !== "menu" && "font-sans text-[0.68rem] uppercase tracking-[0.16em]",
          tone === "ivory" && "text-charcoal hover:text-burgundy",
          tone === "burgundy" && "text-sandstone hover:text-ivory",
          current && tone === "ivory" && "text-burgundy",
          current && tone === "burgundy" && "text-ivory",
          current && tone === "menu" && "border-l border-gold pl-4",
          linkClassName,
        );

        return (
          <li key={item.id}>
            <Link
              href={destination(item)}
              className={classes}
              aria-current={current ? "page" : undefined}
              onClick={onNavigate}
            >
              {item.shortLabel}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function SiteNavPath(props: {
  className?: string;
  linkClassName?: string;
  onNavigate?: (event: MouseEvent<HTMLAnchorElement>) => void;
  tone?: "ivory" | "burgundy" | "menu";
}) {
  const pathname = usePathname();
  return <SiteNavList {...props} pathname={pathname} />;
}

export function SiteNav(props: {
  className?: string;
  linkClassName?: string;
  onNavigate?: (event: MouseEvent<HTMLAnchorElement>) => void;
  tone?: "ivory" | "burgundy" | "menu";
}) {
  return (
    <Suspense fallback={<SiteNavList {...props} pathname={null} />}>
      <SiteNavPath {...props} />
    </Suspense>
  );
}
