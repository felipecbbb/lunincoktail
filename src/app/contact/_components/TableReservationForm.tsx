"use client";

import { useState } from "react";
import { useLang } from "../../../components/LanguageProvider";
import type { Lang } from "../../../lib/i18n";

type Status = "idle" | "submitting" | "success" | "error";

// Self-contained copy (es / en / uk) so we don't touch the global dict.
const COPY: Record<Lang, Record<string, string>> = {
  es: {
    kicker: "Reserva de mesa",
    title: "Reserva tu mesa",
    lead: "Déjanos tus datos y confirmamos tu mesa por email o teléfono. Para grupos grandes o eventos, escríbenos por los canales de abajo.",
    date: "Fecha",
    time: "Hora",
    guests: "Personas",
    name: "Nombre",
    name_ph: "Tu nombre",
    email: "Email",
    email_ph: "tu@email.com",
    phone: "Teléfono",
    phone_ph: "+34 …",
    notes: "Notas (opcional)",
    notes_ph: "Alergias, ocasión especial, preferencia de zona…",
    legal: "Al enviar aceptas que te contactemos para gestionar tu reserva.",
    submit: "Solicitar reserva",
    sending: "Enviando…",
    success_title: "¡Reserva recibida!",
    success_body: "Te confirmaremos la mesa lo antes posible por email o teléfono. ¡Nos vemos en Lunin!",
    err: "No se pudo enviar. Revisa los datos o inténtalo de nuevo.",
  },
  en: {
    kicker: "Table booking",
    title: "Book your table",
    lead: "Leave your details and we'll confirm your table by email or phone. For large groups or events, reach us through the channels below.",
    date: "Date",
    time: "Time",
    guests: "Guests",
    name: "Name",
    name_ph: "Your name",
    email: "Email",
    email_ph: "you@email.com",
    phone: "Phone",
    phone_ph: "+34 …",
    notes: "Notes (optional)",
    notes_ph: "Allergies, special occasion, seating preference…",
    legal: "By submitting you agree to be contacted to manage your booking.",
    submit: "Request booking",
    sending: "Sending…",
    success_title: "Booking received!",
    success_body: "We'll confirm your table as soon as possible by email or phone. See you at Lunin!",
    err: "Couldn't send. Check your details or try again.",
  },
  uk: {
    kicker: "Бронювання столика",
    title: "Забронюй столик",
    lead: "Залиш свої дані, і ми підтвердимо столик електронною поштою або телефоном. Для великих груп чи подій пиши нам каналами нижче.",
    date: "Дата",
    time: "Час",
    guests: "Гостей",
    name: "Ім'я",
    name_ph: "Твоє ім'я",
    email: "Email",
    email_ph: "you@email.com",
    phone: "Телефон",
    phone_ph: "+34 …",
    notes: "Нотатки (необов'язково)",
    notes_ph: "Алергії, особлива нагода, побажання щодо місця…",
    legal: "Надсилаючи, ти погоджуєшся, що ми зв'яжемося для оформлення бронювання.",
    submit: "Забронювати",
    sending: "Надсилання…",
    success_title: "Бронювання отримано!",
    success_body: "Ми підтвердимо столик якнайшвидше електронною поштою або телефоном. До зустрічі в Lunin!",
    err: "Не вдалося надіслати. Перевір дані або спробуй ще раз.",
  },
};

