import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";

type Author = {
  name: string;
  role: string;
};

type PostFrontmatter = {
  author: Author;
  category: string;
  coverImage: string;
  coverImageAlt: string;
  description: string;
  featured?: boolean;
  publishedAt: string;
  title: string;
};

export type PostSummary = PostFrontmatter & {
  publishedAtLabel: string;
  readingTimeMinutes: number;
  slug: string;
  wordCount: number;
};

export type PostDocument = PostSummary & {
  body: string;
};

export type CategorySummary = {
  name: string;
  postCount: number;
  slug: string;
};

const POSTS_DIRECTORY = path.join(process.cwd(), "content", "posts");

function formatPublishedDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function normalizePost(slug: string, frontmatter: PostFrontmatter, body: string): PostDocument {
  const stats = readingTime(body);

  return {
    ...frontmatter,
    body,
    publishedAtLabel: formatPublishedDate(frontmatter.publishedAt),
    readingTimeMinutes: Math.max(1, Math.ceil(stats.minutes)),
    slug,
    wordCount: stats.words,
  };
}

export function slugifyCategory(category: string) {
  return category
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function readPostFile(slug: string) {
  const filePath = path.join(POSTS_DIRECTORY, `${slug}.mdx`);
  return fs.readFile(filePath, "utf8");
}

export async function getAllPosts(): Promise<PostSummary[]> {
  const entries = await fs.readdir(POSTS_DIRECTORY);
  const posts = await Promise.all(
    entries
      .filter((entry) => entry.endsWith(".mdx"))
      .map(async (entry) => {
        const slug = entry.replace(/\.mdx$/, "");
        const source = await readPostFile(slug);
        const { content, data } = matter(source);

        return normalizePost(slug, data as PostFrontmatter, content);
      }),
  );

  return posts.sort((left, right) => right.publishedAt.localeCompare(left.publishedAt));
}

export async function getPostBySlug(slug: string): Promise<PostDocument | null> {
  try {
    const source = await readPostFile(slug);
    const { content, data } = matter(source);

    return normalizePost(slug, data as PostFrontmatter, content);
  } catch {
    return null;
  }
}

export async function getFeaturedPost(): Promise<PostSummary | null> {
  const posts = await getAllPosts();

  return posts.find((post) => post.featured) ?? posts[0] ?? null;
}

export async function getAllCategories(): Promise<CategorySummary[]> {
  const posts = await getAllPosts();
  const categories = new Map<string, CategorySummary>();

  for (const post of posts) {
    const slug = slugifyCategory(post.category);
    const existing = categories.get(slug);

    if (existing) {
      existing.postCount += 1;
      continue;
    }

    categories.set(slug, {
      name: post.category,
      postCount: 1,
      slug,
    });
  }

  return [...categories.values()].sort((left, right) => left.name.localeCompare(right.name));
}

export async function getCategoryBySlug(slug: string): Promise<CategorySummary | null> {
  const categories = await getAllCategories();
  return categories.find((category) => category.slug === slug) ?? null;
}

export async function getPostsByCategory(categorySlug: string): Promise<PostSummary[]> {
  const posts = await getAllPosts();
  return posts.filter((post) => slugifyCategory(post.category) === categorySlug);
}
