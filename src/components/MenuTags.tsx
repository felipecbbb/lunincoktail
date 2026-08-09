"use client";

import { useTranslated } from "./LanguageProvider";
import { TAGS, TAGS_LEGEND, sortTags, type TagId } from "../lib/tags";

export function TagIcon({
  id,
  size = 14,
  className,
}: {
  id: TagId;
  size?: number;
  className?: string;
}) {
  const def = TAGS[id];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {def.paths.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}

/** Fila compacta de iconos para las tarjetas de la carta. */
export function TagBadges({
  tags,
  max = 4,
  size = 13,
}: {
  tags?: TagId[];
  max?: number;
  size?: number;
}) {
  const tr = useTranslated();
  if (!tags || tags.length === 0) return null;
  const sorted = sortTags(tags);
  const shown = sorted.slice(0, max);
  const rest = sorted.length - shown.length;

  return (
    <ul className="mt-2 flex flex-wrap items-center gap-1.5">
      {shown.map((id) => {
        const def = TAGS[id];
        const isAllergen = def.kind === "allergen";
        return (
          <li
            key={id}
            title={tr(def.label)}
            className={
              "grid h-6 w-6 place-items-center rounded-full border " +
              (isAllergen
                ? "border-lunin-gold/45 bg-lunin-gold/10 text-lunin-gold"
                : "border-lunin-cream/15 bg-lunin-cream/5 text-lunin-cream/60")
            }
          >
            <TagIcon id={id} size={size} />
            <span className="sr-only">{tr(def.label)}</span>
          </li>
        );
      })}
      {rest > 0 && (
        <li className="text-[0.62rem] text-lunin-cream/40 tabular-nums">
          +{rest}
        </li>
      )}
    </ul>
  );
}

/** Lista con nombre para el detalle del ítem. */
export function TagList({ tags }: { tags?: TagId[] }) {
  const tr = useTranslated();
  if (!tags || tags.length === 0) return null;

  return (
    <ul className="mt-3 flex flex-wrap gap-2">
      {sortTags(tags).map((id) => {
        const def = TAGS[id];
        const isAllergen = def.kind === "allergen";
        return (
          <li
            key={id}
            className={
              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.72rem] leading-none " +
              (isAllergen
                ? "border-lunin-gold/45 bg-lunin-gold/10 text-lunin-gold"
                : "border-lunin-cream/15 bg-lunin-cream/5 text-lunin-cream/70")
            }
          >
            <TagIcon id={id} size={13} />
            {tr(def.label)}
          </li>
        );
      })}
    </ul>
  );
}

/** Leyenda al pie de la carta. */
export function TagsLegend() {
  const tr = useTranslated();
  const groups = [
    {
      key: "allergen" as const,
      title: TAGS_LEGEND.allergens,
      ids: sortTags(
        Object.values(TAGS)
          .filter((d) => d.kind === "allergen")
          .map((d) => d.id),
      ),
    },
    {
      key: "diet" as const,
      title: TAGS_LEGEND.diet,
      ids: sortTags(
        Object.values(TAGS)
          .filter((d) => d.kind === "diet")
          .map((d) => d.id),
      ),
    },
  ];

  return (
    <section
      aria-label={tr(TAGS_LEGEND.title)}
      className="mt-4 rounded-2xl border border-lunin-cream/10 bg-lunin-charcoal/40 p-6 sm:p-8"
    >
      <h2 className="font-headline uppercase text-[0.68rem] tracking-[0.34em] text-lunin-gold/80">
        {tr(TAGS_LEGEND.title)}
      </h2>
      <p className="mt-2 text-[0.9rem] text-lunin-cream/60">
        {tr(TAGS_LEGEND.lead)}
      </p>

      <div className="mt-6 grid gap-8 sm:grid-cols-2">
        {groups.map((g) => (
          <div key={g.key}>
            <p className="font-headline uppercase text-[0.6rem] tracking-[0.3em] text-lunin-cream/45">
              {tr(g.title)}
            </p>
            <ul className="mt-3 space-y-3">
              {g.ids.map((id) => {
                const def = TAGS[id];
                const isAllergen = def.kind === "allergen";
                return (
                  <li key={id} className="flex items-start gap-3">
                    <span
                      className={
                        "mt-0.5 grid h-7 w-7 flex-shrink-0 place-items-center rounded-full border " +
                        (isAllergen
                          ? "border-lunin-gold/45 bg-lunin-gold/10 text-lunin-gold"
                          : "border-lunin-cream/15 bg-lunin-cream/5 text-lunin-cream/60")
                      }
                    >
                      <TagIcon id={id} size={15} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[0.85rem] text-lunin-cream/90">
                        {tr(def.label)}
                      </span>
                      <span className="block text-[0.78rem] leading-relaxed text-lunin-cream/50">
                        {tr(def.note)}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <p className="mt-8 border-t border-lunin-cream/10 pt-5 text-[0.76rem] leading-relaxed text-lunin-cream/45">
        {tr(TAGS_LEGEND.disclaimer)}
      </p>
    </section>
  );
}
