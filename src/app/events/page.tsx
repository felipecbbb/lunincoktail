import type { Metadata } from "next";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { SocialFAB } from "../../components/SocialFAB";
import { PageHero } from "../../components/PageHero";
import { EventsContent } from "./_components/EventsContent";

export const metadata: Metadata = {
  title: "Eventos privados y reservas",
  description:
    "Reserva Lunin Cocktail Bar en Russafa (Valencia) para tu cumpleaños, despedida, evento corporativo o fiesta privada. Coctelería de autor, ambiente íntimo y servicio a medida. Hasta 60 personas.",
  alternates: { canonical: "/events" },
};

export default function EventsPage() {
  return (
    <>
      <Header variant="menu" />
      <main className="flex-1">
        <PageHero
          imageSrc="/images/brand/horilka-4.jpg"
          imageAlt="Lunin Cocktail Bar — eventos privados"
          kickerKey="nav.events"
          titleKey="events.private.title"
          leadKey="events.private.lead"
          height="md"
          objectPosition="center"
        />
        <EventsContent />
      </main>
      <SocialFAB />
      <Footer />
    </>
  );
}
