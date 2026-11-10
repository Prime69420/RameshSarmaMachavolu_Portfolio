"use client";

import { useState, type FormEvent } from "react";
import { savePratishtha } from "@/app/actions/pratishthas";
import { slugify } from "@/lib/slug";
import { parsePratishthaForm } from "@/lib/pratishtha/validation";
import type { PratishthaStatus } from "@/lib/pratishtha/types";

const labelClass = "block font-sans text-[0.72rem] uppercase tracking-[0.16em] text-charcoal";
const fieldClass = "mt-2 w-full border-0 border-b border-sandstone bg-transparent py-3 font-sans text-base text-charcoal";

export type PratishthaFormValues = {
  id?: string;
  title: string;
  slug: string;
  temple_name: string;
  pratishtha_name: string;
  devatas: string[];
  city: string;
  state: string;
  country: string;
  year: string;
  event_date: string;
  description: string;
  ritual_type: string;
  status: PratishthaStatus;
  featured: boolean;
  display_order: string;
};

export function PratishthaForm({
  initial,
  includePhotos = false,
}: {
  initial: PratishthaFormValues;
  includePhotos?: boolean;
}) {
  const [title, setTitle] = useState(initial.title);
  const [slug, setSlug] = useState(initial.slug);
  const [slugEdited, setSlugEdited] = useState(Boolean(initial.slug));
  const [devatas, setDevatas] = useState(initial.devatas.length > 0 ? initial.devatas : [""]);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function updateDevata(index: number, value: string) {
    setDevatas((current) => current.map((item, itemIndex) => (itemIndex === index ? value : item)));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const parsed = parsePratishthaForm(data);
    if (!parsed.ok) {
      setMessage(null);
      setError(parsed.error);
      return;
    }

    setPending(true);
    setError(null);
    try {
      const result = await savePratishtha(null, data);
      if (result?.ok === false) setError(result.error);
      if (result?.ok === true) {
        setMessage(result.message ?? "Saved.");
        setSlugEdited(true);
      }
    } catch (caught) {
      if (typeof caught === "object" && caught && "digest" in caught) throw caught;
      setError("The record could not be saved. Try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-10 max-w-3xl" noValidate>
      {initial.id ? <input type="hidden" name="id" value={initial.id} /> : null}
      <p className="max-w-2xl leading-7 text-charcoal/75">
        Unknown dates, years, temple names, and other details can be left blank.
      </p>
      {error ? (
        <p role="alert" className="mt-6 text-sm leading-6 text-burgundy">
          {error}
        </p>
      ) : null}
      {message ? (
        <p role="status" className="mt-6 text-sm leading-6 text-burgundy">
          {message}
        </p>
      ) : null}

      <fieldset className="mt-10 space-y-6">
        <legend className="font-display text-3xl text-burgundy">Basic information</legend>
        <label className={labelClass} htmlFor="title">
          Display title
        </label>
        <input
          id="title"
          name="title"
          value={title}
          onChange={(event) => {
            const value = event.target.value;
            setTitle(value);
            if (!slugEdited) setSlug(slugify(value));
          }}
          className={fieldClass}
          required
        />
        <label className={labelClass} htmlFor="temple_name">
          Temple or project name
        </label>
        <input id="temple_name" name="temple_name" defaultValue={initial.temple_name} className={fieldClass} />
        <label className={labelClass} htmlFor="pratishtha_name">
          Pratishtha name or type
        </label>
        <input id="pratishtha_name" name="pratishtha_name" defaultValue={initial.pratishtha_name} className={fieldClass} />
        <label className={labelClass} htmlFor="slug">
          URL slug
        </label>
        <input
          id="slug"
          name="slug"
          value={slug}
          onChange={(event) => {
            setSlugEdited(true);
            setSlug(event.target.value);
          }}
          className={fieldClass}
          spellCheck={false}
          required
        />
        <p className="text-sm leading-6 text-charcoal/70">Generated from the title. You can edit it before saving.</p>
      </fieldset>

      <fieldset className="mt-12">
        <legend className="font-display text-3xl text-burgundy">Deity information</legend>
        <div className="mt-6 space-y-4">
          {devatas.map((devata, index) => (
            <div key={`devata-${index}`} className="flex items-end gap-3">
              <div className="min-w-0 flex-1">
                <label className={labelClass} htmlFor={`devata-${index}`}>
                  Devata {index + 1}
                </label>
                <input
                  id={`devata-${index}`}
                  name="devatas"
                  value={devata}
                  onChange={(event) => updateDevata(index, event.target.value)}
                  className={fieldClass}
                />
              </div>
              <button
                type="button"
                className="pb-3 font-sans text-[0.72rem] uppercase tracking-[0.14em] text-burgundy"
                onClick={() => setDevatas((current) => (current.length === 1 ? [""] : current.filter((_, itemIndex) => itemIndex !== index)))}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="mt-4 font-sans text-[0.72rem] uppercase tracking-[0.14em] text-burgundy"
          onClick={() => setDevatas((current) => [...current, ""])}
        >
          Add Devata
        </button>
      </fieldset>

      <fieldset className="mt-12 grid gap-6 md:grid-cols-3">
        <legend className="font-display text-3xl text-burgundy md:col-span-3">Location</legend>
        <div>
          <label className={labelClass} htmlFor="city">
            City
          </label>
          <input id="city" name="city" defaultValue={initial.city} className={fieldClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="state">
            State
          </label>
          <input id="state" name="state" defaultValue={initial.state} className={fieldClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="country">
            Country
          </label>
          <input id="country" name="country" defaultValue={initial.country} className={fieldClass} />
        </div>
      </fieldset>

      <fieldset className="mt-12 space-y-6">
        <legend className="font-display text-3xl text-burgundy">Event details</legend>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="year">
              Year
            </label>
            <input id="year" name="year" inputMode="numeric" defaultValue={initial.year} className={fieldClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="event_date">
              Event date
            </label>
            <input id="event_date" name="event_date" type="date" defaultValue={initial.event_date} className={fieldClass} />
          </div>
        </div>
        <label className={labelClass} htmlFor="description">
          Description
        </label>
        <textarea id="description" name="description" rows={6} defaultValue={initial.description} className={fieldClass} />
        <label className={labelClass} htmlFor="ritual_type">
          Ritual type
        </label>
        <input id="ritual_type" name="ritual_type" defaultValue={initial.ritual_type} className={fieldClass} />
      </fieldset>

      <fieldset className="mt-12 space-y-6">
        <legend className="font-display text-3xl text-burgundy">Presentation</legend>
        <label className="flex items-center gap-3 font-sans text-sm text-charcoal">
          <input type="checkbox" name="featured" defaultChecked={initial.featured} className="size-4 accent-burgundy" />
          Featured
        </label>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="display_order">
              Display order
            </label>
            <input id="display_order" name="display_order" inputMode="numeric" defaultValue={initial.display_order} className={fieldClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="status">
              Status
            </label>
            <select id="status" name="status" defaultValue={initial.status} className={fieldClass}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>
      </fieldset>

      {includePhotos ? (
        <fieldset className="mt-12 space-y-6">
          <legend className="font-display text-3xl text-burgundy">Photographs</legend>
          <p className="text-sm leading-7 text-charcoal/75">
            JPEG, PNG, WebP, or AVIF. Up to 8 files, 8 MB each. Descriptions can be edited after the record is saved.
          </p>
          <label className={labelClass} htmlFor="photos">
            Photographs
          </label>
          <input id="photos" name="photos" type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple className="mt-3 block w-full text-sm" />
          <label className={labelClass} htmlFor="photo_alt">
            Description for these photographs
          </label>
          <input id="photo_alt" name="photo_alt" className={fieldClass} />
        </fieldset>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="mt-10 inline-flex bg-burgundy px-6 py-3 font-sans text-[0.72rem] uppercase tracking-[0.2em] text-ivory disabled:opacity-50"
      >
        {pending ? "Saving…" : "Save record"}
      </button>
    </form>
  );
}
