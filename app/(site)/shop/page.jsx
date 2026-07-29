import React from "react";
import { getCategories, getProducts } from "../../../lib/db.js";
import { C } from "../../../lib/colors.js";
import CategoryBanner from "../../../components/site/CategoryBanner.jsx";
import ProductBrowser from "../../../components/site/ProductBrowser.jsx";
import { Package } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);
  return (
    <div>
      <CategoryBanner title="كل المنتجات" subtitle="تصفّح كامل تشكيلة أريج النقاء" color={C.navy} count={products.length} />
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <ProductBrowser categories={categories} products={products} activeCatSlug={null} />
      </section>
    </div>
  );
}
