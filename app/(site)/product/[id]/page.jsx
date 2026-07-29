import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShieldCheck, Truck, Wrench } from "lucide-react";
import { getProductById, getProducts } from "../../../../lib/db.js";
import { C, formatPrice } from "../../../../lib/colors.js";
import ProductVisual from "../../../../components/site/ProductVisual.jsx";
import ProductCard from "../../../../components/site/ProductCard.jsx";
import InstallmentBadge from "../../../../components/site/InstallmentBadge.jsx";
import ProductActions from "../../../../components/site/ProductActions.jsx";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }) {
  const product = await getProductById(params.id);
  if (!product) notFound();

  const allProducts = await getProducts({ categorySlug: product.category?.slug });
  const related = allProducts.filter((p) => p.id !== product.id).slice(0, 4);
  const hasDiscount = product.oldPrice && product.oldPrice > product.price;

  return (
    <div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 text-xs" style={{ color: C.slate }}>
        <Link href="/">الرئيسية</Link> <span className="mx-1">/</span>
        <Link href={`/category/${product.category?.slug}`}>{product.category?.name}</Link> <span className="mx-1">/</span>
        <span style={{ color: C.ink }}>{product.name}</span>
      </div>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-14 grid md:grid-cols-2 gap-8">
        <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${C.line}` }}>
          <ProductVisual product={product} heightClass="h-72 sm:h-96" />
        </div>

        <div className="flex flex-col gap-4">
          <span className="text-xs font-bold" style={{ color: product.category?.color || C.navy }}>{product.category?.name}</span>
          <h1 className="font-display text-2xl sm:text-3xl" style={{ color: C.navy }}>{product.name}</h1>

          <div className="flex items-center gap-3">
            {hasDiscount && <span className="text-sm line-through" style={{ color: C.slate }}>{formatPrice(product.oldPrice)} ر.س</span>}
            <span className="font-display text-2xl" style={{ color: C.navy }}>{formatPrice(product.price)} ر.س</span>
            {hasDiscount && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: "#D64545", color: "#fff" }}>
                خصم {Math.round(100 - (product.price / product.oldPrice) * 100)}%
              </span>
            )}
          </div>

          <InstallmentBadge price={product.price} />

          <p className="text-sm leading-relaxed" style={{ color: C.slate }}>{product.fullDescription || product.description}</p>

          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: C.mintTint, color: C.navy }}>
              <ShieldCheck size={13} /> ضمان حتى 3 سنوات
            </span>
            {product.freeShipping && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: C.mintTint, color: C.navy }}>
                <Truck size={13} /> شحن مجاني
              </span>
            )}
            {product.freeInstall && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: C.mintTint, color: C.navy }}>
                <Wrench size={13} /> تركيب مجاني
              </span>
            )}
          </div>

          <ProductActions product={product} />
        </div>
      </section>

      {related.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-14">
          <h2 className="font-display text-xl sm:text-2xl mb-6" style={{ color: C.navy }}>منتجات ذات صلة</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {related.map((p) => (<ProductCard key={p.id} product={p} />))}
          </div>
        </section>
      )}
    </div>
  );
}
