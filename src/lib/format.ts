import type { Lang } from "./i18n";

/**
 * Precio de carta: los enteros se muestran limpios (10) y los que llevan
 * céntimos con dos decimales y el separador del idioma activo (2,50 en ES).
 *
 * Se formatea a mano en lugar de con `toLocaleString` para que el resultado no
 * dependa de los datos de idioma que traiga el navegador.
 */
export function formatPrice(price: number, lang: Lang): string {
  if (Number.isInteger(price)) return String(price);
  return price.toFixed(2).replace(".", lang === "en" ? "." : ",");
}
