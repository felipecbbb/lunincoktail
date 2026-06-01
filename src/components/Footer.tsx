"use client";

import Link from "next/link";
import { Logo } from "./Logo";
import { useT } from "./LanguageProvider";
import { SITE } from "../lib/site";

export function Footer() {
  const t = useT();
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t border-lunin-gold/20 bg-lunin-dark-brown safe-bottom">
      <div className="mx-auto max-w-6xl px-5 md:px-10 py-14 grid gap-10 md:grid-cols-3">
        <div className="space-y-3">
          <Logo size="md" href="/" withTagline />
          <p className="text-sm text-lunin-cream/60 max-w-xs">
            {t("home.sec_visit_lead")}
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="font-headline uppercase text-[0.72rem] tracking-[0.28em] text-lunin-gold">
            {t("nav.menu")}
          </h4>
          <ul className="space-y-2 text-sm text-lunin-cream/75">
            <li><Link href="/menu" className="hover:text-lunin-gold">{t("nav.menu")}</Link></li>
            <li><Link href="/events" className="hover:text-lunin-gold">{t("nav.events")}</Link></li>
            <li><Link href="/about" className="hover:text-lunin-gold">{t("nav.about")}</Link></li>
            <li><Link href="/contact" className="hover:text-lunin-gold">{t("nav.contact")}</Link></li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="font-headline uppercase text-[0.72rem] tracking-[0.28em] text-lunin-gold">
            {t("contact.reach_us")}
          </h4>
          <ul className="space-y-2 text-sm text-lunin-cream/75">
            <li>{SITE.contact.address}</li>
            <li>
              <a href={`tel:${SITE.contact.phoneE164}`} className="hover:text-lunin-gold">
                {SITE.contact.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${SITE.contact.email}`} className="hover:text-lunin-gold">
                {SITE.contact.email}
              </a>
            </li>
            <li>
              <a
                href={SITE.contact.instagram}
                target="_blank"
                rel="noreferrer noopener"
                className="hover:text-lunin-gold"
              >
                {SITE.contact.instagramHandle}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-lunin-cream/10">
        <div className="mx-auto max-w-6xl px-5 md:px-10 py-5 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between text-[0.7rem] tracking-[0.18em] uppercase font-headline text-lunin-cream/40">
          <span>© {year} {SITE.name}. {t("home.footer_rights")}</span>
          <span>{t("home.footer_drink")}</span>
        </div>
      </div>
    </footer>
  );
}
