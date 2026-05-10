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
    <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[color:var(--surface-elevated)]/90 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[var(--content-width)] flex-wrap items-center justify-between gap-3 px-4 py-3 sm:flex-nowrap sm:px-6">
        <Link
          aria-current={pathname === "/" ? "page" : undefined}
          className="font-serif text-2xl font-semibold tracking-normal text-[var(--foreground)]"
          href="/"
        >
          {SITE_NAME}
        </Link>
        <div className="order-3 w-full sm:order-2 sm:w-auto">
          <nav aria-label="Primary navigation">
            <ul className="flex items-center gap-1 overflow-x-auto text-sm text-[var(--muted)] sm:gap-2">
              {PRIMARY_NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    aria-current={isCurrentRoute(item.href) ? "page" : undefined}
                    className="nav-link"
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="order-2 sm:order-3">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
