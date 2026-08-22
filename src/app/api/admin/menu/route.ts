import { NextResponse } from "next/server";
import { Store } from "../../../../lib/store";
import type { Category, MenuItem } from "../../../../lib/types";
import { isAdmin } from "../../../../lib/auth";
import { CONTENT_READONLY } from "../../../../lib/content-editing";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const [categories, items] = await Promise.all([Store.getCategories(), Store.getMenu()]);
  return NextResponse.json({ categories, items });
}

export async function PUT(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (CONTENT_READONLY) {
    return NextResponse.json(
      {
        error: "content_readonly",
        message:
          "La edicion desde el panel no esta disponible. Avisa a Felipe para hacer el cambio.",
      },
      { status: 503 },
    );
  }
  const body = (await req.json().catch(() => null)) as
    | { categories?: Category[]; items?: MenuItem[] }
    | null;
  if (!body) return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  if (Array.isArray(body.categories)) await Store.saveCategories(body.categories);
  if (Array.isArray(body.items)) await Store.saveMenu(body.items);
  return NextResponse.json({ ok: true });
}
