import { NextResponse } from "next/server";
import { Store } from "../../../../lib/store";
import type { BookingRequest } from "../../../../lib/types";
import { isAdmin } from "../../../../lib/auth";

const VALID_STATUS: BookingRequest["status"][] = [
  "new",
  "contacted",
  "confirmed",
  "declined",
];

export async function GET() {
  if (!(await isAdmin()))
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json({ items: await Store.getBookings() });
}

export async function PATCH(req: Request) {
  if (!(await isAdmin()))
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = (await req.json().catch(() => null)) as
    | { id?: string; status?: string }
    | null;
  if (!body?.id) return NextResponse.json({ error: "missing_id" }, { status: 400 });
  if (
    !body.status ||
    !VALID_STATUS.includes(body.status as BookingRequest["status"])
  ) {
    return NextResponse.json({ error: "invalid_status" }, { status: 400 });
  }
  const items = await Store.getBookings();
  const idx = items.findIndex((b) => b.id === body.id);
  if (idx < 0) return NextResponse.json({ error: "not_found" }, { status: 404 });
  items[idx] = { ...items[idx], status: body.status as BookingRequest["status"] };
  await Store.saveBookings(items);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  if (!(await isAdmin()))
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = (await req.json().catch(() => null)) as { id?: string } | null;
  if (!body?.id) return NextResponse.json({ error: "missing_id" }, { status: 400 });
  const items = (await Store.getBookings()).filter((b) => b.id !== body.id);
  await Store.saveBookings(items);
  return NextResponse.json({ ok: true });
}
