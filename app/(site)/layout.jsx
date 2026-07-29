import React from "react";
import { getCategories, getProducts } from "../../lib/db.js";
import { CartProvider } from "../../context/CartContext.jsx";
import Ticker from "../../components/site/Ticker.jsx";
import Header from "../../components/site/Header.jsx";
import Footer from "../../components/site/Footer.jsx";
import CartDrawer from "../../components/site/CartDrawer.jsx";

export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }) {
  const [categories, allProducts] = await Promise.all([getCategories(), getProducts()]);

  return (
    <CartProvider allProducts={allProducts}>
      <Ticker />
      <Header categories={categories} />
      <main>{children}</main>
      <Footer />
      <CartDrawer />
    </CartProvider>
  );
}
