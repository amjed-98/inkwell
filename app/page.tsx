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
      className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-20 font-sans sm:px-10 lg:px-12"
      id="content"
    >
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildWebsiteJsonLd()),
        }}
        type="application/ld+json"
      />
      <div className="max-w-3xl rounded-[2rem] border border-black/8 bg-white p-10 shadow-[0_30px_80px_rgba(15,23,42,0.08)] sm:p-14">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">
          {SITE_NAME}
        </p>
        <h1 className="mt-6 max-w-2xl text-5xl font-bold tracking-tight text-neutral-950 sm:text-6xl">
          {SITE_TAGLINE}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-600">
          {SITE_DESCRIPTION} Built to demonstrate clean information
          architecture, modern content workflows, and measurable search
          readiness.
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            href="/blog"
          >
            Explore the blog
          </Link>
          <Link
            className="inline-flex items-center justify-center rounded-full border border-neutral-300 px-6 py-3 text-sm font-semibold text-neutral-900 transition hover:border-neutral-900"
            href="/about"
          >
            About Amjad
          </Link>
        </div>
        <nav aria-label="Primary" className="mt-10">
          <ul className="flex flex-wrap gap-4 text-sm text-neutral-500">
            {PRIMARY_NAV.map((item) => (
              <li key={item.href}>
                <Link className="transition hover:text-neutral-950" href={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </main>
  );
}
