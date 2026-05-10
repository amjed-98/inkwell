import type { Metadata } from "next";
import Link from "next/link";
import {
  PRIMARY_NAV,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TAGLINE,
} from "../lib/constants";
import { buildHomeMetadata, buildWebsiteJsonLd } from "../lib/seo";

export const metadata: Metadata = buildHomeMetadata();

export default function Home() {
  return (
    <main
      className="page-shell font-sans"
      id="content"
    >
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildWebsiteJsonLd()),
        }}
        type="application/ld+json"
      />
      <section className="reveal-in grid min-h-[72vh] gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(18rem,0.95fr)] lg:items-end">
        <div>
          <p className="eyebrow">{SITE_NAME}</p>
          <h1 className="display-title mt-6 max-w-4xl">
            {SITE_TAGLINE}
          </h1>
          <p className="editorial-lede mt-8 max-w-2xl">
            {SITE_DESCRIPTION} Built to demonstrate clean information
            architecture, modern content workflows, and measurable search
            readiness.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link className="primary-action" href="/blog">
              Explore the blog
            </Link>
            <Link className="pill-link" href="/about">
              About Amjad
            </Link>
          </div>
        </div>
        <div className="soft-panel p-5 sm:p-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-muted)] p-5">
              <p className="eyebrow">Focus</p>
              <p className="mt-4 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
                Frontend systems, search, and editorial workflows.
              </p>
            </div>
            <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-5">
              <p className="eyebrow">Built with</p>
              <p className="mt-4 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
                Next.js, MDX, structured data, and static discovery.
              </p>
            </div>
          </div>
          <nav aria-label="Primary" className="mt-5">
            <ul className="grid gap-2 text-sm text-[var(--muted-strong)]">
              {PRIMARY_NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    className="flex items-center justify-between rounded-[var(--radius-md)] border border-[var(--border)] px-4 py-3 transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                    href={item.href}
                  >
                    <span>{item.label}</span>
                    <span aria-hidden="true">-&gt;</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>
      <section className="mt-16 grid gap-5 border-t border-[var(--border)] pt-10 md:grid-cols-3">
        {[
          ["01", "Fast reading paths", "Pages are structured for scanning first and deep reading second."],
          ["02", "Search-ready content", "Every article carries clean metadata, canonical routes, and useful archive surfaces."],
          ["03", "Quiet craft", "The interface keeps attention on ideas while still feeling distinctive."],
        ].map(([index, title, body]) => (
          <article className="premium-card p-6" key={title}>
            <p className="text-sm font-semibold text-[var(--accent)]">{index}</p>
            <h2 className="mt-5 text-xl font-semibold tracking-tight text-[var(--foreground)]">
              {title}
            </h2>
            <p className="mt-3 leading-7 text-[var(--muted)]">{body}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
