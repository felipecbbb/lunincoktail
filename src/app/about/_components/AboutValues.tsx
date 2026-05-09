"use client";

import { useT } from "../../../components/LanguageProvider";

export function AboutValues() {
  const t = useT();
  const items = [
    { kicker: "01", title: t("about.v1_title"), body: t("about.v1_body"), icon: <IconLeaf /> },
    { kicker: "02", title: t("about.v2_title"), body: t("about.v2_body"), icon: <IconBerry /> },
    { kicker: "03", title: t("about.v3_title"), body: t("about.v3_body"), icon: <IconGlass /> },
  ];
  return (
    <section className="relative border-t border-lunin-cream/10">
      <div className="mx-auto max-w-6xl px-5 md:px-10 py-20 md:py-24">
        <div className="text-center max-w-2xl mx-auto">
          <p className="font-headline uppercase text-[0.7rem] tracking-[0.42em] text-lunin-gold/80">
            /Manifesto
          </p>
          <h2 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl text-lunin-cream leading-[1.05]">
            {t("about.values_title")}
          </h2>
          <span aria-hidden className="block mt-6 mx-auto w-24 hairline" />
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {items.map((it) => (
            <article
              key={it.kicker}
              className="rounded-3xl border border-lunin-cream/10 bg-lunin-charcoal/50 p-7 hover:border-lunin-gold/30 transition"
            >
              <div className="h-12 w-12 rounded-full bg-lunin-gold/10 text-lunin-gold grid place-items-center">
                {it.icon}
              </div>
              <p className="mt-5 font-headline uppercase text-[0.65rem] tracking-[0.34em] text-lunin-gold/80">
                /{it.kicker}
              </p>
              <h3 className="mt-2 font-display text-xl text-lunin-cream">{it.title}</h3>
              <p className="mt-3 text-[0.92rem] leading-relaxed text-lunin-cream/70">
                {it.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function IconLeaf() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <path d="M5 21c.5-7 5-12 14-13-1 9-6 13.5-13 14" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 21C8 17 12 13 17 11" strokeLinecap="round" />
    </svg>
  );
}
function IconBerry() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <circle cx="9" cy="14" r="3.5" />
      <circle cx="15" cy="14" r="3.5" />
      <circle cx="12" cy="9" r="3" />
      <path d="M12 6V3" strokeLinecap="round" />
    </svg>
  );
}
function IconGlass() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <path d="M6 3h12l-2 9a4 4 0 0 1-4 3 4 4 0 0 1-4-3L6 3Z" />
      <path d="M12 15v5" strokeLinecap="round" />
      <path d="M9 20h6" strokeLinecap="round" />
    </svg>
  );
}
