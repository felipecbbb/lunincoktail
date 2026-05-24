import Link from "next/link";
import { Store } from "../../../../lib/store";
import type { BookingRequest } from "../../../../lib/types";
import { BookingRow } from "./BookingRow";

export const dynamic = "force-dynamic";

const TYPE_LABEL: Record<BookingRequest["eventType"], string> = {
  cumpleanos: "Cumpleaños",
  despedida: "Despedida",
  corporativo: "Corporativo",
  privado: "Fiesta privada",
  catering: "Catering",
  otro: "Otro",
};

const STATUS_LABEL: Record<BookingRequest["status"], string> = {
  new: "Nueva",
  contacted: "Contactado",
  confirmed: "Confirmada",
  declined: "Descartada",
};

export default async function AdminBookingsPage() {
  const bookings = (await Store.getBookings()).sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-4">
        <div>
          <p className="font-headline uppercase text-[0.7rem] tracking-[0.42em] text-lunin-gold/80">
            Bandeja
          </p>
          <h1 className="mt-2 font-display text-3xl">Solicitudes de eventos</h1>
          <p className="mt-1 text-sm text-lunin-cream/60">
            {bookings.length} en total ·{" "}
            {bookings.filter((b) => b.status === "new").length} sin atender.
          </p>
        </div>
        <Link
          href="/admin"
          className="text-[0.72rem] font-headline uppercase tracking-[0.22em] text-lunin-cream/70 hover:text-lunin-gold"
        >
          ← Panel
        </Link>
      </header>

      {bookings.length === 0 ? (
        <p className="rounded-2xl border border-lunin-cream/10 bg-lunin-charcoal/40 p-8 text-center text-lunin-cream/60">
          Todavía no hay solicitudes. Cuando alguien rellene el formulario en{" "}
          <code>/eventos</code> aparecerán aquí.
        </p>
      ) : (
        <ul className="space-y-3">
          {bookings.map((b) => (
            <BookingRow
              key={b.id}
              booking={b}
              typeLabel={TYPE_LABEL[b.eventType]}
              statusLabels={STATUS_LABEL}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
