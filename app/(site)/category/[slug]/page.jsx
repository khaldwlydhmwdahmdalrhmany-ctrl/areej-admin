import React from "react";
import { notFound } from "next/navigation";
import { getCategories, getProducts, getCategoryBySlug, getBanners } from "../../../../lib/db.js";
import { C } from "../../../../lib/colors.js";
import CategoryBanner from "../../../../components/site/CategoryBanner.jsx";
import ProductBrowser from "../../../../components/site/ProductBrowser.jsx";

export const dynamic = "force-dynamic";

export default async function CategoryPage({ params }) {
  const category = await getCategoryBySlug(params.slug);
  if (!category) notFound();

  const [categories, products, catBanners] = await Promise.all([
    getCategories(),
    getProducts({ categorySlug: params.slug }),
    getBanners({ placement: "category" }),
  ]);

  const relevantBanners = catBanners.filter((b) => b.active && b.categoryId === category.id);

  return (
    <div>
      <CategoryBanner title={category.name} subtitle={category.tagline} imageUrl={category.bannerUrl} icon={category.icon} color={category.color} count={products.length} />

      {relevantBanners.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
          <div className="grid sm:grid-cols-2 gap-4">
            {relevantBanners.map((b) => (
              <div key={b.id} className="rounded-2xl overflow-hidden p-5 flex flex-col gap-1" style={b.imageUrl ? {} : { background: `linear-gradient(120deg, ${category.color}, ${C.navyDeep})`, color: "#fff" }}>
                {b.imageUrl ? (
                  <img src={b.imageUrl} alt={b.title} className="w-full h-auto rounded-xl" />
                ) : (
                  <>
                    <span className="font-display text-lg">{b.title}</span>
                    {b.subtitle && <span className="text-sm opacity-90">{b.subtitle}</span>}
                  </>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <ProductBrowser categories={categories} products={products} activeCatSlug={params.slug} />
      </section>
    </div>
  );
}
