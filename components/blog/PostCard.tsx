import Image from "next/image";
import Link from "next/link";
import type { PostSummary } from "../../lib/posts";

type PostCardProps = {
  post: PostSummary;
  priority?: boolean;
  variant?: "compact" | "feature";
};

export function PostCard({
  post,
  priority = false,
  variant = "compact",
}: PostCardProps) {
  const isFeature = variant === "feature";

  return (
    <article
      className={`premium-card group grid overflow-hidden ${
        isFeature ? "lg:grid-cols-[1.05fr_0.95fr]" : ""
      }`}
    >
      <Link
        aria-label={`Open cover image for ${post.title}`}
        className={`relative block overflow-hidden bg-[var(--surface-muted)] ${
          isFeature ? "min-h-[18rem] lg:min-h-full" : "aspect-[16/9]"
        }`}
        href={`/blog/${post.slug}`}
      >
        <Image
          alt={post.coverImageAlt}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]"
          fetchPriority={priority ? "high" : undefined}
          height={720}
          sizes={isFeature ? "(min-width: 1024px) 560px, 100vw" : "(min-width: 1024px) 360px, 100vw"}
          src={post.coverImage}
          width={1280}
        />
      </Link>
      <div className={isFeature ? "p-7 sm:p-9 lg:p-10" : "p-6"}>
        <p className="eyebrow">{isFeature ? "Featured essay" : post.category}</p>
        <h2
          className={`mt-4 font-serif font-semibold leading-[1.02] tracking-normal text-[var(--foreground)] ${
            isFeature ? "text-4xl sm:text-5xl" : "text-2xl"
          }`}
        >
          <Link className="transition hover:text-[var(--accent)]" href={`/blog/${post.slug}`}>
            {post.title}
          </Link>
        </h2>
        <p
          className={`mt-4 text-[var(--muted-strong)] ${
            isFeature ? "text-lg leading-8" : "text-base leading-7"
          }`}
        >
          {post.description}
        </p>
        <div className="meta-row mt-6">
          <span className="font-semibold text-[var(--foreground)]">{post.author.name}</span>
          <span className="meta-dot" aria-hidden="true" />
          <span>{post.publishedAtLabel}</span>
          <span className="meta-dot" aria-hidden="true" />
          <span>{post.readingTimeMinutes} min read</span>
        </div>
        <Link className="primary-action mt-7" href={`/blog/${post.slug}`}>
          {isFeature ? "Read the featured post" : `Read ${post.title}`}
        </Link>
      </div>
    </article>
  );
}
