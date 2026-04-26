import React from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import PostPage from "../app/blog/[slug]/page";
import { PostReaderExperience } from "../components/post/PostReaderExperience";
import { getPostBySlug, getRelatedPosts } from "../lib/posts";

describe("article engagement surfaces", () => {
  it("derives a table of contents and related posts from the content layer", async () => {
    const post = await getPostBySlug("introducing-inkwell");

    expect(post?.tableOfContents).toEqual([
      {
        id: "what-the-first-slice-proves",
        level: 2,
        text: "What the first slice proves",
      },
    ]);

    await expect(getRelatedPosts("introducing-inkwell")).resolves.toEqual([
      expect.objectContaining({
        slug: "designing-archive-pages-that-carry-their-own-seo-weight",
      }),
      expect.objectContaining({
        slug: "building-a-static-search-experience-that-stays-lightweight",
      }),
    ]);
  });

  it("renders article reading aids, share actions, and related-post discovery", async () => {
    render(await PostPage({ params: Promise.resolve({ slug: "introducing-inkwell" }) }));

    expect(
      screen.getByRole("navigation", {
        name: /table of contents/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: /what the first slice proves/i,
      }),
    ).toHaveAttribute("href", "#what-the-first-slice-proves");
    expect(
      screen.getByRole("button", {
        name: /copy article link/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole("progressbar", { name: /reading progress/i })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /keep reading/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: /designing archive pages that carry their own seo weight/i,
      }),
    ).toHaveAttribute(
      "href",
      "/blog/designing-archive-pages-that-carry-their-own-seo-weight",
    );
  });
});

describe("post reader experience interactions", () => {
  it("tracks reading progress, highlights the active heading, and copies the article URL", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: { writeText },
    });
    window.history.replaceState({}, "", "/blog/introducing-inkwell");

    Object.defineProperty(document.documentElement, "scrollHeight", {
      configurable: true,
      value: 2000,
    });
    Object.defineProperty(document.documentElement, "clientHeight", {
      configurable: true,
      value: 1000,
    });

    render(
      <>
        <article>
          <h2 data-toc-heading="true" id="first-section">
            First section
          </h2>
          <h2 data-toc-heading="true" id="second-section">
            Second section
          </h2>
        </article>
        <PostReaderExperience
          headings={[
            { id: "first-section", level: 2, text: "First section" },
            { id: "second-section", level: 2, text: "Second section" },
          ]}
          title="Introducing Inkwell's MDX publishing pipeline"
        />
      </>,
    );

    const [firstHeading, secondHeading] = screen.getAllByRole("heading", { level: 2 });
    vi.spyOn(firstHeading, "getBoundingClientRect").mockReturnValue({
      bottom: 180,
      height: 40,
      left: 0,
      right: 0,
      top: 120,
      width: 0,
      x: 0,
      y: 120,
      toJSON: () => ({}),
    });
    vi.spyOn(secondHeading, "getBoundingClientRect").mockReturnValue({
      bottom: 80,
      height: 40,
      left: 0,
      right: 0,
      top: 20,
      width: 0,
      x: 0,
      y: 20,
      toJSON: () => ({}),
    });

    act(() => {
      Object.defineProperty(window, "scrollY", {
        configurable: true,
        value: 500,
      });
      window.dispatchEvent(new Event("scroll"));
    });

    await waitFor(() => {
      expect(screen.getByRole("progressbar", { name: /reading progress/i })).toHaveAttribute(
        "aria-valuenow",
        "50",
      );
      expect(screen.getByRole("link", { name: "Second section" })).toHaveAttribute(
        "aria-current",
        "true",
      );
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: /copy article link/i,
      }),
    );

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith(
        "http://localhost:3000/blog/introducing-inkwell",
      );
    });
  });
});
