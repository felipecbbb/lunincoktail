"use client";

import Image from "next/image";
import { useT } from "../../../components/LanguageProvider";

export function AboutHero() {
  const t = useT();
  return (
    <section className="relative isolate overflow-hidden border-b border-lunin-cream/10">
      {/* Background brand photo */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/brand/apple-horilka.jpg"
          alt="Lunin Apple Horilka"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(13,13,13,0.55) 0%, rgba(13,13,13,0.35) 35%, rgba(13,13,13,0.65) 75%, rgba(13,13,13,0.95) 100%)",
          }}
        />
      </div>

      <div className="mx-auto max-w-6xl px-5 md:px-10 pt-24 md:pt-32 pb-20 md:pb-28 min-h-[78svh] flex flex-col justify-end">
        <p
          className="font-headline uppercase text-[0.7rem] tracking-[0.42em] text-lunin-gold fade-up"
          style={{ animationDelay: "0.05s" }}
        >
          /{t("about.kicker")}
        </p>
        <h1
          className="mt-4 font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-lunin-cream leading-[1.02] max-w-4xl fade-up"
          style={{ animationDelay: "0.15s" }}
        >
          {t("about.title")}
        </h1>
        <p
          className="mt-5 max-w-xl text-base md:text-lg text-lunin-cream/75 leading-relaxed fade-up"
          style={{ animationDelay: "0.25s" }}
        >
          {t("about.lead")}
        </p>
        <span
          aria-hidden="true"
          className="block mt-8 w-32 hairline fade-up"
          style={{ animationDelay: "0.35s" }}
        />
      </div>
    </section>
  );
}
