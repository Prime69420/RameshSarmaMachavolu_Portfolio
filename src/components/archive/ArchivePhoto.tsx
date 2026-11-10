"use client";

import Image from "next/image";
import { useState } from "react";

export function ArchivePhoto({
  src,
  alt,
  sizes,
  caption,
}: {
  src: string;
  alt: string;
  sizes: string;
  caption?: string | null;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <p className="text-sm leading-6 text-charcoal/70">This photograph could not be displayed.</p>;
  }

  return (
    <figure>
      <div className="relative aspect-[4/3] overflow-hidden bg-sandstone/40">
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className="object-cover"
          onError={() => setFailed(true)}
        />
      </div>
      {caption ? <figcaption className="mt-3 text-sm leading-6 text-charcoal/75">{caption}</figcaption> : null}
    </figure>
  );
}
