import "./globals.css";

export const metadata = {
  title: "أريج النقاء المتميز لتحلية المياه",
  description: "أجهزة تحلية وتنقية مياه، برادات، ومحطات تحلية.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
