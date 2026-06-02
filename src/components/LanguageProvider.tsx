"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { dict, type Lang } from "../lib/i18n";

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (path: string) => string;
};

const LanguageContext = createContext<Ctx | null>(null);

const STORAGE_KEY = "lunin_lang";

function detectInitial(): Lang {
  if (typeof window === "undefined") return "es";
  const saved = window.localStorage.getItem(STORAGE_KEY) as Lang | null;
  if (saved === "es" || saved === "en" || saved === "uk") return saved;
  const url = new URL(window.location.href);
  const q = url.searchParams.get("lang");
  if (q === "es" || q === "en" || q === "uk") return q;
  const browser = navigator.language?.toLowerCase() ?? "";
  if (browser.startsWith("uk")) return "uk";
  if (browser.startsWith("en")) return "en";
  return "es";
}

export function LanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lang, setLangState] = useState<Lang>("es");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setLangState(detectInitial());
    setReady(true);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, l);
      document.documentElement.lang = l;
    }
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") document.documentElement.lang = lang;
  }, [lang]);

  const t = useCallback(
    (pathExpr: string) => {
      const parts = pathExpr.split(".");
      let cur: unknown = dict[lang];
      for (const p of parts) {
        if (cur && typeof cur === "object" && p in (cur as Record<string, unknown>)) {
          cur = (cur as Record<string, unknown>)[p];
        } else {
          return pathExpr;
        }
      }
      return typeof cur === "string" ? cur : pathExpr;
    },
    [lang],
  );

  const value = useMemo<Ctx>(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return (
    <LanguageContext.Provider value={value}>
      <div style={{ visibility: ready ? "visible" : "hidden" }}>{children}</div>
    </LanguageContext.Provider>
  );
}

export function useLang(): Ctx {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}

export function useT() {
  return useLang().t;
}

export function useTranslated() {
  const { lang } = useLang();
  return (
    obj: { es: string; en?: string; uk?: string } | undefined,
  ): string => {
    if (!obj) return "";
    if (lang === "uk" && obj.uk && obj.uk.length > 0) return obj.uk;
    if (lang === "en" && obj.en && obj.en.length > 0) return obj.en;
    return obj.es;
  };
}
