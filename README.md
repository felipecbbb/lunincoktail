# Lunin Cocktail Bar — web

Coctelería digital para Lunin Cocktail Bar: carta vía QR, eventos, contacto y
admin para gestionar el contenido. Construida con **Next.js 16 + Tailwind v4**.

## Stack

- Next.js 16 (App Router, Server Components, Turbopack)
- React 19, TypeScript
- Tailwind v4 con tokens de marca Lunin (negro / crema / oro / marrón)
- Tipografía: Alice (logo serif), Raleway (titulares), Montserrat (cuerpo)
- i18n cliente: ES / EN (con persistencia en localStorage)
- Datos en JSON (src/data/) — fácil de migrar a base de datos
- Admin protegido por contraseña (cookie httpOnly)

## Páginas

| Ruta              | Qué es                                                     |
| ----------------- | ---------------------------------------------------------- |
| `/`               | Landing premium con hero, signature cocktails y eventos.   |
| `/menu`           | Hub con todas las categorías (Signature, Cocktails, Spritz, Shots, Licores, Especiales). |
| `/menu/[cat]`     | Lista de cócteles dentro de una categoría.                 |
| `/events`         | Próximos eventos (DJ nights, catas, especiales).           |
| `/about`          | Historia + valores Lunin.                                  |
| `/contact`        | WhatsApp, llamar, IG, mapa, email, horario.                |
| `/admin/login`    | Login del propietario.                                     |
| `/admin`          | Dashboard.                                                 |
| `/admin/menu`     | CRUD completo de la carta (categorías + ítems + imágenes). |
| `/admin/events`   | CRUD de eventos.                                           |

## Configuración

1. Copia `.env.example` a `.env.local` y define `LUNIN_ADMIN_PASSWORD`.
2. (Opcional) en `src/lib/site.ts` ajusta dirección, teléfono, IG, GA y Pixel.
3. `npm run dev` y abre <http://localhost:3000>.

### Comandos

```bash
npm run dev     # desarrollo (Turbopack)
npm run build   # build producción
npm run start   # servidor de producción
```

## Datos

Los datos viven en `src/data/`:

- `categories.json`
- `menu.json`
- `events.json`

Se modifican desde el admin. Las imágenes subidas se guardan en
`public/uploads/`.

> Para hosting (Vercel) los uploads en disco no persisten entre builds — hay
> que migrar a un object store (S3, R2, Vercel Blob) cuando se despliegue.
> La capa de storage está aislada en `src/lib/store.ts` para facilitarlo.

## Despliegue

- Recomendado: Vercel (Next.js nativo, CDN global, HTTPS, Edge cache).
- Domain: `lunincocktailbar.com` (alternativas: `luninbar.es`, `luninbar.com`).
- SSL automático en Vercel.
- Configura las env vars `LUNIN_ADMIN_PASSWORD` (y `LUNIN_ADMIN_TOKEN`).

## Marca

Tokens y tipografía siguen el brand guideline oficial de Lunin Distillery
(2023). Colores primarios: `#0d0d0d`, `#f9f2e0`, `#deab3b`, `#433012`.
Tipografías: Alice / Raleway / Montserrat.
