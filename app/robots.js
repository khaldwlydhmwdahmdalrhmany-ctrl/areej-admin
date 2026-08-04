import { siteUrl } from "../lib/seo.jsx";

/**
 * robots.txt — يمنع فهرسة لوحة التحكم ومسارات الـ API،
 * ويشير إلى خريطة الموقع المتولّدة تلقائيًا.
 */
export default function robots() {
  const base = siteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",          // لوحة التحكم
          "/api/",           // مسارات البيانات
          "/*?utm_",         // نسخ مكررة بوسوم الحملات
          "/*?gclid",
          "/*?fbclid",
        ],
      },
      // زواحف الذكاء الاصطناعي التي لا تُرسل زيارات — تُستهلك النطاق بلا مقابل
      { userAgent: "GPTBot", disallow: "/" },
      { userAgent: "CCBot", disallow: "/" },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
