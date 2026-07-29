import React from "react";
import { countProducts, countCategories, countOrders } from "../../lib/db.js";
import Link from "next/link";
import SeedButton from "../../components/SeedButton.jsx";

const C = { navy: "#0C1C77", teal: "#00C6C7", slate: "#5C6B72", line: "#E1ECE8" };

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const productCount = await countProducts();
  const categoryCount = await countCategories();
  const orderCount = await countOrders();

  const cards = [
    { label: "المنتجات", value: productCount, href: "/admin/products" },
    { label: "التصنيفات", value: categoryCount, href: "/admin/categories" },
    { label: "الطلبات المسجّلة", value: orderCount, href: "/admin/orders" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-xl mb-6" style={{ color: C.navy, fontWeight: 800 }}>نظرة عامة</h1>
        <div className="grid sm:grid-cols-3 gap-4">
          {cards.map((c) => (
            <Link key={c.href} href={c.href} className="p-6 rounded-2xl" style={{ background: "#fff", border: `1px solid ${C.line}` }}>
              <p className="text-xs font-bold" style={{ color: C.slate }}>{c.label}</p>
              <p className="font-display text-3xl mt-2" style={{ color: C.navy }}>{c.value}</p>
            </Link>
          ))}
        </div>
      </div>
      {productCount === 0 && <SeedButton />}
    </div>
  );
}
