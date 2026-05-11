"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslated } from "./LanguageProvider";
import type { Category, MenuItem } from "../lib/types";

export function CategoryCard({
  category,
  count,
  index,
  preview = [],
}: {
  category: Category;
  count: number;
  index: number;
  preview?: MenuItem[];
}) {
  const tr = useTranslated();
  // Prefer the category.hero (curated), fall back to the first item's image
  const heroSrc =
    category.hero && category.hero.length > 0
      ? category.hero
      : preview[0]?.image && preview[0].image.length > 0
        ? preview[0].image
        : null;

  return (
    <Link
      href={`/menu/${category.slug}`}
      className="group relative isolate overflow-hidden rounded-3xl border border-lunin-cream/10 bg-gradient-to-br from-lunin-charcoal to-lunin-black aspect-[4/5] sm:aspect-[5/6] flex flex-col justify-end transition hover:border-lunin-gold/40"
    >
      {/* Hero image full-bleed */}
      {heroSrc && (
        <Image
          src={heroSrc}
          alt={tr(category.name)}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="absolute inset-0 -z-10 object-cover transition duration-700 group-hover:scale-[1.04]"
        />
      )}

      {/* Dark gradient overlay for legibility */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background: heroSrc
            ? "linear-gradient(180deg, rgba(13,13,13,0.20) 0%, rgba(13,13,13,0.10) 30%, rgba(13,13,13,0.78) 72%, rgba(13,13,13,0.96) 100%)"
            : "linear-gradient(180deg, rgba(13,13,13,0.0) 0%, rgba(13,13,13,1) 100%)",
        }}
      />

      {/* Decorative big number top-right */}
      <span
        aria-hidden="true"
        className="absolute right-4 top-3 lunin-wordmark text-5xl leading-none text-lunin-gold/15 group-hover:text-lunin-gold/25 transition"
      >
        {String(index + 1).padStart(2, "0")}
      </span>
      <span aria-hidden="true" className="absolute inset-x-6 top-0 hairline" />

      {/* Content bottom-left */}
      <div className="relative p-6 sm:p-7">
        <span className="font-headline uppercase text-[0.6rem] tracking-[0.36em] text-lunin-gold/80">
          /0{category.order}
        </span>
        <h3 className="mt-2 font-display text-2xl sm:text-[1.7rem] text-lunin-cream leading-tight">
          {tr(category.name)}
        </h3>
        <p className="mt-2 text-[0.72rem] tracking-[0.22em] uppercase font-headline text-lunin-cream/55">
          {count} {count === 1 ? "cóctel" : "cócteles"}
        </p>

        <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-lunin-cream/20 bg-lunin-black/55 backdrop-blur px-3 py-1.5 text-[0.65rem] tracking-[0.28em] uppercase font-headline text-lunin-cream/80 group-hover:border-lunin-gold/60 group-hover:text-lunin-gold transition">
          Ver carta
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            className="transition group-hover:translate-x-1"
          >
            <path d="M5 12h14" strokeLinecap="round" />
            <path d="m13 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
