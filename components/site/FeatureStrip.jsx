import React from "react";
import { C, SH, FEATURE_ITEMS } from "../../lib/colors.js";
import { getIcon } from "../../lib/iconMap.js";

/**
 * شريط مميزات الشركة — يوضع مباشرة بعد الهيرو.
 * البطاقات ترتفع فوق حدّ الهيرو قليلًا (negative margin) لربط بصري.
 */
export default function FeatureStrip() {
  return (
    <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 -mt-8 sm:-mt-12">
      <div
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 p-3 sm:p-4 rounded-3xl"
        style={{ background: C.pearl, border: `1px solid ${C.line}`, boxShadow: SH.lg }}
      >
        {FEATURE_ITEMS.map((f, i) => {
          const Icon = getIcon(f.icon);
          return (
            <div
              key={i}
              className="lift flex flex-col items-center text-center gap-2 p-4 sm:p-5 rounded-2xl"
              style={{ background: i % 2 === 0 ? C.mintTint : C.offWhite }}
            >
              <div
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0"
                style={{ background: C.pearl, border: `1px solid ${C.teal}33` }}
              >
                <Icon size={21} color={C.teal} strokeWidth={1.9} />
              </div>
              <h3 className="font-bold text-[13px] sm:text-sm leading-snug" style={{ color: C.navy }}>
                {f.title}
              </h3>
              <p className="text-[11px] sm:text-xs leading-relaxed hidden sm:block" style={{ color: C.slate }}>
                {f.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
