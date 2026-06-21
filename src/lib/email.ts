import { Resend } from "resend";
import type { BookingRequest, WaitlistEntry } from "./types";

/**
 * Sends a notification email when a new booking request comes in.
 * Silently no-ops if RESEND_API_KEY is not configured, so the booking
 * still gets stored in JSON and visible from /admin/bookings.
 */

const TYPE_LABEL: Record<BookingRequest["eventType"], string> = {
  cumpleanos: "Cumpleaños",
  despedida: "Despedida",
  corporativo: "Corporativo",
  privado: "Fiesta privada",
  catering: "Catering",
  otro: "Otro",
};

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendBookingNotification(b: BookingRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[booking] RESEND_API_KEY not set — skipping email");
    return { sent: false, reason: "no_api_key" as const };
  }

  const from = process.env.BOOKING_FROM || "Lunin <onboarding@resend.dev>";
  const to = (process.env.BOOKING_TO || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (to.length === 0) {
    console.warn("[booking] BOOKING_TO not set — skipping email");
    return { sent: false, reason: "no_recipient" as const };
  }

  const dateLabel = new Date(b.date + "T00:00:00").toLocaleDateString("es-ES", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const subject = `Nueva reserva · ${TYPE_LABEL[b.eventType]} · ${b.name} (${b.guests} pax · ${dateLabel})`;

  const text = [
    `Nueva solicitud de reserva en Lunin Cocktail Bar`,
    ``,
    `Tipo:      ${TYPE_LABEL[b.eventType]}`,
    `Fecha:     ${dateLabel}`,
    `Invitados: ${b.guests}`,
    ``,
    `Nombre:    ${b.name}`,
    `Email:     ${b.email}`,
    `Teléfono:  ${b.phone}`,
    ``,
    b.message ? `Mensaje:\n${b.message}` : `Sin mensaje adicional.`,
    ``,
    `--`,
    `ID: ${b.id}`,
    `Recibido: ${new Date(b.createdAt).toLocaleString("es-ES")}`,
  ].join("\n");

  const whatsappLink = `https://wa.me/${b.phone.replace(/[^\d]/g, "")}`;

  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#0d0d0d;padding:32px 16px;color:#f9f2e0;">
      <div style="max-width:560px;margin:0 auto;background:#161616;border:1px solid rgba(222,171,59,.25);border-radius:16px;overflow:hidden;">
        <div style="background:linear-gradient(180deg,#1f1f1f,#0d0d0d);padding:24px 28px;border-bottom:1px solid rgba(249,242,224,.08);">
          <p style="margin:0;font-size:11px;letter-spacing:.34em;text-transform:uppercase;color:#deab3b;">/ Nueva reserva /</p>
          <h1 style="margin:8px 0 0;font-family:Georgia,serif;font-weight:400;font-size:24px;color:#f9f2e0;">${escapeHtml(TYPE_LABEL[b.eventType])} · ${escapeHtml(b.name)}</h1>
          <p style="margin:6px 0 0;font-size:14px;color:rgba(249,242,224,.7);">${escapeHtml(dateLabel)} · ${b.guests} invitados</p>
        </div>
        <div style="padding:24px 28px;">
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <tr><td style="padding:6px 0;color:rgba(249,242,224,.55);width:110px;">Email</td><td style="padding:6px 0;"><a style="color:#deab3b;text-decoration:none;" href="mailto:${escapeHtml(b.email)}">${escapeHtml(b.email)}</a></td></tr>
            <tr><td style="padding:6px 0;color:rgba(249,242,224,.55);">Teléfono</td><td style="padding:6px 0;"><a style="color:#deab3b;text-decoration:none;" href="tel:${escapeHtml(b.phone)}">${escapeHtml(b.phone)}</a> · <a style="color:rgba(222,171,59,.7);text-decoration:none;" href="${whatsappLink}" target="_blank">WhatsApp</a></td></tr>
            <tr><td style="padding:6px 0;color:rgba(249,242,224,.55);">Tipo</td><td style="padding:6px 0;">${escapeHtml(TYPE_LABEL[b.eventType])}</td></tr>
            <tr><td style="padding:6px 0;color:rgba(249,242,224,.55);">Fecha</td><td style="padding:6px 0;">${escapeHtml(dateLabel)}</td></tr>
            <tr><td style="padding:6px 0;color:rgba(249,242,224,.55);">Invitados</td><td style="padding:6px 0;">${b.guests}</td></tr>
          </table>
          ${
            b.message
              ? `<div style="margin-top:20px;padding:16px;background:rgba(13,13,13,.6);border:1px solid rgba(249,242,224,.08);border-radius:10px;">
                  <p style="margin:0 0 6px;font-size:11px;letter-spacing:.28em;text-transform:uppercase;color:rgba(249,242,224,.5);">Mensaje</p>
                  <p style="margin:0;white-space:pre-wrap;line-height:1.55;color:rgba(249,242,224,.92);">${escapeHtml(b.message)}</p>
                </div>`
              : ""
          }
        </div>
        <div style="padding:16px 28px;border-top:1px solid rgba(249,242,224,.08);font-size:12px;color:rgba(249,242,224,.45);">
          ID ${escapeHtml(b.id)} · Gestiona en <span style="color:#deab3b;">/admin/bookings</span>
        </div>
      </div>
    </div>
  `;

  const resend = new Resend(apiKey);
  try {
    const r = await resend.emails.send({
      from,
      to,
      replyTo: b.email,
      subject,
      text,
      html,
    });
    if (r.error) {
      console.error("[booking] resend error", r.error);
      return { sent: false, reason: "send_failed" as const };
    }
    return { sent: true };
  } catch (e) {
    console.error("[booking] resend exception", e);
    return { sent: false, reason: "exception" as const };
  }
}

/**
 * Sends a notification email when someone reserves a spot on an event
 * waitlist. On serverless hosts (Vercel) the JSON store is ephemeral, so this
 * email is the durable record of the reservation. Throws on failure so the
 * caller can decide whether the request still succeeded.
 */
export async function sendWaitlistNotification(w: WaitlistEntry) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[waitlist] RESEND_API_KEY not set — skipping email");
    return { sent: false, reason: "no_api_key" as const };
  }

  const from = process.env.BOOKING_FROM || "Lunin <onboarding@resend.dev>";
  const to = (process.env.BOOKING_TO || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (to.length === 0) {
    console.warn("[waitlist] BOOKING_TO not set — skipping email");
    return { sent: false, reason: "no_recipient" as const };
  }

  const subject = `Reserva waitlist · ${w.eventTitle} · ${w.name} (${w.guests} pax)`;
  const whatsappLink = `https://wa.me/${w.phone.replace(/[^\d]/g, "")}`;

  const text = [
    `Nueva reserva de plaza (waitlist) en Lunin Cocktail Bar`,
    ``,
    `Evento:    ${w.eventTitle}`,
    `Personas:  ${w.guests}`,
    ``,
    `Nombre:    ${w.name}`,
    `Teléfono:  ${w.phone}`,
    w.email ? `Email:     ${w.email}` : `Email:     —`,
    ``,
    `--`,
    `ID: ${w.id}`,
    `Recibido: ${new Date(w.createdAt).toLocaleString("es-ES")}`,
  ].join("\n");

  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#0d0d0d;padding:32px 16px;color:#f9f2e0;">
      <div style="max-width:560px;margin:0 auto;background:#161616;border:1px solid rgba(222,171,59,.25);border-radius:16px;overflow:hidden;">
        <div style="background:linear-gradient(180deg,#1f1f1f,#0d0d0d);padding:24px 28px;border-bottom:1px solid rgba(249,242,224,.08);">
          <p style="margin:0;font-size:11px;letter-spacing:.34em;text-transform:uppercase;color:#deab3b;">/ Reserva waitlist /</p>
          <h1 style="margin:8px 0 0;font-family:Georgia,serif;font-weight:400;font-size:24px;color:#f9f2e0;">${escapeHtml(w.eventTitle)}</h1>
          <p style="margin:6px 0 0;font-size:14px;color:rgba(249,242,224,.7);">${escapeHtml(w.name)} · ${w.guests} personas</p>
        </div>
        <div style="padding:24px 28px;">
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <tr><td style="padding:6px 0;color:rgba(249,242,224,.55);width:110px;">Teléfono</td><td style="padding:6px 0;"><a style="color:#deab3b;text-decoration:none;" href="tel:${escapeHtml(w.phone)}">${escapeHtml(w.phone)}</a> · <a style="color:rgba(222,171,59,.7);text-decoration:none;" href="${whatsappLink}" target="_blank">WhatsApp</a></td></tr>
            ${
              w.email
                ? `<tr><td style="padding:6px 0;color:rgba(249,242,224,.55);">Email</td><td style="padding:6px 0;"><a style="color:#deab3b;text-decoration:none;" href="mailto:${escapeHtml(w.email)}">${escapeHtml(w.email)}</a></td></tr>`
                : ""
            }
            <tr><td style="padding:6px 0;color:rgba(249,242,224,.55);">Personas</td><td style="padding:6px 0;">${w.guests}</td></tr>
            <tr><td style="padding:6px 0;color:rgba(249,242,224,.55);">Evento</td><td style="padding:6px 0;">${escapeHtml(w.eventTitle)}</td></tr>
          </table>
        </div>
        <div style="padding:16px 28px;border-top:1px solid rgba(249,242,224,.08);font-size:12px;color:rgba(249,242,224,.45);">
          ID ${escapeHtml(w.id)} · Gestiona en <span style="color:#deab3b;">/admin/waitlist</span>
        </div>
      </div>
    </div>
  `;

  const resend = new Resend(apiKey);
  const r = await resend.emails.send({
    from,
    to,
    replyTo: w.email,
    subject,
    text,
    html,
  });
  if (r.error) {
    console.error("[waitlist] resend error", r.error);
    throw new Error("waitlist_email_failed");
  }
  return { sent: true };
}
