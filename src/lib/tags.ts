import type { Localized } from "./types";

/**
 * Etiquetas de dieta y alérgenos de la carta.
 *
 * - `diet`: atributos positivos (vegano, sin gluten, sin alcohol…).
 * - `allergen`: el producto CONTIENE ese alérgeno.
 *
 * Los textos viven aquí (y no en `i18n.ts`) porque van siempre asociados al
 * dato del ítem: se traducen con `useTranslated()` igual que `name`/`ingredients`.
 */
export type TagId =
  | "vegan"
  | "vegetarian"
  | "gluten-free"
  | "alcohol-free"
  | "spicy"
  | "caffeine"
  | "egg"
  | "milk"
  | "fish"
  | "molluscs"
  | "gluten"
  | "sulphites";

export type TagKind = "diet" | "allergen";

export type TagDef = {
  id: TagId;
  kind: TagKind;
  label: Localized;
  /** Aclaración que se muestra en la leyenda de la carta. */
  note: Localized;
  /** Paths del icono, viewBox 24×24, trazo (no relleno). */
  paths: string[];
  /** Orden de aparición: cuanto menor, antes se muestra en las tarjetas. */
  priority: number;
};

export const TAGS: Record<TagId, TagDef> = {
  // ── Alérgenos: lo que el producto contiene ─────────────────────────────
  egg: {
    id: "egg",
    kind: "allergen",
    label: { es: "Contiene huevo", en: "Contains egg", uk: "Містить яйце" },
    note: {
      es: "Lleva clara de huevo pasteurizada. Podemos sustituirla por espumante vegetal.",
      en: "Made with pasteurised egg white. We can swap it for a plant-based foamer.",
      uk: "Містить пастеризований яєчний білок. Можемо замінити рослинним пінником.",
    },
    paths: ["M12 3c3.4 0 6 4.6 6 8.6S15.3 21 12 21s-6-5-6-9.4S8.6 3 12 3Z"],
    priority: 1,
  },
  milk: {
    id: "milk",
    kind: "allergen",
    label: { es: "Contiene lácteos", en: "Contains milk", uk: "Містить молоко" },
    note: {
      es: "Lleva leche o derivados. Disponemos de bebidas vegetales.",
      en: "Contains milk or dairy. Plant-based milks available.",
      uk: "Містить молоко або молочні продукти. Є рослинні альтернативи.",
    },
    paths: ["M9 3h6v3l2 3.5V21H7V9.5L9 6Z", "M7 12.5h10"],
    priority: 2,
  },
  gluten: {
    id: "gluten",
    kind: "allergen",
    label: { es: "Contiene gluten", en: "Contains gluten", uk: "Містить глютен" },
    note: {
      es: "Lleva un ingrediente con cereal (p. ej. salsa Worcester).",
      en: "Contains a cereal-based ingredient (e.g. Worcestershire sauce).",
      uk: "Містить інгредієнт із злаків (напр., вустерський соус).",
    },
    paths: [
      "M12 21V7",
      "M12 11.5l3.2-3.2",
      "M12 11.5L8.8 8.3",
      "M12 16l3.2-3.2",
      "M12 16L8.8 12.8",
      "M12 7.5l2.8-2.8",
      "M12 7.5L9.2 4.7",
    ],
    priority: 3,
  },
  fish: {
    id: "fish",
    kind: "allergen",
    label: { es: "Contiene pescado", en: "Contains fish", uk: "Містить рибу" },
    note: {
      es: "Lleva anchoa o salsa Worcester elaborada con anchoa.",
      en: "Contains anchovy, or Worcestershire sauce made with anchovy.",
      uk: "Містить анчоус або вустерський соус з анчоусом.",
    },
    paths: [
      "M16.5 12c0 3-3.6 5.5-8 5.5-2 0-3.9-.5-5.5-1.5 1-1.1 1.6-2.5 1.6-4s-.6-2.9-1.6-4c1.6-1 3.5-1.5 5.5-1.5 4.4 0 8 2.5 8 5.5Z",
      "M16.5 12l5-3.4v6.8L16.5 12Z",
      "M11.5 10.5h.01",
    ],
    priority: 4,
  },
  molluscs: {
    id: "molluscs",
    kind: "allergen",
    label: { es: "Contiene moluscos", en: "Contains molluscs", uk: "Містить молюски" },
    note: {
      es: "Lleva pulpo cocido.",
      en: "Contains cooked octopus.",
      uk: "Містить варений восьминіг.",
    },
    paths: [
      "M12 3.5c3 0 5.5 2.2 5.5 5v2.2c0 .9.3 1.7.9 2.4",
      "M6.5 10.7V8.5c0-2.8 2.5-5 5.5-5",
      "M6.5 10.7c-.6.7-.9 1.5-.9 2.4",
      "M9 13.2c0 2.5-.8 4.6-2.4 6.3M12 13.2c0 2.7.4 4.9 1.2 6.6M15 13.2c.4 2.3 1.5 4.2 3.2 5.7",
    ],
    priority: 4,
  },
  sulphites: {
    id: "sulphites",
    kind: "allergen",
    label: { es: "Contiene sulfitos", en: "Contains sulphites", uk: "Містить сульфіти" },
    note: {
      es: "Presentes en vino y vermut (y en los espumosos del spritz).",
      en: "Present in wine and vermouth (and in the sparkling wine of a spritz).",
      uk: "Присутні у вині та вермуті (і в ігристому для спритцу).",
    },
    paths: [
      "M8 18a3.2 3.2 0 1 0 0-6.4A3.2 3.2 0 0 0 8 18Z",
      "M16.2 11.4a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4Z",
      "M15.4 18.6a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2Z",
    ],
    priority: 5,
  },

  // ── Dieta: atributos positivos ─────────────────────────────────────────
  spicy: {
    id: "spicy",
    kind: "diet",
    label: { es: "Picante", en: "Spicy", uk: "Гострий" },
    note: {
      es: "Lleva sirope picante o tabasco. Podemos ajustar la intensidad.",
      en: "Made with spicy syrup or Tabasco. We can adjust the heat.",
      uk: "Із гострим сиропом або табаско. Можемо змінити гостроту.",
    },
    paths: [
      "M12 2.8c.7 3 2.3 4.2 3.5 5.8 1.1 1.4 1.7 3 1.7 4.6a5.2 5.2 0 0 1-10.4 0c0-2 1-3.5 2.3-4.8C10.3 7 11.6 5.2 12 2.8Z",
      "M12 20.4a2.7 2.7 0 0 0 2.7-2.7c0-1.4-1-2.3-1.7-3.3-.9 1.1-2.1 1.7-2.1 3.3a2.1 2.1 0 0 0 1.1 2.7Z",
    ],
    priority: 6,
  },
  "alcohol-free": {
    id: "alcohol-free",
    kind: "diet",
    label: { es: "Sin alcohol", en: "Alcohol-free", uk: "Без алкоголю" },
    note: {
      es: "Elaborado sin ninguna bebida alcohólica.",
      en: "Made without any alcoholic ingredient.",
      uk: "Приготовано без жодного алкогольного інгредієнта.",
    },
    paths: ["M5 5h14l-7 8-7-8Z", "M12 13v6", "M8.5 19.2h7", "M4.2 4.2l15.6 15.6"],
    priority: 7,
  },
  vegan: {
    id: "vegan",
    kind: "diet",
    label: { es: "Vegano", en: "Vegan", uk: "Веганський" },
    note: {
      es: "Sin ingredientes de origen animal.",
      en: "No ingredients of animal origin.",
      uk: "Без інгредієнтів тваринного походження.",
    },
    paths: [
      "M4.5 19.5C4.5 11.2 10.2 5 19.5 4.5c0 8.3-5.7 14.5-15 15Z",
      "M9 15.2c1.9-2.7 4.4-4.7 7.2-5.9",
    ],
    priority: 8,
  },
  vegetarian: {
    id: "vegetarian",
    kind: "diet",
    label: { es: "Vegetariano", en: "Vegetarian", uk: "Вегетаріанський" },
    note: {
      es: "Sin carne ni pescado, pero lleva huevo, lácteos o miel.",
      en: "No meat or fish, but contains egg, dairy or honey.",
      uk: "Без м'яса та риби, але містить яйце, молочне або мед.",
    },
    paths: [
      "M12 21v-8.4",
      "M12 12.6c-4.3 0-6.5-2.3-6.5-6.5 4.3 0 6.5 2.3 6.5 6.5Z",
      "M12 12.6c0-4.3 2.2-6.5 6.5-6.5 0 4.2-2.2 6.5-6.5 6.5Z",
    ],
    priority: 9,
  },
  caffeine: {
    id: "caffeine",
    kind: "diet",
    label: { es: "Con cafeína", en: "Contains caffeine", uk: "Містить кофеїн" },
    note: {
      es: "Lleva café, matcha o refresco de cola.",
      en: "Made with coffee, matcha or cola.",
      uk: "Містить каву, матчу або колу.",
    },
    paths: [
      "M4 8.5h12v4.8a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5Z",
      "M16 9.8h1.8a2.4 2.4 0 0 1 0 4.8H16",
      "M4.5 21h11",
    ],
    priority: 10,
  },
  "gluten-free": {
    id: "gluten-free",
    kind: "diet",
    label: { es: "Sin gluten", en: "Gluten-free", uk: "Без глютену" },
    note: {
      es: "Sin cereales con gluten. Los destilados están exentos de declararlo.",
      en: "No gluten-containing cereals. Distilled spirits are exempt from declaring it.",
      uk: "Без злаків із глютеном. Дистиляти звільнені від декларування.",
    },
    paths: [
      "M12 21V7",
      "M12 11.5l3.2-3.2",
      "M12 11.5L8.8 8.3",
      "M12 16l3.2-3.2",
      "M12 16L8.8 12.8",
      "M12 7.5l2.8-2.8",
      "M12 7.5L9.2 4.7",
      "M4 20 20 4",
    ],
    priority: 11,
  },
};

