import React from "react";
import { C } from "../../lib/colors.js";
import { getIcon } from "../../lib/iconMap.js";

export default function CategoryBanner({ title, subtitle, imageUrl, icon, color = C.navy, count }) {
  if (imageUrl) {
    return (
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: "1774 / 500", background: C.navyDeep }}>
        <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
      </div>
    );
  }
  const Icon = getIcon(icon);
  return (
    <div className="relative w-full py-14 sm:py-20 overflow-hidden" style={{ background: `linear-gradient(120deg, ${color}, ${C.navyDeep})` }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.15)" }}>
          <Icon size={26} color="#fff" />
        </div>
        <div>
          <h1 className="font-display text-2xl sm:text-4xl" style={{ color: "#fff" }}>{title}</h1>
          {subtitle && <p className="text-sm sm:text-base mt-1" style={{ color: "rgba(255,255,255,0.8)" }}>{subtitle}</p>}
          {typeof count === "number" && (
            <span className="inline-block mt-2 text-xs font-bold px-3 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.15)", color: "#fff" }}>{count} منتج</span>
          )}
        </div>
      </div>
    </div>
  );
}
