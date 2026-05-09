import { Store } from "../../../../lib/store";
import { MenuEditor } from "./_components/MenuEditor";

export default async function AdminMenuPage() {
  const [categories, items] = await Promise.all([
    Store.getCategories(),
    Store.getMenu(),
  ]);
  return (
    <div className="space-y-6">
      <header>
        <p className="font-headline uppercase text-[0.7rem] tracking-[0.42em] text-lunin-gold/80">
          Gestión
        </p>
        <h1 className="mt-2 font-display text-3xl md:text-4xl">Carta</h1>
        <p className="mt-2 text-sm text-lunin-cream/60 max-w-xl">
          Añade, edita, desactiva y reordena cócteles y categorías. Cambios guardados al pulsar “Guardar cambios”.
        </p>
      </header>
      <MenuEditor initialCategories={categories} initialItems={items} />
    </div>
  );
}
