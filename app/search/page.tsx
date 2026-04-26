import type { Metadata } from "next";
import { SearchExperience } from "../../components/search/SearchExperience";
import { buildSearchIndex } from "../../lib/search";
import { buildSearchMetadata } from "../../lib/seo";

type PageProps = {
  searchParams?: Promise<{
    q?: string;
  }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return buildSearchMetadata();
}

export default async function SearchPage({ searchParams }: PageProps) {
  const [items, resolvedSearchParams] = await Promise.all([
    buildSearchIndex(),
    (searchParams ?? Promise.resolve({})) as Promise<{ q?: string }>,
  ]);
  const initialQuery = resolvedSearchParams.q ?? "";

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-10 lg:px-12" id="content">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">
          Search archive
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-neutral-950 sm:text-5xl">
          Search the Inkwell archive
        </h1>
        <p className="mt-6 text-lg leading-8 text-neutral-600">
          This search surface ships post metadata only, stays shareable through the URL,
          and remains excluded from indexing.
        </p>
      </div>
      <SearchExperience initialQuery={initialQuery} items={items} />
    </main>
  );
}
