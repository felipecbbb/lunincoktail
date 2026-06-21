"use client";

import { useState } from "react";
import { useT } from "../../../components/LanguageProvider";

type Status = "idle" | "submitting" | "success" | "error";

export function WaitlistForm({
  eventId,
  eventTitle,
  whatsappUrl,
}: {
  eventId: string;
  eventTitle: string;
  whatsappUrl?: string;
}) {
  const t = useT();
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    guests: 1,
    website: "", // honeypot
  });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...form, eventId, eventTitle }),
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
      <div className="rounded-2xl border border-lunin-gold/40 bg-lunin-gold/5 p-6 text-center">
        <span aria-hidden className="text-2xl text-lunin-gold">★</span>
        <h4 className="mt-2 font-display text-xl text-lunin-cream">
          {t("events.wl_success_title")}
        </h4>
        <p className="mt-2 text-[0.85rem] leading-relaxed text-lunin-cream/70">
          {t("events.wl_success_body")}
        </p>
      </div>
    );
  }

  const fieldBase =
    "w-full rounded-xl border border-lunin-cream/15 bg-lunin-onyx/60 px-4 py-3 text-base text-lunin-cream placeholder:text-lunin-cream/30 outline-none transition focus:border-lunin-gold/60 focus:ring-1 focus:ring-lunin-gold/30";

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-lunin-cream/10 bg-lunin-charcoal/40 p-5"
    >
      <p className="font-headline text-[0.6rem] uppercase tracking-[0.3em] text-lunin-gold/80">
        {t("events.wl_title")}
      </p>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <input
          type="text"
          required
          minLength={2}
          maxLength={80}
          placeholder={t("events.wl_name_ph")}
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          className={"sm:col-span-2 " + fieldBase}
        />
        <input
          type="tel"
          required
          placeholder={t("events.wl_phone_ph")}
          value={form.phone}
          onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          className={fieldBase}
        />
        <label className="flex items-center gap-3 rounded-xl border border-lunin-cream/15 bg-lunin-onyx/60 px-4">
          <span className="font-headline text-[0.62rem] uppercase tracking-[0.2em] text-lunin-cream/55 whitespace-nowrap">
            {t("events.wl_guests_label")}
          </span>
          <input
            type="number"
            min={1}
            max={50}
            required
            value={form.guests}
            onChange={(e) =>
              setForm((f) => ({ ...f, guests: Number(e.target.value) }))
            }
            className="w-full bg-transparent py-3 text-base text-lunin-cream outline-none"
          />
        </label>
        <input
          type="email"
          placeholder={t("events.wl_email_ph")}
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          className={"sm:col-span-2 " + fieldBase}
        />

        {/* honeypot */}
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
        <p className="mt-3 text-[0.8rem] text-lunin-pink">{t("events.wl_error")}</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="btn-primary mt-4 w-full disabled:opacity-60"
      >
        {status === "submitting" ? t("events.wl_sending") : t("events.wl_submit")}
      </button>

      {whatsappUrl && (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 block text-center text-[0.74rem] font-headline uppercase tracking-[0.22em] text-lunin-cream/55 hover:text-lunin-gold transition"
        >
          {t("events.wl_or_wa")}
        </a>
      )}
    </form>
  );
}
