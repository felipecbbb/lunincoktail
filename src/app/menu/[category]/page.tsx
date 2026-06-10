import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "../../../components/Header";
import { Footer } from "../../../components/Footer";
import { MenuCarousel } from "../../../components/MenuCarousel";
import { MenuBackLink } from "../../../components/MenuBackLink";
import { SocialFAB } from "../../../components/SocialFAB";
import { CategoryHero } from "./_components/CategoryHero";
import { Store } from "../../../lib/store";

type Params = { category: string };

export async function generateStaticParams() {
  const cats = await Store.getCategories();
  return cats.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { category } = await params;
  const cats = await Store.getCategories();
  const cat = cats.find((c) => c.slug === category);
  if (!cat) return { title: "Carta" };
  return {
    title: cat.name.es,
    description: cat.description?.es,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { category } = await params;
  const [cats, items] = await Promise.all([
    Store.getCategories(),
    Store.getMenu(),
  ]);
  const cat = cats.find((c) => c.slug === category && c.enabled);
  if (!cat) notFound();

  const list = items
    .filter((i) => i.categoryId === cat.id && i.enabled)
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

  return (
    <>
      <Header variant="menu" />
      <main className="flex-1">
        <CategoryHero category={cat} />

        <section className="mx-auto max-w-3xl px-5 md:px-8 pb-24">
          <MenuCarousel items={list} />

          <div className="mt-14 flex justify-center">
            <MenuBackLink />
          </div>
        </section>
      </main>
      <SocialFAB />
      <Footer />
    </>
  );
}
