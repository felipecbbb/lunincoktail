"use client";

import Link from "next/link";
import { useT } from "../../components/LanguageProvider";
import { SITE } from "../../lib/site";
import { useLang } from "../../components/LanguageProvider";

export function HomeHero() {
  const t = useT();
  return (
    <div className="grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-end">
      <div>
        <h1
          className="font-display text-3xl sm:text-4xl md:text-5xl leading-[1.08] text-lunin-cream fade-up"
          style={{ animationDelay: "0.45s" }}
        >
          <span className="gold-text">{t("home.hero_title")}</span>
        </h1>
        <p
          className="mt-5 max-w-xl text-[0.95rem] sm:text-base text-lunin-cream/75 leading-relaxed fade-up"
          style={{ animationDelay: "0.55s" }}
        >
          {t("home.hero_subtitle")}
        </p>
      </div>

      <div
        className="flex flex-col sm:flex-row md:flex-col gap-3 fade-up"
        style={{ animationDelay: "0.65s" }}
      >
        <Link href="/menu" className="btn-primary">
          {t("home.cta_menu")}
        </Link>
        <a
          href={`https://wa.me/${SITE.contact.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent("Hola Lunin, quiero reservar mesa.")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost"
        >
          {t("home.cta_reserve")}
        </a>
        <p className="mt-2 font-headline text-[0.65rem] uppercase tracking-[0.36em] text-lunin-cream/55">
          {t("home.hours")}
        </p>
      </div>
    </div>
  );
}

export function ViewAllText() {
  const t = useT();
  return <span>{t("home.view_all")}</span>;
}

export function ViewAllEventsText() {
  const t = useT();
  return <span>{t("home.view_all_events")}</span>;
}

export function VisitInfo() {
  const t = useT();
  const { lang } = useLang();
  const hours = lang === "en" ? SITE.hours.en : SITE.hours.es;
  return (
    <div className="mt-8 grid grid-cols-1 gap-4 text-sm">
      <Row label={t("contact.address")} value={SITE.contact.address} />
      <Row
        label={t("contact.phone")}
        value={SITE.contact.phone}
        href={`tel:${SITE.contact.phoneE164}`}
      />
      <Row
        label={t("contact.email")}
        value={SITE.contact.email}
        href={`mailto:${SITE.contact.email}`}
      />
      <Row label={t("contact.hours")} value={hours} />
      <div className="mt-4 flex flex-wrap gap-3">
        <a
          href={SITE.contact.googleMapsUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="btn-ghost"
        >
          {t("contact.maps")}
        </a>
        <a
          href={SITE.contact.instagram}
          target="_blank"
          rel="noreferrer noopener"
          className="btn-ghost"
        >
          {t("contact.instagram")}
        </a>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  const inner = (
    <>
      <span className="font-headline uppercase text-[0.65rem] tracking-[0.34em] text-lunin-gold/70 block">
        {label}
      </span>
      <span className="block mt-1 text-lunin-cream/85">{value}</span>
    </>
  );
  return (
    <div className="border-t border-lunin-cream/10 pt-4">
      {href ? (
        <a href={href} className="block hover:text-lunin-gold transition">
          {inner}
        </a>
      ) : (
        inner
      )}
    </div>
  );
}
