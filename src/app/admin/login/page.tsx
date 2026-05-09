"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  // No SSR redirect needed: if cookie is set the dashboard works normally.
  // Submitting again from here just rewrites the cookie.
  const router = useRouter();
  const [pwd, setPwd] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pwd }),
    });
    setLoading(false);
    if (res.ok) {
      router.replace("/admin");
      router.refresh();
    } else {
      setError("Contraseña incorrecta.");
    }
  }

  return (
    <main className="min-h-screen grid place-items-center bg-lunin-black px-6">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-3xl border border-lunin-cream/10 bg-lunin-charcoal/70 p-8 backdrop-blur"
      >
        <p className="lunin-wordmark text-3xl text-lunin-cream text-center">LUNIN</p>
        <p className="mt-2 text-center text-[0.7rem] tracking-[0.36em] uppercase font-headline text-lunin-cream/55">
          Admin · Cocktail Bar
        </p>
        <span aria-hidden className="block mt-6 mx-auto w-20 hairline" />
        <label className="mt-8 block">
          <span className="block text-[0.7rem] uppercase tracking-[0.32em] font-headline text-lunin-gold/80">
            Contraseña
          </span>
          <input
            type="password"
            autoFocus
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            className="mt-2 w-full rounded-xl bg-lunin-black border border-lunin-cream/15 px-4 py-3 text-lunin-cream focus:border-lunin-gold/60 focus:outline-none"
          />
        </label>
        {error && <p className="mt-3 text-sm text-rose-300">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary mt-6 w-full disabled:opacity-60"
        >
          {loading ? "…" : "Entrar"}
        </button>
        <p className="mt-6 text-center text-xs text-lunin-cream/40">
          Establece <code className="text-lunin-gold/80">LUNIN_ADMIN_PASSWORD</code> en .env.local
        </p>
      </form>
    </main>
  );
}