export const TAG_IDS = Object.keys(TAGS) as TagId[];

/** Ordena etiquetas por prioridad (alérgenos primero). */
export function sortTags(ids: readonly TagId[]): TagId[] {
  return [...ids]
    .filter((id): id is TagId => id in TAGS)
    .sort((a, b) => TAGS[a].priority - TAGS[b].priority);
}

export const TAGS_LEGEND = {
  title: {
    es: "Dieta y alérgenos",
    en: "Diet & allergens",
    uk: "Дієта та алергени",
  } satisfies Localized,
  lead: {
    es: "Qué significa cada icono de la carta.",
    en: "What each icon on the menu means.",
    uk: "Що означає кожна іконка в меню.",
  } satisfies Localized,
  allergens: {
    es: "Contiene",
    en: "Contains",
    uk: "Містить",
  } satisfies Localized,
  diet: {
    es: "Apto para",
    en: "Suitable for",
    uk: "Підходить для",
  } satisfies Localized,
  disclaimer: {
    es: "Información orientativa elaborada a partir de nuestras recetas. Puede haber trazas por manipulación en barra. Si tienes alergia o intolerancia, dínoslo antes de pedir: adaptamos la mayoría de nuestros cócteles.",
    en: "Guidance based on our own recipes. Traces are possible due to handling behind the bar. If you have an allergy or intolerance, tell us before ordering — we can adapt most of our cocktails.",
    uk: "Орієнтовна інформація на основі наших рецептів. Можливі сліди через приготування за баром. Якщо у вас алергія чи непереносимість, скажіть нам перед замовленням — ми адаптуємо більшість коктейлів.",
  } satisfies Localized,
} as const;
