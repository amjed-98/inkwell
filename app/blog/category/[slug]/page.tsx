import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NewsletterCta } from "../../../../components/blog/NewsletterCta";
import { PostCard } from "../../../../components/blog/PostCard";
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
    <main className="page-shell" id="content">
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
      <div className="max-w-3xl">
        <p className="eyebrow">Category archive</p>
        <h1 className="section-title mt-5">
          {category.name}
        </h1>
        <p className="editorial-lede mt-6">{description}</p>
        <div className="mt-8 flex flex-wrap gap-4 text-sm">
          <Link
            className="text-link"
            href={`/blog?category=${category.slug}`}
          >
            Filter the main archive
          </Link>
          <Link
            className="text-link"
            href="/blog"
          >
            Back to all posts
          </Link>
        </div>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
      <NewsletterCta />
    </main>
  );
}
