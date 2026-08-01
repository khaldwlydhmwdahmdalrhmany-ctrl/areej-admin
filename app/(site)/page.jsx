import React from "react";
import Link from "next/link";
import { Star, ArrowLeft, Wrench, CalendarCheck, ShieldCheck } from "lucide-react";
import { getCategories, getProducts, getBanners } from "../../lib/db.js";
import { C, G, SH, discountPercent } from "../../lib/colors.js";
import HeroBanners from "../../components/site/HeroBanners.jsx";
import ProductCard from "../../components/site/ProductCard.jsx";
import FeatureStrip from "../../components/site/FeatureStrip.jsx";
import TrustStrip from "../../components/site/TrustStrip.jsx";
import CategoryCard from "../../components/site/CategoryCard.jsx";
import SectionHead from "../../components/site/SectionHead.jsx";
import WhyUs from "../../components/site/WhyUs.jsx";
import FaqAccordion from "../../components/site/FaqAccordion.jsx";
import CtaBand from "../../components/site/CtaBand.jsx";
import HowItWorks from "../../components/site/HowItWorks.jsx";

export const dynamic = "force-dynamic";

const TESTIMONIALS = [
  { name: "أم عبدالله", city: "الرياض", text: "جهاز التحلية غيّر طعم مياه المطبخ تمامًا، والتركيب كان سريعًا." },
  { name: "فيصل", city: "جدة", text: "برادة المكتب هادئة جدًا وفرق ملحوظ في نقاء المياه طول اليوم." },
  { name: "سارة", city: "الدمام", text: "طلبت عبر واتساب ووصلني الطلب خلال يومين، تعامل راقٍ وسريع." },
];

