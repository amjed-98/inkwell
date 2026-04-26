import type { Metadata } from "next";
import Link from "next/link";
import { AUTHOR_PROFILE } from "../../lib/author";
import { getRecentPosts } from "../../lib/posts";
import {
  buildAboutMetadata,
  buildBreadcrumbJsonLd,
  buildPersonJsonLd,
} from "../../lib/seo";

export const metadata: Metadata = buildAboutMetadata();

export default async function AboutPage() {
  const recentPosts = await getRecentPosts(3);

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-10 lg:px-12">
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildPersonJsonLd()),
        }}
        type="application/ld+json"
      />
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            buildBreadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "About", path: "/about" },
            ]),
          ),
        }}
        type="application/ld+json"
      />
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <section className="rounded-[2rem] border border-black/8 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">
            About the author
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-neutral-950 sm:text-5xl">
            Amjad Yahia builds calm, search-ready products for content-heavy teams.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-neutral-600">
            {AUTHOR_PROFILE.summary}
          </p>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-neutral-700">
            {AUTHOR_PROFILE.bio}
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm text-neutral-500">
            <span className="font-semibold text-neutral-900">{AUTHOR_PROFILE.name}</span>
            <span>{AUTHOR_PROFILE.role}</span>
            <span>{AUTHOR_PROFILE.location}</span>
          </div>
          <div className="mt-8 flex flex-wrap gap-4 text-sm">
            <Link
              className="font-medium text-blue-700 underline decoration-blue-200 underline-offset-4"
              href={AUTHOR_PROFILE.socials.github}
            >
              GitHub
            </Link>
            <Link
              className="font-medium text-blue-700 underline decoration-blue-200 underline-offset-4"
              href={AUTHOR_PROFILE.socials.linkedin}
            >
              LinkedIn
            </Link>
            <Link
              className="font-medium text-blue-700 underline decoration-blue-200 underline-offset-4"
              href={AUTHOR_PROFILE.socials.x}
            >
              X
            </Link>
          </div>
        </section>
        <aside className="space-y-6">
          <section className="rounded-[2rem] border border-neutral-200 bg-neutral-50 p-8">
            <h2 className="text-2xl font-semibold tracking-tight text-neutral-950">
              Focus areas
            </h2>
            <ul className="mt-5 space-y-3 text-base leading-7 text-neutral-700">
              {AUTHOR_PROFILE.focus.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section className="rounded-[2rem] border border-neutral-200 bg-blue-50/70 p-8">
            <h2 className="text-2xl font-semibold tracking-tight text-neutral-950">
              Recent writing
            </h2>
            <div className="mt-6 grid gap-4">
              {recentPosts.map((post) => (
                <article
                  className="rounded-[1.5rem] border border-white/70 bg-white/90 p-5"
                  key={post.slug}
                >
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                    {post.category}
                  </p>
                  <h3 className="mt-3 text-xl font-semibold tracking-tight text-neutral-950">
                    {post.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-neutral-600">
                    {post.description}
                  </p>
                  <Link
                    className="mt-5 inline-flex text-sm font-medium text-blue-700 underline decoration-blue-200 underline-offset-4"
                    href={`/blog/${post.slug}`}
                  >
                    Read {post.title}
                  </Link>
                </article>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}
