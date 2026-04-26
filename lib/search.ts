import { getAllPosts } from "./posts";

export type SearchIndexItem = {
  authorName: string;
  category: string;
  description: string;
  href: string;
  publishedAt: string;
  publishedAtLabel: string;
  slug: string;
  title: string;
};

function normalizeQuery(value: string) {
  return value.trim().toLowerCase();
}

function buildHaystack(item: SearchIndexItem) {
  return [item.title, item.description, item.category, item.authorName].join(" ").toLowerCase();
}

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

export function searchPosts(items: SearchIndexItem[], query: string) {
  const normalizedQuery = normalizeQuery(query);

  if (!normalizedQuery) {
    return items;
  }

  const terms = normalizedQuery.split(/\s+/).filter(Boolean);

  return [...items]
    .map((item) => {
      const haystack = buildHaystack(item);
      const score = terms.reduce((total, term) => total + (haystack.includes(term) ? 1 : 0), 0);

      return { item, score };
    })
    .filter(({ score }) => score > 0)
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      return right.item.publishedAt.localeCompare(left.item.publishedAt);
    })
    .map(({ item }) => item);
}
