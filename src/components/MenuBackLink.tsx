"use client";

import Link from "next/link";
import { useT } from "./LanguageProvider";

export function MenuBackLink() {
  const t = useT();
  return (
    <Link href="/menu" className="btn-ghost">
      {t("menu.back_short")}
    </Link>
  );
}
