import { cookies } from "next/headers";

const COOKIE_NAME = "lunin_admin";
const ADMIN_PASSWORD = process.env.LUNIN_ADMIN_PASSWORD ?? "lunin2026";
const SESSION_TOKEN = process.env.LUNIN_ADMIN_TOKEN ?? "lunin-admin-session";

export function checkPassword(input: string): boolean {
  return typeof input === "string" && input.length > 0 && input === ADMIN_PASSWORD;
}

export async function isAdmin(): Promise<boolean> {
  const c = await cookies();
  return c.get(COOKIE_NAME)?.value === SESSION_TOKEN;
}

export async function setAdminCookie(): Promise<void> {
  const c = await cookies();
  c.set(COOKIE_NAME, SESSION_TOKEN, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    secure: process.env.NODE_ENV === "production",
  });
}

export async function clearAdminCookie(): Promise<void> {
  const c = await cookies();
  c.delete(COOKIE_NAME);
}
