import React from "react";
import Link from "next/link";
import { Phone, MapPin, MessageCircle } from "lucide-react";
import { C } from "../../lib/colors.js";
import PetalLogo from "./PetalLogo.jsx";

export default function Footer() {
  return (
    <footer style={{ background: C.navyDeep, color: C.pearl }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid sm:grid-cols-4 gap-8">
        <div className="sm:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <PetalLogo size={28} />
            <div className="flex flex-col leading-none">
              <span className="font-display">أريج النقاء</span>
              <span className="text-[10px]" style={{ color: `${C.pearl}80` }}>المتميز لتحلية المياه</span>
            </div>
          </div>
          <p className="text-sm" style={{ color: `${C.pearl}99` }}>
            وجهتك لأجهزة تحلية وتنقية المياه والبرادات ومحطات التحلية بالمملكة.
          </p>
        </div>
        <div>
          <h4 className="font-bold mb-3 text-sm">روابط سريعة</h4>
          <ul className="space-y-2 text-sm" style={{ color: `${C.pearl}99` }}>
            <li><Link href="/">الرئيسية</Link></li>
            <li><Link href="/shop">المنتجات</Link></li>
            <li><Link href="/offers">العروض</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-3 text-sm">الدعم والصيانة</h4>
          <ul className="space-y-2 text-sm" style={{ color: `${C.pearl}99` }}>
            <li><Link href="/maintenance">الصيانة الدورية</Link></li>
            <li><Link href="/maintenance/urgent">طلب صيانة عاجلة</Link></li>
            <li><Link href="/faq">الأسئلة الشائعة</Link></li>
            <li><Link href="/privacy">سياسة الخصوصية</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-3 text-sm">تواصل معنا</h4>
          <ul className="space-y-2 text-sm" style={{ color: `${C.pearl}99` }}>
            <li className="flex items-center gap-2"><Phone size={14} /> 966532540595+</li>
            <li className="flex items-center gap-2"><MapPin size={14} /> المملكة العربية السعودية</li>
            <li className="flex items-center gap-2"><MessageCircle size={14} /> الرد عبر واتساب خلال دقائق</li>
          </ul>
        </div>
      </div>
      <div className="text-center text-xs py-4 border-t" style={{ borderColor: `${C.pearl}22`, color: `${C.pearl}66` }}>
        © {new Date().getFullYear()} أريج النقاء المتميز لتحلية المياه. جميع الحقوق محفوظة.
      </div>
    </footer>
  );
}
