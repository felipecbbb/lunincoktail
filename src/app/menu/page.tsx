import type { Metadata } from "next";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { CategoryCard } from "../../components/CategoryCard";
import { SocialFAB } from "../../components/SocialFAB";
import { PageHero } from "../../components/PageHero";
import { Store } from "../../lib/store";

export const metadata: Metadata = {
  title: "Carta",
  description:
    "Carta digital de Lunin Cocktail Bar — signature cocktails, clásicos, spritz, shots, licores y especiales.",
};

export default async function MenuHubPage() {
  const [categories, items] = await Promise.all([
    Store.getCategories(),
    Store.getMenu(),
  ]);
  const visibleCats = categories.filter((c) => c.enabled);
  const counts = new Map<string, number>();
  const previews = new Map<string, typeof items>();
  for (const it of items) {
    if (!it.enabled) continue;
    counts.set(it.categoryId, (counts.get(it.categoryId) ?? 0) + 1);
    if (!previews.has(it.categoryId)) previews.set(it.categoryId, []);
    const arr = previews.get(it.categoryId)!;
    if (arr.length < 3) arr.push(it);
  }

  return (
    <>
      <Header variant="menu" />
      <main className="flex-1">
        <PageHero
          imageSrc="/images/brand/distillery-1.jpg"
          imageAlt="Lunin Distillery — interior"
          kicker="Carta"
          titleKey="menu.title"
          leadKey="menu.lead"
          height="md"
          objectPosition="center 45%"
        />
        <section className="mx-auto max-w-6xl px-5 md:px-10 py-16 md:py-20">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visibleCats.map((cat, idx) => (
              <CategoryCard
                key={cat.id}
                category={cat}
                count={counts.get(cat.id) ?? 0}
                index={idx}
                preview={previews.get(cat.id) ?? []}
              />
            ))}
          </div>
        </section>
      </main>
      <SocialFAB />
      <Footer />
    </>
  );
}
