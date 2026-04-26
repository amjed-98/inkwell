import type { MetadataRoute } from "next";
import { getAllCategories, getAllPosts, getPostsByCategory } from "../lib/posts";
import { buildSitemapEntry } from "../lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, categories] = await Promise.all([getAllPosts(), getAllCategories()]);
  const staticEntries: MetadataRoute.Sitemap = [
    buildSitemapEntry({
      path: "/",
      changeFrequency: "monthly",
      priority: 1,
    }),
    buildSitemapEntry({
      path: "/about",
      changeFrequency: "monthly",
      priority: 0.8,
    }),
    buildSitemapEntry({
      path: "/blog",
      changeFrequency: "weekly",
      priority: 0.9,
      lastModified: posts[0]?.publishedAt,
    }),
  ];
  const postEntries = posts.map((post) =>
    buildSitemapEntry({
      path: `/blog/${post.slug}`,
      changeFrequency: "monthly",
      priority: 0.7,
      lastModified: post.publishedAt,
    }),
  );
  const categoryEntries = await Promise.all(
    categories.map(async (category) => {
      const categoryPosts = await getPostsByCategory(category.slug);

      return buildSitemapEntry({
        path: `/blog/category/${category.slug}`,
        changeFrequency: "weekly",
        priority: 0.6,
        lastModified: categoryPosts[0]?.publishedAt,
      });
    }),
  );

  return [...staticEntries, ...postEntries, ...categoryEntries];
}
