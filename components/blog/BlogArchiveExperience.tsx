"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { CategorySummary, PostSummary } from "../../lib/posts";
import { PostCard } from "./PostCard";

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
      <section aria-label="Categories" className="mt-14">
        <div className="flex flex-wrap gap-3">
          <Link
            aria-current={activeCategory ? undefined : "page"}
            className="pill-link"
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
              className="pill-link"
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
          className="mt-8 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--accent-soft)] px-6 py-5"
        >
          <p className="text-sm font-semibold text-[var(--foreground)]">
            Filtered by {activeCategory.name}
          </p>
          <div className="mt-3 flex flex-wrap gap-4 text-sm">
            <Link
              className="text-link"
              href={`/blog/category/${activeCategory.slug}`}
            >
              View {activeCategory.name} archive
            </Link>
            <Link
              className="text-link"
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
      <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {visiblePosts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </>
  );
}
