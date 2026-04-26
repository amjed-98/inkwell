import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col items-center justify-center px-6 py-20 text-center sm:px-10">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">
        Lost in the margins
      </p>
      <h1 className="mt-4 text-6xl font-bold tracking-tight text-[var(--color-foreground)]">
        404
      </h1>
      <p className="mt-6 max-w-xl text-lg leading-8 text-[var(--color-muted)]">
        The page you were looking for is not published here. Jump back to the
        homepage or head straight to the writing archive.
      </p>
      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
        <Link
          className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          href="/"
        >
          Return home
        </Link>
        <Link
          className="inline-flex items-center justify-center rounded-full border border-[var(--color-border)] px-6 py-3 text-sm font-semibold text-[var(--color-foreground)] transition hover:border-[var(--color-foreground)]"
          href="/blog"
        >
          Browse articles
        </Link>
      </div>
    </main>
  );
}
