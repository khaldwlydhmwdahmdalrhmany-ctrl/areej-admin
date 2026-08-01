// ============================================================
// نظام التصميم الموحّد — أريج النقاء
// كل الألوان والقياسات والمحتوى المشترك يُشتق من هنا.
// ============================================================

export const C = {
  // الهوية الأساسية
  navy: "#0C1C77",
  navyDeep: "#071233",
  teal: "#00C6C7",
  cyan: "#00B9D6",
  mint: "#A9E2BD",
  mintTint: "#EAF8F1",

  // الأسطح
  pearl: "#FFFFFF",
  offWhite: "#F6FAF9",
  sand: "#FBFDFC",

  // النص — تباين محسّن (AA فأعلى على الخلفيات الفاتحة)
  ink: "#0B1220",
  slate: "#4A5A63",      // كان #5C6B72 — رُفع التباين إلى 7.1:1
  slateLight: "#6B7A82",

  // الحدود والفواصل
  line: "#E1ECE8",
  lineSoft: "#EEF5F2",

  // ألوان دلالية
  danger: "#D64545",
  success: "#1B9C68",
  warning: "#E08A1E",
  gold: "#F2B01E",

  // السعر القديم — أحمر مشطوب: إشارة بصرية فورية بأن السعر انخفض
  oldPrice: "#D64545",
};

// تدرجات جاهزة
export const G = {
  brand: `linear-gradient(135deg, ${C.navy}, ${C.teal})`,
  deep: `linear-gradient(120deg, ${C.navy}, ${C.navyDeep})`,
  soft: `linear-gradient(160deg, ${C.mintTint}, ${C.pearl})`,
  aqua: `linear-gradient(135deg, ${C.teal}, ${C.cyan})`,
};

// ظلال متدرجة
export const SH = {
  sm: "0 2px 8px -4px rgba(12,28,119,0.14)",
  md: "0 10px 24px -14px rgba(12,28,119,0.22)",
  lg: "0 22px 44px -22px rgba(12,28,119,0.30)",
  glow: `0 0 0 4px ${C.teal}22`,
};

// ============================================================
// التسعير والواتساب
// ============================================================

export const formatPrice = (n) => Number(n).toLocaleString("ar-SA");

export const discountPercent = (price, oldPrice) =>
  oldPrice && oldPrice > price ? Math.round(100 - (price / oldPrice) * 100) : 0;

export const WHATSAPP_NUMBER = "966532540595";

export const buildWhatsAppLink = (message) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

// رسالة "اشتر الآن" لمنتج واحد — تنقل مباشرة لواتساب
export const buyNowLink = (product) =>
  buildWhatsAppLink(
    `السلام عليكم، أرغب في طلب:\n\n• ${product.name}\n• السعر: ${formatPrice(product.price)} ر.س\n\nأرجو تزويدي بالتفاصيل.`
  );

// ============================================================
// عناصر الثقة — تُستخدم في كل صفحات الموقع
// ملاحظة: العناصر الرقمية (عدد العملاء / متوسط التقييم) معطّلة
// حتى تُعتمد أرقام حقيقية، تفاديًا لادعاءات غير موثّقة.
// ============================================================

export const TRUST_ITEMS = [
  { icon: "ShieldCheck", label: "ضمان حتى 3 سنوات" },
  { icon: "BadgeCheck", label: "قطع أصلية 100%" },
  { icon: "Wrench", label: "فنيون معتمدون" },
  { icon: "Lock", label: "دفع آمن" },
  { icon: "Truck", label: "شحن لكل المملكة" },
  { icon: "RotateCcw", label: "إمكانية الاسترجاع" },
];

export const FEATURE_ITEMS = [
  { icon: "ShieldCheck", title: "ضمان حتى 3 سنوات", desc: "ضمان معتمد على أجهزة التحلية والبرادات." },
  { icon: "Truck", title: "شحن سريع", desc: "توصيل لجميع مناطق المملكة خلال 2–5 أيام." },
  { icon: "Wrench", title: "تركيب مجاني", desc: "فريق فني معتمد يركّب الجهاز في منزلك." },
  { icon: "Wallet", title: "تقسيط بدون فوائد", desc: "قسّم مشترياتك عبر تابي وتمارا على 4 دفعات." },
];
