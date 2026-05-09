"use client";

import Image from "next/image";
import { useTranslated, useT } from "./LanguageProvider";
import type { MenuItem } from "../lib/types";

export function MenuItemCard({ item }: { item: MenuItem }) {
  const tr = useTranslated();
  const t = useT();
  const hasImage = item.image && item.image.length > 0;
  return (
    <article className="group relative flex gap-4 rounded-2xl border border-lunin-cream/10 bg-lunin-charcoal/60 p-4 transition hover:border-lunin-gold/40 hover:bg-lunin-charcoal/80">
      <div className="relative h-24 w-24 sm:h-28 sm:w-28 flex-shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-lunin-onyx to-lunin-black ring-1 ring-lunin-cream/5">
        {hasImage ? (
          <Image
            src={item.image as string}
            alt={tr(item.name)}
            fill
            sizes="(min-width: 640px) 112px, 96px"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-lunin-gold/40">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
              <path d="M5 4h14l-2 9a5 5 0 0 1-5 4 5 5 0 0 1-5-4L5 4Z" />
              <path d="M12 17v4" />
              <path d="M9 21h6" />
            </svg>
          </div>
        )}
        {item.signature && (
          <span className="absolute top-1 left-1 rounded-full bg-lunin-gold/95 text-lunin-black text-[0.55rem] tracking-[0.18em] uppercase font-headline font-semibold px-2 py-0.5">
            ★
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1 flex flex-col">
        <header className="flex items-start gap-3 justify-between">
          <h3 className="font-headline font-semibold text-[0.98rem] sm:text-base text-lunin-cream truncate-2">
            {tr(item.name)}
          </h3>
          <span className="font-headline font-semibold text-lunin-gold whitespace-nowrap">
            {item.price}
            <span className="text-lunin-gold/70">{t("common.currency")}</span>
          </span>
        </header>
        <p className="mt-1 text-[0.82rem] leading-relaxed text-lunin-cream/65 line-clamp-3">
          {tr(item.ingredients)}
        </p>
      </div>
    </article>
  );
}
