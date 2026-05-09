import { NextResponse } from "next/server";
import { checkPassword, setAdminCookie, clearAdminCookie } from "../../../../lib/auth";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { password?: string };
  if (!checkPassword(body.password ?? "")) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 401 });
  }
  await setAdminCookie();
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  await clearAdminCookie();
  return NextResponse.json({ ok: true });
}
