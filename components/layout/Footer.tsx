import Link from "next/link";
import { SITE_NAME } from "../../lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-8 text-sm text-[var(--color-muted)] sm:px-10 lg:px-12 md:flex-row md:items-center md:justify-between">
        <p>{new Date().getFullYear()} {SITE_NAME}. Built for editorial speed and search clarity.</p>
        <div className="flex items-center gap-4">
          <Link className="transition hover:text-[var(--color-foreground)]" href="/blog">
            Blog
          </Link>
          <Link className="transition hover:text-[var(--color-foreground)]" href="/about">
            About
          </Link>
        </div>
      </div>
    </footer>
  );
}
