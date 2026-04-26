import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import BlogPage from "../app/blog/page";
import PostPage, { generateStaticParams } from "../app/blog/[slug]/page";
import { CodeBlock } from "../components/mdx/CodeBlock";
import { getAllPosts, getPostBySlug } from "../lib/posts";

describe("post content pipeline", () => {
  it("loads local MDX content with frontmatter and reading time metadata", async () => {
    const posts = await getAllPosts();

    expect(posts).toHaveLength(3);
    expect(posts[2]).toMatchObject({
      slug: "introducing-inkwell",
      title: "Introducing Inkwell's MDX publishing pipeline",
      author: {
        name: "Amjad Yahia",
      },
      coverImage: "/images/posts/introducing-inkwell-cover.svg",
    });
    expect(posts[2].readingTimeMinutes).toBeGreaterThan(0);

    const post = await getPostBySlug("introducing-inkwell");
    expect(post?.body).toMatch(/```tsx/);
  });

  it("statically generates the first article route and exposes it from the archive", async () => {
    await expect(generateStaticParams()).resolves.toEqual([
      { slug: "introducing-inkwell" },
    ]);

    render(await BlogPage({}));

    expect(
      screen.getByRole("link", {
        name: /read introducing inkwell's mdx publishing pipeline/i,
      }),
    ).toHaveAttribute("href", "/blog/introducing-inkwell");
  });

  it("renders the article page with author, reading time, local imagery, and code copy support", async () => {
    render(await PostPage({ params: Promise.resolve({ slug: "introducing-inkwell" }) }));

    expect(
      screen.getByRole("heading", {
        name: /introducing inkwell's mdx publishing pipeline/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/amjad yahia/i)).toBeInTheDocument();
    expect(screen.getByText("1 min read")).toBeInTheDocument();
    expect(screen.getByAltText(/abstract blue editorial cover/i)).toHaveAttribute(
      "src",
      "/images/posts/introducing-inkwell-cover.svg",
    );
    expect(
      screen.getByRole("button", {
        name: /copy code block/i,
      }),
    ).toBeInTheDocument();
  });
});

describe("code block interactions", () => {
  it("copies the raw code to the clipboard", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: { writeText },
    });

    render(
      <CodeBlock code={`const message = "inkwell";`} language="tsx">
        <code>{`const message = "inkwell";`}</code>
      </CodeBlock>,
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /copy code block/i,
      }),
    );

    expect(writeText).toHaveBeenCalledWith(`const message = "inkwell";`);
  });
});
