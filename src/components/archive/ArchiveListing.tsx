import Link from "next/link";
import { connection } from "next/server";
import { ArchivePhoto } from "@/components/archive/ArchivePhoto";
import { Pagination } from "@/components/archive/Pagination";
import { publishedFilters, searchArchive, signedUrls } from "@/lib/pratishtha/queries";
import { locationLabel, PAGE_SIZE, type ArchiveRow, type FilterOptions } from "@/lib/pratishtha/types";
import { archiveHref, hasArchiveFilters, parsePage, readParam } from "@/lib/pratishtha/url";

const labelClass = "block font-sans text-[0.72rem] uppercase tracking-[0.16em] text-charcoal";
const fieldClass = "mt-2 w-full border-0 border-b border-sandstone bg-transparent py-3 font-sans text-base text-charcoal";

function withCurrent(values: string[], current: string) {
  if (current && !values.includes(current)) return [current, ...values];
  return values;
}

function FilterSelect({
  name,
  label,
  value,
  options,
}: {
  name: string;
  label: string;
  value: string;
  options: string[];
}) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      <select name={name} defaultValue={value} className={fieldClass}>
        <option value="">Any</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export async function ArchiveListing({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await connection();
  const params = await searchParams;
  const filters = {
    q: readParam(params.q),
    country: readParam(params.country),
    state: readParam(params.state),
    city: readParam(params.city),
    devata: readParam(params.devata),
    type: readParam(params.type),
    year: readParam(params.year),
  };
  const page = parsePage(readParam(params.page));
  const [result, options] = await Promise.all([
    searchArchive({ ...filters, page }, "published"),
    publishedFilters(),
  ]);

  return (
    <div className="border-t border-sandstone py-12 md:py-16">
      <form method="get" action="/pratishtha-kainkaryam" className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <label className="block md:col-span-2 xl:col-span-4">
          <span className={labelClass}>Search</span>
          <input
            name="q"
            defaultValue={filters.q}
            placeholder="Temple, Pratishtha, Devata, or place"
            className={fieldClass}
          />
        </label>
        <FilterFields filters={filters} options={options.ok ? options.data : emptyOptions} />
        <div className="flex flex-wrap items-end gap-3 md:col-span-2 xl:col-span-4">
          <button type="submit" className="bg-burgundy px-6 py-3 font-sans text-[0.72rem] uppercase tracking-[0.2em] text-ivory">
            Search
          </button>
          <Link href="/pratishtha-kainkaryam" className="border border-burgundy/35 px-6 py-3 font-sans text-[0.72rem] uppercase tracking-[0.2em] text-burgundy">
            Clear
          </Link>
        </div>
      </form>

      {!result.ok || !options.ok ? (
        <ArchiveMessage title="The archive is temporarily unavailable" body="The records could not be loaded. Please try again later." />
      ) : result.data.total === 0 ? (
        <ArchiveMessage
          title={hasArchiveFilters(filters) ? "No records match this search" : "No records available"}
          body={
            hasArchiveFilters(filters)
              ? "Try a different word or clear the filters. Only published records are shown."
              : "Published Pratishtha records will appear here."
          }
        />
      ) : result.data.rows.length === 0 ? (
        <div className="mt-10">
          <ArchiveMessage title="No records on this page" body="This page is outside the published archive." />
          <Link href={archiveHref(filters)} className="mt-4 inline-block font-sans text-[0.72rem] uppercase tracking-[0.16em] text-burgundy">
            First page
          </Link>
        </div>
      ) : (
        <Results filters={filters} page={page} total={result.data.total} rows={result.data.rows} />
      )}
    </div>
  );
}

const emptyOptions: FilterOptions = { countries: [], states: [], cities: [], devatas: [], types: [], years: [] };

function FilterFields({
  filters,
  options,
}: {
  filters: { country: string; state: string; city: string; devata: string; type: string; year: string };
  options: FilterOptions;
}) {
  const years = options.years.map(String);
  return (
    <>
      <FilterSelect name="country" label="Country" value={filters.country} options={withCurrent(options.countries, filters.country)} />
      <FilterSelect name="state" label="State" value={filters.state} options={withCurrent(options.states, filters.state)} />
      <FilterSelect name="city" label="City" value={filters.city} options={withCurrent(options.cities, filters.city)} />
      <FilterSelect name="devata" label="Devata" value={filters.devata} options={withCurrent(options.devatas, filters.devata)} />
      <FilterSelect name="type" label="Pratishtha type" value={filters.type} options={withCurrent(options.types, filters.type)} />
      <FilterSelect name="year" label="Year" value={filters.year} options={withCurrent(years, filters.year)} />
    </>
  );
}

function ArchiveMessage({ title, body }: { title: string; body: string }) {
  return (
    <div className="mt-12 border-t border-sandstone pt-8">
      <h2 className="font-display text-3xl text-burgundy">{title}</h2>
      <p className="mt-4 max-w-2xl leading-7 text-charcoal/80">{body}</p>
    </div>
  );
}

async function Results({
  filters,
  page,
  total,
  rows,
}: {
  filters: { q: string; country: string; state: string; city: string; devata: string; type: string; year: string };
  page: number;
  total: number;
  rows: ArchiveRow[];
}) {
  const urls = await signedUrls(rows.flatMap((row) => (row.cover_path ? [row.cover_path] : [])));
  const start = (page - 1) * PAGE_SIZE + 1;
  const end = start + rows.length - 1;

  return (
    <div className="mt-12">
      <p className="font-sans text-sm text-charcoal/70">
        Showing {start}–{end} of {total}
      </p>
      <div className="mt-4 border-t border-sandstone">
        {rows.map((row) => {
          const place = locationLabel(row);
          const cover = row.cover_path ? urls.get(row.cover_path) : undefined;
          return (
            <article key={row.id} className="border-b border-sandstone py-8">
              <Link href={`/pratishtha-kainkaryam/${row.slug}`} className="grid gap-6 md:grid-cols-12">
                {cover ? (
                  <div className="md:col-span-4">
                    <ArchivePhoto src={cover} alt={row.cover_alt || row.title} sizes="(min-width: 768px) 280px, 100vw" />
                  </div>
                ) : null}
                <div className={cover ? "md:col-span-8" : "md:col-span-12"}>
                  {row.featured ? <p className="font-sans text-[0.72rem] uppercase tracking-[0.16em] text-burgundy">Featured</p> : null}
                  <h2 className="font-display text-3xl leading-tight text-burgundy md:text-4xl">{row.title}</h2>
                  {row.temple_name ? <p className="mt-3 leading-7 text-charcoal/85">{row.temple_name}</p> : null}
                  {row.devatas.length > 0 ? <p className="mt-2 leading-7 text-charcoal/85">{row.devatas.join(", ")}</p> : null}
                  {place ? <p className="mt-2 leading-7 text-charcoal/85">{place}</p> : null}
                  {row.year ? <p className="mt-2 leading-7 text-charcoal/85">{row.year}</p> : null}
                  {row.pratishtha_name && row.pratishtha_name !== row.title ? (
                    <p className="mt-2 leading-7 text-charcoal/75">{row.pratishtha_name}</p>
                  ) : null}
                  {!cover ? <p className="mt-4 text-sm text-charcoal/60">No photograph available.</p> : null}
                </div>
              </Link>
            </article>
          );
        })}
      </div>
      <Pagination page={page} total={total} pageSize={PAGE_SIZE} hrefFor={(nextPage) => archiveHref(filters, nextPage)} />
    </div>
  );
}
