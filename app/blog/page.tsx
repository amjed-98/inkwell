import type { Metadata } from "next";
import Link from "next/link";
import { BlogArchiveExperience } from "../../components/blog/BlogArchiveExperience";
import {
  getAllCategories,
  getAllPosts,
  getFeaturedPost,
} from "../../lib/posts";
import {
  buildBlogMetadata,
  buildCollectionPageJsonLd,
  buildBreadcrumbJsonLd,
} from "../../lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildBlogMetadata();
}

export default async function BlogPage() {
  const [categories, featuredPost, allPosts] = await Promise.all([
    getAllCategories(),
    getFeaturedPost(),
    getAllPosts(),
  ]);
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
              posts: allPosts,
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
      <BlogArchiveExperience categories={categories} posts={allPosts} />
    </main>
  );
}
