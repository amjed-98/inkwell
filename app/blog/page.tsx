import type { Metadata } from "next";
import Link from "next/link";
import {
  getAllCategories,
  getAllPosts,
  getFeaturedPost,
  getPostsByCategory,
} from "../../lib/posts";
import {
  buildBlogMetadata,
  buildCollectionPageJsonLd,
  buildBreadcrumbJsonLd,
} from "../../lib/seo";

type PageProps = {
  searchParams?: Promise<{
    category?: string;
  }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return buildBlogMetadata();
}

export default async function BlogPage({ searchParams }: PageProps) {
  const [categories, featuredPost, allPosts] = await Promise.all([
    getAllCategories(),
    getFeaturedPost(),
    getAllPosts(),
  ]);
  const resolvedSearchParams: { category?: string } = await (searchParams ??
    Promise.resolve({}));
  const selectedCategory = resolvedSearchParams.category;
  const posts = selectedCategory ? await getPostsByCategory(selectedCategory) : allPosts;
  const activeCategory =
    categories.find((category) => category.slug === selectedCategory) ?? null;
  const archiveDescription =
    "A publication about performant frontend systems and modern web architecture.";

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-10 lg:px-12" id="content">
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            buildCollectionPageJsonLd({
              name: "Inkwell blog",
              description: archiveDescription,
              path: "/blog",
              posts,
            }),
          ),
        }}
        type="application/ld+json"
      />
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            buildBreadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Blog", path: "/blog" },
            ]),
          ),
        }}
        type="application/ld+json"
      />
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">
          Inkwell archive
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight">
          {archiveDescription}
        </h1>
        <p className="mt-6 text-lg leading-8 text-[var(--color-muted)]">
          The archive starts with one full MDX article so the content model,
          routing, and editorial surface are proven end to end before the
          library expands.
        </p>
      </div>
      {featuredPost ? (
        <article className="mt-12 rounded-[2rem] border border-blue-200 bg-blue-50/70 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">
            Featured post
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-neutral-950">
            {featuredPost.title}
          </h2>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-neutral-700">
            {featuredPost.description}
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm text-neutral-600">
            <span className="font-medium text-neutral-900">{featuredPost.author.name}</span>
            <span>{featuredPost.category}</span>
            <span>{featuredPost.publishedAtLabel}</span>
          </div>
          <Link
            className="mt-8 inline-flex items-center rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            href={`/blog/${featuredPost.slug}`}
          >
            Read the featured post
          </Link>
        </article>
      ) : null}
      <section aria-label="Categories" className="mt-12">
        <div className="flex flex-wrap gap-3">
          <Link
            aria-current={activeCategory ? undefined : "page"}
            className="inline-flex items-center rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-950"
            href="/blog"
          >
            All categories
          </Link>
          {categories.map((category) => (
            <Link
              aria-current={activeCategory?.slug === category.slug ? "page" : undefined}
              className="inline-flex items-center rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-950"
              href={`/blog?category=${category.slug}`}
              key={category.slug}
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
            >
              Clear category filter
            </Link>
          </div>
        </section>
      ) : null}
      <div className="mt-12 grid gap-6">
        {posts.map((post) => (
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
    </main>
  );
}
