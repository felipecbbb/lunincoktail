"use client";

import Image from "next/image";
import Link from "next/link";
import { useT } from "../../../components/LanguageProvider";
import { SITE } from "../../../lib/site";

export function AboutOutro() {
  const t = useT();
  return (
    <section className="relative isolate overflow-hidden border-t border-lunin-cream/10">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/brand/horilka-3.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 40%, rgba(13,13,13,0.55) 0%, rgba(13,13,13,0.85) 60%, rgba(13,13,13,0.98) 100%)",
          }}
        />
      </div>

      <div className="mx-auto max-w-3xl px-5 md:px-10 py-24 md:py-32 text-center">
        <p className="lunin-wordmark text-5xl sm:text-6xl text-lunin-cream">LUNIN</p>
        <p className="mt-2 font-headline uppercase text-[0.7rem] tracking-[0.42em] text-lunin-cream/55">
          Distillery · Cocktail Bar
        </p>
        <span aria-hidden className="block mt-7 mx-auto w-24 hairline" />
        <p className="mt-7 max-w-xl mx-auto text-lunin-cream/80 text-[1.05rem] leading-[1.85]">
          {t("home.sec_visit_lead")}
        </p>
        <div className="mt-9 flex flex-col sm:flex-row justify-center gap-3">
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
        </div>
      </div>
    </section>
  );
}
