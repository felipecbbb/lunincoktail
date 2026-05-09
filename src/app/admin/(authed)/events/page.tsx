import { Store } from "../../../../lib/store";
import { EventsEditor } from "./_components/EventsEditor";

export default async function AdminEventsPage() {
  const items = await Store.getEvents();
  return (
    <div className="space-y-6">
      <header>
        <p className="font-headline uppercase text-[0.7rem] tracking-[0.42em] text-lunin-gold/80">
          Gestión
        </p>
        <h1 className="mt-2 font-display text-3xl md:text-4xl">Eventos</h1>
        <p className="mt-2 text-sm text-lunin-cream/60 max-w-xl">
          Crea DJ nights, catas o eventos especiales con poster, descripción y CTA de reserva.
        </p>
      </header>
      <EventsEditor initial={items} />
    </div>
  );
}
