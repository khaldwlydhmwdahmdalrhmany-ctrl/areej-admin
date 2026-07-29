"use client";
import React from "react";
import Link from "next/link";
import { Plus, Truck, Wrench } from "lucide-react";
import { C, formatPrice } from "../../lib/colors.js";
import ProductVisual from "./ProductVisual.jsx";
import { useCart } from "../../context/CartContext.jsx";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const hasDiscount = product.oldPrice && product.oldPrice > product.price;

  return (
    <div className="lift overflow-hidden flex flex-col rounded-2xl" style={{ background: "#fff", border: `1px solid ${C.line}` }}>
      <Link href={`/product/${product.id}`}>
        <ProductVisual product={product} />
      </Link>
      <div className="p-3.5 flex flex-col gap-2 flex-1">
        <span className="text-[11px] font-bold" style={{ color: product.category?.color || C.navy }}>{product.category?.name}</span>
        <Link href={`/product/${product.id}`}>
          <h3 className="font-bold text-sm leading-snug" style={{ color: C.ink }}>{product.name}</h3>
        </Link>
        <p className="text-xs leading-relaxed flex-1" style={{ color: C.slate }}>{product.description}</p>

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

        <div className="flex items-center justify-between mt-1">
          <div className="flex flex-col">
            {hasDiscount && <span className="text-[11px] line-through" style={{ color: C.slate }}>{formatPrice(product.oldPrice)} ر.س</span>}
            <span className="font-display text-base" style={{ color: C.navy }}>{formatPrice(product.price)} ر.س</span>
          </div>
          <button onClick={() => addToCart(product.id)} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: C.mintTint, color: C.navy }} aria-label={`أضف ${product.name} إلى السلة`}>
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
