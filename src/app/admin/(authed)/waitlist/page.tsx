import Link from "next/link";
import { Store } from "../../../../lib/store";

export const dynamic = "force-dynamic";

export default async function AdminWaitlistPage() {
  const entries = (await Store.getWaitlist()).sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-4">
        <div>
          <p className="font-headline uppercase text-[0.7rem] tracking-[0.42em] text-lunin-gold/80">
            Bandeja
          </p>
          <h1 className="mt-2 font-display text-3xl">Reservas de plaza (waitlist)</h1>
          <p className="mt-1 text-sm text-lunin-cream/60">
            {entries.length} en total. Reservas recibidas desde la cartelera de
            eventos en <code>/events</code>.
          </p>
        </div>
        <Link
          href="/admin"
          className="text-[0.72rem] font-headline uppercase tracking-[0.22em] text-lunin-cream/70 hover:text-lunin-gold"
        >
          ← Panel
        </Link>
      </header>

      <div className="rounded-2xl border border-lunin-gold/20 bg-lunin-gold/5 p-4 text-[0.82rem] leading-relaxed text-lunin-cream/70">
        Nota: en producción (Vercel) este listado puede no reflejar todas las
        reservas porque el almacenamiento en archivo es temporal. La copia
        fiable de cada reserva llega siempre por email a{" "}
        <span className="text-lunin-gold">Lunindistillery@gmail.com</span>.
      </div>

      {entries.length === 0 ? (
        <p className="rounded-2xl border border-lunin-cream/10 bg-lunin-charcoal/40 p-8 text-center text-lunin-cream/60">
          Todavía no hay reservas. Cuando alguien reserve su plaza en{" "}
          <code>/events</code> aparecerá aquí (y por email).
        </p>
      ) : (
        <ul className="space-y-3">
          {entries.map((e) => {
            const waLink = `https://wa.me/${e.phone.replace(/[^\d]/g, "")}`;
            return (
              <li
                key={e.id}
                className="rounded-2xl border border-lunin-cream/10 bg-lunin-charcoal/40 p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-lg text-lunin-cream">{e.name}</p>
                    <p className="text-[0.8rem] text-lunin-cream/55">
                      {e.eventTitle} · {e.guests} pers.
                    </p>
                  </div>
                  <p className="text-[0.72rem] text-lunin-cream/45">
                    {new Date(e.createdAt).toLocaleString("es-ES")}
                  </p>
                </div>
                <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-[0.85rem]">
                  <a href={`tel:${e.phone}`} className="text-lunin-gold hover:underline">
                    {e.phone}
                  </a>
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lunin-gold/80 hover:underline"
                  >
                    WhatsApp
                  </a>
                  {e.email && (
                    <a
                      href={`mailto:${e.email}`}
                      className="text-lunin-cream/70 hover:text-lunin-gold"
                    >
                      {e.email}
                    </a>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
