"use client";

import { LANGS } from "../lib/i18n";
import { useLang } from "./LanguageProvider";

export function LanguageSwitcher({
  variant = "default",
}: {
  variant?: "default" | "minimal";
}) {
  const { lang, setLang } = useLang();
  return (
    <div
      role="group"
      aria-label="Language"
      className={
        variant === "minimal"
          ? "inline-flex items-center gap-1 text-[0.7rem] font-headline uppercase tracking-[0.28em]"
          : "inline-flex items-center gap-1 rounded-full border border-lunin-cream/15 px-1 py-1 backdrop-blur-sm"
      }
    >
      {LANGS.map((l) => (
        <button
          key={l.code}
          type="button"
          onClick={() => setLang(l.code)}
          aria-pressed={lang === l.code}
          className={
            "px-2.5 py-1 rounded-full font-headline text-[0.7rem] uppercase tracking-[0.28em] transition " +
            (lang === l.code
              ? "bg-lunin-gold text-lunin-black"
              : "text-lunin-cream/70 hover:text-lunin-cream")
          }
        >
          {l.short}
        </button>
      ))}
    </div>
  );
}
