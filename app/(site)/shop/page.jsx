import React from "react";
import { getCategories, getProducts, getBanners } from "../../../lib/db.js";
import { C } from "../../../lib/colors.js";
import PageHero from "../../../components/site/PageHero.jsx";
import TrustStrip from "../../../components/site/TrustStrip.jsx";
import ProductBrowser from "../../../components/site/ProductBrowser.jsx";
import CtaBand from "../../../components/site/CtaBand.jsx";

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const [categories, products, banners] = await Promise.all([
    getCategories(),
    getProducts(),
    getBanners({ placement: "home" }),
  ]);

  // أول بنر رئيسي نشط يصلح ترويسة لصفحة المتجر
  const heroBanner = banners.find((b) => b.active && b.imageUrl);

  return (
    <div>
      <PageHero
        title="كل المنتجات"
        subtitle="تصفّح كامل تشكيلة أريج النقاء — من الفلتر المنزلي إلى محطات التحلية الصناعية."
        imageUrl={heroBanner?.imageUrl}
        icon="Package"
        color={C.navy}
        count={products.length}
      />

      <TrustStrip />

      <section className="max-w-6xl mx-auto px-4 sm:px-6 section-y">
        <ProductBrowser categories={categories} products={products} activeCatSlug={null} />
      </section>

      <CtaBand
        eyebrow="محتار في الاختيار؟"
        title="نرشّح لك الجهاز المناسب"
        desc="أرسل لنا عدد أفراد أسرتك ونوع مياه منطقتك، ونختار لك ما يناسبك فعلًا."
        primaryLabel="تصفّح العروض"
        primaryHref="/offers"
      />
    </div>
  );
}
