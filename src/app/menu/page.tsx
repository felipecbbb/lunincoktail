import type { Metadata } from "next";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { SocialFAB } from "../../components/SocialFAB";
import { PageHero } from "../../components/PageHero";
import { Store } from "../../lib/store";
import { MenuInline } from "./_components/MenuInline";

export const metadata: Metadata = {
  title: "Carta de cócteles",
  description:
    "Carta de Lunin Cocktail Bar en Russafa (Valencia) — signature cocktails, clásicos, spritz, shots, licores y destilados craft propios. Coctelería de autor.",
  alternates: { canonical: "/menu" },
};

export default async function MenuPage() {
  const [categories, items] = await Promise.all([
    Store.getCategories(),
    Store.getMenu(),
  ]);
  const visibleCats = categories
    .filter((c) => c.enabled)
    .sort((a, b) => a.order - b.order);
  const visibleItems = items.filter((i) => i.enabled);

  return (
    <>
      <Header variant="menu" />
      <main className="flex-1">
        <PageHero
          imageSrc="/images/brand/dry-gin.jpg"
          imageAlt="Lunin — The First Ukrainian Dry Gin"
          kickerKey="nav.menu"
          titleKey="menu.title"
          leadKey="menu.lead"
          height="md"
          objectPosition="center 42%"
        />
        <MenuInline categories={visibleCats} items={visibleItems} />
      </main>
      <SocialFAB />
      <Footer />
    </>
  );
}
