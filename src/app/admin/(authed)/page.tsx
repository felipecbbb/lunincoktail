import Link from "next/link";
import { Store } from "../../../lib/store";

export default async function AdminHome() {
  const [cats, items, events] = await Promise.all([
    Store.getCategories(),
    Store.getMenu(),
    Store.getEvents(),
  ]);
  const enabledItems = items.filter((i) => i.enabled).length;
  const enabledEvents = events.filter((e) => e.enabled).length;
  return (
    <div className="space-y-8">
      <header>
        <p className="font-headline uppercase text-[0.7rem] tracking-[0.42em] text-lunin-gold/80">
          Panel
        </p>
        <h1 className="mt-2 font-display text-3xl md:text-4xl">Bienvenido, Lunin.</h1>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Categorías" value={cats.length} />
        <Stat label="Cócteles activos" value={`${enabledItems} / ${items.length}`} />
        <Stat label="Eventos activos" value={`${enabledEvents} / ${events.length}`} />
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
