"use client";
import React, { useState } from "react";
import { HelpCircle, ChevronDown } from "lucide-react";
import { C } from "../../../lib/colors.js";
import CategoryBanner from "../../../components/site/CategoryBanner.jsx";

const FAQS = [
  { q: "كم تستغرق مدة التوصيل؟", a: "عادةً من 2 إلى 5 أيام عمل حسب المدينة، والطلبات داخل الرياض وجدة والدمام تصل غالبًا خلال 48 ساعة." },
  { q: "هل التركيب مجاني؟", a: "التركيب مجاني على أجهزة التحلية والبرادات المؤهلة، ويظهر ذلك كشارة واضحة على صفحة كل منتج." },
  { q: "ما هي مدة الضمان؟", a: "تختلف المدة حسب نوع الجهاز وتصل حتى 3 سنوات على أجهزة التحلية، ويُذكر الضمان تفصيليًا في صفحة كل منتج." },
  { q: "هل يتوفر الدفع بالتقسيط؟", a: "نعم، نوفر التقسيط بدون فوائد عبر تابي وتمارا على 4 دفعات لجميع المنتجات المؤهلة." },
  { q: "متى يجب استبدال الفلاتر؟", a: "بشكل عام كل 6 إلى 12 شهرًا حسب نوع الفلتر ومعدل الاستخدام، ونوصي بالاشتراك في باقة الصيانة الدورية لمتابعة أدق." },
  { q: "كيف أطلب صيانة عاجلة؟", a: "من صفحة «صيانة عاجلة» في القائمة، عبّئ بياناتك ووصف العطل وسيتم تحويلك مباشرة للتواصل مع الفريق الفني عبر واتساب." },
  { q: "هل تغطون كل مناطق المملكة؟", a: "نعم، نوفر التوصيل لجميع مناطق المملكة، والتركيب المباشر متاح في المدن الرئيسية ويُنسّق فريقنا الجدولة معك بعد الطلب." },
];

export default function FAQPage() {
  const [open, setOpen] = useState(0);
  return (
    <div>
      <CategoryBanner title="الأسئلة الشائعة" subtitle="إجابات سريعة على أكثر الأسئلة تكرارًا" icon="Package" color={C.teal} />
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-14 flex flex-col gap-3">
        {FAQS.map((item, i) => (
          <div key={i} className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${C.line}`, background: "#fff" }}>
            <button onClick={() => setOpen(open === i ? -1 : i)} className="w-full flex items-center justify-between gap-4 p-4 text-right">
              <span className="font-bold text-sm" style={{ color: C.navy }}>{item.q}</span>
              <ChevronDown size={18} color={C.slate} style={{ transform: open === i ? "rotate(180deg)" : "none", transition: "transform .2s ease" }} />
            </button>
            {open === i && (<div className="px-4 pb-4 text-sm leading-relaxed" style={{ color: C.slate }}>{item.a}</div>)}
          </div>
        ))}
      </section>
    </div>
  );
}
