import React from "react";
import Link from "next/link";
import { Tag } from "lucide-react";
import { getProducts, getBanners } from "../../../lib/db.js";
import { C } from "../../../lib/colors.js";
import CategoryBanner from "../../../components/site/CategoryBanner.jsx";
import ProductCard from "../../../components/site/ProductCard.jsx";

export const dynamic = "force-dynamic";

export default async function OffersPage() {
  const [products, banners] = await Promise.all([getProducts(), getBanners({ placement: "home" })]);
  const onSale = products.filter((p) => p.oldPrice && p.oldPrice > p.price);
  const activeBanners = banners.filter((b) => b.active);

  return (
    <div>
      <CategoryBanner title="عروض أريج النقاء" subtitle="أفضل الأسعار على أجهزة التحلية والبرادات لفترة محدودة" icon="Tag" color={C.navy} />

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {activeBanners.length > 0 && (
          <div className="grid sm:grid-cols-3 gap-4 mb-12">
            {activeBanners.map((b) => (
              <Link key={b.id} href={b.linkCategorySlug ? `/category/${b.linkCategorySlug}` : "/shop"} className="lift text-right p-5 rounded-2xl flex flex-col gap-2 h-full overflow-hidden" style={b.imageUrl ? {} : { background: `linear-gradient(135deg, ${C.navy}, ${C.teal})`, color: "#fff" }}>
                {b.imageUrl ? (
                  <img src={b.imageUrl} alt={b.title} className="w-full h-auto rounded-xl" />
                ) : (
                  <>
                    <span className="font-display text-lg">{b.title}</span>
                    <span className="text-sm opacity-90 leading-relaxed">{b.subtitle}</span>
                  </>
                )}
              </Link>
            ))}
          </div>
        )}

        <h2 className="font-display text-2xl mb-6" style={{ color: C.navy }}>منتجات مخفّضة الآن</h2>
        {onSale.length === 0 ? (
          <p style={{ color: C.slate }}>لا توجد عروض نشطة حاليًا، تابعنا قريبًا لمزيد من الخصومات.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {onSale.map((p) => (<ProductCard key={p.id} product={p} />))}
          </div>
        )}
      </section>
    </div>
  );
}
