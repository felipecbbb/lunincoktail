"use client";

import { useState } from "react";
import { useT } from "../../../components/LanguageProvider";

type EventType =
  | "cumpleanos"
  | "despedida"
  | "corporativo"
  | "privado"
  | "catering"
  | "otro";

type Status = "idle" | "submitting" | "success" | "error";

const TYPES: { value: EventType; key: string }[] = [
  { value: "cumpleanos", key: "form.type_cumpleanos" },
  { value: "despedida", key: "form.type_despedida" },
  { value: "corporativo", key: "form.type_corporativo" },
  { value: "privado", key: "form.type_privado" },
  { value: "catering", key: "form.type_catering" },
  { value: "otro", key: "form.type_otro" },
];

const WHATSAPP = "+34655147944";
const EMAIL = "Lunindistillery@gmail.com";

function buildWhatsAppHref(message: string) {
  const phone = WHATSAPP.replace(/[^\d]/g, "");
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

function errorKey(code?: string) {
  switch (code) {
    case "invalid_name":
      return "form.err_name";
    case "invalid_email":
      return "form.err_email";
    case "invalid_phone":
      return "form.err_phone";
    case "invalid_type":
      return "form.err_type";
    case "invalid_date":
      return "form.err_date";
    case "invalid_guests":
      return "form.err_guests";
    default:
      return "form.err_generic";
  }
}

export function BookingForm() {
  const t = useT();
  const [status, setStatus] = useState<Status>("idle");
  const [errorKeyStr, setErrorKeyStr] = useState<string>("form.err_generic");
  const [form, setForm] = useState({
    eventType: "cumpleanos" as EventType,
    date: "",
    guests: 20,
    name: "",
    email: "",
    phone: "",
    message: "",
    website: "", // honeypot
  });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrorKeyStr("form.err_generic");
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) {
        setStatus("error");
        setErrorKeyStr(errorKey(json.error));
        return;
      }
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorKeyStr("form.err_generic");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-3xl border border-lunin-gold/40 bg-lunin-charcoal/60 p-8 sm:p-10 text-center">
        <span aria-hidden className="text-3xl text-lunin-gold">★</span>
        <h2 className="mt-3 font-display text-2xl sm:text-3xl text-lunin-cream">
          {t("form.success_title")}
        </h2>
        <p className="mt-3 text-lunin-cream/70 max-w-md mx-auto text-[0.95rem] leading-relaxed">
          {t("form.success_body")}
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={buildWhatsAppHref(t("form.wa_success_msg"))}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-lunin-gold text-lunin-black font-headline uppercase tracking-[0.22em] text-[0.72rem] px-5 py-2.5 hover:bg-lunin-gold-bright transition"
          >
            WhatsApp
          </a>
          <a
            href={`mailto:${EMAIL}`}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-lunin-cream/20 text-lunin-cream font-headline uppercase tracking-[0.22em] text-[0.72rem] px-5 py-2.5 hover:border-lunin-gold/50 hover:text-lunin-gold transition"
          >
            {t("form.success_email_btn")}
          </a>
        </div>
      </div>
    );
  }

  const fieldBase =
    "w-full rounded-xl border border-lunin-cream/15 bg-lunin-onyx/60 px-4 py-3 text-base text-lunin-cream placeholder:text-lunin-cream/30 outline-none transition focus:border-lunin-gold/60 focus:ring-1 focus:ring-lunin-gold/30";

  return (
    <form onSubmit={onSubmit} className="rounded-3xl border border-lunin-cream/10 bg-lunin-charcoal/40 p-6 sm:p-8 backdrop-blur-sm">
      <p className="font-headline uppercase text-[0.65rem] tracking-[0.34em] text-lunin-gold/80">
        /&nbsp;&nbsp;{t("form.kicker")}&nbsp;&nbsp;/
      </p>
      <h2 className="mt-3 font-display text-2xl sm:text-3xl text-lunin-cream leading-tight">
        {t("form.title")}
      </h2>
      <p className="mt-2 text-[0.9rem] text-lunin-cream/60 leading-relaxed">
        {t("form.lead")}
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="font-headline text-[0.68rem] tracking-[0.28em] uppercase text-lunin-cream/65">
            {t("form.type_label")}
          </span>
          <div className="mt-2 flex flex-wrap gap-2">
            {TYPES.map((tp) => (
              <button
                key={tp.value}
                type="button"
                onClick={() => setForm((f) => ({ ...f, eventType: tp.value }))}
                className={
                  "rounded-full px-4 py-1.5 text-[0.72rem] tracking-[0.22em] uppercase font-headline transition " +
                  (form.eventType === tp.value
                    ? "bg-lunin-gold text-lunin-black border border-lunin-gold"
                    : "border border-lunin-cream/15 text-lunin-cream/75 hover:border-lunin-gold/50 hover:text-lunin-gold")
                }
              >
                {t(tp.key)}
              </button>
            ))}
          </div>
        </label>

        <label className="block">
          <span className="font-headline text-[0.68rem] tracking-[0.28em] uppercase text-lunin-cream/65">
            {t("form.date_label")}
          </span>
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
          <span className="font-headline text-[0.68rem] tracking-[0.28em] uppercase text-lunin-cream/65">
            {t("form.guests_label")}
          </span>
          <input
            type="number"
            min={1}
            max={500}
            required
            value={form.guests}
            onChange={(e) =>
              setForm((f) => ({ ...f, guests: Number(e.target.value) }))
            }
            className={"mt-2 " + fieldBase}
          />
        </label>

        <label className="block sm:col-span-2">
          <span className="font-headline text-[0.68rem] tracking-[0.28em] uppercase text-lunin-cream/65">
            {t("form.name_label")}
          </span>
          <input
            type="text"
            required
            minLength={2}
            maxLength={80}
            placeholder={t("form.name_ph")}
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className={"mt-2 " + fieldBase}
          />
        </label>

        <label className="block">
          <span className="font-headline text-[0.68rem] tracking-[0.28em] uppercase text-lunin-cream/65">
            {t("form.email_label")}
          </span>
          <input
            type="email"
            required
            placeholder={t("form.email_ph")}
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className={"mt-2 " + fieldBase}
          />
        </label>

        <label className="block">
          <span className="font-headline text-[0.68rem] tracking-[0.28em] uppercase text-lunin-cream/65">
            {t("form.phone_label")}
          </span>
          <input
            type="tel"
            required
            placeholder={t("form.phone_ph")}
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            className={"mt-2 " + fieldBase}
          />
        </label>

        <label className="block sm:col-span-2">
          <span className="font-headline text-[0.68rem] tracking-[0.28em] uppercase text-lunin-cream/65">
            {t("form.details_label")}
          </span>
          <textarea
            rows={4}
            maxLength={1000}
            placeholder={t("form.details_ph")}
            value={form.message}
            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
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
          {t(errorKeyStr)}
        </p>
      )}

      <div className="mt-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="text-[0.78rem] text-lunin-cream/50 leading-relaxed">
          {t("form.legal")}
        </p>
        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-lunin-gold text-lunin-black font-headline uppercase tracking-[0.22em] text-[0.72rem] px-7 py-3 hover:bg-lunin-gold-bright disabled:opacity-60 transition"
        >
          {status === "submitting" ? t("form.sending") : t("form.submit")}
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
