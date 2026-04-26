import React from "react";
import { render } from "@testing-library/react";
import Home, { metadata as homeMetadata } from "../app/page";
import AboutPage, { metadata as aboutMetadata } from "../app/about/page";
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

  it("emits about-page metadata and identity structured data", async () => {
    expect(aboutMetadata).toMatchObject({
      title: "About | Inkwell",
      description:
        "Full-stack engineer focused on editorial systems, technical SEO, and performance-conscious product delivery for content-heavy teams.",
      alternates: {
        canonical: "https://inkwell-demo.netlify.app/about",
      },
      openGraph: {
        type: "profile",
        url: "https://inkwell-demo.netlify.app/about",
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

    const { container } = render(await AboutPage());
    const structuredDataScripts = container.querySelectorAll(
      'script[type="application/ld+json"]',
    );
    const personStructuredData = Array.from(structuredDataScripts).find((node) =>
      node.textContent?.includes('"@type":"Person"'),
    );
    const breadcrumbStructuredData = Array.from(structuredDataScripts).find((node) =>
      node.textContent?.includes('"@type":"BreadcrumbList"'),
    );

    expect(personStructuredData).toBeDefined();
    expect(breadcrumbStructuredData).toBeDefined();
    if (!personStructuredData || !breadcrumbStructuredData) {
      throw new Error("Expected about page structured data scripts");
    }
    expect(personStructuredData.textContent).toContain('"name":"Amjad Yahia"');
    expect(personStructuredData.textContent).toContain(
      '"url":"https://inkwell-demo.netlify.app/about"',
    );
    expect(personStructuredData.textContent).toContain(
      '"sameAs":["https://github.com/amjed-98","https://www.linkedin.com/in/amjedyahia","https://x.com/amjed_98"]',
    );
    expect(breadcrumbStructuredData.textContent).toContain('"name":"About"');
    expect(breadcrumbStructuredData.textContent).toContain(
      '"item":"https://inkwell-demo.netlify.app/about"',
    );
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
    const articleOpenGraph = metadata.openGraph as { publishedTime?: string } | undefined;
    expect(articleOpenGraph?.publishedTime).toBe("2026-04-26");
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
