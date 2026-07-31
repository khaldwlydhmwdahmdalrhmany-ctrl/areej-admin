"use client";
import React from "react";
import Link from "next/link";
import { ShoppingCart, Truck, Wrench, Zap } from "lucide-react";
import { C, SH, formatPrice, buyNowLink } from "../../lib/colors.js";
import ProductVisual from "./ProductVisual.jsx";
import Rating from "./Rating.jsx";
import StockBadge from "./StockBadge.jsx";
import { useCart } from "../../context/CartContext.jsx";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const hasDiscount = product.oldPrice && product.oldPrice > product.price;
  const soldOut = product.stock === "out_of_stock";

  return (
    <article
      className="lift group flex flex-col rounded-2xl overflow-hidden h-full"
      style={{ background: "#fff", border: `1px solid ${C.line}`, boxShadow: SH.sm }}
    >
      <Link href={`/product/${product.id}`} className="zoom-wrap block relative">
        <ProductVisual product={product} />
        {soldOut && (
          <span
            className="absolute inset-0 flex items-center justify-center text-sm font-bold"
            style={{ background: "rgba(255,255,255,.72)", color: C.danger }}
          >
            غير متوفر حاليًا
          </span>
        )}
      </Link>

      <div className="p-3.5 sm:p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-bold truncate" style={{ color: product.category?.color || C.navy }}>
            {product.category?.name}
          </span>
          {product.brand && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0" style={{ background: C.offWhite, color: C.slate }}>
              {product.brand}
            </span>
          )}
        </div>

        <Link href={`/product/${product.id}`}>
          <h3 className="font-bold text-sm leading-snug line-clamp-2" style={{ color: C.ink }}>
            {product.name}
          </h3>
        </Link>

        <Rating rating={product.rating} reviewCount={product.reviewCount} />

        <p className="text-xs leading-relaxed line-clamp-2 flex-1" style={{ color: C.slate }}>
          {product.description}
        </p>

        {(product.freeShipping || product.freeInstall) && (
          <div className="flex flex-wrap gap-1.5">
            {product.freeShipping && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full" style={{ background: C.mintTint, color: C.navy }}>
                <Truck size={11} /> شحن مجاني
              </span>
            )}
            {product.freeInstall && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full" style={{ background: C.mintTint, color: C.navy }}>
                <Wrench size={11} /> تركيب مجاني
              </span>
            )}
          </div>
        )}

        <div className="flex items-end justify-between gap-2 mt-1">
          <div className="flex flex-col">
            {hasDiscount && (
              <span className="text-[11px] line-through" style={{ color: C.slateLight }}>
                {formatPrice(product.oldPrice)} ر.س
              </span>
            )}
            <span className="font-display text-base sm:text-lg leading-none" style={{ color: C.navy }}>
              {formatPrice(product.price)} <span className="text-[11px] font-normal">ر.س</span>
            </span>
          </div>
          <StockBadge stock={product.stock} />
        </div>

        {/* زرّا الشراء */}
        <div className="grid grid-cols-2 gap-2 mt-2">
          <button
            onClick={() => addToCart(product.id)}
            disabled={soldOut}
            className="btn py-2.5 text-[12px]"
            style={{ background: C.mintTint, color: C.navy }}
            aria-label={`أضف ${product.name} إلى السلة`}
          >
            <ShoppingCart size={14} /> للسلة
          </button>

          <a
            href={soldOut ? undefined : buyNowLink(product)}
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={soldOut}
            className="btn py-2.5 text-[12px]"
            style={{
              background: soldOut ? C.lineSoft : C.navy,
              color: soldOut ? C.slateLight : "#fff",
              pointerEvents: soldOut ? "none" : "auto",
            }}
          >
            <Zap size={14} /> اشترِ الآن
          </a>
        </div>
      </div>
    </article>
  );
}
