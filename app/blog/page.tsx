import type { Metadata } from "next";
import { BlogArchiveExperience } from "../../components/blog/BlogArchiveExperience";
import { NewsletterCta } from "../../components/blog/NewsletterCta";
import { PostCard } from "../../components/blog/PostCard";
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
    <main className="page-shell" id="content">
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
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end">
        <div>
          <p className="eyebrow">Inkwell archive</p>
          <h1 className="section-title mt-5 max-w-4xl">
          {archiveDescription}
          </h1>
          <p className="editorial-lede mt-6 max-w-2xl">
            Essays are organized for fast discovery, clean category browsing,
            and a focused path from preview to reading.
          </p>
        </div>
        <div className="soft-panel p-5">
          <p className="text-sm font-semibold text-[var(--foreground)]">Archive signal</p>
          <dl className="mt-5 grid grid-cols-2 gap-4">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                Posts
              </dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight">{allPosts.length}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                Topics
              </dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight">{categories.length}</dd>
            </div>
          </dl>
        </div>
      </div>
      {featuredPost ? (
        <div className="mt-12">
          <PostCard post={featuredPost} priority variant="feature" />
        </div>
      ) : null}
      <BlogArchiveExperience categories={categories} posts={allPosts} />
      <NewsletterCta />
    </main>
  );
}
