"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { CategorySummary, PostSummary } from "../../lib/posts";

type BlogArchiveExperienceProps = {
  categories: CategorySummary[];
  posts: PostSummary[];
};

function getCategoryFromLocation() {
  return new URLSearchParams(window.location.search).get("category") ?? "";
}

function buildCategoryUrl(categorySlug: string) {
  if (!categorySlug) {
    return "/blog";
  }

  return `/blog?category=${encodeURIComponent(categorySlug)}`;
}

function slugifyCategory(category: string) {
  return category
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function BlogArchiveExperience({
  categories,
  posts,
}: BlogArchiveExperienceProps) {
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const syncCategory = () => {
      setSelectedCategory(getCategoryFromLocation());
    };

    syncCategory();
    window.addEventListener("popstate", syncCategory);

    return () => window.removeEventListener("popstate", syncCategory);
  }, []);

  const activeCategory = useMemo(
    () => categories.find((category) => category.slug === selectedCategory) ?? null,
    [categories, selectedCategory],
  );
  const visiblePosts = useMemo(() => {
    if (!activeCategory) {
      return posts;
    }

    return posts.filter((post) => activeCategory.slug === slugifyCategory(post.category));
  }, [activeCategory, posts]);

  function handleCategorySelect(categorySlug: string) {
    window.history.replaceState({}, "", buildCategoryUrl(categorySlug));
    setSelectedCategory(categorySlug);
  }

  return (
    <>
      <section aria-label="Categories" className="mt-12">
        <div className="flex flex-wrap gap-3">
          <Link
            aria-current={activeCategory ? undefined : "page"}
            className="inline-flex items-center rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-950"
            href="/blog"
            onClick={(event) => {
              event.preventDefault();
              handleCategorySelect("");
            }}
          >
            All categories
          </Link>
          {categories.map((category) => (
            <Link
              aria-current={activeCategory?.slug === category.slug ? "page" : undefined}
              className="inline-flex items-center rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-950"
              href={buildCategoryUrl(category.slug)}
              key={category.slug}
              onClick={(event) => {
                event.preventDefault();
                handleCategorySelect(category.slug);
              }}
            >
              {category.name} ({category.postCount})
            </Link>
          ))}
        </div>
      </section>
      {activeCategory ? (
        <section
          aria-label="Active category filter"
          className="mt-8 rounded-[1.5rem] border border-neutral-200 bg-neutral-50 px-6 py-5"
        >
          <p className="text-sm font-medium text-neutral-700">
            Filtered by {activeCategory.name}
          </p>
          <div className="mt-3 flex flex-wrap gap-4 text-sm">
            <Link
              className="font-medium text-blue-700 underline decoration-blue-200 underline-offset-4"
              href={`/blog/category/${activeCategory.slug}`}
            >
              View {activeCategory.name} archive
            </Link>
            <Link
              className="font-medium text-neutral-700 underline decoration-neutral-300 underline-offset-4"
              href="/blog"
              onClick={(event) => {
                event.preventDefault();
                handleCategorySelect("");
              }}
            >
              Clear category filter
            </Link>
          </div>
        </section>
      ) : null}
      <div className="mt-12 grid gap-6">
        {visiblePosts.map((post) => (
          <article
            className="rounded-[2rem] border border-black/8 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)]"
            key={post.slug}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              {post.category}
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-neutral-950">
              {post.title}
            </h2>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-neutral-600">
              {post.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm text-neutral-500">
              <span className="font-medium text-neutral-800">{post.author.name}</span>
              <span>{post.publishedAtLabel}</span>
              <span>{post.readingTimeMinutes} min read</span>
            </div>
            <Link
              className="mt-8 inline-flex items-center rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              href={`/blog/${post.slug}`}
            >
              Read {post.title}
            </Link>
          </article>
        ))}
      </div>
    </>
  );
}
