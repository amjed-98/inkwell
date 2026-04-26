import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import SearchPage, { generateMetadata } from "../app/search/page";
import { SearchExperience } from "../components/search/SearchExperience";
import { buildSearchIndex } from "../lib/search";
import { searchPosts } from "../lib/search-shared";

describe("search discovery", () => {
  it("builds a compact metadata-only search index and returns relevant matches", async () => {
    const index = await buildSearchIndex();

    expect(index).toHaveLength(3);
    expect(index[0]).toMatchObject({
      slug: "introducing-inkwell",
      title: "Introducing Inkwell's MDX publishing pipeline",
      category: "Editorial systems",
      href: "/blog/introducing-inkwell",
    });
    expect(index[0]).not.toHaveProperty("body");

    expect(searchPosts(index, "static search")[0]).toMatchObject({
      slug: "building-a-static-search-experience-that-stays-lightweight",
    });
    expect(searchPosts(index, "editorial systems")[0]).toMatchObject({
      slug: "introducing-inkwell",
    });
    expect(searchPosts(index, "missing phrase")).toEqual([]);
  });

  it("marks the search route as canonical but excluded from indexing", async () => {
    await expect(generateMetadata()).resolves.toMatchObject({
      title: "Search | Inkwell",
      alternates: {
        canonical: "https://inkwell-demo.netlify.app/search",
      },
      robots: {
        index: false,
        follow: true,
      },
    });
  });

  it("renders search results from the URL query state on the dedicated page", async () => {
    render(await SearchPage({ searchParams: Promise.resolve({ q: "search" }) }));

    expect(screen.getByRole("main")).toHaveAttribute("id", "content");
    expect(
      screen.getByRole("heading", {
        name: /search the inkwell archive/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue("search")).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: /building a static search experience that stays lightweight/i,
      }),
    ).toHaveAttribute(
      "href",
      "/blog/building-a-static-search-experience-that-stays-lightweight",
    );
  });
});

describe("search experience interactions", () => {
  it("filters results on input and keeps the query synchronized in the URL", () => {
    window.history.replaceState({}, "", "/search");

    render(
      <SearchExperience
        initialQuery=""
        items={[
          {
            slug: "introducing-inkwell",
            href: "/blog/introducing-inkwell",
            title: "Introducing Inkwell's MDX publishing pipeline",
            description:
              "A first production-shaped article that proves local MDX content, static routing, and editorial rendering can move together.",
            category: "Editorial systems",
            authorName: "Amjad Yahia",
            publishedAt: "2026-04-26",
            publishedAtLabel: "April 26, 2026",
          },
          {
            slug: "building-a-static-search-experience-that-stays-lightweight",
            href: "/blog/building-a-static-search-experience-that-stays-lightweight",
            title: "Building a static search experience that stays lightweight",
            description:
              "A practical approach to search pages that feel responsive without shipping full article bodies or introducing server-side search infrastructure.",
            category: "Search experience",
            authorName: "Amjad Yahia",
            publishedAt: "2026-04-22",
            publishedAtLabel: "April 22, 2026",
          },
        ]}
      />,
    );

    const input = screen.getByLabelText(/search posts/i);
    fireEvent.change(input, { target: { value: "editorial" } });

    expect(
      screen.getByRole("link", {
        name: /introducing inkwell's mdx publishing pipeline/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("link", {
        name: /building a static search experience that stays lightweight/i,
      }),
    ).not.toBeInTheDocument();
    expect(window.location.search).toBe("?q=editorial");
  });

  it("announces live result counts for screen-reader users as the query changes", () => {
    render(
      <SearchExperience
        initialQuery=""
        items={[
          {
            slug: "introducing-inkwell",
            href: "/blog/introducing-inkwell",
            title: "Introducing Inkwell's MDX publishing pipeline",
            description:
              "A first production-shaped article that proves local MDX content, static routing, and editorial rendering can move together.",
            category: "Editorial systems",
            authorName: "Amjad Yahia",
            publishedAt: "2026-04-26",
            publishedAtLabel: "April 26, 2026",
          },
          {
            slug: "building-a-static-search-experience-that-stays-lightweight",
            href: "/blog/building-a-static-search-experience-that-stays-lightweight",
            title: "Building a static search experience that stays lightweight",
            description:
              "A practical approach to search pages that feel responsive without shipping full article bodies or introducing server-side search infrastructure.",
            category: "Search experience",
            authorName: "Amjad Yahia",
            publishedAt: "2026-04-22",
            publishedAtLabel: "April 22, 2026",
          },
        ]}
      />,
    );

    const input = screen.getByLabelText(/search posts/i);
    expect(screen.getByRole("status")).toHaveTextContent("Showing 2 results.");

    fireEvent.change(input, { target: { value: "editorial" } });
    expect(screen.getByRole("status")).toHaveTextContent(
      'Showing 1 result for "editorial".',
    );

    fireEvent.change(input, { target: { value: "missing" } });
    expect(screen.getByRole("status")).toHaveTextContent(
      'Showing 0 results for "missing".',
    );
  });
});
