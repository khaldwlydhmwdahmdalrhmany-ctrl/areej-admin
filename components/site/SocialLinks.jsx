import React from "react";
import { C } from "../../lib/colors.js";
import { getIcon } from "../../lib/iconMap.js";
import { activeSocials } from "../../lib/settings.js";

/**
 * أيقونات التواصل — تُعرض فقط الروابط المعبّأة من لوحة التحكم.
 *
 * تلوين المرور يتم بـ CSS خالص عبر متغيّر `--soc` لا بمعالجات JavaScript،
 * ليبقى المكوّن مكوّن خادم. تمرير onMouseEnter من مكوّن خادم يرمي خطأ
 * وقت التشغيل ويُسقط كل صفحات الموقع (الفوتر موجود في التخطيط العام).
 */
export default function SocialLinks({ settings, variant = "dark", size = 18 }) {
  const socials = activeSocials(settings);
  if (socials.length === 0) return null;

  const onDark = variant === "dark";
  const baseBg = onDark ? "rgba(255,255,255,.1)" : C.offWhite;
  const baseBorder = onDark ? "rgba(255,255,255,.14)" : C.line;

  return (
    <>
      <style>{`
        .soc-link {
          background: var(--soc-bg);
          border: 1px solid var(--soc-border);
          transition: background-color .25s ease, border-color .25s ease, transform .25s ease;
        }
        .soc-link:hover {
          background: var(--soc);
          border-color: var(--soc);
          transform: translateY(-3px);
        }
        .soc-link:hover .soc-icon { color: var(--soc-fg); }
      `}</style>

      <div className="flex flex-wrap items-center gap-2">
        {socials.map((s) => {
          const Icon = getIcon(s.icon);
          // سناب شات أصفر فاقع — الأيقونة البيضاء عليه غير مقروءة
          const hoverFg = s.color === "#FFFC00" ? "#111" : "#fff";

          return (
            <a
              key={s.key}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              title={s.label}
              className="soc-link w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                "--soc": s.color,
                "--soc-fg": hoverFg,
                "--soc-bg": baseBg,
                "--soc-border": baseBorder,
              }}
            >
              <Icon
                size={size}
                strokeWidth={1.9}
                className="soc-icon"
                style={{ color: onDark ? "#fff" : C.navy, transition: "color .25s ease" }}
              />
            </a>
          );
        })}
      </div>
    </>
  );
}
