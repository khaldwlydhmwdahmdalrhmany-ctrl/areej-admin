import "./globals.css";
import { getSettings } from "../lib/queries.js";
import AnalyticsScripts, { GtmNoScript } from "../components/site/AnalyticsScripts.jsx";
import { organizationSchema, websiteSchema, JsonLd, siteUrl } from "../lib/seo.jsx";

/** العنوان والوصف والأيقونة — كلها من لوحة التحكم مع قيم افتراضية. */
export async function generateMetadata() {
  const s = await getSettings().catch(() => ({}));
  const name = (s.store_name || "أريج النقاء المتميز لتحلية المياه").trim();
  const short = (s.store_short_name || "أريج النقاء").trim();
  const desc = (s.store_description ||
    "متجر أريج النقاء لأجهزة تحلية وتنقية المياه، البرادات، الفلاتر، ومحطات التحلية في المملكة العربية السعودية — مع ضمان حتى 3 سنوات وتركيب معتمد.").trim();
  const ogImage = (s.store_og_image || "").trim();
  const favicon = (s.store_favicon || "").trim();

  return {
    metadataBase: new URL(siteUrl()),
    title: { default: name, template: `%s | ${short}` },
    description: desc,
    keywords: ["تحلية المياه", "فلاتر مياه", "أجهزة تنقية", "محطات تحلية", "السعودية"],
    ...(favicon ? { icons: { icon: favicon, apple: favicon } } : {}),
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      locale: "ar_SA",
      siteName: name,
      title: name,
      description: desc,
      url: siteUrl(),
      ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630, alt: name }] } : {}),
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title: name,
      description: desc,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
    robots: {
      index: true, follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    },
  };
}

export const viewport = {
  themeColor: "#0C1C77",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }) {
  const settings = await getSettings().catch(() => ({}));

  return (
    <html lang="ar" dir="rtl">
      <head>
        {/* preconnect يوفّر جولة ذهاب وإياب كاملة قبل طلب ملف الخط */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        {settings.gsc_verification && (
          <meta name="google-site-verification" content={settings.gsc_verification} />
        )}
        {settings.bing_verification && (
          <meta name="msvalidate.01" content={settings.bing_verification} />
        )}
      </head>
      <body>
        <GtmNoScript settings={settings} />
        <AnalyticsScripts settings={settings} />
        <JsonLd data={organizationSchema(settings)} />
        <JsonLd data={websiteSchema()} />
        {children}
      </body>
    </html>
  );
}
