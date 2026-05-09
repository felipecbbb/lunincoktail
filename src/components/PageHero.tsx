"use client";

import Image from "next/image";
import { useT } from "./LanguageProvider";

type Props = {
  imageSrc: string;
  imageAlt?: string;
  kicker?: string;
  /** Translation key for title; if not provided, use rawTitle */
  titleKey?: string;
  rawTitle?: string;
  leadKey?: string;
  rawLead?: string;
  height?: "sm" | "md" | "lg";
  align?: "left" | "center";
  /** Vertical position of the photo focus, e.g. 'center 30%' */
  objectPosition?: string;
  /** Children render below the lead */
  children?: React.ReactNode;
};

const heights = {
  sm: "min-h-[42svh] md:min-h-[44svh]",
  md: "min-h-[58svh] md:min-h-[62svh]",
  lg: "min-h-[78svh] md:min-h-[82svh]",
};

export function PageHero({
  imageSrc,
  imageAlt = "",
  kicker,
  titleKey,
  rawTitle,
  leadKey,
  rawLead,
  height = "md",
  align = "left",
  objectPosition = "center",
  children,
}: Props) {
  const t = useT();
  const title = titleKey ? t(titleKey) : rawTitle ?? "";
  const lead = leadKey ? t(leadKey) : rawLead;
  const alignCls = align === "center" ? "text-center mx-auto items-center" : "items-start";
  return (
    <section className={`relative isolate overflow-hidden border-b border-lunin-cream/10 ${heights[height]}`}>
      <div className="absolute inset-0 -z-10">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(13,13,13,0.55) 0%, rgba(13,13,13,0.30) 30%, rgba(13,13,13,0.65) 75%, rgba(13,13,13,0.96) 100%)",
          }}
        />
      </div>

      <div
        className={`mx-auto max-w-6xl px-5 md:px-10 pt-24 md:pt-32 pb-16 md:pb-24 flex flex-col justify-end h-full ${heights[height]} ${alignCls}`}
      >
        {kicker && (
          <p
            className="font-headline uppercase text-[0.7rem] tracking-[0.42em] text-lunin-gold fade-up"
            style={{ animationDelay: "0.05s" }}
          >
            /{kicker}
          </p>
        )}
        <h1
          className={
            "mt-4 font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-lunin-cream leading-[1.02] fade-up " +
            (align === "center" ? "max-w-3xl" : "max-w-4xl")
          }
          style={{ animationDelay: "0.15s" }}
        >
          {title}
        </h1>
        {lead && (
          <p
            className={
              "mt-5 text-base md:text-lg text-lunin-cream/75 leading-relaxed fade-up " +
              (align === "center" ? "max-w-xl" : "max-w-xl")
            }
            style={{ animationDelay: "0.25s" }}
          >
            {lead}
          </p>
        )}
        <span
          aria-hidden="true"
          className={`block mt-8 w-32 hairline fade-up ${align === "center" ? "mx-auto" : ""}`}
          style={{ animationDelay: "0.35s" }}
        />
        {children && (
          <div className="mt-7 fade-up" style={{ animationDelay: "0.45s" }}>
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
