import { render, screen } from "@testing-library/react";
import BlogPage, { generateMetadata as generateBlogMetadata } from "../app/blog/page";
import CategoryPage, {
  generateMetadata as generateCategoryMetadata,
  generateStaticParams as generateCategoryStaticParams,
} from "../app/blog/category/[slug]/page";
import {
  getAllCategories,
  getFeaturedPost,
  getPostsByCategory,
} from "../lib/posts";

describe("blog archive surfaces", () => {
  it("exposes featured content and normalized category data from the content layer", async () => {
    await expect(getFeaturedPost()).resolves.toMatchObject({
      slug: "introducing-inkwell",
      title: "Introducing Inkwell's MDX publishing pipeline",
      category: "Editorial systems",
    });

    await expect(getAllCategories()).resolves.toEqual([
      {
        slug: "content-strategy",
        name: "Content strategy",
        postCount: 1,
      },
      {
        slug: "editorial-systems",
        name: "Editorial systems",
        postCount: 1,
      },
      {
        slug: "search-experience",
        name: "Search experience",
        postCount: 1,
      },
    ]);

    await expect(getPostsByCategory("editorial-systems")).resolves.toHaveLength(1);
  });

  it("filters the blog index from the category URL state", async () => {
    render(
      await BlogPage({
        searchParams: Promise.resolve({ category: "editorial-systems" }),
      }),
    );

    expect(screen.getByRole("main")).toHaveAttribute("id", "content");
    expect(screen.getByText(/filtered by editorial systems/i)).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: /view editorial systems archive/i,
      }),
    ).toHaveAttribute("href", "/blog/category/editorial-systems");
    expect(
      screen.getByRole("link", {
        name: /editorial systems \(1\)/i,
      }),
    ).toHaveAttribute("aria-current", "page");
    expect(
      screen.getByRole("link", {
        name: /all categories/i,
      }),
    ).not.toHaveAttribute("aria-current");
    expect(
      screen.getByRole("link", {
        name: /clear category filter/i,
      }),
    ).toHaveAttribute("href", "/blog");
  });

  it("statically generates a category archive with metadata and structured data", async () => {
    await expect(generateCategoryStaticParams()).resolves.toEqual([
      { slug: "content-strategy" },
      { slug: "editorial-systems" },
      { slug: "search-experience" },
    ]);

    await expect(generateBlogMetadata()).resolves.toMatchObject({
      title: "Blog | Inkwell",
      alternates: {
        canonical: "https://inkwell-demo.netlify.app/blog",
      },
    });

    await expect(
      generateCategoryMetadata({
        params: Promise.resolve({ slug: "editorial-systems" }),
      }),
    ).resolves.toMatchObject({
      title: "Editorial systems articles | Inkwell",
      alternates: {
        canonical: "https://inkwell-demo.netlify.app/blog/category/editorial-systems",
      },
    });

    const { container } = render(
      await CategoryPage({
        params: Promise.resolve({ slug: "editorial-systems" }),
      }),
    );
    const structuredDataScripts = container.querySelectorAll(
      'script[type="application/ld+json"]',
    );

    expect(
      Array.from(structuredDataScripts).some((node) =>
        node.textContent?.includes('"@type":"CollectionPage"'),
      ),
    ).toBe(true);
    expect(screen.getByRole("main")).toHaveAttribute("id", "content");
    expect(
      Array.from(structuredDataScripts).some((node) =>
        node.textContent?.includes('"@type":"BreadcrumbList"'),
      ),
    ).toBe(true);
  });
});
