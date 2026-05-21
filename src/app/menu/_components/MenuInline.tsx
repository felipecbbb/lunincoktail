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
  const [selected, setSelected] = useState<MenuItem | null>(null);
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

  const categoryNameById = new Map(categories.map((c) => [c.id, c.name]));

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
        rootMargin: "-30% 0px -55% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );
    for (const [, el] of els) io.observe(el);
    return () => io.disconnect();
  }, [categories.length]);

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
                    <InlineCard
                      key={it.id}
                      item={it}
                      onOpen={() => setSelected(it)}
                    />
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>

      <ItemDetailModal
        item={selected}
        categoryName={
          selected ? categoryNameById.get(selected.categoryId) : undefined
        }
        onClose={() => setSelected(null)}
      />
    </>
  );
}

function InlineCard({
  item,
  onOpen,
}: {
  item: MenuItem;
  onOpen: () => void;
}) {
  const tr = useTranslated();
  const t = useT();
  const hasImage = item.image && item.image.length > 0;
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={tr(item.name)}
      className="group relative flex w-full gap-4 rounded-2xl border border-lunin-cream/10 bg-lunin-charcoal/60 p-4 text-left transition hover:border-lunin-gold/40 hover:bg-lunin-charcoal/80 focus:outline-none focus-visible:border-lunin-gold/60 focus-visible:ring-1 focus-visible:ring-lunin-gold/40 active:scale-[0.99]"
    >
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
    </button>
  );
}

function ItemDetailModal({
  item,
  categoryName,
  onClose,
}: {
  item: MenuItem | null;
  categoryName?: { es: string; en?: string };
  onClose: () => void;
}) {
  const tr = useTranslated();
  const t = useT();

  useEffect(() => {
    if (!item) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [item, onClose]);

  if (!item) return null;
  const hasImage = item.image && item.image.length > 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={tr(item.name)}
      className="fixed inset-0 z-50 flex items-stretch sm:items-center justify-center"
    >
      <button
        type="button"
        aria-label={t("nav.close") || "Cerrar"}
        onClick={onClose}
        className="absolute inset-0 bg-lunin-black/80 backdrop-blur-sm animate-fade-in"
      />

      <div className="relative z-10 w-full h-full sm:h-auto sm:max-w-md sm:max-h-[92vh] overflow-y-auto rounded-none sm:rounded-3xl border-0 sm:border sm:border-lunin-cream/10 bg-gradient-to-b from-lunin-charcoal to-lunin-black shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] animate-slide-up safe-top safe-bottom">
        <button
          type="button"
          onClick={onClose}
          aria-label={t("nav.close") || "Cerrar"}
          className="absolute top-4 right-4 z-10 h-10 w-10 sm:h-9 sm:w-9 grid place-items-center rounded-full bg-lunin-black/70 backdrop-blur text-lunin-cream/85 hover:text-lunin-gold hover:bg-lunin-black/90 transition"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
          </svg>
        </button>

        <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-br from-lunin-onyx to-lunin-black">
          {hasImage ? (
            <Image
              src={item.image as string}
              alt={tr(item.name)}
              fill
              sizes="(min-width: 640px) 448px, 100vw"
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center">
              <span className="lunin-wordmark text-6xl text-lunin-gold/25">
                LUNIN
              </span>
            </div>
          )}
          {item.signature && (
            <span className="absolute top-4 left-4 rounded-full bg-lunin-gold text-lunin-black text-[0.6rem] font-headline font-semibold tracking-[0.22em] uppercase px-3 py-1">
              ★ Signature
            </span>
          )}
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-lunin-black to-transparent"
          />
        </div>

        <div className="px-6 sm:px-7 pt-5 pb-7">
          {categoryName && (
            <p className="font-headline uppercase text-[0.65rem] tracking-[0.34em] text-lunin-gold/75">
              {tr(categoryName)}
            </p>
          )}
          <div className="mt-2 flex items-start gap-4 justify-between">
            <h2 className="font-display text-2xl sm:text-3xl text-lunin-cream leading-tight">
              {tr(item.name)}
            </h2>
            <span className="font-display text-2xl sm:text-3xl gold-text whitespace-nowrap leading-none">
              {item.price}
              <span className="text-lg">{t("common.currency")}</span>
            </span>
          </div>
          <span aria-hidden className="block mt-4 hairline" />
          <p className="mt-4 font-headline text-[0.65rem] tracking-[0.34em] uppercase text-lunin-gold/75">
            {t("menu.ingredients")}
          </p>
          <p className="mt-2 text-[0.95rem] leading-relaxed text-lunin-cream/80">
            {tr(item.ingredients)}
          </p>
        </div>
      </div>
    </div>
  );
}
