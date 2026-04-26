import { getAllPosts } from "./posts";
import type { SearchIndexItem } from "./search-shared";

export async function buildSearchIndex(): Promise<SearchIndexItem[]> {
  const posts = await getAllPosts();

  return posts.map((post) => ({
    slug: post.slug,
    href: `/blog/${post.slug}`,
    title: post.title,
    description: post.description,
    category: post.category,
    authorName: post.author.name,
    publishedAt: post.publishedAt,
    publishedAtLabel: post.publishedAtLabel,
  }));
}
