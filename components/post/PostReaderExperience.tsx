"use client";

import { useEffect, useState } from "react";
import type { TableOfContentsHeading } from "../../lib/posts";

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getActiveHeadingId(headings: TableOfContentsHeading[]) {
  const headingElements = headings
    .map((heading) => document.getElementById(heading.id))
    .filter((element): element is HTMLElement => element instanceof HTMLElement);

  const activeHeading = [...headingElements]
    .reverse()
    .find((element) => element.getBoundingClientRect().top <= 96);

  return activeHeading?.id ?? headings[0]?.id ?? "";
}

export function PostReaderExperience({
  headings,
  title,
}: {
  headings: TableOfContentsHeading[];
  title: string;
}) {
  const [activeHeadingId, setActiveHeadingId] = useState(headings[0]?.id ?? "");
  const [copyFeedback, setCopyFeedback] = useState("Copy link");
  const [progress, setProgress] = useState(0);
  const hasHeadings = headings.length > 0;

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const nextProgress = maxScroll <= 0 ? 0 : Math.round((window.scrollY / maxScroll) * 100);

      setProgress(clamp(nextProgress, 0, 100));

      if (hasHeadings) {
        setActiveHeadingId(getActiveHeadingId(headings));
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasHeadings, headings]);

  useEffect(() => {
    if (copyFeedback === "Copy link") {
      return;
    }

    const timeout = window.setTimeout(() => setCopyFeedback("Copy link"), 2000);
    return () => window.clearTimeout(timeout);
  }, [copyFeedback]);

  async function copyLink() {
    const shareUrl = window.location.href;
    await navigator.clipboard.writeText(shareUrl);
    setCopyFeedback("Copied link");
  }

  async function shareArticle() {
    const shareUrl = window.location.href;

    if ("share" in navigator) {
      await navigator.share({
        title,
        url: shareUrl,
      });
      return;
    }

    await copyLink();
  }

  return (
    <>
      <div
        aria-label="Reading progress"
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={progress}
        className="fixed inset-x-0 top-0 z-40 h-1 bg-transparent"
        role="progressbar"
      >
        <div
          className="h-full bg-blue-600 transition-[width] duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <aside className="space-y-6 lg:sticky lg:top-24">
        {hasHeadings ? (
          <nav
            aria-label="Table of contents"
            className="rounded-[1.5rem] border border-black/8 bg-white/85 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">
              On this page
            </p>
            <ol className="mt-4 space-y-3">
              {headings.map((heading) => (
                <li key={heading.id}>
                  <a
                    aria-current={activeHeadingId === heading.id ? "true" : undefined}
                    className={`block text-sm leading-6 transition ${
                      activeHeadingId === heading.id
                        ? "font-semibold text-neutral-950"
                        : "text-neutral-600 hover:text-neutral-950"
                    } ${heading.level === 3 ? "pl-4" : ""}`}
                    href={`#${heading.id}`}
                  >
                    {heading.text}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        ) : null}
        <div className="rounded-[1.5rem] border border-black/8 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">
            Share
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              aria-label="Copy article link"
              className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-800 transition hover:border-blue-300 hover:text-blue-700"
              onClick={() => {
                void copyLink();
              }}
              type="button"
            >
              {copyFeedback}
            </button>
            <button
              aria-label="Share article"
              className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-800 transition hover:border-blue-300 hover:text-blue-700"
              onClick={() => {
                void shareArticle();
              }}
              type="button"
            >
              Share article
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
