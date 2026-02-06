"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/about", label: "About" },
  { href: "/experience", label: "Experience" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
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
        James Kwame Amo
      </Link>

      {/* Desktop nav */}
      <div className="hidden items-center gap-7 sm:flex">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`text-[14px] transition-colors hover:text-foreground ${
              pathname === link.href ? "text-foreground" : "text-muted"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Mobile hamburger */}
      <button
        className="flex flex-col gap-[5px] sm:hidden"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span
          className={`block h-[1.5px] w-5 bg-foreground transition-transform ${
            menuOpen ? "translate-y-[6.5px] rotate-45" : ""
          }`}
        />
        <span
          className={`block h-[1.5px] w-5 bg-foreground transition-opacity ${
            menuOpen ? "opacity-0" : ""
          }`}
        />
        <span
          className={`block h-[1.5px] w-5 bg-foreground transition-transform ${
            menuOpen ? "-translate-y-[6.5px] -rotate-45" : ""
          }`}
        />
      </button>

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
