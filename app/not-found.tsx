import Link from "next/link";

export default function NotFound() {
  return (
    <main
      className="page-shell flex min-h-[70vh] flex-col items-center justify-center text-center"
      id="content"
    >
      <p className="eyebrow">Lost in the margins</p>
      <h1 className="mt-4 font-serif text-7xl font-semibold tracking-normal text-[var(--foreground)]">
        404
      </h1>
      <p className="editorial-lede mt-6 max-w-xl">
        The page you were looking for is not published here. Jump back to the
        homepage or head straight to the writing archive.
      </p>
      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
        <Link className="primary-action" href="/">
          Return home
        </Link>
        <Link className="pill-link" href="/blog">
          Browse articles
        </Link>
      </div>
    </main>
  );
}
