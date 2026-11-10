import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function SuppliedImage({
  src,
  alt,
  children,
  className,
  sizes = "(min-width: 1024px) 30vw, 50vw",
}: {
  src: string | null;
  alt: string;
  children: ReactNode;
  className?: string;
  sizes?: string;
}) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {src ? <Image src={src} alt={alt} fill className="object-cover" sizes={sizes} /> : children}
    </div>
  );
}
