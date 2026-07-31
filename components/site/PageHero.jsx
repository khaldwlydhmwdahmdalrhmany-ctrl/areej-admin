import React from "react";
import Link from "next/link";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { C, G, buildWhatsAppLink } from "../../lib/colors.js";
import { getIcon } from "../../lib/iconMap.js";

/**
 * ترويسة صفحة موحّدة — تدعم صورة بنر كبيرة (كالصفحة الرئيسية)
 * وتتراجع تلقائيًا إلى تدرج لوني + أيقونة إن لم توجد صورة.
 * تُستخدم في: المتجر، التصنيفات، العروض، الصيانة، التواصل، من نحن...
 */
export default function PageHero({
  title,
  subtitle,
  imageUrl,
  icon,
  color = C.navy,
  count,
  cta,            // { label, href }
  whatsapp,       // نص رسالة واتساب — يعرض زرًا ثانويًا
  compact = false,
}) {
  const Icon = getIcon(icon);
  const hasImage = Boolean(imageUrl);

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ background: hasImage ? C.navyDeep : `linear-gradient(120deg, ${color}, ${C.navyDeep})` }}
    >
      {hasImage && (
        <>
          <img src={imageUrl} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" />
          {/* تعتيم متدرّج يضمن قراءة النص فوق أي صورة */}
          <span
            className="absolute inset-0"
            style={{ background: "linear-gradient(90deg, rgba(7,18,51,.92) 0%, rgba(7,18,51,.72) 45%, rgba(7,18,51,.35) 100%)" }}
          />
        </>
      )}

      {/* زخرفة خفيفة عند غياب الصورة */}
      {!hasImage && (
        <span
          className="absolute -top-32 -left-24 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ background: C.teal }}
        />
      )}

      <div className={`relative max-w-6xl mx-auto px-4 sm:px-6 ${compact ? "py-12 sm:py-16" : "py-16 sm:py-24"}`}>
        <div className="flex items-start gap-4 max-w-2xl">
          {!hasImage && (
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 mt-1"
              style={{ background: "rgba(255,255,255,0.15)" }}
            >
              <Icon size={26} color="#fff" strokeWidth={1.8} />
            </div>
          )}

          <div className="flex flex-col gap-3">
            <h1 className="h-display font-display" style={{ color: "#fff" }}>{title}</h1>

            {subtitle && (
              <p className="text-sm sm:text-lg leading-relaxed" style={{ color: "rgba(255,255,255,.82)" }}>
                {subtitle}
              </p>
            )}

            {typeof count === "number" && (
              <span
                className="inline-block w-fit text-xs font-bold px-3 py-1.5 rounded-full"
                style={{ background: "rgba(255,255,255,0.15)", color: "#fff" }}
              >
                {count} منتج
              </span>
            )}

            {(cta || whatsapp) && (
              <div className="flex flex-col sm:flex-row gap-3 mt-3">
                {cta && (
                  <Link href={cta.href} className="btn group px-6 py-3 text-sm" style={{ background: "#fff", color: C.navy }}>
                    {cta.label} <ArrowLeft size={15} className="arrow-slide" />
                  </Link>
                )}
                {whatsapp && (
                  <a
                    href={buildWhatsAppLink(whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn px-6 py-3 text-sm"
                    style={{ background: "#25D366", color: "#fff" }}
                  >
                    <MessageCircle size={16} /> تواصل عبر واتساب
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
