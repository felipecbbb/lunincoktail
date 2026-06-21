import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { isAdmin } from "../../../lib/auth";
import { LogoutButton } from "../_components/LogoutButton";

export default async function AuthedAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const ok = await isAdmin();
  if (!ok) redirect("/admin/login");

  return (
    <div className="min-h-screen flex flex-col bg-lunin-black text-lunin-cream">
      <header className="sticky top-0 z-30 bg-lunin-black/85 backdrop-blur border-b border-lunin-cream/10">
        <div className="max-w-6xl mx-auto px-5 md:px-10 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="lunin-wordmark text-lg text-lunin-cream">
              LUNIN
            </Link>
            <nav className="hidden sm:flex gap-5 text-[0.72rem] tracking-[0.28em] uppercase font-headline text-lunin-cream/70">
              <Link href="/admin" className="hover:text-lunin-gold">Inicio</Link>
              <Link href="/admin/menu" className="hover:text-lunin-gold">Carta</Link>
              <Link href="/admin/events" className="hover:text-lunin-gold">Eventos</Link>
              <Link href="/admin/waitlist" className="hover:text-lunin-gold">Reservas</Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-[0.72rem] tracking-[0.28em] uppercase font-headline text-lunin-cream/60 hover:text-lunin-gold"
            >
              Ver web
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-6xl mx-auto w-full px-5 md:px-10 py-8">
        {children}
      </main>
    </div>
  );
}
