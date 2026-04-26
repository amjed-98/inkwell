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
  publishedAt: string;
  title: string;
};

export type PostSummary = PostFrontmatter & {
  publishedAtLabel: string;
  readingTimeMinutes: number;
  slug: string;
};

export type PostDocument = PostSummary & {
  body: string;
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
  return {
    ...frontmatter,
    body,
    publishedAtLabel: formatPublishedDate(frontmatter.publishedAt),
    readingTimeMinutes: Math.max(1, Math.ceil(readingTime(body).minutes)),
    slug,
  };
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
