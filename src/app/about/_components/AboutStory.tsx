"use client";

import Image from "next/image";
import { useT } from "../../../components/LanguageProvider";

export function AboutStory() {
  const t = useT();
  return (
    <section className="relative">
      <div className="mx-auto max-w-6xl px-5 md:px-10 py-20 md:py-28 grid gap-12 md:grid-cols-[1fr_1.05fr] items-center">
        {/* Image side */}
        <div className="order-2 md:order-1 relative">
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-lunin-cream/10 shadow-[0_30px_60px_-25px_rgba(0,0,0,0.85)]">
            <Image
              src="/images/brand/horilka-2.jpg"
              alt="Lunin Horilka — botellas craft"
              fill
              sizes="(min-width: 768px) 45vw, 90vw"
              className="object-cover"
            />
          </div>
          <span
            aria-hidden="true"
            className="absolute -bottom-3 -right-3 hidden md:block lunin-wordmark text-lunin-gold/15 text-7xl select-none"
          >
            01
          </span>
        </div>

        {/* Text side */}
        <div className="order-1 md:order-2">
          <p className="font-headline uppercase text-[0.72rem] tracking-[0.42em] text-lunin-gold/80">
            /{t("about.story_kicker")}
          </p>
          <h2 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl text-lunin-cream leading-[1.05]">
            {t("about.story_title")}
          </h2>
          <span aria-hidden className="block mt-6 w-24 hairline" />
          <p className="mt-7 text-lunin-cream/80 text-[1rem] leading-[1.85]">
            {t("about.story_body_1")}
          </p>
          <p className="mt-5 text-lunin-cream/75 text-[0.98rem] leading-[1.85]">
            {t("about.story_body_2")}
          </p>

          <ul className="mt-9 grid grid-cols-3 gap-3 sm:gap-4">
            <Stat label={t("about.stats.s1_l")} value={t("about.stats.s1_v")} detail={t("about.stats.s1_d")} />
            <Stat label={t("about.stats.s2_l")} value={t("about.stats.s2_v")} detail={t("about.stats.s2_d")} />
            <Stat label={t("about.stats.s3_l")} value={t("about.stats.s3_v")} detail={t("about.stats.s3_d")} />
          </ul>
        </div>
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <li className="rounded-2xl border border-lunin-cream/10 bg-lunin-charcoal/40 p-4">
      <span className="font-headline uppercase text-[0.6rem] tracking-[0.32em] text-lunin-gold/70">
        {label}
      </span>
      <p className="mt-1 font-display text-xl text-lunin-cream">{value}</p>
      <p className="mt-1 text-[0.7rem] tracking-[0.06em] text-lunin-cream/55 leading-snug">
        {detail}
      </p>
    </li>
  );
}
