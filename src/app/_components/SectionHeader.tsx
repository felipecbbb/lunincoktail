"use client";

import { useT } from "../../components/LanguageProvider";

export function SectionHeader({
  kicker,
  titleKey,
  leadKey,
  align = "left",
}: {
  kicker?: string;
  titleKey: string;
  leadKey?: string;
  align?: "left" | "center";
}) {
  const t = useT();
  const cls = align === "center" ? "text-center mx-auto" : "";
  return (
    <header className={`max-w-2xl ${cls}`}>
      {kicker && (
        <p className="font-headline uppercase text-[0.7rem] tracking-[0.42em] text-lunin-gold/80">
          /{kicker}
        </p>
      )}
      <h2 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl text-lunin-cream leading-[1.05]">
        {t(titleKey)}
      </h2>
      {leadKey && (
        <p className="mt-4 text-[0.95rem] sm:text-base text-lunin-cream/65 leading-relaxed">
          {t(leadKey)}
        </p>
      )}
      <span aria-hidden className="block mt-6 hairline" />
    </header>
  );
}
