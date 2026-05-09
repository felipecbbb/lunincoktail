import type { Metadata } from "next";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { EventCard } from "../../components/EventCard";
import { SocialFAB } from "../../components/SocialFAB";
import { PageHero } from "../../components/PageHero";
import { Store } from "../../lib/store";

export const metadata: Metadata = {
  title: "Eventos",
  description: "Próximas DJ nights, catas y noches especiales en Lunin Cocktail Bar.",
};

export default async function EventsPage() {
  const items = await Store.getEvents();
  const upcoming = items
    .filter((e) => e.enabled)
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <>
      <Header variant="menu" />
      <main className="flex-1">
        <PageHero
          imageSrc="/images/brand/horilka-4.jpg"
          imageAlt="Lunin events"
          kicker="Agenda"
          titleKey="events.title"
          leadKey="events.lead"
          height="md"
          objectPosition="center"
        />
        <section className="mx-auto max-w-6xl px-5 md:px-10 py-16 md:py-20">
          {upcoming.length === 0 ? (
            <p className="text-center text-lunin-cream/60 py-12">
              Próximamente.
            </p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
          )}
        </section>
      </main>
      <SocialFAB />
      <Footer />
    </>
  );
}
