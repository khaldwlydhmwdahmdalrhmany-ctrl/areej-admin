"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { C } from "../../lib/colors.js";
import { getIcon } from "../../lib/iconMap.js";
import ProductCard from "./ProductCard.jsx";

export default function ProductBrowser({ categories, products, activeCatSlug }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const q = query.trim();
      return q === "" || p.name.includes(q) || (p.description || "").includes(q);
    });
  }, [products, query]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div className="relative w-full sm:w-72 order-2 sm:order-1">
          <Search size={16} className="absolute top-1/2 -translate-y-1/2 right-3" color={C.teal} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ابحث عن منتج..." className="w-full pr-9 pl-3 py-2.5 rounded-full text-sm outline-none" style={{ border: `1.5px solid ${C.line}`, background: C.pearl }} />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 order-1 sm:order-2 -mx-1 px-1">
          <Link href="/shop" className="shrink-0 px-4 py-2 rounded-full text-sm font-bold" style={!activeCatSlug ? { background: C.navy, color: C.pearl } : { background: C.pearl, color: C.navy, border: `1.5px solid ${C.line}` }}>
            الكل
          </Link>
          {categories.map((c) => {
            const Icon = getIcon(c.icon);
            return (
              <Link key={c.id} href={`/category/${c.slug}`} className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold" style={activeCatSlug === c.slug ? { background: c.color, color: C.pearl } : { background: C.pearl, color: c.color, border: `1.5px solid ${C.line}` }}>
                <Icon size={14} /> {c.name}
              </Link>
            );
          })}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16" style={{ color: C.slate }}>لا توجد منتجات مطابقة لبحثك.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((p) => (<ProductCard key={p.id} product={p} />))}
        </div>
      )}
    </div>
  );
}
