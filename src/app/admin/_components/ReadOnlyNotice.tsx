import { CONTENT_OWNER, CONTENT_READONLY } from "../../../lib/content-editing";

/**
 * Aviso de que el contenido no se puede editar desde el panel. Se pinta en las
 * pantallas de gestión (carta, eventos) para que nadie intente guardar y se
 * encuentre con un error sin explicación.
 */
export function ReadOnlyNotice({ what = "esta sección" }: { what?: string }) {
  if (!CONTENT_READONLY) return null;
  return (
    <div className="rounded-xl border border-lunin-gold/35 bg-lunin-gold/10 px-4 py-3.5 text-sm">
      <p className="font-headline uppercase tracking-[0.28em] text-[0.68rem] text-lunin-gold">
        Solo consulta
      </p>
      <p className="mt-2 text-lunin-cream/85">
        Los cambios en {what} no se pueden guardar desde aquí. Puedes mirarlo
        todo, pero al guardar dará error.
      </p>
      <p className="mt-1.5 text-lunin-cream/70">
        Para cualquier cambio —precios, productos nuevos, fotos, textos— avisa a{" "}
        {CONTENT_OWNER.name}:{" "}
        <a
          href={`mailto:${CONTENT_OWNER.email}`}
          className="text-lunin-gold underline underline-offset-2"
        >
          {CONTENT_OWNER.email}
        </a>
        .
      </p>
    </div>
  );
}
