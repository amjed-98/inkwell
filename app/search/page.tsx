import type { Metadata } from "next";
import { SearchExperience } from "../../components/search/SearchExperience";
import { buildSearchIndex } from "../../lib/search";
import { buildSearchMetadata } from "../../lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildSearchMetadata();
}

export default async function SearchPage() {
  const items = await buildSearchIndex();

  return (
    <main className="page-shell" id="content">
      <div className="max-w-3xl">
        <p className="eyebrow">Search archive</p>
        <h1 className="section-title mt-5">
          Search the Inkwell archive
        </h1>
        <p className="editorial-lede mt-6">
          This search surface ships post metadata only, stays shareable through the URL,
          and remains excluded from indexing.
        </p>
      </div>
      <SearchExperience items={items} />
    </main>
  );
}
