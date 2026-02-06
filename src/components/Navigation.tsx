"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";

const links = [
  { href: "/about", label: "About" },
  { href: "/experience", label: "Experience" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/guestbook", label: "Wall" },
  { href: "/contact", label: "Contact" },
];

export default function Navigation() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between">
      <Link
        href="/"
        className="text-[15px] font-semibold tracking-tight text-foreground"
      >
        JKA
      </Link>

      {/* Desktop nav */}
      <div className="hidden items-center gap-7 sm:flex">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`nav-link text-[14px] transition-colors hover:text-foreground ${
              pathname === link.href ? "text-foreground" : "text-muted"
            }`}
          >
            {link.label}
          </Link>
        ))}
        <ThemeToggle />
      </div>

      {/* Mobile theme toggle and hamburger */}
      <div className="flex items-center gap-2 sm:hidden">
        <ThemeToggle />
        <button
          className="flex h-11 w-11 flex-col items-center justify-center gap-[5px] rounded-md transition-colors hover:bg-border"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`block h-[2px] w-5 bg-foreground transition-transform ${
              menuOpen ? "translate-y-[7px] rotate-45" : ""
            }`}
          />
          <span
            className={`block h-[2px] w-5 bg-foreground transition-opacity ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-[2px] w-5 bg-foreground transition-transform ${
              menuOpen ? "-translate-y-[7px] -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="absolute left-0 right-0 top-14 z-50 border-b border-border bg-background px-6 pb-6 sm:hidden">
          <div className="flex flex-col gap-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`text-[14px] transition-colors hover:text-foreground ${
                  pathname === link.href ? "text-foreground" : "text-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
