import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllCategories,
  getCategoryBySlug,
  getPostsByCategory,
} from "../../../../lib/posts";
import {
  buildBreadcrumbJsonLd,
  buildCategoryMetadata,
  buildCollectionPageJsonLd,
} from "../../../../lib/seo";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  const categories = await getAllCategories();

  return categories.map((category) => ({
    slug: category.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return {};
  }

  return buildCategoryMetadata(category);
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const [category, posts] = await Promise.all([
    getCategoryBySlug(slug),
    getPostsByCategory(slug),
  ]);

  if (!category) {
    notFound();
  }

  const description = `A focused archive for ${category.name} essays, implementation notes, and production patterns.`;

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-10 lg:px-12" id="content">
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            buildCollectionPageJsonLd({
              name: `${category.name} archive`,
              description,
              path: `/blog/category/${category.slug}`,
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
              { name: category.name, path: `/blog/category/${category.slug}` },
            ]),
          ),
        }}
        type="application/ld+json"
      />
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">
          Category archive
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-neutral-950">
          {category.name}
        </h1>
        <p className="mt-6 text-lg leading-8 text-[var(--color-muted)]">{description}</p>
        <div className="mt-8 flex flex-wrap gap-4 text-sm">
          <Link
            className="font-medium text-blue-700 underline decoration-blue-200 underline-offset-4"
            href={`/blog?category=${category.slug}`}
          >
            Filter the main archive
          </Link>
          <Link
            className="font-medium text-neutral-700 underline decoration-neutral-300 underline-offset-4"
            href="/blog"
          >
            Back to all posts
          </Link>
        </div>
      </div>
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
