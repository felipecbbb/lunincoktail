"use client";

import { useState, useTransition } from "react";
import type { BookingRequest } from "../../../../lib/types";

const STATUS_ORDER: BookingRequest["status"][] = [
  "new",
  "contacted",
  "confirmed",
  "declined",
];

export function BookingRow({
  booking,
  typeLabel,
  statusLabels,
}: {
  booking: BookingRequest;
  typeLabel: string;
  statusLabels: Record<BookingRequest["status"], string>;
}) {
  const [status, setStatus] = useState(booking.status);
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  function update(next: BookingRequest["status"]) {
    startTransition(async () => {
      const res = await fetch("/api/admin/bookings", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id: booking.id, status: next }),
      });
      if (res.ok) setStatus(next);
    });
  }

  const dateLabel = new Date(booking.date + "T00:00:00").toLocaleDateString(
    "es-ES",
    { day: "2-digit", month: "short", year: "numeric" },
  );
  const createdLabel = new Date(booking.createdAt).toLocaleString("es-ES", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <li className="rounded-2xl border border-lunin-cream/10 bg-lunin-charcoal/40 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full text-left p-5 flex flex-wrap items-center gap-3 hover:bg-lunin-charcoal/60 transition"
      >
        <span
          className={
            "shrink-0 inline-flex items-center justify-center h-6 px-2.5 rounded-full text-[0.65rem] font-headline tracking-[0.18em] uppercase " +
            (status === "new"
              ? "bg-lunin-gold text-lunin-black"
              : status === "contacted"
                ? "bg-lunin-cream/10 text-lunin-cream"
                : status === "confirmed"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  : "bg-lunin-cream/5 text-lunin-cream/40 line-through")
          }
        >
          {statusLabels[status]}
        </span>
        <span className="font-headline text-[0.65rem] tracking-[0.28em] uppercase text-lunin-gold/80">
          {typeLabel}
        </span>
        <span className="font-display text-lg text-lunin-cream flex-1 min-w-0 truncate">
          {booking.name}
        </span>
        <span className="text-sm text-lunin-cream/70 whitespace-nowrap">
          {dateLabel}
        </span>
        <span className="text-sm text-lunin-cream/60 whitespace-nowrap">
          {booking.guests} pax
        </span>
        <span className="text-lunin-cream/40 text-xs">
          {open ? "▲" : "▼"}
        </span>
      </button>

      {open && (
        <div className="border-t border-lunin-cream/10 p-5 space-y-4 bg-lunin-onyx/30">
          <dl className="grid gap-3 sm:grid-cols-2 text-sm">
            <Field label="Recibido">{createdLabel}</Field>
            <Field label="Fecha del evento">{dateLabel}</Field>
            <Field label="Email">
              <a
                href={`mailto:${booking.email}`}
                className="text-lunin-gold hover:underline break-all"
              >
                {booking.email}
              </a>
            </Field>
            <Field label="Teléfono">
              <a
                href={`tel:${booking.phone.replace(/[^\d+]/g, "")}`}
                className="text-lunin-gold hover:underline"
              >
                {booking.phone}
              </a>{" "}
              ·{" "}
              <a
                href={`https://wa.me/${booking.phone.replace(/[^\d]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lunin-gold/70 hover:text-lunin-gold"
              >
                WhatsApp
              </a>
            </Field>
          </dl>

          {booking.message && (
            <div className="rounded-xl bg-lunin-black/40 border border-lunin-cream/10 p-4">
              <p className="font-headline text-[0.62rem] tracking-[0.28em] uppercase text-lunin-cream/50 mb-2">
                Mensaje
              </p>
              <p className="text-[0.92rem] text-lunin-cream/85 whitespace-pre-wrap leading-relaxed">
                {booking.message}
              </p>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="font-headline text-[0.62rem] tracking-[0.28em] uppercase text-lunin-cream/50 mr-2">
              Marcar como
            </span>
            {STATUS_ORDER.map((s) => (
              <button
                key={s}
                type="button"
                disabled={pending || s === status}
                onClick={() => update(s)}
                className={
                  "rounded-full px-3 py-1 text-[0.7rem] tracking-[0.18em] uppercase font-headline transition disabled:opacity-50 " +
                  (s === status
                    ? "bg-lunin-gold/20 border border-lunin-gold/60 text-lunin-gold"
                    : "border border-lunin-cream/15 text-lunin-cream/70 hover:border-lunin-gold/40 hover:text-lunin-gold")
                }
              >
                {statusLabels[s]}
              </button>
            ))}
          </div>
        </div>
      )}
    </li>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="font-headline text-[0.62rem] tracking-[0.28em] uppercase text-lunin-cream/50">
        {label}
      </p>
      <p className="mt-1 text-lunin-cream">{children}</p>
    </div>
  );
}
