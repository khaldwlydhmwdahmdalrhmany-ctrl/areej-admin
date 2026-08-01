import React from "react";
import { Phone, MapPin, Clock, MessageCircle, Mail } from "lucide-react";
import { C, SH, WHATSAPP_NUMBER, buildWhatsAppLink } from "../../../lib/colors.js";
import PageHero from "../../../components/site/PageHero.jsx";
import { getBanners } from "../../../lib/db.js";
import { pickBanner } from "../../../lib/banners.js";
import TrustStrip from "../../../components/site/TrustStrip.jsx";
import ContactForm from "../../../components/site/ContactForm.jsx";
import SectionHead from "../../../components/site/SectionHead.jsx";
import FaqAccordion from "../../../components/site/FaqAccordion.jsx";

export const dynamic = "force-dynamic";

// TODO: استبدل هذا بالعنوان الفعلي للمعرض ليظهر على الخريطة بدقة.
// اتركه فارغًا ("") لإخفاء قسم الخريطة بالكامل بدل عرض موقع تقريبي مضلّل.
const MAP_QUERY = "";

const CONTACT_ITEMS = [
  { icon: Phone, label: "الهاتف وواتساب", value: "+966 53 254 0595", href: `tel:+${WHATSAPP_NUMBER}` },
  { icon: MapPin, label: "نطاق الخدمة", value: "المملكة العربية السعودية" },
  { icon: Clock, label: "أوقات العمل", value: "السبت – الخميس، 9 صباحًا – 9 مساءً" },
];

export default async function ContactPage() {
  const pageBanner = pickBanner(await getBanners({ placement: "contact" }));

  return (
    <div>
      <PageHero
        imageUrl={pageBanner?.imageUrl}
        ratio={pageBanner?.ratio}
        bannerCta={pageBanner?.ctaHref ? { label: pageBanner.ctaLabel, href: pageBanner.ctaHref } : undefined}
        title="تواصل معنا"
        subtitle="سؤال عن جهاز، طلب عرض سعر، أو حجز تركيب — نحن هنا."
        icon="Headset"
        color={C.navy}
        whatsapp="السلام عليكم، أرغب في التواصل مع فريق أريج النقاء."
        compact
      />

      <TrustStrip />

      <section className="max-w-6xl mx-auto px-4 sm:px-6 section-y">
        <div className="grid lg:grid-cols-5 gap-6 lg:gap-8">
          {/* النموذج */}
          <div className="lg:col-span-3">
            <ContactForm />
          </div>

          {/* بطاقة معلومات الشركة */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="p-6 sm:p-7 rounded-3xl flex flex-col gap-5" style={{ background: C.navyDeep, boxShadow: SH.md }}>
              <h2 className="h-card font-display" style={{ color: "#fff" }}>معلومات التواصل</h2>

              <ul className="flex flex-col gap-4">
                {CONTACT_ITEMS.map((c, i) => {
                  const body = (
                    <>
                      <span
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: "rgba(255,255,255,.1)" }}
                      >
                        <c.icon size={17} color={C.mint} strokeWidth={1.9} />
                      </span>
                      <span className="flex flex-col">
                        <span className="text-[11px]" style={{ color: "rgba(255,255,255,.6)" }}>{c.label}</span>
                        <span className="text-sm font-bold" dir={c.href ? "ltr" : undefined} style={{ color: "#fff" }}>
                          {c.value}
                        </span>
                      </span>
                    </>
                  );
                  return (
                    <li key={i}>
                      {c.href ? (
                        <a href={c.href} className="flex items-center gap-3">{body}</a>
                      ) : (
                        <div className="flex items-center gap-3">{body}</div>
                      )}
                    </li>
                  );
                })}
              </ul>

              <a
                href={buildWhatsAppLink("السلام عليكم، أرغب في الاستفسار عن أجهزة تحلية المياه.")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn w-full py-3.5 text-sm mt-1"
                style={{ background: "#25D366", color: "#fff" }}
              >
                <MessageCircle size={17} /> محادثة واتساب فورية
              </a>
            </div>

            {/* الخريطة — تظهر فقط عند تحديد عنوان فعلي */}
            {MAP_QUERY ? (
              <div className="rounded-3xl overflow-hidden" style={{ border: `1px solid ${C.line}`, minHeight: 260 }}>
                <iframe
                  title="موقعنا على الخريطة"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&hl=ar&z=14&output=embed`}
                  className="w-full h-full min-h-[260px] border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            ) : (
              <div
                className="rounded-3xl p-6 flex items-center gap-3"
                style={{ background: C.mintTint, border: `1px dashed ${C.teal}55` }}
              >
                <Mail size={20} color={C.navy} className="shrink-0" />
                <p className="text-xs leading-relaxed" style={{ color: C.navy }}>
                  نخدم عملاءنا في جميع مناطق المملكة عبر الشحن والتركيب المنزلي.
                  للاستفسار عن التغطية في مدينتك، راسلنا على واتساب.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section style={{ background: C.offWhite }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 section-y">
          <SectionHead align="center" eyebrow="قبل ما تسأل" title="ربما تجد إجابتك هنا" />
          <FaqAccordion />
        </div>
      </section>
    </div>
  );
}
