import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "quiet" | "inverse" | "light";

const variants: Record<Variant, string> = {
  primary: "bg-burgundy text-ivory hover:bg-burgundy/90",
  secondary: "border border-burgundy/35 text-burgundy hover:border-burgundy",
  quiet: "text-burgundy underline decoration-gold underline-offset-[0.4em] hover:decoration-burgundy",
  inverse: "bg-ivory text-burgundy hover:bg-sandstone",
  light: "border border-ivory text-ivory hover:bg-ivory/10",
};

type Common = {
  variant?: Variant;
  className?: string;
  children: ReactNode;
};

type ButtonProps = Common &
  Omit<ComponentProps<"button">, "className" | "children"> & {
    href?: undefined;
  };

type LinkButtonProps = Common &
  Omit<ComponentProps<"a">, "className" | "children" | "href"> & {
    href: string;
  };

export function Button({
  variant = "primary",
  className,
  children,
  href,
  ...props
}: ButtonProps | LinkButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center text-center font-sans text-[0.72rem] uppercase tracking-[0.2em] transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50",
    variant === "quiet" ? "px-0 py-1" : "px-6 py-3",
    variants[variant],
    className,
  );

  if (typeof href === "string") {
    if (href.startsWith("/") && !href.startsWith("//")) {
      return (
        <Link href={href} className={classes} {...(props as Omit<LinkButtonProps, keyof Common | "href">)}>
          {children}
        </Link>
      );
    }

    return (
      <a href={href} className={classes} {...(props as Omit<LinkButtonProps, keyof Common | "href">)}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...(props as Omit<ButtonProps, keyof Common | "href">)}>
      {children}
    </button>
  );
}
