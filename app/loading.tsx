export default function Loading() {
  return (
    <div className="mx-auto flex min-h-[50vh] w-full max-w-6xl items-center px-6 py-12 sm:px-10 lg:px-12">
      <div
        aria-live="polite"
        className="space-y-4"
        role="status"
      >
        <p className="sr-only">Loading the Inkwell shell.</p>
        <div
          aria-hidden="true"
          className="h-3 w-32 animate-pulse rounded-full bg-[var(--color-border)]"
        />
        <div
          aria-hidden="true"
          className="h-10 w-72 animate-pulse rounded-full bg-[var(--color-border)]"
        />
        <div
          aria-hidden="true"
          className="h-3 w-96 animate-pulse rounded-full bg-[var(--color-border)]"
        />
      </div>
    </div>
  );
}
