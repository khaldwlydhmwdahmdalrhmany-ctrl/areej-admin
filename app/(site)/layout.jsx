import React from "react";
import { getCategories, getProducts, getSettings } from "../../lib/db.js";
import { CartProvider } from "../../context/CartContext.jsx";
import Ticker, { AnnouncementBar } from "../../components/site/Ticker.jsx";
import Header from "../../components/site/Header.jsx";
import Footer from "../../components/site/Footer.jsx";
import CartDrawer from "../../components/site/CartDrawer.jsx";
import VisitTracker from "../../components/site/VisitTracker.jsx";

export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }) {
  const [categories, allProducts, settings] = await Promise.all([
    getCategories(),
    getProducts(),
    getSettings().catch(() => ({})),   // الإعدادات ليست حرجة — لا نُسقط الصفحة إن فشلت
  ]);

  return (
    <CartProvider allProducts={allProducts}>
      <AnnouncementBar settings={settings} />
      <Ticker settings={settings} />
      <Header categories={categories} />
      <main>{children}</main>
      <Footer settings={settings} />
      <CartDrawer />
      <VisitTracker />
    </CartProvider>
  );
}
