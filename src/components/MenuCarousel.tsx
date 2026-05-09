"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useT, useTranslated } from "./LanguageProvider";
import type { MenuItem } from "../lib/types";

type View = "carousel" | "grid";

const STORAGE_KEY = "lunin_menu_view";

export function MenuCarousel({ items }: { items: MenuItem[] }) {
  const tr = useTranslated();
  const t = useT();
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);
  const [view, setView] = useState<View>("carousel");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "grid" || saved === "carousel") setView(saved);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, view);
    }
  }, [view]);

  // Track scroll position to update the active dot/counter.
  useEffect(() => {
    if (view !== "carousel") return;
    const track = trackRef.current;
    if (!track) return;
    const cards = Array.from(track.querySelectorAll<HTMLElement>("[data-card]"));
    if (cards.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && e.intersectionRatio > 0.6) {
            const idx = Number((e.target as HTMLElement).dataset.index ?? "0");
            setActive(idx);
          }
        }
      },
      { root: track, threshold: [0.6, 0.9] },
    );
    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, [view, items.length]);

  function goTo(i: number) {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>(`[data-index="${i}"]`);
    if (card) {
      card.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      setActive(i);
    }
  }

  if (items.length === 0) {
    return (
      <p className="text-center text-lunin-cream/60 py-16">{t("menu.empty")}</p>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5 px-1">
        <span className="font-headline text-[0.7rem] tracking-[0.32em] uppercase text-lunin-cream/55">
          <span className="text-lunin-gold">{String(active + 1).padStart(2, "0")}</span>
          <span className="mx-2 text-lunin-cream/30">/</span>
          {String(items.length).padStart(2, "0")}
        </span>
        <ViewToggle view={view} onChange={setView} />
      </div>

      {view === "carousel" ? (
        <>
          <div
            ref={trackRef}
            className="relative -mx-5 md:-mx-8 overflow-x-auto overflow-y-visible snap-x snap-mandatory flex no-scrollbar scroll-smooth pb-4 gap-4 sm:gap-6 px-5 md:px-8"
            style={{ scrollPaddingInline: "1.25rem" }}
          >
            {items.map((it, i) => (
              <CarouselCard key={it.id} item={it} index={i} />
            ))}
          </div>

          <div className="mt-3 flex items-center justify-center gap-2.5">
            {items.map((it, i) => (
              <button
                key={it.id}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Ir a ${tr(it.name)}`}
                className={
                  "h-1.5 rounded-full transition-all " +
                  (i === active
                    ? "w-8 bg-lunin-gold"
                    : "w-1.5 bg-lunin-cream/25 hover:bg-lunin-cream/45")
                }
              />
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => goTo(Math.max(0, active - 1))}
              disabled={active === 0}
              className="h-10 w-10 grid place-items-center rounded-full border border-lunin-cream/15 text-lunin-cream/80 hover:border-lunin-gold/50 hover:text-lunin-gold disabled:opacity-30 disabled:hover:border-lunin-cream/15 transition"
              aria-label="Anterior"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <span className="font-headline text-[0.66rem] tracking-[0.34em] uppercase text-lunin-cream/40">
              Desliza →
            </span>
            <button
              type="button"
              onClick={() => goTo(Math.min(items.length - 1, active + 1))}
              disabled={active === items.length - 1}
              className="h-10 w-10 grid place-items-center rounded-full border border-lunin-cream/15 text-lunin-cream/80 hover:border-lunin-gold/50 hover:text-lunin-gold disabled:opacity-30 disabled:hover:border-lunin-cream/15 transition"
              aria-label="Siguiente"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {items.map((it) => (
            <GridCard key={it.id} item={it} />
          ))}
        </div>
      )}
    </div>
  );
}

function CarouselCard({ item, index }: { item: MenuItem; index: number }) {
  const tr = useTranslated();
  const t = useT();
  const hasImage = item.image && item.image.length > 0;
  return (
    <article
      data-card
      data-index={index}
      className="snap-center shrink-0 w-[78vw] sm:w-[55vw] md:w-[42vw] lg:w-[34vw] max-w-[420px]"
    >
      <div className="relative rounded-[28px] overflow-hidden border border-lunin-cream/10 bg-gradient-to-br from-lunin-onyx to-lunin-black aspect-[3/4] shadow-[0_30px_60px_-25px_rgba(0,0,0,0.85)]">
        {hasImage ? (
          <Image
            src={item.image as string}
            alt={tr(item.name)}
            fill
            sizes="(min-width: 1024px) 34vw, (min-width: 768px) 42vw, (min-width: 640px) 55vw, 78vw"
            className="object-cover"
            priority={index < 2}
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center">
            <span className="lunin-wordmark text-5xl text-lunin-gold/25">LUNIN</span>
          </div>
        )}

        {/* dark gradient overlay for text legibility */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(13,13,13,0.05) 0%, rgba(13,13,13,0.15) 40%, rgba(13,13,13,0.75) 65%, rgba(13,13,13,0.96) 88%, rgba(13,13,13,1) 100%)",
          }}
        />

        {/* signature ribbon */}
        {item.signature && (
          <span className="absolute top-4 left-4 rounded-full bg-lunin-gold text-lunin-black text-[0.6rem] font-headline font-semibold tracking-[0.22em] uppercase px-3 py-1">
            ★ Signature
          </span>
        )}
        {/* content */}
        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7 flex flex-col">
          <span className="font-headline text-[0.7rem] tracking-[0.34em] uppercase text-lunin-gold/85">
            {t("menu.ingredients")}
          </span>
          <p className="mt-1 text-sm text-lunin-cream/85 leading-relaxed line-clamp-2">
            {tr(item.ingredients)}
          </p>
          <div className="mt-4 flex items-end justify-between gap-4">
            <h3 className="font-display text-2xl sm:text-3xl text-lunin-cream leading-tight max-w-[68%]">
              {tr(item.name)}
            </h3>
            <span className="font-display text-3xl sm:text-4xl gold-text leading-none whitespace-nowrap">
              {item.price}
              <span className="text-xl">{t("common.currency")}</span>
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

function GridCard({ item }: { item: MenuItem }) {
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

function ViewToggle({
  view,
  onChange,
}: {
  view: View;
  onChange: (v: View) => void;
}) {
  return (
    <div className="inline-flex items-center rounded-full border border-lunin-cream/15 p-0.5">
      <button
        type="button"
        onClick={() => onChange("carousel")}
        aria-pressed={view === "carousel"}
        className={
          "h-7 w-8 grid place-items-center rounded-full transition " +
          (view === "carousel" ? "bg-lunin-gold text-lunin-black" : "text-lunin-cream/60 hover:text-lunin-cream")
        }
        aria-label="Vista carrusel"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="6" width="13" height="12" rx="2" />
          <path d="M19 9v6" strokeLinecap="round" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => onChange("grid")}
        aria-pressed={view === "grid"}
        className={
          "h-7 w-8 grid place-items-center rounded-full transition " +
          (view === "grid" ? "bg-lunin-gold text-lunin-black" : "text-lunin-cream/60 hover:text-lunin-cream")
        }
        aria-label="Vista lista"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4 6h16" strokeLinecap="round" />
          <path d="M4 12h16" strokeLinecap="round" />
          <path d="M4 18h16" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
