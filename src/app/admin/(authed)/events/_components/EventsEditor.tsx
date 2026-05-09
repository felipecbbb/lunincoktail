"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import type { EventItem } from "../../../../../lib/types";

function uid() {
  return `evt-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

export function EventsEditor({ initial }: { initial: EventItem[] }) {
  const [items, setItems] = useState<EventItem[]>(initial);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function update(id: string, patch: Partial<EventItem>) {
    setItems((it) => it.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  }
  function add() {
    const today = new Date();
    const iso = today.toISOString().slice(0, 10);
    const next: EventItem = {
      id: uid(),
      title: { es: "Nuevo evento", en: "New event" },
      description: { es: "", en: "" },
      date: iso,
      time: "21:00",
      image: "",
      ctaLabel: { es: "Reservar", en: "Book" },
      ctaUrl: "",
      enabled: true,
    };
    setItems((it) => [next, ...it]);
  }
  function remove(id: string) {
    if (!confirm("¿Eliminar evento?")) return;
    setItems((it) => it.filter((e) => e.id !== id));
  }
  async function save() {
    setSaving(true);
    setError(null);
    const res = await fetch("/api/admin/events", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });
    setSaving(false);
    if (!res.ok) setError("No se pudo guardar.");
    else setSavedAt(new Date().toLocaleTimeString());
  }

  return (
    <div className="space-y-6">
      <div className="sticky top-14 z-20 bg-lunin-black/85 backdrop-blur border-b border-lunin-cream/10 -mx-5 md:-mx-10 px-5 md:px-10 py-3 flex items-center justify-between">
        <span className="text-xs text-lunin-cream/55">
          {saving ? "Guardando…" : savedAt ? `Guardado a las ${savedAt}` : "Cambios sin guardar"}
        </span>
        <div className="flex items-center gap-3">
          {error && <span className="text-rose-300 text-xs">{error}</span>}
          <button onClick={add} className="btn-ghost">+ Añadir evento</button>
          <button onClick={save} disabled={saving} className="btn-primary disabled:opacity-50">
            Guardar cambios
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {items.length === 0 && (
          <p className="text-sm text-lunin-cream/55 italic">No hay eventos. Pulsa “Añadir evento”.</p>
        )}
        {items.map((e) => (
          <EventRow
            key={e.id}
            event={e}
            onChange={(p) => update(e.id, p)}
            onDelete={() => remove(e.id)}
          />
        ))}
      </div>
    </div>
  );
}

function EventRow({
  event,
  onChange,
  onDelete,
}: {
  event: EventItem;
  onChange: (p: Partial<EventItem>) => void;
  onDelete: () => void;
}) {
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
    } else alert("Error subiendo poster.");
  }

  return (
    <article className="rounded-2xl border border-lunin-cream/10 bg-lunin-charcoal/60 p-5 grid gap-4 md:grid-cols-[200px_1fr] items-start">
      <button
        onClick={() => fileRef.current?.click()}
        className="relative aspect-[4/3] md:aspect-[4/5] w-full rounded-xl overflow-hidden border border-lunin-cream/10 bg-lunin-onyx grid place-items-center"
        aria-label="Subir poster"
      >
        {event.image ? (
          <Image src={event.image} alt={event.title.es} fill sizes="200px" className="object-cover" />
        ) : (
          <span className="text-lunin-gold/40 text-3xl">+</span>
        )}
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
        {uploading && (
          <span className="absolute inset-0 grid place-items-center bg-black/60 text-xs text-lunin-cream">
            Subiendo…
          </span>
        )}
      </button>

      <div className="grid gap-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field
            label="Título · ES"
            value={event.title.es}
            onChange={(v) => onChange({ title: { ...event.title, es: v } })}
          />
          <Field
            label="Title · EN"
            value={event.title.en ?? ""}
            onChange={(v) => onChange({ title: { ...event.title, en: v } })}
          />
          <Field
            label="Fecha"
            type="date"
            value={event.date}
            onChange={(v) => onChange({ date: v })}
          />
          <Field
            label="Hora"
            type="time"
            value={event.time ?? ""}
            onChange={(v) => onChange({ time: v })}
          />
        </div>
        <TextArea
          label="Descripción · ES"
          value={event.description.es}
          onChange={(v) => onChange({ description: { ...event.description, es: v } })}
        />
        <TextArea
          label="Description · EN"
          value={event.description.en ?? ""}
          onChange={(v) => onChange({ description: { ...event.description, en: v } })}
        />
        <div className="grid gap-3 sm:grid-cols-3">
          <Field
            label="CTA · ES"
            value={event.ctaLabel?.es ?? ""}
            onChange={(v) =>
              onChange({ ctaLabel: { ...(event.ctaLabel ?? { es: "" }), es: v } })
            }
          />
          <Field
            label="CTA · EN"
            value={event.ctaLabel?.en ?? ""}
            onChange={(v) =>
              onChange({ ctaLabel: { ...(event.ctaLabel ?? { es: "" }), en: v } })
            }
          />
          <Field
            label="CTA URL"
            value={event.ctaUrl ?? ""}
            onChange={(v) => onChange({ ctaUrl: v })}
          />
        </div>
        <div className="flex items-center justify-between gap-4 pt-1">
          <Toggle
            label="Visible"
            checked={event.enabled}
            onChange={(v) => onChange({ enabled: v })}
          />
          {event.image && (
            <button
              onClick={() => onChange({ image: "" })}
              className="text-[0.7rem] tracking-[0.22em] uppercase text-lunin-cream/55 hover:text-rose-300"
            >
              Quitar poster
            </button>
          )}
          <button
            onClick={onDelete}
            className="text-[0.7rem] tracking-[0.22em] uppercase text-rose-300/80 hover:text-rose-300"
          >
            Eliminar
          </button>
        </div>
      </div>
    </article>
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
        rows={3}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg bg-lunin-black/70 border border-lunin-cream/15 px-3 py-2 text-sm text-lunin-cream focus:border-lunin-gold/60 focus:outline-none resize-y min-h-[80px]"
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
    <label className="flex items-center gap-3 cursor-pointer">
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
      <span className="text-[0.7rem] tracking-[0.22em] uppercase font-headline text-lunin-cream/70">
        {label}
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
