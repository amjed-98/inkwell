import type { Metadata } from "next";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { NewsletterCta } from "../../../components/blog/NewsletterCta";
import { CodeBlock } from "../../../components/mdx/CodeBlock";
import { PostReaderExperience } from "../../../components/post/PostReaderExperience";
import {
  getAllPosts,
  getPostBySlug,
  getRelatedPosts,
  slugifyHeading,
} from "../../../lib/posts";
import {
  buildArticleJsonLd,
  buildArticleMetadata,
  buildBreadcrumbJsonLd,
} from "../../../lib/seo";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const mdxComponents = {
  h2: (props: React.ComponentProps<"h2">) => (
    <h2
      data-toc-heading="true"
      id={props.id ?? slugifyHeading(String(props.children))}
      className="mt-14 scroll-mt-28 font-serif text-4xl font-semibold leading-tight tracking-normal text-[var(--foreground)]"
      {...props}
    />
  ),
  h3: (props: React.ComponentProps<"h3">) => (
    <h3
      data-toc-heading="true"
      id={props.id ?? slugifyHeading(String(props.children))}
      className="mt-10 scroll-mt-28 text-2xl font-semibold tracking-tight text-[var(--foreground)]"
      {...props}
    />
  ),
  p: (props: React.ComponentProps<"p">) => (
    <p className="mt-6 text-[1.08rem] leading-8 text-[var(--muted-strong)]" {...props} />
  ),
  a: (props: React.ComponentProps<"a">) => (
    <a className="text-link" {...props} />
  ),
  ul: (props: React.ComponentProps<"ul">) => (
    <ul className="mt-6 list-disc space-y-3 pl-6 text-[1.08rem] leading-8 text-[var(--muted-strong)]" {...props} />
  ),
  code: (props: React.ComponentProps<"code">) => (
    <code
      className="rounded bg-[var(--accent-soft)] px-1.5 py-0.5 font-mono text-[0.95em] text-[var(--accent-strong)]"
      {...props}
    />
  ),
  pre: ({ children }: React.ComponentProps<"pre">) => {
    const child = React.Children.only(children) as React.ReactElement<{
      children?: React.ReactNode;
      className?: string;
    }>;
    const code = typeof child.props.children === "string" ? child.props.children.trimEnd() : "";
    const language = child.props.className?.replace(/^language-/, "") ?? "text";

    return (
      <CodeBlock code={code} language={language}>
        <code className={child.props.className}>{child.props.children}</code>
      </CodeBlock>
    );
  },
};

export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = await getAllPosts();

  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {};
  }

  return buildArticleMetadata(post);
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post.slug);

  const { content } = await compileMDX({
    source: post.body,
    components: mdxComponents,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
      },
      parseFrontmatter: false,
    },
  });

  return (
    <main className="page-shell" id="content">
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildArticleJsonLd(post)),
        }}
        type="application/ld+json"
      />
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            buildBreadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Blog", path: "/blog" },
              { name: post.title, path: `/blog/${post.slug}` },
            ]),
          ),
        }}
        type="application/ld+json"
      />
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
        <article className="min-w-0">
          <header className="mx-auto max-w-[var(--reader-width)]">
            <Link className="text-link text-sm" href="/blog">
              Back to archive
            </Link>
            <p className="eyebrow mt-10">{post.category}</p>
            <h1 className="mt-5 font-serif text-5xl font-semibold leading-[0.95] tracking-normal text-[var(--foreground)] sm:text-6xl lg:text-7xl">
              {post.title}
            </h1>
            <p className="editorial-lede mt-6">{post.description}</p>
            <div className="meta-row mt-8">
              <span className="font-semibold text-[var(--foreground)]">{post.author.name}</span>
              <span>{post.author.role}</span>
              <span className="meta-dot" aria-hidden="true" />
              <span>{post.publishedAtLabel}</span>
              <span className="meta-dot" aria-hidden="true" />
              <span>{post.readingTimeMinutes} min read</span>
            </div>
          </header>
          <div className="mt-10 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-muted)] shadow-[var(--shadow-soft)]">
            <Image
              alt={post.coverImageAlt}
              className="w-full"
              fetchPriority="high"
              height={720}
              sizes="(min-width: 1024px) 768px, 100vw"
              src={post.coverImage}
              width={1280}
            />
          </div>
          <div className="mx-auto mt-12 max-w-[var(--reader-width)]">{content}</div>
            {relatedPosts.length > 0 ? (
              <section className="mx-auto mt-16 max-w-[var(--reader-width)] border-t border-[var(--border)] pt-10">
                <p className="eyebrow">Keep reading</p>
                <h2 className="mt-4 font-serif text-4xl font-semibold leading-tight tracking-normal text-[var(--foreground)]">
                  Keep reading
                </h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {relatedPosts.map((relatedPost) => (
                    <Link
                      className="premium-card p-5"
                      href={`/blog/${relatedPost.slug}`}
                      key={relatedPost.slug}
                    >
                      <p className="eyebrow">{relatedPost.category}</p>
                      <h3 className="mt-3 text-lg font-semibold tracking-tight text-[var(--foreground)]">
                        {relatedPost.title}
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                        {relatedPost.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}
          <NewsletterCta />
        </article>
        <PostReaderExperience headings={post.tableOfContents} title={post.title} />
      </div>
    </main>
  );
}
