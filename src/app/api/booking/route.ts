import { NextResponse } from "next/server";
import { Store } from "../../../lib/store";
import { sendBookingNotification } from "../../../lib/email";
import type { BookingRequest } from "../../../lib/types";

const VALID_TYPES = [
  "cumpleanos",
  "despedida",
  "corporativo",
  "privado",
  "catering",
  "otro",
] as const;

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const eventType = String(body.eventType ?? "").trim();
  const date = String(body.date ?? "").trim();
  const guestsRaw = Number(body.guests);
  const message = String(body.message ?? "").trim().slice(0, 1000);
  const honeypot = String(body.website ?? "");

  if (honeypot.length > 0) {
    // bot caught — pretend success
    return NextResponse.json({ ok: true });
  }

  if (name.length < 2 || name.length > 80) {
    return NextResponse.json({ error: "invalid_name" }, { status: 400 });
  }
  if (!isEmail(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }
  if (phone.length < 6 || phone.length > 30) {
    return NextResponse.json({ error: "invalid_phone" }, { status: 400 });
  }
  if (!VALID_TYPES.includes(eventType as (typeof VALID_TYPES)[number])) {
    return NextResponse.json({ error: "invalid_type" }, { status: 400 });
  }
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "invalid_date" }, { status: 400 });
  }
  if (!Number.isFinite(guestsRaw) || guestsRaw < 1 || guestsRaw > 500) {
    return NextResponse.json({ error: "invalid_guests" }, { status: 400 });
  }

  const booking: BookingRequest = {
    id: `bk-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
    status: "new",
    eventType: eventType as BookingRequest["eventType"],
    date,
    guests: Math.round(guestsRaw),
    name,
    email,
    phone,
    message: message || undefined,
  };

  await Store.addBooking(booking);
  // Fire-and-forget email — the request succeeds even if email fails.
  sendBookingNotification(booking).catch((e) =>
    console.error("[booking] notification error", e),
  );
  return NextResponse.json({ ok: true, id: booking.id });
}
