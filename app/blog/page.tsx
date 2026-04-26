export default function BlogPage() {
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
          The full editorial archive lands in the next slice. This shell keeps
          navigation and deployment paths honest from the start.
        </p>
      </div>
    </main>
  );
}
