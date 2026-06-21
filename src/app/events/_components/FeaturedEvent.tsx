"use client";

import Image from "next/image";
import { useLang, useT, useTranslated } from "../../../components/LanguageProvider";
import { WaitlistForm } from "./WaitlistForm";
import type { EventItem } from "../../../lib/types";

export function FeaturedEvent({ event }: { event: EventItem }) {
  const t = useT();
  const tr = useTranslated();
  const { lang } = useLang();

  const date = new Date(event.date + (event.time ? `T${event.time}` : ""));
  const dateStr = date.toLocaleDateString(
    lang === "es" ? "es-ES" : lang === "uk" ? "uk-UA" : "en-GB",
    { weekday: "long", day: "2-digit", month: "long", year: "numeric" },
  );

  return (
    <article className="overflow-hidden rounded-3xl border border-lunin-gold/25 bg-gradient-to-br from-lunin-dark-green/70 via-lunin-charcoal/80 to-lunin-black shadow-[0_30px_80px_-40px_rgba(2,53,28,0.9)]">
      <div className="grid lg:grid-cols-[0.85fr_1fr]">
        {/* Poster — se muestra completo, sin recortar ni estirar (4:5) */}
        <div className="relative bg-lunin-dark-green self-start">
          <Image
            src={event.image as string}
            alt={tr(event.title)}
            width={1080}
            height={1350}
            sizes="(min-width: 1024px) 45vw, 100vw"
            priority
            className="h-auto w-full"
          />
          {event.badge && (
            <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-lunin-black/75 px-3.5 py-1.5 font-headline text-[0.62rem] uppercase tracking-[0.24em] text-lunin-gold backdrop-blur">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lunin-gold/70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-lunin-gold" />
              </span>
              {tr(event.badge)}
            </span>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col gap-6 p-7 md:p-10">
          <div>
            <p className="font-headline text-[0.62rem] uppercase tracking-[0.34em] text-lunin-gold/80">
              / {dateStr} · {event.time} /
            </p>
            <h3 className="mt-3 font-display text-3xl leading-tight text-lunin-cream md:text-4xl">
              {tr(event.title)}
            </h3>
            <p className="mt-3 text-[0.92rem] leading-relaxed text-lunin-cream/70">
              {tr(event.description)}
            </p>
          </div>

          {event.priceLabel && (
            <div className="flex items-center gap-3 rounded-2xl border border-lunin-gold/25 bg-lunin-gold/5 px-5 py-3">
              <span className="font-display text-2xl text-lunin-gold">
                {tr(event.priceLabel)}
              </span>
            </div>
          )}

          {event.includes && event.includes.length > 0 && (
            <div>
              <p className="font-headline text-[0.6rem] uppercase tracking-[0.3em] text-lunin-gold/80">
                {t("events.includes_label")}
              </p>
              <ul className="mt-3 space-y-2.5">
                {event.includes.map((inc, i) => (
                  <li key={i} className="flex gap-3 text-[0.88rem] leading-relaxed text-lunin-cream/80">
                    <svg
                      className="mt-0.5 shrink-0 text-lunin-gold"
                      width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    >
                      <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>{tr(inc)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {event.conditions && event.conditions.length > 0 && (
            <details className="group rounded-2xl border border-lunin-cream/10 bg-lunin-charcoal/40">
              <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-3.5 font-headline text-[0.6rem] uppercase tracking-[0.3em] text-lunin-cream/70">
                {t("events.conditions_label")}
                <svg
                  className="transition-transform duration-300 group-open:rotate-180"
                  width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
                >
                  <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </summary>
              <ul className="space-y-2 px-5 pb-5 pt-1">
                {event.conditions.map((c, i) => (
                  <li key={i} className="flex gap-2.5 text-[0.82rem] leading-relaxed text-lunin-cream/55">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-lunin-gold/60" />
                    <span>{tr(c)}</span>
                  </li>
                ))}
              </ul>
            </details>
          )}

          <div className="mt-auto space-y-3">
            <WaitlistForm
              eventId={event.id}
              eventTitle={tr(event.title)}
              whatsappUrl={event.ctaUrl}
            />
            <p className="text-[0.74rem] leading-relaxed text-lunin-cream/45">
              {t("events.waitlist_note")}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
