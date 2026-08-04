/**
 * شارات المنتجات — جاهزة ومصنّفة، مع إمكانية كتابة شارة مخصّصة.
 *
 * `offers: true` تعني أن المنتج يظهر في صفحة العروض حتى لو لم يكن
 * عليه خصم سعري — فبعض العروض حزم أو هدايا لا تخفيضات.
 */

export const BADGES = [
  // ترويجية — تُدرج المنتج في صفحة العروض
  { value: "عرض خاص",      color: "#D64545", group: "ترويجية", offers: true },
  { value: "خصم محدود",     color: "#D64545", group: "ترويجية", offers: true },
  { value: "عرض الأسبوع",   color: "#E0561E", group: "ترويجية", offers: true },
  { value: "تصفية",         color: "#B93030", group: "ترويجية", offers: true },
  { value: "باقة موفّرة",    color: "#7C3AED", group: "ترويجية", offers: true },
  { value: "هدية مع المنتج", color: "#C026A3", group: "ترويجية", offers: true },

  // رواج
  { value: "الأكثر مبيعًا",  color: "#F2B01E", group: "رواج" },
  { value: "الأكثر طلبًا",   color: "#F2B01E", group: "رواج" },
  { value: "اختيار العملاء", color: "#E08A1E", group: "رواج" },
  { value: "الأفضل قيمة",   color: "#1B9C68", group: "رواج" },

  // حالة المنتج
  { value: "جديد",          color: "#00B9D6", group: "حالة" },
  { value: "وصل حديثًا",     color: "#00B9D6", group: "حالة" },
  { value: "كمية محدودة",   color: "#E08A1E", group: "حالة" },
  { value: "حصري",          color: "#0C1C77", group: "حالة" },

  // مزايا
  { value: "شحن مجاني",     color: "#1B9C68", group: "مزايا" },
  { value: "تركيب مجاني",   color: "#1B9C68", group: "مزايا" },
  { value: "ضمان ٣ سنوات",  color: "#0C1C77", group: "مزايا" },
  { value: "موفّر للطاقة",   color: "#0C7A55", group: "مزايا" },
];

export const BADGE_GROUPS = [...new Set(BADGES.map((b) => b.group))];

/** الشارات التي تُدرج المنتج في صفحة العروض. */
export const OFFER_BADGES = BADGES.filter((b) => b.offers).map((b) => b.value);

export function badgeMeta(value) {
  return BADGES.find((b) => b.value === value) || null;
}

/** لون الشارة — مخصّصة غير معروفة تأخذ اللون الكحلي الافتراضي. */
export function badgeColor(value) {
  return badgeMeta(value)?.color || "#0C1C77";
}

/** هل ينتمي المنتج لصفحة العروض؟ */
export function isOfferProduct(product) {
  if (!product) return false;
  if (product.oldPrice && product.oldPrice > product.price) return true;
  return OFFER_BADGES.includes(product.badge);
}
