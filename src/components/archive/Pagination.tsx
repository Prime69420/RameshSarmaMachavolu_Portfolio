import Link from "next/link";

const linkClass =
  "inline-flex min-h-11 min-w-11 items-center justify-center border border-sandstone px-3 font-sans text-sm text-burgundy hover:border-burgundy";
const currentClass =
  "inline-flex min-h-11 min-w-11 items-center justify-center border border-burgundy bg-burgundy px-3 font-sans text-sm text-ivory";
const disabledClass =
  "inline-flex min-h-11 items-center justify-center px-3 font-sans text-sm text-charcoal/40";

function visiblePages(page: number, pages: number) {
  if (pages <= 7) return Array.from({ length: pages }, (_, index) => index + 1);
  const items: Array<number | "gap"> = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(pages - 1, page + 1);
  if (start > 2) items.push("gap");
  for (let number = start; number <= end; number += 1) items.push(number);
  if (end < pages - 1) items.push("gap");
  items.push(pages);
  return items;
}

export function Pagination({
  page,
  total,
  pageSize,
  hrefFor,
}: {
  page: number;
  total: number;
  pageSize: number;
  hrefFor: (page: number) => string;
}) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (pages <= 1) return null;
  const current = Math.min(page, pages);
  const numbers = visiblePages(current, pages);

  return (
    <nav aria-label="Pagination" className="mt-10 flex flex-wrap items-center gap-2">
      {current > 1 ? (
        <Link href={hrefFor(current - 1)} className={linkClass}>
          Previous
        </Link>
      ) : (
        <span className={disabledClass}>Previous</span>
      )}
      {numbers.map((item, index) =>
        item === "gap" ? (
          <span key={`gap-${index}`} className="px-1 text-charcoal/50" aria-hidden="true">
            …
          </span>
        ) : (
          <Link
            key={item}
            href={hrefFor(item)}
            aria-current={item === current ? "page" : undefined}
            className={item === current ? currentClass : linkClass}
          >
            {item}
          </Link>
        ),
      )}
      {current < pages ? (
        <Link href={hrefFor(current + 1)} className={linkClass}>
          Next
        </Link>
      ) : (
        <span className={disabledClass}>Next</span>
      )}
    </nav>
  );
}
