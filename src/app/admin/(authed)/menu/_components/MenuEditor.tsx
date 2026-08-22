"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import type { Category, MenuItem } from "../../../../../lib/types";
import { TAGS, sortTags, type TagId } from "../../../../../lib/tags";

type Props = {
  initialCategories: Category[];
  initialItems: MenuItem[];
  /** En Vercel el contenido no se puede guardar: el editor pasa a solo consulta. */
  readOnly?: boolean;
};

const DEFAULT_PRICE = 10;

function uid(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

export function MenuEditor({ initialCategories, initialItems, readOnly = false }: Props) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [items, setItems] = useState<MenuItem[]>(initialItems);
  const [activeCat, setActiveCat] = useState<string>(initialCategories[0]?.id ?? "");
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const itemsByCat = useMemo(() => {
    const m = new Map<string, MenuItem[]>();
    for (const c of categories) m.set(c.id, []);
    for (const it of items) {
      const arr = m.get(it.categoryId);
      if (arr) arr.push(it);
    }
    for (const [, arr] of m) arr.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
    return m;
  }, [categories, items]);

  async function save() {
    setSaving(true);
    setError(null);
    const res = await fetch("/api/admin/menu", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ categories, items }),
    });
    setSaving(false);
    if (!res.ok) {
      setError("No se pudo guardar.");
      return;
    }
    setSavedAt(new Date().toLocaleTimeString());
  }

  function addCategory() {
    const id = uid("cat");
    const next: Category = {
      id,
      slug: id,
      name: { es: "Nueva categoría", en: "New category" },
      order: categories.length + 1,
      enabled: true,
    };
    setCategories([...categories, next]);
    setActiveCat(id);
  }

  function updateCategory(id: string, patch: Partial<Category>) {
    setCategories((cs) => cs.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }

  function deleteCategory(id: string) {
    if (!confirm("¿Eliminar la categoría y todos sus ítems?")) return;
    setCategories((cs) => cs.filter((c) => c.id !== id));
    setItems((is) => is.filter((i) => i.categoryId !== id));
    if (activeCat === id) setActiveCat(categories[0]?.id ?? "");
  }

  function moveCategory(id: string, dir: -1 | 1) {
    setCategories((cs) => {
      const sorted = [...cs].sort((a, b) => a.order - b.order);
      const idx = sorted.findIndex((c) => c.id === id);
      const swap = idx + dir;
      if (idx < 0 || swap < 0 || swap >= sorted.length) return cs;
      const a = sorted[idx];
      const b = sorted[swap];
      const ao = a.order;
      a.order = b.order;
      b.order = ao;
      return [...sorted];
    });
  }

  function addItem(categoryId: string) {
    const id = uid("itm");
    const next: MenuItem = {
      id,
      categoryId,
      name: { es: "Nuevo cóctel", en: "New cocktail" },
      ingredients: { es: "", en: "" },
      price: DEFAULT_PRICE,
      enabled: true,
      order: (itemsByCat.get(categoryId)?.length ?? 0) + 1,
    };
    setItems((is) => [...is, next]);
  }

  function updateItem(id: string, patch: Partial<MenuItem>) {
    setItems((is) => is.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  }

  function deleteItem(id: string) {
    if (!confirm("¿Eliminar este cóctel?")) return;
    setItems((is) => is.filter((i) => i.id !== id));
  }

  const sortedCats = [...categories].sort((a, b) => a.order - b.order);
  const activeCategory = sortedCats.find((c) => c.id === activeCat) ?? sortedCats[0];

  return (
    <div className="space-y-6">
      <div className="sticky top-14 z-20 bg-lunin-black/85 backdrop-blur border-b border-lunin-cream/10 -mx-5 md:-mx-10 px-5 md:px-10 py-3 flex items-center justify-between">
        <span className="text-xs text-lunin-cream/55">
          {readOnly
            ? "Solo consulta · avisa a Felipe para cambiar algo"
            : saving
              ? "Guardando…"
              : savedAt
                ? `Guardado a las ${savedAt}`
                : "Cambios sin guardar"}
        </span>
        <div className="flex items-center gap-3">
          {error && <span className="text-rose-300 text-xs">{error}</span>}
          <button
            onClick={save}
            disabled={saving || readOnly}
            title={readOnly ? "No disponible desde el panel" : undefined}
            className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Guardar cambios
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[260px_1fr]">
        <aside className="rounded-2xl border border-lunin-cream/10 bg-lunin-charcoal/60 p-3">
          <div className="flex items-center justify-between mb-2 px-2">
            <p className="text-[0.7rem] tracking-[0.28em] uppercase font-headline text-lunin-gold/80">
              Categorías
            </p>
            <button
              type="button"
              onClick={addCategory}
              disabled={readOnly}
              className="h-7 w-7 grid place-items-center rounded-full bg-lunin-gold text-lunin-black"
              aria-label="Añadir categoría"
            >
              +
            </button>
          </div>
          <ul className="space-y-1">
            {sortedCats.map((c) => (
              <li key={c.id}>
                <button
                  onClick={() => setActiveCat(c.id)}
                  className={
                    "w-full text-left rounded-xl px-3 py-2 transition flex items-center justify-between " +
                    (activeCat === c.id
                      ? "bg-lunin-gold/15 text-lunin-cream"
                      : "hover:bg-lunin-cream/5 text-lunin-cream/70")
                  }
                >
                  <span className="truncate">
                    <span className="text-lunin-gold/70 mr-2 text-[0.7rem]">0{c.order}</span>
                    {c.name.es}
                  </span>
                  {!c.enabled && (
                    <span className="text-[0.6rem] tracking-[0.2em] uppercase text-lunin-cream/40">
                      off
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {activeCategory && (
          <section className="rounded-2xl border border-lunin-cream/10 bg-lunin-charcoal/60 p-5 space-y-5">
            <header className="flex items-start justify-between gap-4">
              <div className="grid gap-3 flex-1">
                <Field
                  label="Nombre · ES"
                  value={activeCategory.name.es}
                  onChange={(v) =>
                    updateCategory(activeCategory.id, {
                      name: { ...activeCategory.name, es: v },
                    })
                  }
                />
                <Field
                  label="Name · EN"
                  value={activeCategory.name.en ?? ""}
                  onChange={(v) =>
                    updateCategory(activeCategory.id, {
                      name: { ...activeCategory.name, en: v },
                    })
                  }
                />
                <Field
                  label="Slug"
                  value={activeCategory.slug}
                  onChange={(v) =>
                    updateCategory(activeCategory.id, {
                      slug: v.toLowerCase().replace(/[^a-z0-9-]+/g, "-"),
                    })
                  }
                />
                <TextArea
                  label="Descripción · ES"
                  value={activeCategory.description?.es ?? ""}
                  onChange={(v) =>
                    updateCategory(activeCategory.id, {
                      description: { ...(activeCategory.description ?? { es: "" }), es: v },
                    })
                  }
                />
                <TextArea
                  label="Description · EN"
                  value={activeCategory.description?.en ?? ""}
                  onChange={(v) =>
                    updateCategory(activeCategory.id, {
                      description: {
                        ...(activeCategory.description ?? { es: "" }),
                        en: v,
                      },
                    })
                  }
                />
              </div>
              <div className="flex flex-col gap-2 items-stretch min-w-[140px]">
                <Toggle
                  label="Activa"
                  checked={activeCategory.enabled}
                  onChange={(v) => updateCategory(activeCategory.id, { enabled: v })}
                />
                <button onClick={() => moveCategory(activeCategory.id, -1)} className="btn-ghost text-[0.65rem]">↑ subir</button>
                <button onClick={() => moveCategory(activeCategory.id, 1)} className="btn-ghost text-[0.65rem]">↓ bajar</button>
                <button
                  onClick={() => deleteCategory(activeCategory.id)}
                  disabled={readOnly}
                  className="text-[0.7rem] tracking-[0.22em] uppercase text-rose-300/80 hover:text-rose-300"
                >
                  Eliminar categoría
                </button>
              </div>
            </header>

            <div className="border-t border-lunin-cream/10 pt-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[0.7rem] tracking-[0.28em] uppercase font-headline text-lunin-gold/80">
                  Cócteles
                </p>
                <button
                  type="button"
                  onClick={() => addItem(activeCategory.id)}
                  disabled={readOnly}
                  className="btn-ghost"
                >
                  + Añadir cóctel
                </button>
              </div>
              <div className="space-y-3">
                {(itemsByCat.get(activeCategory.id) ?? []).map((it) => (
                  <ItemRow
                    readOnly={readOnly}
                    key={it.id}
                    item={it}
                    onChange={(patch) => updateItem(it.id, patch)}
                    onDelete={() => deleteItem(it.id)}
                  />
                ))}
                {(itemsByCat.get(activeCategory.id)?.length ?? 0) === 0 && (
                  <p className="text-sm text-lunin-cream/55 italic">Sin cócteles aún.</p>
                )}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="block text-[0.65rem] tracking-[0.28em] uppercase font-headline text-lunin-cream/55">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg bg-lunin-black/70 border border-lunin-cream/15 px-3 py-2 text-sm text-lunin-cream focus:border-lunin-gold/60 focus:outline-none"
      />
    </label>
  );
}

function NumberField({
  label,
  value,
  onChange,
  min = 0,
  step = 1,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  step?: number;
}) {
  return (
    <label className="block">
      <span className="block text-[0.65rem] tracking-[0.28em] uppercase font-headline text-lunin-cream/55">
        {label}
      </span>
      <input
        type="number"
        min={min}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 w-full rounded-lg bg-lunin-black/70 border border-lunin-cream/15 px-3 py-2 text-sm text-lunin-cream focus:border-lunin-gold/60 focus:outline-none"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="block text-[0.65rem] tracking-[0.28em] uppercase font-headline text-lunin-cream/55">
        {label}
      </span>
      <textarea
        value={value}
        rows={2}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg bg-lunin-black/70 border border-lunin-cream/15 px-3 py-2 text-sm text-lunin-cream focus:border-lunin-gold/60 focus:outline-none resize-y min-h-[64px]"
      />
    </label>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-full border border-lunin-cream/15 px-3 py-2 cursor-pointer">
      <span className="text-[0.7rem] tracking-[0.22em] uppercase font-headline text-lunin-cream/70">
        {label}
      </span>
      <span
        className={
          "relative inline-block h-5 w-9 rounded-full transition " +
          (checked ? "bg-lunin-gold" : "bg-lunin-cream/15")
        }
      >
        <span
          className={
            "absolute top-0.5 h-4 w-4 rounded-full bg-lunin-cream transition " +
            (checked ? "left-[calc(100%-1.125rem)]" : "left-0.5")
          }
        />
      </span>
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
    </label>
  );
}

function TagPicker({
  tags,
  onChange,
}: {
  tags: TagId[];
  onChange: (tags: TagId[]) => void;
}) {
  const groups: { title: string; ids: TagId[] }[] = [
    {
      title: "Contiene (alérgenos)",
      ids: sortTags(
        Object.values(TAGS).filter((d) => d.kind === "allergen").map((d) => d.id),
      ),
    },
    {
      title: "Dieta",
      ids: sortTags(
        Object.values(TAGS).filter((d) => d.kind === "diet").map((d) => d.id),
      ),
    },
  ];

  function toggle(id: TagId) {
    const has = tags.includes(id);
    let next = has ? tags.filter((t) => t !== id) : [...tags, id];
    // vegano y vegetariano son excluyentes
    if (!has && id === "vegan") next = next.filter((t) => t !== "vegetarian");
    if (!has && id === "vegetarian") next = next.filter((t) => t !== "vegan");
    onChange(sortTags(next));
  }

  return (
    <div className="sm:col-span-2">
      <p className="text-[0.7rem] tracking-[0.22em] uppercase font-headline text-lunin-cream/70">
        Etiquetas
      </p>
      <div className="mt-2 grid gap-3 sm:grid-cols-2">
        {groups.map((g) => (
          <div key={g.title}>
            <p className="text-[0.6rem] tracking-[0.2em] uppercase text-lunin-cream/40">
              {g.title}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {g.ids.map((id) => {
                const active = tags.includes(id);
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => toggle(id)}
                    aria-pressed={active}
                    className={
                      "rounded-full border px-2.5 py-1 text-[0.7rem] transition " +
                      (active
                        ? "border-lunin-gold bg-lunin-gold/15 text-lunin-gold"
                        : "border-lunin-cream/15 text-lunin-cream/55 hover:border-lunin-cream/35")
                    }
                  >
                    {TAGS[id].label.es}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ItemRow({
  item,
  onChange,
  onDelete,
  readOnly = false,
}: {
  item: MenuItem;
  onChange: (patch: Partial<MenuItem>) => void;
  onDelete: () => void;
  readOnly?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(file: File) {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    setUploading(false);
    if (res.ok) {
      const data = (await res.json()) as { url: string };
      onChange({ image: data.url });
    } else {
      alert("Error al subir la imagen.");
    }
  }

  return (
    <div className="rounded-xl border border-lunin-cream/10 bg-lunin-onyx/70 p-3">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setOpen((v) => !v)}
          className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-lunin-black/60 ring-1 ring-lunin-cream/10 grid place-items-center relative"
          aria-label="Editar imagen"
        >
          {item.image ? (
            <Image src={item.image} alt={item.name.es} fill sizes="64px" className="object-cover" />
          ) : (
            <span className="text-lunin-gold/40 text-xl">+</span>
          )}
        </button>
        <div className="flex-1 min-w-0">
          <input
            value={item.name.es}
            onChange={(e) => onChange({ name: { ...item.name, es: e.target.value } })}
            className="w-full bg-transparent border-0 px-0 py-1 text-base text-lunin-cream font-headline font-semibold focus:outline-none"
            placeholder="Nombre del cóctel"
          />
          <input
            value={item.ingredients.es}
            onChange={(e) =>
              onChange({ ingredients: { ...item.ingredients, es: e.target.value } })
            }
            className="w-full bg-transparent border-0 px-0 py-1 text-xs text-lunin-cream/65 focus:outline-none"
            placeholder="Ingredientes"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={item.price}
            min={0}
            step={0.5}
            onChange={(e) => onChange({ price: Number(e.target.value) })}
            className="w-16 rounded-md bg-lunin-black/70 border border-lunin-cream/15 px-2 py-1 text-right text-sm text-lunin-gold"
          />
          <Toggle
            label="On"
            checked={item.enabled}
            onChange={(v) => onChange({ enabled: v })}
          />
        </div>
      </div>

      {open && (
        <div className="mt-3 grid gap-3 sm:grid-cols-2 border-t border-lunin-cream/10 pt-3">
          <Field
            label="Name · EN"
            value={item.name.en ?? ""}
            onChange={(v) => onChange({ name: { ...item.name, en: v } })}
          />
          <Field
            label="Ingredients · EN"
            value={item.ingredients.en ?? ""}
            onChange={(v) => onChange({ ingredients: { ...item.ingredients, en: v } })}
          />
          <NumberField
            label="Orden"
            value={item.order ?? 0}
            min={0}
            onChange={(v) => onChange({ order: v })}
          />
          <Toggle
            label="Signature ★"
            checked={!!item.signature}
            onChange={(v) => onChange({ signature: v })}
          />

          <TagPicker
            tags={item.tags ?? []}
            onChange={(tags) => onChange({ tags })}
          />

          <div className="sm:col-span-2 flex items-center justify-between gap-3 flex-wrap">
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="btn-ghost disabled:opacity-40 disabled:cursor-not-allowed"
              disabled={uploading || readOnly}
              title={readOnly ? "No disponible desde el panel" : undefined}
            >
              {readOnly
                ? "Subida no disponible"
                : uploading
                  ? "Subiendo…"
                  : item.image
                    ? "Reemplazar imagen"
                    : "Subir imagen"}
            </button>
            {item.image && (
              <button
                type="button"
                onClick={() => onChange({ image: "" })}
                className="text-[0.7rem] tracking-[0.22em] uppercase text-lunin-cream/55 hover:text-rose-300"
              >
                Quitar imagen
              </button>
            )}
            <button
              type="button"
              onClick={onDelete}
              disabled={readOnly}
              className="text-[0.7rem] tracking-[0.22em] uppercase text-rose-300/80 hover:text-rose-300 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Eliminar cóctel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
