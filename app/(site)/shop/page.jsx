import React from "react";
import { getBanners, getCategories, getProducts } from "../../../lib/db.js";
import { C } from "../../../lib/colors.js";
import PageHero from "../../../components/site/PageHero.jsx";
import { pickBanner } from "../../../lib/banners.js";
import TrustStrip from "../../../components/site/TrustStrip.jsx";
import ProductBrowser from "../../../components/site/ProductBrowser.jsx";
import CtaBand from "../../../components/site/CtaBand.jsx";

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const pageBanner = pickBanner(await getBanners({ placement: "shop" }));

  const [categories, products] = await Promise.all([getCategories(), getProducts()]);

  return (
    <div>
      <PageHero
        imageUrl={pageBanner?.imageUrl}
        ratio={pageBanner?.ratio}
        bannerCta={pageBanner?.ctaHref ? { label: pageBanner.ctaLabel, href: pageBanner.ctaHref } : undefined}
        title="كل المنتجات"
        subtitle="تصفّح كامل تشكيلة أريج النقاء — من الفلتر المنزلي إلى محطات التحلية الصناعية."
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
