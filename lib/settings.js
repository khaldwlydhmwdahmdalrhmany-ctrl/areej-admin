/**
 * مفاتيح الإعدادات العامة — مصدر واحد يستخدمه الموقع ولوحة التحكم.
 * الروابط الفارغة لا تُعرض إطلاقًا: أيقونة تواصل تقود إلى لا شيء
 * أسوأ من غيابها.
 */

export const SOCIAL_LINKS = [
  { key: "social_whatsapp", label: "واتساب",   icon: "MessageCircle", color: "#25D366", placeholder: "https://wa.me/9665xxxxxxxx" },
  { key: "social_instagram", label: "إنستغرام", icon: "Instagram",     color: "#E4405F", placeholder: "https://instagram.com/username" },
  { key: "social_x",         label: "منصة X",   icon: "Twitter",       color: "#000000", placeholder: "https://x.com/username" },
  { key: "social_tiktok",    label: "تيك توك",  icon: "Music2",        color: "#010101", placeholder: "https://tiktok.com/@username" },
  { key: "social_snapchat",  label: "سناب شات", icon: "Ghost",         color: "#FFFC00", placeholder: "https://snapchat.com/add/username" },
  { key: "social_youtube",   label: "يوتيوب",   icon: "Youtube",       color: "#FF0000", placeholder: "https://youtube.com/@channel" },
  { key: "social_linkedin",  label: "لينكدإن",  icon: "Linkedin",      color: "#0A66C2", placeholder: "https://linkedin.com/company/name" },
  { key: "social_facebook",  label: "فيسبوك",   icon: "Facebook",      color: "#1877F2", placeholder: "https://facebook.com/page" },
];

export const CONTACT_SETTINGS = [
  { key: "contact_phone",   label: "رقم الهاتف",        placeholder: "+966 53 254 0595" },
  { key: "contact_email",   label: "البريد الإلكتروني",  placeholder: "info@example.com" },
  { key: "contact_address", label: "العنوان",            placeholder: "الرياض، المملكة العربية السعودية" },
  { key: "contact_hours",   label: "أوقات العمل",        placeholder: "السبت – الخميس، 9 ص – 9 م" },
  { key: "map_query",       label: "موقع الخريطة",       placeholder: "اسم المعرض أو الإحداثيات — يظهر خريطة Google" },
];

export const ALL_SETTING_KEYS = [
  ...SOCIAL_LINKS.map((s) => s.key),
  ...CONTACT_SETTINGS.map((s) => s.key),
];

/** يعيد فقط الروابط المعبّأة فعلًا. */
export function activeSocials(settings = {}) {
  return SOCIAL_LINKS
    .map((s) => ({ ...s, href: (settings[s.key] || "").trim() }))
    .filter((s) => s.href.length > 0);
}
