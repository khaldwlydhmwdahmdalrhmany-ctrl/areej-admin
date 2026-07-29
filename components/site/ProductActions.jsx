"use client";
import React, { useState } from "react";
import { ShoppingCart, Plus, Minus, MessageCircle } from "lucide-react";
import { C, formatPrice, buildWhatsAppLink } from "../../lib/colors.js";
import { useCart } from "../../context/CartContext.jsx";

export default function ProductActions({ product }) {
  const { addToCart, buyNow } = useCart();
  const [qty, setQty] = useState(1);

  const askAboutProduct = () => {
    const msg = `مرحبًا أريج النقاء 🌿\nأستفسر عن: ${product.name}\nالسعر: ${formatPrice(product.price)} ريال`;
    window.open(buildWhatsAppLink(msg), "_blank");
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3 mt-2">
        <div className="flex items-center gap-2 rounded-full px-2 py-1" style={{ border: `1.5px solid ${C.line}` }}>
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: C.mintTint }}><Minus size={14} /></button>
          <span className="w-6 text-center font-bold text-sm">{qty}</span>
          <button onClick={() => setQty((q) => q + 1)} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: C.mintTint }}><Plus size={14} /></button>
        </div>
        <button onClick={() => addToCart(product.id, qty)} className="flex-1 py-3 rounded-full font-bold text-sm flex items-center justify-center gap-2" style={{ background: C.navy, color: C.pearl }}>
          <ShoppingCart size={16} /> أضف إلى السلة
        </button>
      </div>
      <div className="flex gap-3">
        <button onClick={() => buyNow(product.id)} className="flex-1 py-3 rounded-full font-bold text-sm" style={{ border: `1.5px solid ${C.navy}30`, color: C.navy }}>
          اشترِ الآن
        </button>
        <button onClick={askAboutProduct} className="flex-1 py-3 rounded-full font-bold text-sm flex items-center justify-center gap-2" style={{ background: "#25D366", color: "#fff" }}>
          <MessageCircle size={16} /> استفسار واتساب
        </button>
      </div>
    </div>
  );
}
