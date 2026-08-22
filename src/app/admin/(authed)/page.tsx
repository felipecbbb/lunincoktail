import Link from "next/link";
import { Store } from "../../../lib/store";
import { ReadOnlyNotice } from "../_components/ReadOnlyNotice";

export default async function AdminHome() {
  const [cats, items, events, bookings, waitlist] = await Promise.all([
    Store.getCategories(),
    Store.getMenu(),
    Store.getEvents(),
    Store.getBookings(),
    Store.getWaitlist(),
  ]);
  const enabledItems = items.filter((i) => i.enabled).length;
  const enabledEvents = events.filter((e) => e.enabled).length;
  const newBookings = bookings.filter((b) => b.status === "new").length;
  const newWaitlist = waitlist.filter((w) => w.status === "new").length;
  return (
    <div className="space-y-8">
      <header>
        <p className="font-headline uppercase text-[0.7rem] tracking-[0.42em] text-lunin-gold/80">
          Panel
        </p>
        <h1 className="mt-2 font-display text-3xl md:text-4xl">Bienvenido, Lunin.</h1>
      </header>

      <ReadOnlyNotice what="la carta y los eventos" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Categorías" value={cats.length} />
        <Stat label="Cócteles activos" value={`${enabledItems} / ${items.length}`} />
        <Stat label="Eventos activos" value={`${enabledEvents} / ${events.length}`} />
        <Stat
          label="Solicitudes nuevas"
          value={`${newBookings} / ${bookings.length}`}
        />
        <Stat
          label="Reservas waitlist"
          value={`${newWaitlist} / ${waitlist.length}`}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/menu"
          className="rounded-2xl border border-lunin-cream/10 bg-lunin-charcoal/60 p-6 hover:border-lunin-gold/40 transition"
        >
          <p className="font-headline uppercase text-[0.7rem] tracking-[0.32em] text-lunin-gold/80">
            Gestionar
          </p>
          <h2 className="mt-2 font-display text-xl">Carta digital →</h2>
          <p className="mt-2 text-sm text-lunin-cream/65">
            Añade, edita o desactiva cócteles y categorías. Sube fotos y cambia precios.
          </p>
        </Link>
        <Link
          href="/admin/events"
          className="rounded-2xl border border-lunin-cream/10 bg-lunin-charcoal/60 p-6 hover:border-lunin-gold/40 transition"
        >
          <p className="font-headline uppercase text-[0.7rem] tracking-[0.32em] text-lunin-gold/80">
            Gestionar
          </p>
          <h2 className="mt-2 font-display text-xl">Eventos →</h2>
          <p className="mt-2 text-sm text-lunin-cream/65">
            DJ nights, catas y celebraciones. Define fecha, descripción y CTA de reserva.
          </p>
        </Link>
        <Link
          href="/admin/bookings"
          className="rounded-2xl border border-lunin-cream/10 bg-lunin-charcoal/60 p-6 hover:border-lunin-gold/40 transition sm:col-span-2"
        >
          <p className="font-headline uppercase text-[0.7rem] tracking-[0.32em] text-lunin-gold/80">
            Bandeja de entrada
          </p>
          <h2 className="mt-2 font-display text-xl">
            Solicitudes de eventos privados{" "}
            {newBookings > 0 && (
              <span className="ml-2 inline-flex items-center justify-center min-w-[1.5rem] h-6 rounded-full bg-lunin-gold text-lunin-black text-xs font-headline tracking-normal px-2 align-middle">
                {newBookings}
              </span>
            )}{" "}
            →
          </h2>
          <p className="mt-2 text-sm text-lunin-cream/65">
            Reservas del local recibidas desde el formulario público de /eventos.
          </p>
        </Link>
        <Link
          href="/admin/waitlist"
          className="rounded-2xl border border-lunin-cream/10 bg-lunin-charcoal/60 p-6 hover:border-lunin-gold/40 transition sm:col-span-2"
        >
          <p className="font-headline uppercase text-[0.7rem] tracking-[0.32em] text-lunin-gold/80">
            Bandeja de entrada
          </p>
          <h2 className="mt-2 font-display text-xl">
            Reservas de plaza · eventos{" "}
            {newWaitlist > 0 && (
              <span className="ml-2 inline-flex items-center justify-center min-w-[1.5rem] h-6 rounded-full bg-lunin-gold text-lunin-black text-xs font-headline tracking-normal px-2 align-middle">
                {newWaitlist}
              </span>
            )}{" "}
            →
          </h2>
          <p className="mt-2 text-sm text-lunin-cream/65">
            Plazas reservadas (waitlist) desde la cartelera de eventos. La copia
            fiable llega siempre por email.
          </p>
        </Link>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-lunin-cream/10 bg-lunin-charcoal/60 p-5">
      <span className="font-headline uppercase text-[0.65rem] tracking-[0.34em] text-lunin-gold/70">
        {label}
      </span>
      <p className="mt-2 font-display text-2xl">{value}</p>
    </div>
  );
}
