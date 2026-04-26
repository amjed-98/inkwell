import React from "react";
import { render, screen } from "@testing-library/react";
import Home, { metadata as homeMetadata } from "../app/page";
import PostPage, { generateMetadata as generatePostMetadata } from "../app/blog/[slug]/page";

describe("SEO surfaces", () => {
  it("emits complete homepage metadata with canonical and social preview fields", () => {
    expect(homeMetadata).toMatchObject({
      title: "Inkwell | Editorial Next.js SEO Portfolio",
      description:
        "An editorial Next.js SEO showcase focused on performance, structured content, and production-grade frontend engineering.",
      alternates: {
        canonical: "https://inkwell-demo.netlify.app/",
      },
      openGraph: {
        type: "website",
        url: "https://inkwell-demo.netlify.app/",
        images: [
          {
            url: "https://inkwell-demo.netlify.app/images/inkwell-og.svg",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        images: ["https://inkwell-demo.netlify.app/images/inkwell-og.svg"],
      },
    });
  });

  it("renders website structured data on the homepage", () => {
    const { container } = render(<Home />);
    const structuredData = container.querySelector('script[type="application/ld+json"]');

    expect(structuredData).not.toBeNull();
    if (!structuredData) {
      throw new Error("Expected homepage structured data script");
    }
    expect(structuredData.textContent).toContain('"url":"https://inkwell-demo.netlify.app/"');
    expect(structuredData.textContent).toContain('"@type":"WebSite"');
  });

  it("emits article metadata with canonical, publish details, and social preview fields", async () => {
    const metadata = await generatePostMetadata({
      params: Promise.resolve({ slug: "introducing-inkwell" }),
    });

    expect(metadata).toMatchObject({
      title: "Introducing Inkwell's MDX publishing pipeline | Inkwell",
      description:
        "A first production-shaped article that proves local MDX content, static routing, and editorial rendering can move together.",
      alternates: {
        canonical: "https://inkwell-demo.netlify.app/blog/introducing-inkwell",
      },
      authors: [{ name: "Amjad Yahia" }],
      openGraph: {
        type: "article",
        url: "https://inkwell-demo.netlify.app/blog/introducing-inkwell",
        section: "Editorial systems",
        images: [
          {
            url: "https://inkwell-demo.netlify.app/images/posts/introducing-inkwell-cover.svg",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        images: [
          "https://inkwell-demo.netlify.app/images/posts/introducing-inkwell-cover.svg",
        ],
      },
    });
    const articleOpenGraph = metadata.openGraph as { publishedTime?: Date } | undefined;
    expect(articleOpenGraph?.publishedTime).toEqual(new Date("2026-04-26"));
  });

  it("renders article and breadcrumb structured data on the post page", async () => {
    const { container } = render(
      await PostPage({ params: Promise.resolve({ slug: "introducing-inkwell" }) }),
    );
    const structuredDataScripts = container.querySelectorAll(
      'script[type="application/ld+json"]',
    );
    const articleStructuredData = Array.from(structuredDataScripts).find((node) =>
      node.textContent?.includes('"@type":"Article"'),
    );
    const breadcrumbStructuredData = Array.from(structuredDataScripts).find((node) =>
      node.textContent?.includes('"@type":"BreadcrumbList"'),
    );

    expect(articleStructuredData).toBeDefined();
    expect(breadcrumbStructuredData).toBeDefined();
    if (!articleStructuredData || !breadcrumbStructuredData) {
      throw new Error("Expected article and breadcrumb structured data scripts");
    }
    expect(articleStructuredData?.textContent).toContain(
      '"headline":"Introducing Inkwell\'s MDX publishing pipeline"',
    );
    expect(articleStructuredData?.textContent).toContain(
      '"author":{"@type":"Person","name":"Amjad Yahia"}',
    );
    expect(breadcrumbStructuredData.textContent).toContain('"name":"Blog"');
    expect(breadcrumbStructuredData.textContent).toContain(
      '"item":"https://inkwell-demo.netlify.app/blog/introducing-inkwell"',
    );
  });
});
