import Link from "next/link";
import { getAllPosts } from "../../lib/posts";

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-10 lg:px-12">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">
          Inkwell archive
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight">
          A publication about performant frontend systems and modern web
          architecture.
        </h1>
        <p className="mt-6 text-lg leading-8 text-[var(--color-muted)]">
          The archive starts with one full MDX article so the content model,
          routing, and editorial surface are proven end to end before the
          library expands.
        </p>
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
