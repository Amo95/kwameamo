"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";

const links = [
  { href: "/about", label: "About" },
  { href: "/experience", label: "Experience" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/guestbook", label: "Wall" },
  { href: "/contact", label: "Contact" },
];

const socials = [
  { href: "https://github.com/amo95", label: "GitHub" },
  { href: "https://linkedin.com/in/james-amo", label: "LinkedIn" },
  { href: "mailto:kwame.amo.james@gmail.com", label: "Email" },
];

export default function Navigation() {
  const pathname = usePathname();
  // The menu counts as open only on the page it was opened on, so navigating closes it.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const menuOpen = openOn === pathname;
  const close = () => setOpenOn(null);

  useEffect(() => {
    if (!menuOpen) return;
    const root = document.documentElement;
    const overflow = root.style.overflow;
    root.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenOn(null);
    };
    const desktop = window.matchMedia("(min-width: 640px)");
    const onResize = (e: MediaQueryListEvent) => {
      if (e.matches) setOpenOn(null);
    };
    document.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onResize);
    return () => {
      root.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onResize);
    };
  }, [menuOpen]);

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
          <Link
            href="/"
            onClick={close}
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

          {/* Mobile theme toggle and two-line menu button */}
          <div className="flex items-center gap-2 sm:hidden">
            <ThemeToggle />
            <button
              className="relative h-11 w-11 rounded-md transition-colors hover:bg-border"
              onClick={() => setOpenOn(menuOpen ? null : pathname)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              <span
                className={`absolute left-3 h-[2px] w-5 rounded-full bg-foreground transition-all duration-300 ${
                  menuOpen ? "top-[21px] rotate-45" : "top-[17px]"
                }`}
              />
              <span
                className={`absolute left-3 h-[2px] rounded-full bg-foreground transition-all duration-300 ${
                  menuOpen ? "top-[21px] w-5 -rotate-45" : "top-[25px] w-[13px]"
                }`}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu: outside the nav, whose backdrop blur would trap a fixed child */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-background px-4 pb-8 pt-24 sm:hidden"
        >
          <div className="flex flex-col gap-1.5">
            {links.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={close}
                style={{ animationDelay: `${i * 35}ms` }}
                className={`menu-link text-[40px] font-semibold leading-[1.15] tracking-[-0.03em] ${
                  pathname === link.href ? "text-foreground" : "text-muted"
                }`}
              >
                {link.label}
                <span aria-hidden="true" className="ml-1.5 text-[28px] font-normal opacity-50">
                  &rarr;
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-auto flex gap-5 border-t border-border pt-5 text-[13px] text-muted">
            {socials.map((social) => (
              <Link
                key={social.label}
                href={social.href}
                target={social.href.startsWith("http") ? "_blank" : undefined}
                rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="transition-colors hover:text-foreground"
              >
                {social.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
