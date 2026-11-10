"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import type { GalleryCategory, GalleryPhotograph } from "@/data/gallery";
import { ArchivePhoto } from "@/components/archive/ArchivePhoto";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

type VisiblePhoto = GalleryPhotograph & {
  category: string;
};

export function GalleryArchive({ categories }: { categories: GalleryCategory[] }) {
  const [filter, setFilter] = useState("all");
  const [index, setIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const titleId = useId();

  const shown = categories.filter((category) => filter === "all" || category.id === filter);
  const visible: VisiblePhoto[] = shown.flatMap((category) =>
    category.photos.map((photo) => ({ ...photo, category: category.title })),
  );
  const active = index === null ? null : visible[index];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (index === null) {
      if (dialog.open) dialog.close();
      return;
    }
    if (!dialog.open) dialog.showModal();
  }, [index]);

  function open(nextIndex: number, opener: HTMLButtonElement) {
    openerRef.current = opener;
    setIndex(nextIndex);
  }

  function step(direction: -1 | 1) {
    if (visible.length < 2 || index === null) return;
    setIndex((index + direction + visible.length) % visible.length);
  }

  const starts = new Map<string, number>();
  let nextStart = 0;
  for (const category of shown) {
    starts.set(category.id, nextStart);
    nextStart += category.photos.length;
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Gallery categories">
        <FilterButton pressed={filter === "all"} onClick={() => { setFilter("all"); setIndex(null); }}>
          All
        </FilterButton>
        {categories.map((category) => (
          <FilterButton
            key={category.id}
            pressed={filter === category.id}
            onClick={() => { setFilter(category.id); setIndex(null); }}
          >
            {category.title}
          </FilterButton>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="mt-10 max-w-2xl leading-7 text-charcoal/80">
          {shown.some((category) => category.unavailable)
            ? "Some photographs could not be loaded. A category stays empty until an authentic photograph is supplied."
            : "No photographs have been placed in the archive yet. Each category is ready to receive authentic pictures."}
        </p>
      ) : null}

      <div className="mt-12 space-y-16">
        {shown.map((category) => {
          const start = starts.get(category.id) ?? 0;
          return (
            <section key={category.id} aria-labelledby={`${category.id}-heading`}>
              <h2 id={`${category.id}-heading`} className="font-display text-3xl text-burgundy md:text-4xl">
                {category.title}
              </h2>
              <p className="mt-3 max-w-xl leading-7 text-charcoal/80">{category.text}</p>
              {category.photos.length === 0 ? (
                <p className="mt-6 border border-sandstone px-6 py-8 font-display text-2xl leading-snug text-burgundy">
                  {category.unavailable ? "Photographs could not be loaded." : "Photographs will be added here."}
                </p>
              ) : (
                <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {category.photos.map((photo, photoIndex) => {
                    const photoNumber = start + photoIndex;
                    return (
                      <li key={photo.id}>
                        <button
                          type="button"
                          className="block w-full text-left"
                          onClick={(event) => open(photoNumber, event.currentTarget)}
                          aria-label={`Open photograph: ${photo.caption}`}
                        >
                          <ArchivePhoto
                            src={photo.src}
                            alt={photo.alt}
                            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          />
                        </button>
                        <p className="mt-3 leading-6 text-charcoal/80">{photo.caption}</p>
                      </li>
                    );
                  })}
                </ul>
              )}
              <div className="mt-6">
                <Button href={category.href} variant="quiet">
                  {category.linkLabel}
                </Button>
              </div>
            </section>
          );
        })}
      </div>

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        className="surface-burgundy m-auto w-[min(100vw-1.5rem,60rem)] max-h-[100dvh] overflow-y-auto border-0 bg-burgundy p-0 text-ivory backdrop:bg-charcoal/75"
        onClose={() => {
          setIndex(null);
          openerRef.current?.focus();
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") {
            event.preventDefault();
            step(1);
          }
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            step(-1);
          }
        }}
      >
        {active ? (
          <div className="p-5 sm:p-8">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="font-sans text-[0.68rem] uppercase tracking-[0.18em] text-sandstone">{active.category}</p>
                <h2 id={titleId} className="mt-3 font-display text-3xl leading-tight">
                  {active.caption}
                </h2>
                {active.alt !== active.caption ? <p className="mt-3 max-w-xl leading-7 text-sandstone">{active.alt}</p> : null}
              </div>
              <button type="button" className="shrink-0 font-sans text-[0.72rem] uppercase tracking-[0.16em] text-ivory" onClick={() => dialogRef.current?.close()}>
                Close
              </button>
            </div>
            <LightboxImage key={active.id} photo={active} />
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                className="border border-ivory/40 px-4 py-2 font-sans text-[0.72rem] uppercase tracking-[0.16em] text-ivory disabled:opacity-40"
                onClick={() => step(-1)}
                disabled={visible.length < 2}
              >
                Previous
              </button>
              <button
                type="button"
                className="border border-ivory/40 px-4 py-2 font-sans text-[0.72rem] uppercase tracking-[0.16em] text-ivory disabled:opacity-40"
                onClick={() => step(1)}
                disabled={visible.length < 2}
              >
                Next
              </button>
            </div>
          </div>
        ) : null}
      </dialog>
    </div>
  );
}

function LightboxImage({ photo }: { photo: GalleryPhotograph }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return <p className="mt-6 leading-7 text-sandstone">This photograph could not be displayed.</p>;
  }
  return (
    <div className="relative mx-auto mt-6 aspect-[4/3] w-full max-h-[68dvh]">
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes="(min-width: 768px) 60rem, 100vw"
        className="object-contain"
        onError={() => setFailed(true)}
      />
    </div>
  );
}

function FilterButton({
  pressed,
  onClick,
  children,
}: {
  pressed: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={cn(
        "border px-3 py-2 text-left font-sans text-[0.68rem] uppercase tracking-[0.14em] transition-colors duration-200",
        pressed ? "border-burgundy bg-burgundy text-ivory" : "border-sandstone text-charcoal hover:border-burgundy",
      )}
    >
      {children}
    </button>
  );
}
