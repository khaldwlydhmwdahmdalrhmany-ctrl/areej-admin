import "./globals.css";
import { getSettings } from "../lib/db.js";
import AnalyticsScripts, { GtmNoScript } from "../components/site/AnalyticsScripts.jsx";

export const metadata = {
  metadataBase: new URL("https://areej-alnaqaa-admin.vercel.app"),
  title: {
    default: "أريج النقاء المتميز لتحلية المياه",
    template: "%s | أريج النقاء",
  },
  description:
    "متجر أريج النقاء لأجهزة تحلية وتنقية المياه، البرادات، الفلاتر، ومحطات التحلية في المملكة العربية السعودية — مع ضمان حتى 3 سنوات وتركيب معتمد.",
  keywords: ["تحلية المياه", "فلاتر مياه", "أجهزة تنقية", "محطات تحلية", "السعودية"],
  openGraph: {
    type: "website",
    locale: "ar_SA",
    siteName: "أريج النقاء المتميز لتحلية المياه",
    title: "أريج النقاء المتميز لتحلية المياه",
    description: "أجهزة تحلية وتنقية مياه، برادات، فلاتر، ومحطات تحلية — بضمان وتركيب معتمد.",
  },
  robots: { index: true, follow: true },
};

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
        {children}
      </body>
    </html>
  );
}
