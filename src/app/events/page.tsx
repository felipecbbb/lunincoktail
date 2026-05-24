import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { SocialFAB } from "../../components/SocialFAB";
import { PageHero } from "../../components/PageHero";
import { BookingForm } from "./_components/BookingForm";
import { SITE as site } from "../../lib/site";

export const metadata: Metadata = {
  title: "Eventos privados",
  description:
    "Reserva Lunin Cocktail Bar para tu cumpleaños, despedida, evento corporativo o fiesta privada. Cócteles de autor, ambiente íntimo y servicio a medida.",
};

const HIGHLIGHTS: { kicker: string; title: string; body: string }[] = [
  {
    kicker: "Aforo",
    title: "Hasta 60 personas",
    body: "El local entero o solo una zona reservada según la ocasión.",
  },
  {
    kicker: "Cócteles",
    title: "Coctelería de autor",
    body: "Carta a medida con destilados craft Lunin elaborada con tu bartender.",
  },
  {
    kicker: "Servicio",
    title: "Personal dedicado",
    body: "Equipo exclusivo para tu grupo, horario flexible y catering opcional.",
  },
];

export default function EventsPage() {
  return (
    <>
      <Header variant="menu" />
      <main className="flex-1">
        <PageHero
          imageSrc="/images/brand/horilka-4.jpg"
          imageAlt="Lunin Cocktail Bar — eventos privados"
          kicker="Eventos privados"
          titleKey="events.private.title"
          leadKey="events.private.lead"
          height="md"
          objectPosition="center"
        />

        <section className="mx-auto max-w-6xl px-5 md:px-10 py-14 md:py-20">
          {/* Intro / value props */}
          <div className="grid gap-4 sm:grid-cols-3 mb-14 md:mb-16">
            {HIGHLIGHTS.map((h) => (
              <div
                key={h.title}
                className="rounded-2xl border border-lunin-cream/10 bg-lunin-charcoal/40 p-5"
              >
                <p className="font-headline uppercase text-[0.62rem] tracking-[0.34em] text-lunin-gold/80">
                  / {h.kicker} /
                </p>
                <h3 className="mt-3 font-display text-xl text-lunin-cream leading-tight">
                  {h.title}
                </h3>
                <p className="mt-2 text-[0.85rem] text-lunin-cream/65 leading-relaxed">
                  {h.body}
                </p>
              </div>
            ))}
          </div>

          <span aria-hidden className="block mx-auto w-32 hairline" />

          {/* Form + sidebar with contact alternatives */}
          <div className="mt-14 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
            <BookingForm />
            <aside className="space-y-6">
              <div className="rounded-2xl border border-lunin-cream/10 bg-lunin-charcoal/40 p-6">
                <p className="font-headline uppercase text-[0.62rem] tracking-[0.34em] text-lunin-gold/80">
                  / Contacto directo /
                </p>
                <h3 className="mt-3 font-display text-xl text-lunin-cream">
                  ¿Prefieres hablar?
                </h3>
                <p className="mt-2 text-[0.85rem] text-lunin-cream/60 leading-relaxed">
                  Si necesitas algo urgente o quieres organizar los detalles por
                  voz, contacta directamente con el bar.
                </p>
                <div className="mt-5 space-y-3">
                  <a
                    href={`tel:${site.contact.phoneE164}`}
                    className="flex items-center gap-3 text-lunin-cream hover:text-lunin-gold transition"
                  >
                    <span className="grid place-items-center h-9 w-9 rounded-full border border-lunin-cream/15">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z" />
                      </svg>
                    </span>
                    <span className="text-sm">{site.contact.phone}</span>
                  </a>
                  <a
                    href={`https://wa.me/${site.contact.phoneE164.replace(/[^\d]/g, "")}?text=${encodeURIComponent(
                      "Hola Lunin, me gustaría reservar el local para un evento.",
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-lunin-cream hover:text-lunin-gold transition"
                  >
                    <span className="grid place-items-center h-9 w-9 rounded-full border border-lunin-cream/15">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.52 3.48A11.93 11.93 0 0 0 12 0C5.4 0 .03 5.37.03 12c0 2.11.55 4.17 1.6 5.98L0 24l6.16-1.62A11.96 11.96 0 0 0 12 24c6.6 0 11.97-5.37 11.97-12 0-3.19-1.24-6.19-3.45-8.52ZM12 21.82c-1.83 0-3.62-.49-5.19-1.42l-.37-.22-3.66.96.98-3.57-.24-.37A9.83 9.83 0 0 1 2.2 12C2.2 6.59 6.59 2.2 12 2.2c2.61 0 5.07 1.02 6.92 2.87a9.78 9.78 0 0 1 2.87 6.93c0 5.41-4.4 9.82-9.79 9.82Zm5.36-7.36c-.29-.15-1.74-.86-2.01-.96-.27-.1-.47-.15-.66.15-.2.29-.76.96-.93 1.16-.17.2-.34.22-.63.07-.29-.15-1.23-.45-2.34-1.44-.86-.77-1.45-1.72-1.62-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.51.15-.17.2-.29.29-.49.1-.2.05-.37-.02-.51-.07-.15-.66-1.6-.91-2.18-.24-.58-.49-.5-.66-.51l-.56-.01c-.2 0-.51.07-.78.37s-1.02.99-1.02 2.42c0 1.43 1.04 2.81 1.19 3.01.15.2 2.05 3.13 4.96 4.38.69.3 1.23.48 1.66.61.7.22 1.34.19 1.84.12.56-.08 1.74-.71 1.99-1.4.24-.69.24-1.27.17-1.4-.07-.13-.27-.2-.56-.34Z" />
                      </svg>
                    </span>
                    <span className="text-sm">WhatsApp</span>
                  </a>
                  <a
                    href={`mailto:${site.contact.email}`}
                    className="flex items-center gap-3 text-lunin-cream hover:text-lunin-gold transition"
                  >
                    <span className="grid place-items-center h-9 w-9 rounded-full border border-lunin-cream/15">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                        <rect x="3" y="5" width="18" height="14" rx="2" />
                        <path d="m4 7 8 6 8-6" />
                      </svg>
                    </span>
                    <span className="text-sm break-all">{site.contact.email}</span>
                  </a>
                </div>
              </div>

              <div className="rounded-2xl border border-lunin-cream/10 bg-lunin-charcoal/40 p-6">
                <p className="font-headline uppercase text-[0.62rem] tracking-[0.34em] text-lunin-gold/80">
                  / Antes de venir /
                </p>
                <h3 className="mt-3 font-display text-xl text-lunin-cream">
                  Echa un vistazo a la carta
                </h3>
                <p className="mt-2 text-[0.85rem] text-lunin-cream/60 leading-relaxed">
                  Diseñamos la coctelería de tu evento partiendo de nuestra
                  carta de autor.
                </p>
                <Link
                  href="/menu"
                  className="mt-4 inline-flex items-center gap-2 text-[0.72rem] font-headline tracking-[0.22em] uppercase text-lunin-gold hover:text-lunin-gold-bright transition"
                >
                  Ver carta
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M5 12h14" strokeLinecap="round" />
                    <path d="m13 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
            </aside>
          </div>
        </section>
      </main>
      <SocialFAB />
      <Footer />
    </>
  );
}
