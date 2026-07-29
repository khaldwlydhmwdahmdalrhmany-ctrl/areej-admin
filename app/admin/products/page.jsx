"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";

const C = { navy: "#0C1C77", teal: "#00C6C7", line: "#E1ECE8", slate: "#5C6B72" };

export default function AdminProductsPage() {
  const [products, setProducts] = useState(null);
  const [error, setError] = useState("");

  const load = () => {
    fetch("/api/products").then((r) => r.json()).then(setProducts);
  };

  useEffect(() => { load(); }, []);

  const remove = async (id, name) => {
    if (!confirm(`تأكيد حذف "${name}"؟`)) return;
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (res.ok) load();
    else setError("تعذّر حذف المنتج");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-xl" style={{ color: C.navy, fontWeight: 800 }}>المنتجات</h1>
        <Link href="/admin/products/new" className="flex items-center gap-2 px-4 py-2.5 rounded-full font-bold text-sm" style={{ background: C.navy, color: "#fff" }}>
          <Plus size={16} /> منتج جديد
        </Link>
      </div>

      {error && <p className="text-sm mb-3" style={{ color: "#c05050" }}>{error}</p>}

      {!products ? (
        <p style={{ color: C.slate }}>جاري التحميل...</p>
      ) : products.length === 0 ? (
        <p style={{ color: C.slate }}>لا توجد منتجات بعد. ابدأ بإضافة أول منتج.</p>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${C.line}`, background: "#fff" }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "#F6FAF9" }}>
                <th className="text-right p-3">المنتج</th>
                <th className="text-right p-3 hidden sm:table-cell">التصنيف</th>
                <th className="text-right p-3">السعر</th>
                <th className="text-right p-3"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} style={{ borderTop: `1px solid ${C.line}` }}>
                  <td className="p-3 flex items-center gap-3">
                    {p.imageUrl ? (
                      <img src={p.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg" style={{ background: "#F6FAF9" }} />
                    )}
                    <span className="font-bold">{p.name}</span>
                  </td>
                  <td className="p-3 hidden sm:table-cell" style={{ color: C.slate }}>{p.category?.name}</td>
                  <td className="p-3 font-bold" style={{ color: C.navy }}>{p.price.toLocaleString("ar-SA")} ر.س</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2 justify-end">
                      <Link href={`/admin/products/${p.id}/edit`} className="p-2 rounded-lg" style={{ background: "#F6FAF9" }}>
                        <Pencil size={15} color={C.navy} />
                      </Link>
                      <button onClick={() => remove(p.id, p.name)} className="p-2 rounded-lg" style={{ background: "#FDEDED" }}>
                        <Trash2 size={15} color="#c05050" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
