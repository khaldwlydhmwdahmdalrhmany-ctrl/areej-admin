import React from "react";
import Link from "next/link";
import { Star, ShieldCheck, Truck, Wallet, Headset, ArrowLeft } from "lucide-react";
import { getCategories, getProducts, getBanners } from "../../lib/db.js";
import { C } from "../../lib/colors.js";
import { getIcon } from "../../lib/iconMap.js";
import HeroBanners from "../../components/site/HeroBanners.jsx";
import ProductCard from "../../components/site/ProductCard.jsx";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [categories, products, banners] = await Promise.all([
    getCategories(),
    getProducts(),
    getBanners({ placement: "home" }),
  ]);

  const activeBanners = banners.filter((b) => b.active);
  const bestSellers = products.filter((p) => p.badge === "الأكثر طلبًا" || p.badge === "عرض").slice(0, 8);
  const fallbackBestSellers = bestSellers.length > 0 ? bestSellers : products.slice(0, 8);

  return (
    <div>
      <HeroBanners banners={activeBanners} />

      {/* Trust bar */}
      <section className="border-y" style={{ borderColor: C.line }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          {[
            { icon: Truck, label: "شحن لجميع مناطق المملكة" },
            { icon: ShieldCheck, label: "ضمان حتى 3 سنوات" },
            { icon: Wallet, label: "تقسيط عبر تابي وتمارا" },
            { icon: Headset, label: "دعم فني عبر واتساب" },
          ].map((f, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2">
              <f.icon size={22} color={C.teal} />
              <span className="text-xs font-semibold" style={{ color: C.navy }}>{f.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="mb-8">
          <span className="text-xs font-bold" style={{ color: C.teal }}>تسوّق حسب التصنيف</span>
          <h2 className="font-display text-2xl sm:text-3xl mt-1" style={{ color: C.navy }}>كل ما تحتاجه لمياه نقية</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((c) => {
            const Icon = getIcon(c.icon);
            return (
              <Link key={c.id} href={`/category/${c.slug}`} className="lift flex flex-col items-center text-center gap-2 p-4 rounded-2xl" style={{ background: "#fff", border: `1px solid ${C.line}` }}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `${c.color}15` }}>
                  <Icon size={22} color={c.color} />
                </div>
                <span className="text-xs font-bold" style={{ color: C.ink }}>{c.name}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Best sellers */}
      {fallbackBestSellers.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-4 pb-14">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-xs font-bold" style={{ color: C.teal }}>الأكثر مبيعًا</span>
              <h2 className="font-display text-2xl sm:text-3xl mt-1" style={{ color: C.navy }}>منتجات مختارة لك</h2>
            </div>
            <Link href="/shop" className="text-sm font-bold hidden sm:flex items-center gap-1" style={{ color: C.navy }}>
              كل المنتجات <ArrowLeft size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {fallbackBestSellers.map((p) => (<ProductCard key={p.id} product={p} />))}
          </div>
        </section>
      )}

      {/* How it works */}
      <section style={{ background: C.mintTint }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
          <div className="text-center mb-10">
            <span className="text-xs font-bold" style={{ color: C.teal }}>رحلة الطلب</span>
            <h2 className="font-display text-2xl sm:text-3xl mt-1" style={{ color: C.navy }}>كيف تصلك منتجاتنا</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { n: "01", t: "اختر منتجك", d: "تصفّح الأقسام وأضف ما يناسب منزلك إلى السلة." },
              { n: "02", t: "أكّد الطلب عبر واتساب", d: "أدخل بياناتك وأرسل الطلب مباشرة لفريقنا." },
              { n: "03", t: "استلم واستمتع بالنقاء", d: "نوصّل الطلب لعنوانك مع خيار التركيب المنزلي." },
            ].map((s) => (
              <div key={s.n} className="p-6 rounded-2xl" style={{ background: C.pearl }}>
                <span className="font-display text-3xl" style={{ color: `${C.navy}30` }}>{s.n}</span>
                <h3 className="font-bold mt-2" style={{ color: C.navy }}>{s.t}</h3>
                <p className="text-sm mt-1" style={{ color: C.slate }}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="text-center mb-10">
          <span className="text-xs font-bold" style={{ color: C.teal }}>آراء عملائنا</span>
          <h2 className="font-display text-2xl sm:text-3xl mt-1" style={{ color: C.navy }}>ثقة نبنيها كل يوم</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-5">
          {[
            { name: "أم عبدالله", city: "الرياض", text: "جهاز التحلية غيّر طعم مياه المطبخ تمامًا، والتركيب كان سريعًا." },
            { name: "فيصل", city: "جدة", text: "برادة المكتب هادئة جدًا وفرق ملحوظ في نقاء المياه طول اليوم." },
            { name: "سارة", city: "الدمام", text: "طلبت عبر واتساب ووصلني الطلب خلال يومين، تعامل راقٍ وسريع." },
          ].map((t, i) => (
            <div key={i} className="p-5 rounded-2xl" style={{ border: `1px solid ${C.line}` }}>
              <div className="flex gap-0.5 mb-2">
                {Array.from({ length: 5 }).map((_, idx) => (<Star key={idx} size={14} fill={C.teal} color={C.teal} />))}
              </div>
              <p className="text-sm leading-relaxed" style={{ color: C.ink }}>«{t.text}»</p>
              <p className="text-xs font-bold mt-3" style={{ color: C.navy }}>{t.name} — {t.city}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
