"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={async () => {
        await fetch("/api/admin/login", { method: "DELETE" });
        router.replace("/admin/login");
        router.refresh();
      }}
      className="text-[0.72rem] tracking-[0.28em] uppercase font-headline text-lunin-cream/60 hover:text-lunin-gold"
    >
      Salir
    </button>
  );
}
