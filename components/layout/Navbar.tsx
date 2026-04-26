"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PRIMARY_NAV, SITE_NAME } from "../../lib/constants";
import { ThemeToggle } from "../ui/ThemeToggle";

export function Navbar() {
  const pathname = usePathname();

  function isCurrentRoute(href: string) {
    if (href === "/") {
      return pathname === href;
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className="border-b border-[var(--color-border)] bg-[color:var(--color-surface)]/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 sm:px-10 lg:px-12">
        <Link
          aria-current={pathname === "/" ? "page" : undefined}
          className="text-lg font-semibold tracking-tight text-[var(--color-foreground)]"
          href="/"
        >
          {SITE_NAME}
        </Link>
        <div className="flex items-center gap-3 sm:gap-6">
          <nav aria-label="Primary navigation">
            <ul className="flex items-center gap-4 text-sm text-[var(--color-muted)]">
              {PRIMARY_NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    aria-current={isCurrentRoute(item.href) ? "page" : undefined}
                    className="transition hover:text-[var(--color-foreground)]"
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
