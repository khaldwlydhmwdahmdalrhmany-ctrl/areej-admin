import React from "react";
import { C } from "../../lib/colors.js";

export default function Ticker() {
  return (
    <div className="overflow-hidden whitespace-nowrap py-2" style={{ background: C.navy }}>
      <div className="ticker-track inline-block">
        {Array.from({ length: 2 }).map((_, r) => (
          <span key={r} className="inline-flex items-center gap-8 text-xs font-semibold px-6" style={{ color: C.mint }}>
            <span>✦ توصيل مجاني للطلبات فوق 500 ريال</span>
            <span>✦ ضمان حتى 3 سنوات على أجهزة التحلية</span>
            <span>✦ تقسيط بدون فوائد عبر تابي وتمارا</span>
            <span>✦ الرد على واتساب خلال دقائق</span>
          </span>
        ))}
      </div>
    </div>
  );
}
