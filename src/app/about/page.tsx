import type { Metadata } from "next";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { SocialFAB } from "../../components/SocialFAB";
import { AboutHero } from "./_components/AboutHero";
import { AboutStory } from "./_components/AboutStory";
import { AboutTeam } from "./_components/AboutTeam";
import { AboutValues } from "./_components/AboutValues";
import { AboutCertificate } from "./_components/AboutCertificate";
import { AboutOutro } from "./_components/AboutOutro";

export const metadata: Metadata = {
  title: "Sobre Lunin",
  description:
    "La esencia de Lunin: destilería craft de espíritus de frutas y un cocktail bar de autor. Equipo, valores y certificados de calidad.",
};

export default function AboutPage() {
  return (
    <>
      <Header variant="menu" />
      <main className="flex-1">
        <AboutHero />
        <AboutStory />
        <AboutTeam />
        <AboutValues />
        <AboutCertificate />
        <AboutOutro />
      </main>
      <SocialFAB />
      <Footer />
    </>
  );
}
