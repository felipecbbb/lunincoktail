"use client";

import { useState } from "react";

type EventType =
  | "cumpleanos"
  | "despedida"
  | "corporativo"
  | "privado"
  | "catering"
  | "otro";

type Status = "idle" | "submitting" | "success" | "error";

const TYPES: { value: EventType; label: string }[] = [
  { value: "cumpleanos", label: "Cumpleaños" },
  { value: "despedida", label: "Despedida" },
  { value: "corporativo", label: "Corporativo" },
  { value: "privado", label: "Fiesta privada" },
  { value: "catering", label: "Catering" },
  { value: "otro", label: "Otro" },
];

const WHATSAPP = "+34655147944";
const EMAIL = "Lunindistillery@gmail.com";

function buildWhatsAppHref(message: string) {
  const phone = WHATSAPP.replace(/[^\d]/g, "");
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function BookingForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");
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
    setErrorMsg("");
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) {
        setStatus("error");
        setErrorMsg(translateError(json.error));
        return;
      }
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMsg("No hemos podido enviar tu solicitud. Inténtalo de nuevo.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-3xl border border-lunin-gold/40 bg-lunin-charcoal/60 p-8 sm:p-10 text-center">
        <span aria-hidden className="text-3xl text-lunin-gold">★</span>
        <h2 className="mt-3 font-display text-2xl sm:text-3xl text-lunin-cream">
          Solicitud recibida
        </h2>
        <p className="mt-3 text-lunin-cream/70 max-w-md mx-auto text-[0.95rem] leading-relaxed">
          Te contestaremos a tu correo en menos de 24 horas con disponibilidad y
          una propuesta a medida. Si necesitas algo urgente, llámanos o
          escríbenos por WhatsApp.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={buildWhatsAppHref("Hola Lunin, acabo de enviar una solicitud para un evento privado.")}
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
            Correo
          </a>
        </div>
      </div>
    );
  }

  const fieldBase =
    "w-full rounded-xl border border-lunin-cream/15 bg-lunin-onyx/60 px-4 py-3 text-[0.95rem] text-lunin-cream placeholder:text-lunin-cream/30 outline-none transition focus:border-lunin-gold/60 focus:ring-1 focus:ring-lunin-gold/30";

  return (
    <form onSubmit={onSubmit} className="rounded-3xl border border-lunin-cream/10 bg-lunin-charcoal/40 p-6 sm:p-8 backdrop-blur-sm">
      <p className="font-headline uppercase text-[0.65rem] tracking-[0.34em] text-lunin-gold/80">
        /  RESERVA  PRIVADA  /
      </p>
      <h2 className="mt-3 font-display text-2xl sm:text-3xl text-lunin-cream leading-tight">
        Cuéntanos sobre tu evento
      </h2>
      <p className="mt-2 text-[0.9rem] text-lunin-cream/60 leading-relaxed">
        Rellena el formulario y te contactaremos con una propuesta adaptada
        (aforo, cócteles, catering y horario). Sin compromiso.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="font-headline text-[0.68rem] tracking-[0.28em] uppercase text-lunin-cream/65">
            Tipo de evento
          </span>
          <div className="mt-2 flex flex-wrap gap-2">
            {TYPES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setForm((f) => ({ ...f, eventType: t.value }))}
                className={
                  "rounded-full px-4 py-1.5 text-[0.72rem] tracking-[0.22em] uppercase font-headline transition " +
                  (form.eventType === t.value
                    ? "bg-lunin-gold text-lunin-black border border-lunin-gold"
                    : "border border-lunin-cream/15 text-lunin-cream/75 hover:border-lunin-gold/50 hover:text-lunin-gold")
                }
              >
                {t.label}
              </button>
            ))}
          </div>
        </label>

        <label className="block">
          <span className="font-headline text-[0.68rem] tracking-[0.28em] uppercase text-lunin-cream/65">
            Fecha estimada
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
            Nº invitados aprox.
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
            Tu nombre
          </span>
          <input
            type="text"
            required
            minLength={2}
            maxLength={80}
            placeholder="Nombre y apellidos"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className={"mt-2 " + fieldBase}
          />
        </label>

        <label className="block">
          <span className="font-headline text-[0.68rem] tracking-[0.28em] uppercase text-lunin-cream/65">
            Correo electrónico
          </span>
          <input
            type="email"
            required
            placeholder="tu@email.com"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className={"mt-2 " + fieldBase}
          />
        </label>

        <label className="block">
          <span className="font-headline text-[0.68rem] tracking-[0.28em] uppercase text-lunin-cream/65">
            Teléfono
          </span>
          <input
            type="tel"
            required
            placeholder="+34 ..."
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            className={"mt-2 " + fieldBase}
          />
        </label>

        <label className="block sm:col-span-2">
          <span className="font-headline text-[0.68rem] tracking-[0.28em] uppercase text-lunin-cream/65">
            Detalles (opcional)
          </span>
          <textarea
            rows={4}
            maxLength={1000}
            placeholder="Cuéntanos cualquier detalle relevante: horario aproximado, alergias, si quieres barra libre o cocktails específicos, decoración…"
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
          {errorMsg || "Algo salió mal. Inténtalo de nuevo."}
        </p>
      )}

      <div className="mt-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="text-[0.78rem] text-lunin-cream/50 leading-relaxed">
          Al enviar aceptas que te contactemos por correo o teléfono únicamente
          para gestionar esta solicitud.
        </p>
        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-lunin-gold text-lunin-black font-headline uppercase tracking-[0.22em] text-[0.72rem] px-7 py-3 hover:bg-lunin-gold-bright disabled:opacity-60 transition"
        >
          {status === "submitting" ? "Enviando…" : "Enviar solicitud"}
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

function translateError(code?: string) {
  switch (code) {
    case "invalid_name":
      return "Revisa el nombre (mínimo 2 caracteres).";
    case "invalid_email":
      return "El correo no parece válido.";
    case "invalid_phone":
      return "Revisa el teléfono.";
    case "invalid_type":
      return "Selecciona un tipo de evento.";
    case "invalid_date":
      return "Selecciona una fecha válida.";
    case "invalid_guests":
      return "Nº de invitados inválido (1 – 500).";
    default:
      return "No hemos podido enviar tu solicitud. Inténtalo de nuevo.";
  }
}
