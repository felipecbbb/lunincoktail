/**
 * La carta, las categorías y los eventos se guardan escribiendo los JSON de
 * `src/data/`, y las imágenes subidas van a `public/uploads/`. En Vercel el
 * sistema de archivos es de solo lectura, así que allí guardar falla: el panel
 * sirve para consultar, pero no para editar.
 *
 * En vez de dejar que el usuario se coma un error al pulsar "Guardar", el panel
 * avisa antes y desactiva las acciones que no pueden funcionar.
 *
 * Se puede forzar con `LUNIN_CONTENT_READONLY` ("1" o "0") para probar el aviso
 * en local o para reactivar la edición si algún día el contenido deja de vivir
 * en archivos.
 */
const forced = process.env.LUNIN_CONTENT_READONLY;

export const CONTENT_READONLY =
  forced === "1" ? true : forced === "0" ? false : Boolean(process.env.VERCEL);

/** A quién avisar para que haga el cambio. */
export const CONTENT_OWNER = {
  name: "Felipe",
  email: process.env.LUNIN_CONTENT_CONTACT ?? "felipegestion03@gmail.com",
};

export const CONTENT_READONLY_REASON =
  "La edición desde el panel no está disponible.";
