"use client";

import Image from "next/image";
import { useT } from "../../components/LanguageProvider";

const fruits = [
  {
    key: "apple",
    name: { es: "Manzana", en: "Apple" },
    note: { es: "Apple Horilka", en: "Apple Horilka" },
    image: "/images/brand/apple-horilka.jpg",
  },
  {
    key: "plum",
    name: { es: "Ciruela", en: "Plum" },
    note: { es: "Plum Horilka", en: "Plum Horilka" },
    image: "/images/brand/horilka-2.jpg",
  },
  {
    key: "acacia",
    name: { es: "Acacia", en: "Acacia" },
    note: { es: "Licor floral", en: "Floral liqueur" },
    image: "/images/fruit/acacia.jpg",
  },
  {
    key: "cherry",
    name: { es: "Cereza ácida", en: "Sour Cherry" },
    note: { es: "Licor", en: "Liqueur" },
    image: "/images/fruit/sourcherry.jpg",
  },
];

export function OriginSection() {
  const t = useT();
  return (
    <section id="origin" className="relative">
      <div className="mx-auto max-w-6xl px-5 md:px-10 py-20 md:py-24 border-t border-lunin-cream/10">
        <header className="max-w-2xl">
          <p className="font-headline uppercase text-[0.7rem] tracking-[0.42em] text-lunin-gold/80">
            /{t("home.sec_origin_kicker")}
          </p>
          <h2 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl text-lunin-cream leading-[1.05]">
            {t("home.sec_origin_title")}
          </h2>
          <p className="mt-4 text-[0.95rem] sm:text-base text-lunin-cream/65 leading-relaxed">
            {t("home.sec_origin_lead")}
          </p>
          <span aria-hidden className="block mt-6 hairline" />
        </header>

        <ul className="mt-12 grid gap-3 grid-cols-2 lg:grid-cols-4">
          {fruits.map((f, i) => {
            const lang = (typeof document !== "undefined" && document.documentElement.lang === "en") ? "en" : "es";
            return (
              <li key={f.key}>
                <article className="group relative isolate overflow-hidden rounded-3xl border border-lunin-cream/10 bg-lunin-charcoal/40 aspect-[3/4]">
                  <Image
                    src={f.image}
                    alt={f.name.es}
                    fill
                    sizes="(min-width: 1024px) 23vw, (min-width: 640px) 45vw, 50vw"
                    className="object-cover transition duration-700 group-hover:scale-[1.04]"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(13,13,13,0.05) 0%, rgba(13,13,13,0.20) 45%, rgba(13,13,13,0.85) 90%, rgba(13,13,13,0.96) 100%)",
                    }}
                  />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <span className="font-headline uppercase text-[0.6rem] tracking-[0.32em] text-lunin-gold/80">
                      /0{i + 1}
                    </span>
                    <h3 className="mt-1.5 font-display text-xl text-lunin-cream leading-tight">
                      {lang === "en" ? f.name.en : f.name.es}
                    </h3>
                    <p className="mt-1 text-[0.7rem] tracking-[0.18em] uppercase font-headline text-lunin-cream/55">
                      {lang === "en" ? f.note.en : f.note.es}
                    </p>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
