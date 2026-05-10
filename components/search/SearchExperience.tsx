"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { SearchIndexItem } from "../../lib/search-shared";
import { searchPosts } from "../../lib/search-shared";

type SearchExperienceProps = {
  initialQuery?: string;
  items: SearchIndexItem[];
};

function buildResultsAnnouncement(resultCount: number, query: string) {
  const resultLabel = `result${resultCount === 1 ? "" : "s"}`;
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return `Showing ${resultCount} ${resultLabel}.`;
  }

  return `Showing ${resultCount} ${resultLabel} for "${trimmedQuery}".`;
}

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
  const [query, setQuery] = useState(initialQuery ?? "");

  useEffect(() => {
    if (typeof initialQuery === "string") {
      setQuery(initialQuery);
      return;
    }

    const nextQuery = new URLSearchParams(window.location.search).get("q") ?? "";
    setQuery(nextQuery);
  }, [initialQuery]);

  useEffect(() => {
    window.history.replaceState({}, "", buildSearchUrl(query));
  }, [query]);

  const results = useMemo(() => searchPosts(items, query), [items, query]);
  const hasQuery = query.trim().length > 0;
  const resultsAnnouncement = buildResultsAnnouncement(results.length, query);

  return (
    <section className="soft-panel mt-12 p-6 sm:p-8">
      <label className="block" htmlFor="search-posts">
        <span className="eyebrow">Search posts</span>
        <input
          aria-describedby="search-helper"
          className="mt-4 w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-5 py-4 text-base text-[var(--foreground)] outline-none transition focus:border-[var(--accent)]"
          id="search-posts"
          name="q"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search titles, descriptions, and categories"
          type="search"
          value={query}
        />
      </label>
      <p className="mt-3 text-sm text-[var(--muted)]" id="search-helper">
        Results update instantly and the query stays reflected in the URL for sharing.
      </p>
      <div className="mt-8 flex items-center justify-between gap-4 text-sm text-[var(--muted)]">
        <p aria-atomic="true" aria-live="polite" role="status">
          {resultsAnnouncement}
        </p>
        {hasQuery ? (
          <Link
            className="text-link"
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
              className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-6 py-5 transition hover:border-[var(--accent)]"
              key={item.slug}
            >
              <div className="meta-row">
                <span className="font-semibold text-[var(--foreground)]">{item.category}</span>
                <span className="meta-dot" aria-hidden="true" />
                <span>{item.publishedAtLabel}</span>
                <span className="meta-dot" aria-hidden="true" />
                <span>{item.authorName}</span>
              </div>
              <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight tracking-normal text-[var(--foreground)]">
                <Link className="transition hover:text-[var(--accent)]" href={item.href}>
                  {item.title}
                </Link>
              </h2>
              <p className="mt-3 text-base leading-7 text-[var(--muted-strong)]">{item.description}</p>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-[var(--radius-md)] border border-dashed border-[var(--border-strong)] px-6 py-10 text-center">
          <p className="text-lg font-semibold text-[var(--foreground)]">No posts match that search yet.</p>
          <p className="mt-3 text-sm text-[var(--muted)]">
            Try a category like Editorial systems or Search experience.
          </p>
        </div>
      )}
    </section>
  );
}
