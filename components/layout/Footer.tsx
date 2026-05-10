import Link from "next/link";
import { SITE_NAME } from "../../lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)]">
      <div className="mx-auto grid w-full max-w-[var(--content-width)] gap-8 px-4 py-10 text-sm text-[var(--muted)] sm:px-6 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="font-serif text-2xl font-semibold tracking-normal text-[var(--foreground)]">
            {SITE_NAME}
          </p>
          <p className="mt-2 max-w-lg">
            Built for editorial speed, search clarity, and a reading experience
            that respects attention.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link className="transition hover:text-[var(--foreground)]" href="/blog">
            Blog
          </Link>
          <Link className="transition hover:text-[var(--foreground)]" href="/search">
            Search
          </Link>
          <Link className="transition hover:text-[var(--foreground)]" href="/about">
            About
          </Link>
        </div>
        <p className="text-xs text-[var(--muted)] md:col-span-2">
          {new Date().getFullYear()} {SITE_NAME}.
        </p>
      </div>
    </footer>
  );
}
