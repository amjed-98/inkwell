"use client";

import { useState } from "react";

type CodeBlockProps = {
  children: React.ReactNode;
  code: string;
  language: string;
};

export function CodeBlock({ children, code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    void navigator.clipboard.writeText(code);
    setCopied(true);
  }

  return (
    <div className="mt-8 overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-950 text-slate-100 shadow-[0_18px_60px_rgba(15,23,42,0.22)]">
      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3 text-xs uppercase tracking-[0.18em] text-slate-400">
        <span>{language}</span>
        <button
          className="rounded-full border border-slate-700 px-3 py-1 font-semibold text-slate-100 transition hover:border-slate-500"
          onClick={handleCopy}
          type="button"
        >
          {copied ? "Copied" : "Copy code block"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-sm leading-7">{children}</pre>
    </div>
  );
}
