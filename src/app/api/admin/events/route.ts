import { NextResponse } from "next/server";
import { Store } from "../../../../lib/store";
import type { EventItem } from "../../../../lib/types";
import { isAdmin } from "../../../../lib/auth";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const items = await Store.getEvents();
  return NextResponse.json({ items });
}

export async function PUT(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = (await req.json().catch(() => null)) as { items?: EventItem[] } | null;
  if (!body || !Array.isArray(body.items)) {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }
  await Store.saveEvents(body.items);
  return NextResponse.json({ ok: true });
}
