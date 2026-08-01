/**
 * إعدادات المنصات التحليلية والإعلانية.
 *
 * الفلسفة: Google Tag Manager هو نقطة الدخول الوحيدة. أي بكسل جديد
 * (ميتا، تيك توك، سناب، X) يُثبَّت من داخل حاوية GTM بلا لمس الكود.
 * حقول GA4 وClarity وUET موجودة كبديل لمن يفضّل التثبيت المباشر،
 * لكن الأنظف تركها فارغة وإدارتها كلها من GTM.
 */

export const ANALYTICS_SETTINGS = [
  {
    key: "gtm_id",
    label: "معرّف Google Tag Manager",
    placeholder: "GTM-XXXXXXX",
    pattern: /^GTM-[A-Z0-9]{4,}$/i,
    note: "الأهم — ثبّت منه كل البكسلات لاحقًا بلا تعديل الكود.",
    primary: true,
  },
  {
    key: "ga4_id",
    label: "معرّف Google Analytics 4",
    placeholder: "G-XXXXXXXXXX",
    pattern: /^G-[A-Z0-9]{6,}$/i,
    note: "اتركه فارغًا إن كنت ستربط GA4 من داخل GTM (الأفضل).",
  },
  {
    key: "gads_id",
    label: "معرّف Google Ads",
    placeholder: "AW-XXXXXXXXX",
    pattern: /^AW-\d{6,}$/i,
    note: "لتتبّع التحويلات الإعلانية مباشرة.",
  },
  {
    key: "clarity_id",
    label: "معرّف Microsoft Clarity",
    placeholder: "abcdefghij",
    note: "خرائط حرارية وتسجيل جلسات — مجاني بالكامل.",
  },
  {
    key: "uet_id",
    label: "معرّف Microsoft Ads (UET)",
    placeholder: "123456789",
    pattern: /^\d{6,}$/,
    note: "بكسل إعلانات بينغ ومايكروسوفت.",
  },
  {
    key: "gsc_verification",
    label: "توثيق Google Search Console",
    placeholder: "محتوى وسم google-site-verification",
    note: "الصق قيمة content فقط، لا الوسم كاملًا.",
  },
  {
    key: "bing_verification",
    label: "توثيق Bing Webmaster",
    placeholder: "محتوى وسم msvalidate.01",
  },
];

export const ANALYTICS_KEYS = ANALYTICS_SETTINGS.map((a) => a.key);

/** يتحقق من صيغة المعرّف قبل حقنه في الصفحة. */
export function validateAnalyticsId(key, value) {
  if (!value) return null;
  const def = ANALYTICS_SETTINGS.find((a) => a.key === key);
  if (def?.pattern && !def.pattern.test(value.trim())) {
    return `صيغة ${def.label} غير صحيحة — المتوقع مثل ${def.placeholder}`;
  }
  return null;
}

/**
 * أحداث التجارة الإلكترونية القياسية (GA4 Ecommerce).
 * تُدفَع إلى dataLayer فتلتقطها كل البكسلات المثبّتة في GTM دفعة واحدة —
 * تكتب الحدث مرة، ويستفيد منه ميتا وتيك توك وسناب وجوجل معًا.
 */
export function pushEvent(name, payload = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: name, ...payload });
}

const toItem = (p, qty = 1) => ({
  item_id: p.id,
  item_name: p.name,
  item_brand: p.brand || undefined,
  item_category: p.category?.name || undefined,
  price: Number(p.price),
  quantity: qty,
});

export const trackViewItem = (p) =>
  pushEvent("view_item", { currency: "SAR", value: Number(p.price), items: [toItem(p)] });

export const trackAddToCart = (p, qty = 1) =>
  pushEvent("add_to_cart", { currency: "SAR", value: Number(p.price) * qty, items: [toItem(p, qty)] });

export const trackBeginCheckout = (details, total) =>
  pushEvent("begin_checkout", {
    currency: "SAR",
    value: Number(total),
    items: details.map((d) => toItem(d.product, d.qty)),
  });

export const trackPurchase = (orderNumber, details, total, attribution) =>
  pushEvent("purchase", {
    transaction_id: orderNumber,
    currency: "SAR",
    value: Number(total),
    items: details.map((d) => toItem(d.product, d.qty)),
    traffic_source: attribution?.source,
    traffic_medium: attribution?.medium,
  });

export const trackLead = (type, ref) =>
  pushEvent("generate_lead", { lead_type: type, transaction_id: ref, currency: "SAR", value: 0 });
