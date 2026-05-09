"use client";

import Link from "next/link";
import { useT, useTranslated } from "../../../../components/LanguageProvider";
import type { Category } from "../../../../lib/types";

export function CategoryHero({ category }: { category: Category }) {
  const tr = useTranslated();
  const t = useT();
  return (
    <section className="relative isolate overflow-hidden border-b border-lunin-cream/10">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(circle at 50% 30%, rgba(222,171,59,0.16), transparent 60%), linear-gradient(180deg, #161616, #0d0d0d)",
        }}
      />
      <div className="mx-auto max-w-3xl px-5 md:px-8 py-14 md:py-20 text-center">
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 text-[0.7rem] tracking-[0.32em] uppercase font-headline text-lunin-cream/55 hover:text-lunin-gold transition"
        >
          ← <span>{t("menu.detail_back")}</span>
        </Link>
        <p className="mt-6 font-headline uppercase text-[0.7rem] tracking-[0.42em] text-lunin-gold/80">
          /0{category.order}
        </p>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl md:text-6xl text-lunin-cream leading-[1.05]">
          {tr(category.name)}
        </h1>
        {category.description && (
          <p className="mt-4 max-w-xl mx-auto text-[0.95rem] text-lunin-cream/65 leading-relaxed">
            {tr(category.description)}
          </p>
        )}
        <span aria-hidden="true" className="block mt-8 mx-auto w-32 hairline" />
      </div>
    </section>
  );
}
