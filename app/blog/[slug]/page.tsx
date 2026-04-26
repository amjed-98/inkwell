import type { Metadata } from "next";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
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
      className="mt-12 text-2xl font-semibold tracking-tight text-neutral-950"
      {...props}
    />
  ),
  h3: (props: React.ComponentProps<"h3">) => (
    <h3
      data-toc-heading="true"
      id={props.id ?? slugifyHeading(String(props.children))}
      className="mt-10 text-xl font-semibold tracking-tight text-neutral-950"
      {...props}
    />
  ),
  p: (props: React.ComponentProps<"p">) => (
    <p className="mt-6 text-lg leading-8 text-neutral-700" {...props} />
  ),
  a: (props: React.ComponentProps<"a">) => (
    <a className="font-medium text-blue-700 underline decoration-blue-200 underline-offset-4" {...props} />
  ),
  ul: (props: React.ComponentProps<"ul">) => (
    <ul className="mt-6 list-disc space-y-3 pl-6 text-lg leading-8 text-neutral-700" {...props} />
  ),
  code: (props: React.ComponentProps<"code">) => (
    <code
      className="rounded bg-blue-50 px-1.5 py-0.5 font-mono text-[0.95em] text-blue-900"
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
    <main className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-10 lg:px-12" id="content">
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
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
        <article className="mx-auto w-full max-w-3xl">
          <div className="rounded-[2rem] border border-black/8 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">
              {post.category}
            </p>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-neutral-950 sm:text-5xl">
              {post.title}
            </h1>
            <p className="mt-5 text-lg leading-8 text-neutral-600">{post.description}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-neutral-500">
              <span className="font-semibold text-neutral-800">{post.author.name}</span>
              <span>{post.author.role}</span>
              <span aria-hidden="true">•</span>
              <span>{post.publishedAtLabel}</span>
              <span aria-hidden="true">•</span>
              <span>{post.readingTimeMinutes} min read</span>
            </div>
            <Image
              alt={post.coverImageAlt}
              className="mt-10 w-full rounded-[1.5rem] border border-neutral-200 bg-slate-100"
              fetchPriority="high"
              height={720}
              sizes="(min-width: 1024px) 768px, 100vw"
              src={post.coverImage}
              width={1280}
            />
            <div className="mt-12 border-t border-neutral-200 pt-8">
              <Link
                className="text-sm font-medium text-blue-700 underline decoration-blue-200 underline-offset-4"
                href="/blog"
              >
                Back to archive
              </Link>
            </div>
            <div className="mt-6">{content}</div>
            {relatedPosts.length > 0 ? (
              <section className="mt-16 border-t border-neutral-200 pt-10">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">
                  Keep reading
                </p>
                <h2 className="mt-4 text-2xl font-semibold tracking-tight text-neutral-950">
                  Keep reading
                </h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {relatedPosts.map((relatedPost) => (
                    <Link
                      className="rounded-[1.5rem] border border-neutral-200 bg-neutral-50 p-5 transition hover:border-blue-200 hover:bg-white"
                      href={`/blog/${relatedPost.slug}`}
                      key={relatedPost.slug}
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
                        {relatedPost.category}
                      </p>
                      <h3 className="mt-3 text-lg font-semibold tracking-tight text-neutral-950">
                        {relatedPost.title}
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-neutral-600">
                        {relatedPost.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        </article>
        <PostReaderExperience headings={post.tableOfContents} title={post.title} />
      </div>
    </main>
  );
}
