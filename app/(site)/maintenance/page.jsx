import React from "react";
import Link from "next/link";
import { Wrench, CheckCircle2, AlertTriangle } from "lucide-react";
import { C } from "../../../lib/colors.js";
import CategoryBanner from "../../../components/site/CategoryBanner.jsx";
import MaintenanceCTA from "../../../components/site/MaintenanceCTA.jsx";

const PLANS = [
  { id: "basic", name: "باقة أساسية", freq: "كل 6 أشهر", price: 150,
    items: ["فحص شامل للجهاز", "استبدال الفلتر الأول والثاني", "تنظيف الخزان الخارجي"] },
  { id: "pro", name: "باقة متقدمة", freq: "سنوية (زيارتان)", price: 260,
    items: ["كل ما في الباقة الأساسية", "استبدال المرحلة الكربونية", "فحص الأغشية وضغط التشغيل", "تعقيم كامل للمنظومة"] },
  { id: "commercial", name: "باقة تجارية", freq: "حسب الاتفاق", price: null,
    items: ["مناسبة لمحطات ومنشآت", "عقد صيانة دوري مخصص", "أولوية في الزيارات الطارئة"] },
];

export default function MaintenancePage() {
  return (
    <div>
      <CategoryBanner title="الصيانة الدورية" subtitle="حافظ على أداء جهازك ونقاء مياهك على مدار العام" icon="Wrench" color={C.teal} />

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid sm:grid-cols-3 gap-5 mb-12">
          {PLANS.map((p) => (
            <div key={p.id} className="p-6 rounded-2xl flex flex-col gap-4" style={{ background: "#fff", border: `1px solid ${C.line}` }}>
              <div>
                <h3 className="font-display text-lg" style={{ color: C.navy }}>{p.name}</h3>
                <p className="text-xs mt-1" style={{ color: C.slate }}>{p.freq}</p>
              </div>
              <ul className="flex flex-col gap-2 flex-1">
                {p.items.map((it, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm" style={{ color: C.ink }}>
                    <CheckCircle2 size={16} color={C.teal} className="shrink-0 mt-0.5" /> {it}
                  </li>
                ))}
              </ul>
              <div className="font-display text-xl" style={{ color: C.navy }}>{p.price ? `${p.price} ر.س` : "حسب الطلب"}</div>
              <MaintenanceCTA planName={p.name} />
            </div>
          ))}
        </div>

        <div className="rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ background: C.mintTint }}>
          <div className="flex items-center gap-3">
            <AlertTriangle size={22} color={C.navy} />
            <p className="text-sm font-bold" style={{ color: C.navy }}>عندك عطل مفاجئ ولا يقدر ينتظر؟</p>
          </div>
          <Link href="/maintenance/urgent" className="px-6 py-2.5 rounded-full font-bold text-sm" style={{ background: C.navy, color: C.pearl }}>
            اطلب صيانة عاجلة
          </Link>
        </div>
      </section>
    </div>
  );
}
