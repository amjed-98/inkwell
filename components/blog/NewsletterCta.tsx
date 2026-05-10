import Link from "next/link";

export function NewsletterCta() {
  return (
    <section
      aria-labelledby="newsletter-heading"
      className="mt-20 grid gap-8 border-y border-[var(--border)] py-12 md:grid-cols-[0.9fr_1.1fr] md:items-center"
    >
      <div>
        <p className="eyebrow">Dispatch</p>
        <h2 className="section-title mt-4" id="newsletter-heading">
          Notes for people shaping content-heavy products.
        </h2>
      </div>
      <div>
        <p className="editorial-lede">
          Occasional essays on editorial systems, search surfaces, and frontend
          architecture that keeps publishing teams fast.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link className="primary-action" href="/search">
            Explore the archive
          </Link>
          <Link className="pill-link" href="/about">
            Meet the author
          </Link>
        </div>
      </div>
    </section>
  );
}
