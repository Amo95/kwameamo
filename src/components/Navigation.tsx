"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

const links = [
  { href: "/projects", label: "Projects" },
  { href: "/guestbook", label: "Wall" },
];

/** Three things: the projects, the Wall, and the CV (the right one for the visitor's region, via /cv). */
export default function Navigation() {
  const pathname = usePathname();
  return (
    <nav className="sticky top-0 z-[56] border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3.5 sm:px-6 sm:py-5 lg:px-8">
        <Link href="/" className="text-[15px] font-semibold tracking-tight text-foreground">
          JKA
        </Link>
        <div className="flex items-center gap-4 sm:gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
              className={`nav-link text-[14px] transition-colors hover:text-foreground ${
                pathname === link.href ? "text-foreground" : "text-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="/cv"
            target="_blank"
            rel="noopener"
            className="inline-flex h-8 items-center gap-1 rounded-full border border-border px-3 text-[13px] text-foreground transition-colors hover:bg-foreground/[0.05]"
          >
            CV <span aria-hidden="true">↓</span>
          </a>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
