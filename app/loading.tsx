export default function Loading() {
  return (
    <div className="page-shell flex min-h-[50vh] items-center">
      <div
        aria-live="polite"
        className="space-y-4"
        role="status"
      >
        <p className="sr-only">Loading the Inkwell shell.</p>
        <div
          aria-hidden="true"
          className="h-3 w-32 animate-pulse rounded-full bg-[var(--border)]"
        />
        <div
          aria-hidden="true"
          className="h-10 w-72 animate-pulse rounded-full bg-[var(--border)]"
        />
        <div
          aria-hidden="true"
          className="h-3 w-96 animate-pulse rounded-full bg-[var(--border)]"
        />
      </div>
    </div>
  );
}
