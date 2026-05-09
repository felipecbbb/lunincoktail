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
  return (
    <Link
      href={`/menu/${category.slug}`}
      className="group relative isolate overflow-hidden rounded-3xl border border-lunin-cream/10 bg-gradient-to-br from-lunin-charcoal to-lunin-black p-6 sm:p-7 min-h-[200px] flex flex-col justify-between transition hover:border-lunin-gold/40"
    >
      <span
        aria-hidden="true"
        className="absolute -right-6 -top-6 text-[7rem] leading-none lunin-wordmark text-lunin-gold/[0.04] group-hover:text-lunin-gold/10 transition"
      >
        {String(index + 1).padStart(2, "0")}
      </span>
      <span aria-hidden="true" className="absolute inset-x-6 top-0 hairline" />

      <div className="relative z-10">
        <h3 className="font-headline uppercase text-[0.72rem] tracking-[0.32em] text-lunin-gold/80">
          0{category.order}
        </h3>
        <p className="mt-3 font-display text-2xl sm:text-[1.7rem] text-lunin-cream leading-tight">
          {tr(category.name)}
        </p>
        <p className="mt-2 text-[0.78rem] tracking-[0.2em] uppercase font-headline text-lunin-cream/45">
          {count} {count === 1 ? "cóctel" : "cócteles"}
        </p>
      </div>

      {/* Drink thumbnails — only when we actually have images */}
      {preview.length > 0 && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 right-0 h-[78%] w-[68%] sm:w-[60%]"
        >
          {preview.slice(0, 3).map((item, i) => (
            <div
              key={item.id}
              className="absolute h-full"
              style={{
                right: `${i * 18}%`,
                width: "46%",
                opacity: 0.9 - i * 0.1,
                transform: `translateY(${i * 4}%)`,
                zIndex: 3 - i,
              }}
            >
              {item.image ? (
                <Image
                  src={item.image}
                  alt=""
                  fill
                  sizes="(min-width: 640px) 200px, 140px"
                  className="object-cover object-bottom rounded-xl"
                  style={{
                    maskImage:
                      "radial-gradient(ellipse at 50% 60%, rgba(0,0,0,1) 30%, rgba(0,0,0,0.85) 55%, rgba(0,0,0,0.0) 78%)",
                    WebkitMaskImage:
                      "radial-gradient(ellipse at 50% 60%, rgba(0,0,0,1) 30%, rgba(0,0,0,0.85) 55%, rgba(0,0,0,0.0) 78%)",
                  }}
                />
              ) : (
                <div className="absolute bottom-0 right-0 h-1/2 w-full rounded-xl bg-gradient-to-t from-lunin-gold/15 to-transparent" />
              )}
            </div>
          ))}
        </div>
      )}

      <div className="relative z-10 mt-5 flex items-center justify-between text-[0.7rem] tracking-[0.22em] uppercase font-headline text-lunin-cream/50">
        <span className="rounded-full border border-lunin-cream/15 px-3 py-1 bg-lunin-black/55 backdrop-blur">
          Ver carta
        </span>
        <span className="inline-flex items-center gap-1 text-lunin-gold/80 group-hover:text-lunin-gold transition">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            className="transition group-hover:translate-x-1"
          >
            <path d="M5 12h14" strokeLinecap="round" />
            <path d="m13 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