export default async function HomePage() {
  const [categories, products, banners] = await Promise.all([
    getCategories(),
    getProducts(),
    getBanners({ placement: "home" }),
  ]);

  const activeBanners = banners.filter((b) => b.active);

  // الأكثر مبيعًا — أولوية للمنتجات المميّزة بشارة
  const flagged = products.filter((p) => p.badge === "الأكثر طلبًا" || p.badge === "الأكثر مبيعًا");
  const bestSellers = (flagged.length >= 4 ? flagged : products).slice(0, 8);

  // العروض — كل منتج له سعر قديم أعلى فعليًا
  const offers = products
    .filter((p) => discountPercent(p.price, p.oldPrice) > 0)
    .sort((a, b) => discountPercent(b.price, b.oldPrice) - discountPercent(a.price, a.oldPrice))
    .slice(0, 4);

  // الفلاتر والإكسسوارات
  const filtersAndAccessories = products
    .filter((p) => ["filters", "accessories", "maintenance-tools"].includes(p.categorySlug))
    .slice(0, 4);

  return (
    <div>
      {/* ١ — الهيرو */}
      <HeroBanners banners={activeBanners} />

      {/* ٢ — مميزات الشركة */}
      <FeatureStrip />

      {/* ٣ — التصنيفات */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 section-y">
        <SectionHead
          eyebrow="تسوّق حسب التصنيف"
          title="كل ما تحتاجه لمياه نقية"
          desc="من الفلتر المنزلي البسيط إلى محطات التحلية الصناعية."
          href="/shop"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((c) => (<CategoryCard key={c.id} category={c} />))}
        </div>
      </section>

      {/* ٤ — الأكثر مبيعًا */}
      {bestSellers.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
          <SectionHead
            eyebrow="الأكثر مبيعًا"
            title="منتجات مختارة لك"
            desc="الأجهزة التي يطلبها عملاؤنا أكثر من غيرها."
            href="/shop"
            hrefLabel="كل المنتجات"
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {bestSellers.map((p) => (<ProductCard key={p.id} product={p} />))}
          </div>
        </section>
      )}

      {/* ٥ — العروض */}
      {offers.length > 0 && (
        <section style={{ background: C.mintTint }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 section-y">
            <SectionHead
              eyebrow="وفّر أكثر"
              title="العروض الحالية"
              desc="خصومات فعلية على أجهزة مختارة، لفترة محدودة."
              href="/offers"
              hrefLabel="كل العروض"
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {offers.map((p) => (<ProductCard key={p.id} product={p} />))}
            </div>
          </div>
        </section>
      )}

      {/* ٦ — الصيانة الدورية */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 section-y">
        <div
          className="grid lg:grid-cols-2 gap-8 items-center rounded-3xl overflow-hidden p-7 sm:p-12"
          style={{ background: G.deep }}
        >
          <div className="flex flex-col gap-5">
            <span className="text-xs font-bold" style={{ color: C.mint }}>الصيانة الدورية</span>
            <h2 className="h-section font-display" style={{ color: "#fff" }}>
              جهازك يحتاج متابعة، لا استبدال
            </h2>
            <p className="text-sm sm:text-base leading-relaxed" style={{ color: "rgba(255,255,255,.78)" }}>
              أغلب أعطال أجهزة التحلية سببها فلتر لم يُستبدل في وقته. باقات الصيانة الدورية تتابع جهازك وتذكّرك قبل أن تتعطل.
            </p>

            <ul className="flex flex-col gap-2.5">
              {[
                { icon: CalendarCheck, t: "زيارات مجدولة تلقائيًا" },
                { icon: Wrench, t: "استبدال شمعات أصلية" },
                { icon: ShieldCheck, t: "فحص شامل للتسريبات والضغط" },
              ].map((s, i) => (
                <li key={i} className="flex items-center gap-2.5 text-sm" style={{ color: "rgba(255,255,255,.92)" }}>
                  <s.icon size={17} color={C.mint} className="shrink-0" /> {s.t}
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <Link href="/maintenance" className="btn group px-6 py-3 text-sm" style={{ background: "#fff", color: C.navy }}>
                باقات الصيانة <ArrowLeft size={15} className="arrow-slide" />
              </Link>
              <Link href="/maintenance/urgent" className="btn px-6 py-3 text-sm" style={{ background: "rgba(255,255,255,.14)", color: "#fff" }}>
                صيانة عاجلة
              </Link>
            </div>
          </div>

          <div className="hidden lg:flex items-center justify-center">
            <div className="relative w-full aspect-square max-w-sm rounded-3xl flex items-center justify-center" style={{ background: "rgba(255,255,255,.06)" }}>
              <span className="absolute inset-0 rounded-3xl blur-3xl opacity-25" style={{ background: C.teal }} />
              <Wrench size={92} color={C.mint} strokeWidth={1.1} className="relative" />
            </div>
          </div>
        </div>
      </section>

      {/* كيف تصلك منتجاتنا */}
      <HowItWorks />

      {/* ٧ — الفلاتر والإكسسوارات */}
      {filtersAndAccessories.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
          <SectionHead
            eyebrow="قطع الغيار"
            title="الفلاتر والإكسسوارات"
            desc="شمعات بديلة وقطع أصلية تُبقي جهازك يعمل بكفاءته الأولى."
            href="/category/filters"
            hrefLabel="كل الفلاتر"
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {filtersAndAccessories.map((p) => (<ProductCard key={p.id} product={p} />))}
          </div>
        </section>
      )}

      {/* ٨ — لماذا أريج النقاء */}
      <WhyUs />

      {/* عناصر الثقة */}
      <TrustStrip />

      {/* ٩ — آراء العملاء */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 section-y">
        <SectionHead align="center" eyebrow="آراء عملائنا" title="ثقة نبنيها كل يوم" />
        <div className="grid sm:grid-cols-3 gap-4 sm:gap-5">
          {TESTIMONIALS.map((t, i) => (
            <figure
              key={i}
              className="lift p-6 rounded-2xl flex flex-col gap-3"
              style={{ background: C.pearl, border: `1px solid ${C.line}`, boxShadow: SH.sm }}
            >
              <div className="flex gap-0.5" aria-label="تقييم 5 من 5">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star key={idx} size={14} fill={C.gold} color={C.gold} />
                ))}
              </div>
              <blockquote className="text-sm leading-relaxed flex-1" style={{ color: C.ink }}>
                «{t.text}»
              </blockquote>
              <figcaption className="text-xs font-bold" style={{ color: C.navy }}>
                {t.name} — <span style={{ color: C.slateLight }}>{t.city}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ١٠ — الأسئلة الشائعة */}
      <section style={{ background: C.offWhite }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 section-y">
          <SectionHead
            align="center"
            eyebrow="الأسئلة الشائعة"
            title="أسئلة يسألها أغلب عملائنا"
            desc="لم تجد إجابتك؟ راسلنا على واتساب ونرد خلال دقائق."
          />
          <FaqAccordion />
          <div className="text-center mt-8">
            <Link href="/faq" className="group inline-flex items-center gap-1.5 text-sm font-bold" style={{ color: C.navy }}>
              كل الأسئلة <ArrowLeft size={15} className="arrow-slide" />
            </Link>
          </div>
        </div>
      </section>

      {/* ١١ — دعوة لاتخاذ إجراء */}
      <CtaBand />
    </div>
  );
}
