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
    <main className="page-shell" id="content">
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
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(19rem,0.85fr)]">
        <section>
          <p className="eyebrow">About the author</p>
          <h1 className="section-title mt-5 max-w-4xl">
            Amjad Yahia builds calm, search-ready products for content-heavy teams.
          </h1>
          <p className="editorial-lede mt-6 max-w-3xl">
            {AUTHOR_PROFILE.summary}
          </p>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-[var(--muted-strong)]">
            {AUTHOR_PROFILE.bio}
          </p>
          <div className="meta-row mt-8">
            <span className="font-semibold text-[var(--foreground)]">{AUTHOR_PROFILE.name}</span>
            <span className="meta-dot" aria-hidden="true" />
            <span>{AUTHOR_PROFILE.role}</span>
            <span className="meta-dot" aria-hidden="true" />
            <span>{AUTHOR_PROFILE.location}</span>
          </div>
          <div className="mt-8 flex flex-wrap gap-4 text-sm">
            <Link
              className="text-link"
              href={AUTHOR_PROFILE.socials.github}
            >
              GitHub
            </Link>
            <Link
              className="text-link"
              href={AUTHOR_PROFILE.socials.linkedin}
            >
              LinkedIn
            </Link>
            <Link
              className="text-link"
              href={AUTHOR_PROFILE.socials.x}
            >
              X
            </Link>
          </div>
        </section>
        <aside className="space-y-6">
          <section className="soft-panel p-7">
            <h2 className="font-serif text-3xl font-semibold tracking-normal text-[var(--foreground)]">
              Focus areas
            </h2>
            <ul className="mt-5 space-y-3 text-base leading-7 text-[var(--muted-strong)]">
              {AUTHOR_PROFILE.focus.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section className="soft-panel p-7">
            <h2 className="font-serif text-3xl font-semibold tracking-normal text-[var(--foreground)]">
              Recent writing
            </h2>
            <div className="mt-6 grid gap-4">
              {recentPosts.map((post) => (
                <article
                  className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-5"
                  key={post.slug}
                >
                  <p className="eyebrow">{post.category}</p>
                  <h3 className="mt-3 text-xl font-semibold tracking-tight text-[var(--foreground)]">
                    {post.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                    {post.description}
                  </p>
                  <Link
                    className="text-link mt-5 inline-flex text-sm"
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