export function TableReservationForm() {
  const { lang } = useLang();
  const c = COPY[lang] ?? COPY.es;
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({
    date: "",
    time: "",
    guests: 2,
    name: "",
    email: "",
    phone: "",
    notes: "",
    website: "", // honeypot
  });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    try {
      // Reuse the existing /api/booking endpoint. Time + notes go into the
      // message field (the booking schema has no dedicated time column).
      const message = [
        form.time ? `Hora preferida: ${form.time}` : "",
        form.notes.trim(),
      ]
        .filter(Boolean)
        .join(" · ");
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          eventType: "mesa",
          date: form.date,
          guests: form.guests,
          name: form.name,
          email: form.email,
          phone: form.phone,
          message,
          website: form.website,
        }),
      });
      const json = (await res.json()) as { ok?: boolean };
      if (!res.ok || !json.ok) {
        setStatus("error");
        return;
      }
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-3xl border border-lunin-gold/40 bg-lunin-charcoal/60 p-8 sm:p-10 text-center">
        <span aria-hidden className="text-3xl text-lunin-gold">★</span>
        <h2 className="mt-3 font-display text-2xl sm:text-3xl text-lunin-cream">
          {c.success_title}
        </h2>
        <p className="mt-3 text-lunin-cream/70 max-w-md mx-auto text-[0.95rem] leading-relaxed">
          {c.success_body}
        </p>
      </div>
    );
  }

  const fieldBase =
    "w-full rounded-xl border border-lunin-cream/15 bg-lunin-onyx/60 px-4 py-3 text-base text-lunin-cream placeholder:text-lunin-cream/30 outline-none transition focus:border-lunin-gold/60 focus:ring-1 focus:ring-lunin-gold/30";
  const labelBase =
    "font-headline text-[0.68rem] tracking-[0.28em] uppercase text-lunin-cream/65";

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-3xl border border-lunin-cream/10 bg-lunin-charcoal/40 p-6 sm:p-8 backdrop-blur-sm"
    >
      <p className="font-headline uppercase text-[0.65rem] tracking-[0.34em] text-lunin-gold/80">
        /&nbsp;&nbsp;{c.kicker}&nbsp;&nbsp;/
      </p>
      <h2 className="mt-3 font-display text-2xl sm:text-3xl text-lunin-cream leading-tight">
        {c.title}
      </h2>
      <p className="mt-2 text-[0.9rem] text-lunin-cream/60 leading-relaxed">
        {c.lead}
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className={labelBase}>{c.date}</span>
          <input
            type="date"
            required
            min={new Date().toISOString().slice(0, 10)}
            value={form.date}
            onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            className={"mt-2 " + fieldBase + " [color-scheme:dark]"}
          />
        </label>

        <label className="block">
          <span className={labelBase}>{c.time}</span>
          <input
            type="time"
            required
            value={form.time}
            onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
            className={"mt-2 " + fieldBase + " [color-scheme:dark]"}
          />
        </label>

        <label className="block">
          <span className={labelBase}>{c.guests}</span>
          <input
            type="number"
            min={1}
            max={20}
            required
            value={form.guests}
            onChange={(e) =>
              setForm((f) => ({ ...f, guests: Number(e.target.value) }))
            }
            className={"mt-2 " + fieldBase}
          />
        </label>

        <label className="block">
          <span className={labelBase}>{c.name}</span>
          <input
            type="text"
            required
            minLength={2}
            maxLength={80}
            placeholder={c.name_ph}
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className={"mt-2 " + fieldBase}
          />
        </label>

        <label className="block">
          <span className={labelBase}>{c.email}</span>
          <input
            type="email"
            required
            placeholder={c.email_ph}
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className={"mt-2 " + fieldBase}
          />
        </label>

        <label className="block">
          <span className={labelBase}>{c.phone}</span>
          <input
            type="tel"
            required
            placeholder={c.phone_ph}
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            className={"mt-2 " + fieldBase}
          />
        </label>

        <label className="block sm:col-span-2">
          <span className={labelBase}>{c.notes}</span>
          <textarea
            rows={3}
            maxLength={1000}
            placeholder={c.notes_ph}
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            className={"mt-2 resize-none " + fieldBase}
          />
        </label>

        {/* honeypot — invisible to humans */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={form.website}
          onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
          className="absolute left-[-9999px] top-[-9999px] h-0 w-0 opacity-0"
          aria-hidden="true"
        />
      </div>

      {status === "error" && (
        <p className="mt-4 text-sm text-red-400 bg-red-950/30 border border-red-500/30 rounded-lg px-4 py-3">
          {c.err}
        </p>
      )}

      <div className="mt-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="text-[0.78rem] text-lunin-cream/50 leading-relaxed">
          {c.legal}
        </p>
        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-lunin-gold text-lunin-black font-headline uppercase tracking-[0.22em] text-[0.72rem] px-7 py-3 hover:bg-lunin-gold-bright disabled:opacity-60 transition"
        >
          {status === "submitting" ? c.sending : c.submit}
          {status !== "submitting" && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M5 12h14" strokeLinecap="round" />
              <path d="m13 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
      </div>
    </form>
  );
}
