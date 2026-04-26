import type { Metadata } from "next";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TAGLINE,
} from "./constants";
import type { PostDocument } from "./posts";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://inkwell-demo.netlify.app";
const DEFAULT_OG_IMAGE = "/images/inkwell-og.svg";
const SITE_TITLE = `${SITE_NAME} | Editorial Next.js SEO Portfolio`;
const AUTHOR = {
  name: "Amjad Yahia",
};

type BreadcrumbItem = {
  name: string;
  path: string;
};

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

export function getSiteUrl() {
  return trimTrailingSlash(SITE_URL);
}

export function toAbsoluteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteUrl()}${normalizedPath}`;
}

export function buildHomeMetadata(): Metadata {
  const imageUrl = toAbsoluteUrl(DEFAULT_OG_IMAGE);

  return {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    alternates: {
      canonical: toAbsoluteUrl("/"),
    },
    openGraph: {
      type: "website",
      url: toAbsoluteUrl("/"),
      title: SITE_TITLE,
      description: SITE_DESCRIPTION,
      siteName: SITE_NAME,
      images: [
        {
          url: imageUrl,
          alt: `${SITE_NAME} social preview`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: SITE_TITLE,
      description: SITE_DESCRIPTION,
      images: [imageUrl],
    },
  };
}

export function buildArticleMetadata(post: PostDocument): Metadata {
  const canonical = toAbsoluteUrl(`/blog/${post.slug}`);
  const imageUrl = toAbsoluteUrl(post.coverImage);

  return {
    title: `${post.title} | ${SITE_NAME}`,
    description: post.description,
    alternates: {
      canonical,
    },
    authors: [{ name: post.author.name }],
    openGraph: {
      type: "article",
      url: canonical,
      title: post.title,
      description: post.description,
      siteName: SITE_NAME,
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      section: post.category,
      images: [
        {
          url: imageUrl,
          alt: post.coverImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [imageUrl],
    },
  };
}

export function buildWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    headline: SITE_TAGLINE,
    url: toAbsoluteUrl("/"),
  };
}

export function buildArticleJsonLd(post: PostDocument) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: {
      "@type": "Person",
      name: post.author.name,
    },
    image: toAbsoluteUrl(post.coverImage),
    mainEntityOfPage: toAbsoluteUrl(`/blog/${post.slug}`),
    articleSection: post.category,
    wordCount: post.wordCount,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
    },
  };
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: toAbsoluteUrl(item.path),
    })),
  };
}
