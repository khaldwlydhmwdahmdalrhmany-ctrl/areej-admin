"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const C = { navy: "#0C1C77", teal: "#00C6C7", line: "#E1ECE8", slate: "#5C6B72", mintTint: "#EAF8F1" };

export default function ProductForm({ initial, productId }) {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(
    initial || {
      name: "", description: "", fullDescription: "", price: "", oldPrice: "",
      badge: "", imageUrl: "", freeShipping: false, freeInstall: false, categoryId: "",
      brand: "", stock: "in_stock", rating: "", reviewCount: "",
    }
  );
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/categories").then((r) => r.json()).then((data) => {
      setCategories(data);
      setForm((f) => (f.categoryId ? f : { ...f, categoryId: data[0]?.id || "" }));
    });
  }, []);

  const set = (key) => (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [key]: val }));
  };

  const uploadImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    setUploading(false);
    if (!res.ok) { setError(data.error || "فشل رفع الصورة"); return; }
    setForm((f) => ({ ...f, imageUrl: data.url }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.categoryId || form.price === "") {
      setError("الاسم والتصنيف والسعر حقول مطلوبة");
      return;
    }
    setSaving(true);
    const url = productId ? `/api/products/${productId}` : "/api/products";
    const method = productId ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        oldPrice: form.oldPrice === "" ? null : form.oldPrice,
        rating: form.rating === "" ? null : form.rating,
        reviewCount: form.reviewCount === "" ? null : form.reviewCount,
        brand: form.brand?.trim() || null,
      }),
    });
    setSaving(false);
    if (res.ok) {
      router.push("/admin/products");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || "حدث خطأ أثناء الحفظ");
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4 max-w-xl">
      <div>
        <label className="text-xs font-bold" style={{ color: C.navy }}>اسم المنتج</label>
        <input value={form.name} onChange={set("name")} className="w-full mt-1 px-4 py-2.5 rounded-xl text-sm outline-none" style={{ border: `1.5px solid ${C.line}` }} />
      </div>

      <div>
        <label className="text-xs font-bold" style={{ color: C.navy }}>التصنيف</label>
        <select value={form.categoryId} onChange={set("categoryId")} className="w-full mt-1 px-4 py-2.5 rounded-xl text-sm outline-none bg-white" style={{ border: `1.5px solid ${C.line}` }}>
          {categories.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
        </select>
      </div>

      <div>
        <label className="text-xs font-bold" style={{ color: C.navy }}>وصف مختصر (يظهر في بطاقة المنتج)</label>
        <textarea value={form.description} onChange={set("description")} rows={2} className="w-full mt-1 px-4 py-2.5 rounded-xl text-sm outline-none resize-none" style={{ border: `1.5px solid ${C.line}` }} />
      </div>

      <div>
        <label className="text-xs font-bold" style={{ color: C.navy }}>الوصف الكامل (يظهر في صفحة المنتج)</label>
        <textarea value={form.fullDescription} onChange={set("fullDescription")} rows={4} className="w-full mt-1 px-4 py-2.5 rounded-xl text-sm outline-none resize-none" style={{ border: `1.5px solid ${C.line}` }} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold" style={{ color: C.navy }}>السعر (ريال)</label>
          <input type="number" value={form.price} onChange={set("price")} className="w-full mt-1 px-4 py-2.5 rounded-xl text-sm outline-none" style={{ border: `1.5px solid ${C.line}` }} />
        </div>
        <div>
          <label className="text-xs font-bold" style={{ color: C.navy }}>السعر قبل الخصم (اختياري)</label>
          <input type="number" value={form.oldPrice} onChange={set("oldPrice")} className="w-full mt-1 px-4 py-2.5 rounded-xl text-sm outline-none" style={{ border: `1.5px solid ${C.line}` }} />
        </div>
      </div>

      <div>
        <label className="text-xs font-bold" style={{ color: C.navy }}>شارة المنتج (اختياري، مثل: جديد / عرض)</label>
        <input value={form.badge} onChange={set("badge")} className="w-full mt-1 px-4 py-2.5 rounded-xl text-sm outline-none" style={{ border: `1.5px solid ${C.line}` }} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold" style={{ color: C.navy }}>الماركة (اختياري)</label>
          <input
            value={form.brand || ""}
            onChange={set("brand")}
            placeholder="مثال: GuldenPRO"
            className="w-full mt-1 px-4 py-2.5 rounded-xl text-sm outline-none"
            style={{ border: `1.5px solid ${C.line}` }}
          />
          <p className="text-[11px] mt-1" style={{ color: C.slate }}>تظهر كخيار في فلتر الماركات بالمتجر.</p>
        </div>
        <div>
          <label className="text-xs font-bold" style={{ color: C.navy }}>حالة التوفر</label>
          <select
            value={form.stock || "in_stock"}
            onChange={set("stock")}
            className="w-full mt-1 px-4 py-2.5 rounded-xl text-sm outline-none bg-white"
            style={{ border: `1.5px solid ${C.line}` }}
          >
            <option value="in_stock">متوفر</option>
            <option value="low_stock">كمية محدودة</option>
            <option value="out_of_stock">غير متوفر حاليًا</option>
            <option value="preorder">حجز مسبق</option>
          </select>
          <p className="text-[11px] mt-1" style={{ color: C.slate }}>«غير متوفر» يعطّل أزرار الشراء تلقائيًا.</p>
        </div>
      </div>

      <div className="p-4 rounded-xl" style={{ background: "#FFF8E7", border: "1px solid #F2B01E44" }}>
        <p className="text-xs font-bold mb-1" style={{ color: "#8A6200" }}>التقييمات — أدخل أرقامًا حقيقية فقط</p>
        <p className="text-[11px] leading-relaxed mb-3" style={{ color: "#8A6200" }}>
          اتركهما فارغين إن لم توجد تقييمات فعلية؛ عندها لا تظهر أي نجوم في المتجر.
          نشر تقييمات غير حقيقية مخالف لنظام التجارة الإلكترونية السعودي وقد يعاقب عليه محرك البحث.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold" style={{ color: C.navy }}>متوسط التقييم (1–5)</label>
            <input
              type="number" step="0.1" min="1" max="5"
              value={form.rating ?? ""}
              onChange={set("rating")}
              placeholder="فارغ = بلا تقييم"
              className="w-full mt-1 px-4 py-2.5 rounded-xl text-sm outline-none"
              style={{ border: `1.5px solid ${C.line}` }}
            />
          </div>
          <div>
            <label className="text-xs font-bold" style={{ color: C.navy }}>عدد التقييمات</label>
            <input
              type="number" min="0"
              value={form.reviewCount ?? ""}
              onChange={set("reviewCount")}
              placeholder="فارغ = بلا تقييم"
              className="w-full mt-1 px-4 py-2.5 rounded-xl text-sm outline-none"
              style={{ border: `1.5px solid ${C.line}` }}
            />
          </div>
        </div>
      </div>

      <div>
        <label className="text-xs font-bold" style={{ color: C.navy }}>صورة المنتج</label>
        <div className="flex items-center gap-3 mt-1">
          {form.imageUrl && <img src={form.imageUrl} alt="" className="w-16 h-16 rounded-xl object-cover" style={{ border: `1px solid ${C.line}` }} />}
          <input type="file" accept="image/png,image/jpeg,image/webp" onChange={uploadImage} className="text-sm" />
        </div>
        {uploading && <p className="text-xs mt-1" style={{ color: C.slate }}>جاري رفع الصورة...</p>}
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm font-bold" style={{ color: C.navy }}>
          <input type="checkbox" checked={form.freeShipping} onChange={set("freeShipping")} /> شحن مجاني
        </label>
        <label className="flex items-center gap-2 text-sm font-bold" style={{ color: C.navy }}>
          <input type="checkbox" checked={form.freeInstall} onChange={set("freeInstall")} /> تركيب مجاني
        </label>
      </div>

      {error && <p className="text-sm" style={{ color: "#c05050" }}>{error}</p>}

      <button type="submit" disabled={saving} className="w-full py-3 rounded-full font-bold text-sm" style={{ background: C.navy, color: "#fff" }}>
        {saving ? "جاري الحفظ..." : productId ? "حفظ التعديلات" : "إضافة المنتج"}
      </button>
    </form>
  );
}
