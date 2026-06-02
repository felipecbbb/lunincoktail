import Link from "next/link";
import Image from "next/image";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Logo } from "../components/Logo";
import { MenuItemCard } from "../components/MenuItemCard";
import { SocialFAB } from "../components/SocialFAB";
import { Store } from "../lib/store";
import { SectionHeader } from "./_components/SectionHeader";
import {
  HomeHero,
  HeroKicker,
  ViewAllText,
  VisitInfo,
} from "./_components/HomeText";
import { OriginSection } from "./_components/OriginSection";

export default async function Home() {
  const menu = await Store.getMenu();
  const signature = menu.filter((m) => m.enabled && m.signature).slice(0, 3);

  return (
    <>
      <Header />

      {/* Hero */}
      <section className="relative isolate overflow-hidden min-h-[92svh] flex items-end">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/brand/apple-horilka.jpg"
            alt="Lunin"
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: "center 30%" }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(13,13,13,0.50) 0%, rgba(13,13,13,0.20) 30%, rgba(13,13,13,0.55) 60%, rgba(13,13,13,0.92) 92%, rgba(13,13,13,1) 100%)",
            }}
          />
        </div>

        {/* Top brand mark — large LUNIN wordmark in upper area */}
        <div className="absolute inset-x-0 top-0 pt-28 md:pt-32 z-[1] pointer-events-none">
          <div className="mx-auto max-w-6xl px-5 md:px-10 text-center">
            <p
              className="font-headline uppercase text-[0.7rem] tracking-[0.42em] text-lunin-gold/85 fade-up"
              style={{ animationDelay: "0.05s" }}
            >
              <HeroKicker />
            </p>
            <div className="mt-5 fade-up" style={{ animationDelay: "0.15s" }}>
              <Logo size="xl" href={null} withTagline />
            </div>
          </div>
        </div>

        {/* Bottom CTA block */}
        <div className="relative z-[1] mx-auto max-w-6xl w-full px-5 md:px-10 pb-20 md:pb-28">
          <HomeHero />
        </div>
      </section>

      {/* Origin / 4 fruits */}
      <OriginSection />

      {/* Signature cocktails */}
      <section id="signature" className="relative">
        <div className="mx-auto max-w-6xl px-5 md:px-10 py-20 md:py-24 border-t border-lunin-cream/10">
          <SectionHeader
            kicker="signature"
            titleKey="home.sec_signature"
            leadKey="home.sec_signature_lead"
          />

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {signature.map((item) => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <Link href="/menu" className="btn-primary">
              <ViewAllText />
            </Link>
          </div>
        </div>
      </section>

      {/* Visit / contact */}
      <section id="visit" className="relative">
        <div className="mx-auto max-w-6xl px-5 md:px-10 py-20 md:py-24 border-t border-lunin-cream/10 grid gap-12 md:grid-cols-2 items-center">
          <div>
            <SectionHeader kicker="visit" titleKey="home.sec_visit" leadKey="home.sec_visit_lead" />
            <VisitInfo />
          </div>
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-lunin-cream/10 shadow-[0_30px_60px_-25px_rgba(0,0,0,0.85)]">
            <Image
              src="/images/menu/espresso-martini.jpg"
              alt="Lunin Cocktail Bar — atmósfera"
              fill
              sizes="(min-width: 768px) 45vw, 90vw"
              className="object-cover"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(13,13,13,0.0) 50%, rgba(13,13,13,0.6) 100%)",
              }}
            />
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
              <p className="lunin-wordmark text-2xl text-lunin-cream">LUNIN</p>
              <span className="font-headline text-[0.65rem] tracking-[0.32em] uppercase text-lunin-cream/65">
                Cocktail Bar
              </span>
            </div>
          </div>
        </div>
      </section>

      <SocialFAB />
      <Footer />
    </>
  );
}
