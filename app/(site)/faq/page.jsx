import React from "react";
import { C } from "../../../lib/colors.js";
import PageHero from "../../../components/site/PageHero.jsx";
import { getBanners } from "../../../lib/queries.js";
import { pickBanner } from "../../../lib/banners.js";
import TrustStrip from "../../../components/site/TrustStrip.jsx";
import FaqAccordion from "../../../components/site/FaqAccordion.jsx";
import CtaBand from "../../../components/site/CtaBand.jsx";

const FAQS = [
  { q: "كم تستغرق مدة التوصيل؟", a: "عادةً من 2 إلى 5 أيام عمل حسب المدينة، والطلبات داخل الرياض وجدة والدمام تصل غالبًا خلال 48 ساعة." },
  { q: "هل التركيب مجاني؟", a: "التركيب مجاني على أجهزة التحلية والبرادات المؤهلة، ويظهر ذلك كشارة واضحة على صفحة كل منتج." },
  { q: "ما هي مدة الضمان؟", a: "تختلف المدة حسب نوع الجهاز وتصل حتى 3 سنوات على أجهزة التحلية، ويُذكر الضمان تفصيليًا في صفحة كل منتج." },
  { q: "هل يتوفر الدفع بالتقسيط؟", a: "نعم، نوفر التقسيط بدون فوائد عبر تابي وتمارا على 4 دفعات لجميع المنتجات المؤهلة." },
  { q: "متى يجب استبدال الفلاتر؟", a: "بشكل عام كل 6 إلى 12 شهرًا حسب نوع الفلتر ومعدل الاستخدام، ونوصي بالاشتراك في باقة الصيانة الدورية لمتابعة أدق." },
  { q: "كيف أطلب صيانة عاجلة؟", a: "من صفحة «صيانة عاجلة» في القائمة، عبّئ بياناتك ووصف العطل وسيتم تحويلك مباشرة للتواصل مع الفريق الفني عبر واتساب." },
  { q: "هل تغطون كل مناطق المملكة؟", a: "نعم، نوفر التوصيل لجميع مناطق المملكة، والتركيب المباشر متاح في المدن الرئيسية ويُنسّق فريقنا الجدولة معك بعد الطلب." },
];

export default async function FAQPage() {
  const pageBanner = pickBanner(await getBanners({ placement: "faq" }));

  return (
    <div>
      <PageHero
        imageUrl={pageBanner?.imageUrl}
        ratio={pageBanner?.ratio}
        bannerCta={pageBanner?.ctaHref ? { label: pageBanner.ctaLabel, href: pageBanner.ctaHref } : undefined}
        title="الأسئلة الشائعة"
        subtitle="كل ما تحتاج معرفته عن الشحن والتركيب والضمان والصيانة."
        icon="Headset"
        color={C.cyan}
        compact
      />

      <TrustStrip />

      <section className="max-w-6xl mx-auto px-4 sm:px-6 section-y">
        <FaqAccordion items={FAQS} />
      </section>

      <CtaBand
        eyebrow="لم تجد إجابتك؟"
        title="اسألنا مباشرة"
        desc="فريقنا يرد على واتساب خلال دقائق في أوقات العمل."
        primaryLabel="تواصل معنا"
        primaryHref="/contact"
      />
    </div>
  );
}
