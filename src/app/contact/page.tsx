import type { Metadata } from "next";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { SocialFAB } from "../../components/SocialFAB";
import { PageHero } from "../../components/PageHero";
import { ContactCards } from "./_components/ContactCards";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Cómo llegar, horarios y reservas en Lunin Cocktail Bar.",
};

export default function ContactPage() {
  return (
    <>
      <Header variant="menu" />
      <main className="flex-1">
        <PageHero
          imageSrc="/images/brand/horilka-5.jpg"
          imageAlt="Lunin Cocktail Bar"
          kicker="Hello"
          titleKey="contact.title"
          leadKey="contact.lead"
          height="md"
          objectPosition="center 35%"
        />
        <section className="mx-auto max-w-6xl px-5 md:px-10 py-16 md:py-20">
          <ContactCards />
        </section>
      </main>
      <SocialFAB />
      <Footer />
    </>
  );
}
