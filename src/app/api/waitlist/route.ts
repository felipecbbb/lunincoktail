import { NextResponse } from "next/server";
import { Store } from "../../../lib/store";
import { sendWaitlistNotification } from "../../../lib/email";
import type { WaitlistEntry } from "../../../lib/types";

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const email = String(body.email ?? "").trim();
  const eventId = String(body.eventId ?? "").trim().slice(0, 80);
  const eventTitle = String(body.eventTitle ?? "").trim().slice(0, 160) || "Evento Lunin";
  const guestsRaw = Number(body.guests);
  const honeypot = String(body.website ?? "");

  if (honeypot.length > 0) {
    // bot caught — pretend success
    return NextResponse.json({ ok: true });
  }

  if (name.length < 2 || name.length > 80) {
    return NextResponse.json({ error: "invalid_name" }, { status: 400 });
  }
  if (phone.length < 6 || phone.length > 30) {
    return NextResponse.json({ error: "invalid_phone" }, { status: 400 });
  }
  const guests = Number.isFinite(guestsRaw) ? Math.round(guestsRaw) : 1;
  if (guests < 1 || guests > 50) {
    return NextResponse.json({ error: "invalid_guests" }, { status: 400 });
  }

  const entry: WaitlistEntry = {
    id: `wl-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
    status: "new",
    eventId: eventId || "unknown",
    eventTitle,
    name,
    phone,
    email: email || undefined,
    guests,
  };

  // Two channels: the JSON store (visible in /admin, but ephemeral on
  // serverless hosts) and email (durable). Try both; succeed if either works
  // so a reservation is never silently lost.
  let stored = false;
  let emailed = false;
  try {
    await Store.addWaitlist(entry);
    stored = true;
  } catch (e) {
    console.error("[waitlist] store error", e);
  }
  try {
    await sendWaitlistNotification(entry);
    emailed = true;
  } catch (e) {
    console.error("[waitlist] email error", e);
  }

  if (!stored && !emailed) {
    return NextResponse.json({ error: "not_saved" }, { status: 500 });
  }
  return NextResponse.json({ ok: true, id: entry.id });
}
