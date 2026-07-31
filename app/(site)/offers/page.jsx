import React from "react";
import Link from "next/link";
import { getProducts, getBanners, getCategories } from "../../../lib/db.js";
import { C, discountPercent } from "../../../lib/colors.js";
import PageHero from "../../../components/site/PageHero.jsx";
import TrustStrip from "../../../components/site/TrustStrip.jsx";
import ProductBrowser from "../../../components/site/ProductBrowser.jsx";
import SectionHead from "../../../components/site/SectionHead.jsx";
import CtaBand from "../../../components/site/CtaBand.jsx";

export const dynamic = "force-dynamic";

export default async function OffersPage() {
  const [products, banners, categories] = await Promise.all([
    getProducts(),
    getBanners({ placement: "home" }),
    getCategories(),
  ]);

  const onSale = products
    .filter((p) => discountPercent(p.price, p.oldPrice) > 0)
    .sort((a, b) => discountPercent(b.price, b.oldPrice) - discountPercent(a.price, a.oldPrice));

  const activeBanners = banners.filter((b) => b.active);
  const heroBanner = activeBanners.find((b) => b.imageUrl);
  const topDiscount = onSale.length ? discountPercent(onSale[0].price, onSale[0].oldPrice) : 0;

  return (
    <div>
      <PageHero
        title="عروض أريج النقاء"
        subtitle={
          topDiscount > 0
            ? `خصومات تصل إلى ${topDiscount}% على أجهزة مختارة — لفترة محدودة.`
            : "تابعنا للاطلاع على أحدث الخصومات على أجهزة التحلية والبرادات."
        }
        imageUrl={heroBanner?.imageUrl}
        icon="Tag"
        color={C.navy}
        count={onSale.length}
      />

      <TrustStrip />

      <section className="max-w-6xl mx-auto px-4 sm:px-6 section-y">
        {activeBanners.length > 0 && (
          <div className="grid sm:grid-cols-3 gap-4 mb-14">
            {activeBanners.map((b) => (
              <Link
                key={b.id}
                href={b.linkCategorySlug ? `/category/${b.linkCategorySlug}` : "/shop"}
                className="lift zoom-wrap text-right rounded-2xl flex flex-col overflow-hidden h-full"
                style={b.imageUrl ? { border: `1px solid ${C.line}` } : { background: `linear-gradient(135deg, ${C.navy}, ${C.teal})`, color: "#fff" }}
              >
                {b.imageUrl ? (
                  <img src={b.imageUrl} alt={b.title} className="zoom-img w-full h-auto" />
                ) : (
                  <div className="p-6 flex flex-col gap-2">
                    <span className="font-display text-lg">{b.title}</span>
                    {b.subtitle && <span className="text-sm opacity-90 leading-relaxed">{b.subtitle}</span>}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}

        {onSale.length === 0 ? (
          <div className="text-center py-20 rounded-2xl" style={{ background: C.offWhite }}>
            <p className="font-bold mb-1" style={{ color: C.navy }}>لا توجد عروض نشطة حاليًا</p>
            <p className="text-sm mb-5" style={{ color: C.slate }}>تابعنا قريبًا — نضيف خصومات جديدة باستمرار.</p>
            <Link href="/shop" className="btn px-6 py-2.5 text-sm" style={{ background: C.navy, color: "#fff" }}>
              تصفّح كل المنتجات
            </Link>
          </div>
        ) : (
          <>
            <SectionHead eyebrow="خصومات فعلية" title="منتجات مخفّضة الآن" />
            <ProductBrowser categories={categories} products={onSale} activeCatSlug={null} />
          </>
        )}
      </section>

      <CtaBand
        eyebrow="لا تفوّت العرض"
        title="اسأل عن توفّر المنتج قبل نفاده"
        desc="بعض العروض بكميات محدودة — تأكد من التوفر عبر واتساب قبل الطلب."
        primaryLabel="كل المنتجات"
        primaryHref="/shop"
      />
    </div>
  );
}
