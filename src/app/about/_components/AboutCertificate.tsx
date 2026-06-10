"use client";

import Image from "next/image";
import { useT } from "../../../components/LanguageProvider";

export function AboutCertificate() {
  const t = useT();
  return (
    <section className="relative border-t border-lunin-cream/10 bg-lunin-onyx/40">
      <div className="mx-auto max-w-6xl px-5 md:px-10 py-20 md:py-24 grid gap-10 md:grid-cols-[1fr_1.1fr] items-center">
        <div className="order-2 md:order-1">
          <div className="relative aspect-[3/4] max-w-md mx-auto md:mx-0 rounded-3xl overflow-hidden border border-lunin-cream/15 shadow-[0_30px_60px_-25px_rgba(0,0,0,0.85)]">
            <Image
              src="/images/brand/certificate.jpg"
              alt="Certificado de calidad Lunin"
              fill
              sizes="(min-width: 768px) 45vw, 90vw"
              className="object-cover"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(13,13,13,0.55) 100%)",
              }}
            />
            {/* Gold seal */}
            <div className="absolute bottom-4 right-4 h-16 w-16 rounded-full bg-gradient-to-br from-lunin-gold-bright to-lunin-gold text-lunin-black grid place-items-center shadow-lg">
              <div className="text-center">
                <p className="lunin-wordmark text-base leading-none">L</p>
                <p className="text-[0.45rem] tracking-[0.18em] uppercase font-headline mt-0.5">
                  {t("about.cert_verified")}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="order-1 md:order-2">
          <p className="font-headline uppercase text-[0.72rem] tracking-[0.42em] text-lunin-gold/80">
            /{t("about.cert_kicker")}
          </p>
          <h2 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl text-lunin-cream leading-[1.05]">
            {t("about.cert_title")}
          </h2>
          <span aria-hidden className="block mt-6 w-24 hairline" />
          <p className="mt-7 text-lunin-cream/80 text-[1rem] leading-[1.85] max-w-md">
            {t("about.cert_body")}
          </p>

          <ul className="mt-7 space-y-2 text-sm text-lunin-cream/70">
            <li className="flex items-center gap-3">
              <CheckIcon />
              <span>{t("about.cert_b1")}</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckIcon />
              <span>{t("about.cert_b2")}</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckIcon />
              <span>{t("about.cert_b3")}</span>
            </li>
          </ul>

          <a
            href="/files/lunin-certificate.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary mt-8"
          >
            {t("about.cert_view")}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
            >
              <path d="M5 12h14" strokeLinecap="round" />
              <path d="m13 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

function CheckIcon() {
  return (
    <span className="h-6 w-6 rounded-full bg-lunin-gold/15 text-lunin-gold grid place-items-center flex-shrink-0">
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        aria-hidden="true"
      >
        <path d="m5 12 5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}
