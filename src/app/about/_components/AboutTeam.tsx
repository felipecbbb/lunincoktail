"use client";

import Image from "next/image";
import { useT } from "../../../components/LanguageProvider";

export function AboutTeam() {
  const t = useT();
  return (
    <section className="relative border-t border-lunin-cream/10 bg-lunin-onyx/40">
      <div className="mx-auto max-w-6xl px-5 md:px-10 py-20 md:py-28 grid gap-12 md:grid-cols-[1.05fr_1fr] items-center">
        <div>
          <p className="font-headline uppercase text-[0.72rem] tracking-[0.42em] text-lunin-gold/80">
            /{t("about.team_kicker")}
          </p>
          <h2 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl text-lunin-cream leading-[1.05]">
            {t("about.team_title")}
          </h2>
          <span aria-hidden className="block mt-6 w-24 hairline" />
          <p className="mt-7 text-lunin-cream/80 text-[1rem] leading-[1.85] max-w-md">
            {t("about.team_body")}
          </p>
        </div>

        <div className="grid grid-cols-5 gap-3">
          <div className="col-span-3 row-span-2 relative aspect-[4/5] rounded-3xl overflow-hidden border border-lunin-cream/10 shadow-[0_30px_60px_-25px_rgba(0,0,0,0.85)]">
            <Image
              src="/images/about/team-hero.jpg"
              alt="Equipo Lunin — bokeh"
              fill
              sizes="(min-width: 768px) 30vw, 60vw"
              className="object-cover"
            />
          </div>
          <div className="col-span-2 relative aspect-square rounded-2xl overflow-hidden border border-lunin-cream/10">
            <Image
              src="/images/about/team-2.jpg"
              alt="Equipo Lunin"
              fill
              sizes="(min-width: 768px) 20vw, 40vw"
              className="object-cover"
            />
          </div>
          <div className="col-span-2 relative aspect-square rounded-2xl overflow-hidden border border-lunin-cream/10">
            <Image
              src="/images/about/team-3.jpg"
              alt="Equipo Lunin"
              fill
              sizes="(min-width: 768px) 20vw, 40vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
