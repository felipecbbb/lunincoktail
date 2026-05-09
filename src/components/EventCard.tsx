"use client";

import Image from "next/image";
import { useLang, useT, useTranslated } from "./LanguageProvider";
import type { EventItem } from "../lib/types";

export function EventCard({ event }: { event: EventItem }) {
  const tr = useTranslated();
  const t = useT();
  const { lang } = useLang();
  const date = new Date(event.date + (event.time ? `T${event.time}` : ""));
  const dateStr = date.toLocaleDateString(lang === "es" ? "es-ES" : "en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const hasImage = event.image && event.image.length > 0;
  const ctaLabel = event.ctaLabel ? tr(event.ctaLabel) : t("events.reserve_cta");

  return (
    <article className="group rounded-3xl overflow-hidden border border-lunin-cream/10 bg-lunin-charcoal/60 flex flex-col">
      <div className="relative aspect-[16/10] bg-gradient-to-br from-lunin-onyx to-lunin-black">
        {hasImage ? (
          <Image
            src={event.image as string}
            alt={tr(event.title)}
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover transition duration-700 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center">
            <span className="lunin-wordmark text-3xl text-lunin-gold/30">LUNIN</span>
          </div>
        )}
        <div className="absolute top-3 left-3 rounded-full bg-lunin-black/70 backdrop-blur px-3 py-1 text-[0.7rem] font-headline uppercase tracking-[0.22em] text-lunin-gold">
          {dateStr}{event.time ? ` · ${event.time}` : ""}
        </div>
      </div>
      <div className="flex flex-col gap-3 p-6 flex-1">
        <h3 className="font-display text-xl text-lunin-cream leading-snug">
          {tr(event.title)}
        </h3>
        <p className="text-sm text-lunin-cream/65 leading-relaxed flex-1">
          {tr(event.description)}
        </p>
        {event.ctaUrl && (
          <a
            href={event.ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary mt-2 w-full"
          >
            {ctaLabel}
          </a>
        )}
      </div>
    </article>
  );
}
