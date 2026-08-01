import React from "react";
import { C } from "../../lib/colors.js";
import { getIcon } from "../../lib/iconMap.js";
import { activeSocials } from "../../lib/settings.js";

/**
 * أيقونات التواصل — تُعرض فقط الروابط المعبّأة من لوحة التحكم.
 * أيقونة بلا رابط تُحبط المستخدم، فالغياب أفضل من رابط ميت.
 */
export default function SocialLinks({ settings, variant = "dark", size = 18 }) {
  const socials = activeSocials(settings);
  if (socials.length === 0) return null;

  const onDark = variant === "dark";

  return (
    <div className="flex flex-wrap items-center gap-2">
      {socials.map((s) => {
        const Icon = getIcon(s.icon);
        return (
          <a
            key={s.key}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.label}
            title={s.label}
            className="group w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-250 hover:-translate-y-1"
            style={{
              background: onDark ? "rgba(255,255,255,.1)" : C.offWhite,
              border: `1px solid ${onDark ? "rgba(255,255,255,.14)" : C.line}`,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = s.color; e.currentTarget.style.borderColor = s.color; }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = onDark ? "rgba(255,255,255,.1)" : C.offWhite;
              e.currentTarget.style.borderColor = onDark ? "rgba(255,255,255,.14)" : C.line;
            }}
          >
            <Icon
              size={size}
              strokeWidth={1.9}
              className="transition-colors duration-250"
              color={onDark ? "#fff" : C.navy}
            />
          </a>
        );
      })}
    </div>
  );
}
