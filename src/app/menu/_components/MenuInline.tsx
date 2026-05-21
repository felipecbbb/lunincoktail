"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useT, useTranslated } from "../../../components/LanguageProvider";
import type { Category, MenuItem } from "../../../lib/types";

export function MenuInline({
  categories,
  items,
}: {
  categories: Category[];
  items: MenuItem[];
}) {
  const tr = useTranslated();
  const t = useT();
  const [activeId, setActiveId] = useState<string>(categories[0]?.id ?? "");
  const navRef = useRef<HTMLDivElement | null>(null);
  const sectionsRef = useRef<Map<string, HTMLElement>>(new Map());

  const itemsByCategory = new Map<string, MenuItem[]>();
  for (const cat of categories) itemsByCategory.set(cat.id, []);
  for (const it of items) {
    const arr = itemsByCategory.get(it.categoryId);
    if (arr) arr.push(it);
  }
  for (const arr of itemsByCategory.values()) {
    arr.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
  }

  const registerSection = useCallback(
    (id: string) => (el: HTMLElement | null) => {
      if (el) sectionsRef.current.set(id, el);
      else sectionsRef.current.delete(id);
    },
    [],
  );

  useEffect(() => {
    const els = Array.from(sectionsRef.current.entries());
    if (els.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          const id = visible[0].target.getAttribute("data-cat-id");
          if (id) setActiveId(id);
        }
      },
      {
        // Trigger when the section's top crosses ~30% from top of viewport
        rootMargin: "-30% 0px -55% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );
    for (const [, el] of els) io.observe(el);
    return () => io.disconnect();
  }, [categories.length]);

  // Keep the active pill in view inside the horizontal nav scroller.
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const pill = nav.querySelector<HTMLElement>(`[data-pill-id="${activeId}"]`);
    if (pill) {
      const navRect = nav.getBoundingClientRect();
      const pillRect = pill.getBoundingClientRect();
      const offset =
        pillRect.left - navRect.left - (navRect.width - pillRect.width) / 2;
      nav.scrollBy({ left: offset, behavior: "smooth" });
    }
  }, [activeId]);

  function goTo(id: string) {
    const el = sectionsRef.current.get(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      {/* Sticky category nav sits just below the main header (h-16) */}
      <nav
        aria-label="Categorías"
        className="sticky top-16 z-30 border-b border-lunin-cream/10 bg-lunin-black/90 backdrop-blur-md"
      >
        <div
          ref={navRef}
          className="mx-auto max-w-6xl flex gap-2 overflow-x-auto no-scrollbar px-5 md:px-10 py-3"
        >
          {categories.map((cat) => {
            const isActive = cat.id === activeId;
            const count = itemsByCategory.get(cat.id)?.length ?? 0;
            return (
              <button
                key={cat.id}
                type="button"
                data-pill-id={cat.id}
                onClick={() => goTo(cat.id)}
                aria-current={isActive ? "true" : undefined}
                className={
                  "shrink-0 inline-flex items-center gap-2 rounded-full px-4 py-2 text-[0.7rem] tracking-[0.24em] uppercase font-headline transition " +
                  (isActive
                    ? "bg-lunin-gold text-lunin-black border border-lunin-gold"
                    : "border border-lunin-cream/15 text-lunin-cream/75 hover:text-lunin-gold hover:border-lunin-gold/50")
                }
              >
                <span>{tr(cat.name)}</span>
                <span
                  className={
                    "text-[0.65rem] " +
                    (isActive ? "text-lunin-black/60" : "text-lunin-cream/40")
                  }
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-5 md:px-10 pb-24">
        {categories.map((cat) => {
          const list = itemsByCategory.get(cat.id) ?? [];
          return (
            <section
              key={cat.id}
              id={cat.slug}
              data-cat-id={cat.id}
              ref={registerSection(cat.id)}
              className="scroll-mt-32 py-12 md:py-16 border-b border-lunin-cream/5 last:border-b-0"
            >
              <header className="mb-8 md:mb-10">
                <p className="font-headline uppercase text-[0.7rem] tracking-[0.42em] text-lunin-gold/80">
                  /0{cat.order}
                </p>
                <h2 className="mt-3 font-display text-3xl sm:text-4xl md:text-5xl text-lunin-cream leading-[1.05]">
                  {tr(cat.name)}
                </h2>
                {cat.description && (
                  <p className="mt-3 max-w-xl text-[0.95rem] text-lunin-cream/65 leading-relaxed">
                    {tr(cat.description)}
                  </p>
                )}
                <span aria-hidden className="block mt-6 hairline" />
              </header>

              {list.length === 0 ? (
                <p className="text-lunin-cream/55 text-sm py-6">
                  {t("menu.empty")}
                </p>
              ) : (
                <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
                  {list.map((it) => (
                    <InlineCard key={it.id} item={it} />
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </>
  );
}

function InlineCard({ item }: { item: MenuItem }) {
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
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              aria-hidden="true"
            >
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
          <h3 className="font-headline font-semibold text-[0.98rem] sm:text-base text-lunin-cream">
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
