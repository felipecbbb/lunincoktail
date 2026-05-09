"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useT } from "./LanguageProvider";

export function Header({ variant = "site" }: { variant?: "site" | "menu" }) {
  const t = useT();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const links = [
    { href: "/menu", label: t("nav.menu") },
    { href: "/events", label: t("nav.events") },
    { href: "/about", label: t("nav.about") },
    { href: "/contact", label: t("nav.contact") },
  ];

  return (
    <header
      className={
        "sticky top-0 z-40 transition-all duration-300 safe-top " +
        (scrolled || variant === "menu"
          ? "bg-lunin-black/85 backdrop-blur-md border-b border-lunin-cream/10"
          : "bg-transparent")
      }
    >
      <div className="mx-auto max-w-6xl px-5 md:px-10 h-16 flex items-center justify-between">
        <Logo size="sm" href="/" />

        <nav className="hidden md:flex items-center gap-8 font-headline text-[0.78rem] uppercase tracking-[0.22em] text-lunin-cream/80">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={
                "hover:text-lunin-gold transition " +
                (pathname?.startsWith(l.href) ? "text-lunin-gold" : "")
              }
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? t("nav.close") : "Menu"}
            aria-expanded={open}
            className="md:hidden h-10 w-10 grid place-items-center rounded-full border border-lunin-cream/15 text-lunin-cream"
          >
            <span className="sr-only">Menu</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              {open ? (
                <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
              ) : (
                <>
                  <path d="M4 7h16" strokeLinecap="round" />
                  <path d="M4 12h16" strokeLinecap="round" />
                  <path d="M4 17h16" strokeLinecap="round" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-lunin-cream/10 bg-lunin-black/95 backdrop-blur-md">
          <nav className="px-5 py-6 flex flex-col gap-5 font-headline uppercase tracking-[0.22em] text-[0.85rem] text-lunin-cream">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="hover:text-lunin-gold transition"
              >
                {l.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-lunin-cream/10">
              <LanguageSwitcher />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
