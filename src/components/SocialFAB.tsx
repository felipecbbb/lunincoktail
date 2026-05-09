"use client";

import { SITE } from "../lib/site";
import { useT } from "./LanguageProvider";

export function SocialFAB() {
  const t = useT();
  return (
    <div className="fixed bottom-5 right-5 z-30 flex flex-col gap-3 safe-bottom">
      <a
        href={`https://wa.me/${SITE.contact.whatsapp.replace(/[^0-9]/g, "")}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t("contact.whatsapp")}
        className="h-12 w-12 grid place-items-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/40 hover:scale-105 transition"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M19.07 4.93A10 10 0 0 0 4.4 18.4L3 21l2.7-1.4a10 10 0 0 0 13.37-14.67ZM12 19.5a7.5 7.5 0 0 1-3.83-1l-.27-.16-2.05 1.05.55-2.13-.18-.28A7.5 7.5 0 1 1 12 19.5Zm4.36-5.6c-.24-.12-1.42-.7-1.64-.78s-.38-.12-.54.12-.62.78-.76.94-.28.18-.52.06a6.13 6.13 0 0 1-1.8-1.12 6.78 6.78 0 0 1-1.25-1.55c-.13-.23 0-.36.11-.48s.24-.28.36-.42a1.65 1.65 0 0 0 .24-.4.46.46 0 0 0 0-.43c-.06-.12-.54-1.3-.74-1.78s-.39-.4-.54-.4h-.46a.89.89 0 0 0-.64.3 2.69 2.69 0 0 0-.84 2c0 1.18.86 2.32.98 2.48a9.78 9.78 0 0 0 4.04 3.5c.56.24 1 .38 1.34.48a3.24 3.24 0 0 0 1.48.1 2.41 2.41 0 0 0 1.58-1.12 1.95 1.95 0 0 0 .14-1.12c-.06-.1-.22-.16-.46-.28Z" />
        </svg>
      </a>
      <a
        href={`tel:${SITE.contact.phoneE164}`}
        aria-label={t("contact.call")}
        className="h-12 w-12 grid place-items-center rounded-full bg-lunin-gold text-lunin-black shadow-lg shadow-black/40 hover:scale-105 transition"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </div>
  );
}
