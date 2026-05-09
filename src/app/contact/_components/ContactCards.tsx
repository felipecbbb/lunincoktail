"use client";

import { SITE } from "../../../lib/site";
import { useLang, useT } from "../../../components/LanguageProvider";

type ChannelProps = {
  label: string;
  value: string;
  href: string;
  icon: React.ReactNode;
  external?: boolean;
};

function Channel({ label, value, href, icon, external }: ChannelProps) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer noopener" : undefined}
      className="group rounded-2xl border border-lunin-cream/10 bg-lunin-charcoal/60 p-5 flex items-center gap-4 transition hover:border-lunin-gold/40 hover:bg-lunin-charcoal/80"
    >
      <span className="h-12 w-12 rounded-full bg-lunin-gold/10 text-lunin-gold grid place-items-center group-hover:bg-lunin-gold/20 transition">
        {icon}
      </span>
      <span className="flex-1 min-w-0">
        <span className="block font-headline uppercase text-[0.65rem] tracking-[0.34em] text-lunin-gold/70">
          {label}
        </span>
        <span className="block mt-1 text-lunin-cream/90 truncate">{value}</span>
      </span>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="text-lunin-cream/40 group-hover:text-lunin-gold transition" aria-hidden="true">
        <path d="M5 12h14" strokeLinecap="round" />
        <path d="m13 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  );
}

export function ContactCards() {
  const t = useT();
  const { lang } = useLang();
  const hours = lang === "en" ? SITE.hours.en : SITE.hours.es;

  return (
    <div className="grid gap-10 md:grid-cols-[1.1fr_1fr] items-start">
      <div className="grid gap-3">
        <Channel
          label={t("contact.whatsapp")}
          value={SITE.contact.phone}
          href={`https://wa.me/${SITE.contact.whatsapp.replace(/[^0-9]/g, "")}`}
          external
          icon={<IconWA />}
        />
        <Channel
          label={t("contact.call")}
          value={SITE.contact.phone}
          href={`tel:${SITE.contact.phoneE164}`}
          icon={<IconPhone />}
        />
        <Channel
          label={t("contact.instagram")}
          value={SITE.contact.instagramHandle}
          href={SITE.contact.instagram}
          external
          icon={<IconIG />}
        />
        <Channel
          label={t("contact.maps")}
          value={SITE.contact.address}
          href={SITE.contact.googleMapsUrl}
          external
          icon={<IconPin />}
        />
        <Channel
          label={t("contact.email")}
          value={SITE.contact.email}
          href={`mailto:${SITE.contact.email}`}
          icon={<IconMail />}
        />

        <div className="rounded-2xl border border-lunin-cream/10 bg-lunin-charcoal/60 p-5">
          <span className="block font-headline uppercase text-[0.65rem] tracking-[0.34em] text-lunin-gold/70">
            {t("contact.hours")}
          </span>
          <span className="block mt-2 text-lunin-cream/90">{hours}</span>
        </div>
      </div>

      <div className="rounded-3xl overflow-hidden border border-lunin-cream/10 bg-lunin-charcoal/60 aspect-[4/5] md:aspect-auto md:h-full md:min-h-[480px]">
        <iframe
          title="Lunin Cocktail Bar — Google Maps"
          src={SITE.contact.googleMapsEmbed}
          loading="lazy"
          width="100%"
          height="100%"
          style={{ border: 0, filter: "grayscale(0.6) contrast(1.1) brightness(0.85)" }}
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    </div>
  );
}

function IconWA() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.07 4.93A10 10 0 0 0 4.4 18.4L3 21l2.7-1.4a10 10 0 0 0 13.37-14.67ZM12 19.5a7.5 7.5 0 0 1-3.83-1l-.27-.16-2.05 1.05.55-2.13-.18-.28A7.5 7.5 0 1 1 12 19.5Z" />
    </svg>
  );
}
function IconPhone() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconIG() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
    </svg>
  );
}
function IconPin() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M12 22s7-6.16 7-12a7 7 0 0 0-14 0c0 5.84 7 12 7 12Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}
function IconMail() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}
