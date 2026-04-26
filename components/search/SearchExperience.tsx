"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { SearchIndexItem } from "../../lib/search-shared";
import { searchPosts } from "../../lib/search-shared";

type SearchExperienceProps = {
  initialQuery: string;
  items: SearchIndexItem[];
};

function buildSearchUrl(query: string) {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return "/search";
  }

  return `/search?q=${encodeURIComponent(trimmedQuery)}`;
}

export function SearchExperience({
  initialQuery,
  items,
}: SearchExperienceProps) {
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    window.history.replaceState({}, "", buildSearchUrl(query));
  }, [query]);

  const results = useMemo(() => searchPosts(items, query), [items, query]);
  const hasQuery = query.trim().length > 0;

  return (
    <section className="mt-12 rounded-[2rem] border border-black/8 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:p-10">
      <label className="block" htmlFor="search-posts">
        <span className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
          Search posts
        </span>
        <input
          aria-describedby="search-helper"
          className="mt-4 w-full rounded-2xl border border-neutral-300 bg-white px-5 py-4 text-base text-neutral-950 outline-none transition focus:border-blue-500"
          id="search-posts"
          name="q"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search titles, descriptions, and categories"
          type="search"
          value={query}
        />
      </label>
      <p className="mt-3 text-sm text-neutral-500" id="search-helper">
        Results update instantly and the query stays reflected in the URL for sharing.
      </p>
      <div className="mt-8 flex items-center justify-between gap-4 text-sm text-neutral-500">
        <p>{results.length} result{results.length === 1 ? "" : "s"}</p>
        {hasQuery ? (
          <Link
            className="font-medium text-blue-700 underline decoration-blue-200 underline-offset-4"
            href="/search"
          >
            Clear search
          </Link>
        ) : null}
      </div>
      {results.length > 0 ? (
        <div className="mt-8 grid gap-5">
          {results.map((item) => (
            <article
              className="rounded-[1.5rem] border border-neutral-200 bg-neutral-50 px-6 py-5"
              key={item.slug}
            >
              <div className="flex flex-wrap gap-3 text-sm text-neutral-500">
                <span className="font-medium text-neutral-800">{item.category}</span>
                <span>{item.publishedAtLabel}</span>
                <span>{item.authorName}</span>
              </div>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-950">
                <Link className="transition hover:text-blue-700" href={item.href}>
                  {item.title}
                </Link>
              </h2>
              <p className="mt-3 text-base leading-7 text-neutral-600">{item.description}</p>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-[1.5rem] border border-dashed border-neutral-300 px-6 py-10 text-center">
          <p className="text-lg font-medium text-neutral-900">No posts match that search yet.</p>
          <p className="mt-3 text-sm text-neutral-500">
            Try a category like Editorial systems or Search experience.
          </p>
        </div>
      )}
    </section>
  );
}
