"use client";
import React, { useState } from "react";

const C = { navy: "#0C1C77", slate: "#4A5A63", line: "#E1ECE8", teal: "#00C6C7" };

const STATUS_STYLE = {
  "جديد":        { bg: "#EAF2FF", fg: "#1E4DB7" },
  "قيد التجهيز": { bg: "#FFF4E0", fg: "#8A6200" },
  "تم الشحن":    { bg: "#E6F7FF", fg: "#0A7490" },
  "مكتمل":       { bg: "#E7F7EF", fg: "#1B7A52" },
  "ملغي":        { bg: "#FDECEC", fg: "#B93030" },
};

const STATUSES = ["جديد", "قيد التجهيز", "تم الشحن", "مكتمل", "ملغي"];

export default function OrderCard({ order }) {
  const [status, setStatus] = useState(order.status || "جديد");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  let items = [];
  try { items = JSON.parse(order.itemsJson || "[]"); } catch { items = []; }

  const change = async (next) => {
    const prev = status;
    setStatus(next); setSaving(true); setError("");
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "فشل التحديث");
    } catch (e) {
      setStatus(prev);           // تراجع بصري عند الفشل
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const st = STATUS_STYLE[status] || STATUS_STYLE["جديد"];
  const date = order.createdAt ? new Date(order.createdAt).toLocaleString("ar-SA") : "";

  return (
    <div className="p-4 rounded-2xl" style={{ background: "#fff", border: `1px solid ${C.line}` }}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          {order.orderNumber && (
            <span
              className="inline-block text-[11px] font-bold px-2 py-0.5 rounded-md mb-1.5 tracking-wide"
              dir="ltr"
              style={{ background: "#EAF2FF", color: "#1E4DB7" }}
            >
              {order.orderNumber}
            </span>
          )}
          <p className="font-bold text-sm" style={{ color: C.navy }}>{order.customerName}</p>
          <p className="text-xs mt-0.5" style={{ color: C.slate }}>
            <a href={`tel:${order.customerPhone}`} className="hover:underline">{order.customerPhone}</a>
            {order.customerCity && ` — ${order.customerCity}`}
          </p>
          {date && <p className="text-[11px] mt-0.5" style={{ color: C.slate }}>{date}</p>}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="font-bold text-sm" style={{ color: C.navy }}>
            {Number(order.total).toLocaleString("ar-SA")} ر.س
          </span>
          <select
            value={status}
            onChange={(e) => change(e.target.value)}
            disabled={saving}
            aria-label="حالة الطلب"
            className="text-xs font-bold px-3 py-1.5 rounded-full outline-none cursor-pointer disabled:opacity-50"
            style={{ background: st.bg, color: st.fg, border: "none" }}
          >
            {STATUSES.map((s) => (<option key={s} value={s}>{s}</option>))}
          </select>
        </div>
      </div>

      {error && <p className="text-xs mt-2" style={{ color: "#B93030" }}>{error}</p>}

      {items.length > 0 && (
        <>
          <button onClick={() => setOpen((v) => !v)} className="text-xs font-bold mt-3" style={{ color: C.teal }}>
            {open ? "إخفاء" : `عرض المنتجات (${items.length})`}
          </button>
          {open && (
            <ul className="mt-2 flex flex-col gap-1.5 pt-2" style={{ borderTop: `1px solid ${C.line}` }}>
              {items.map((it, i) => (
                <li key={i} className="flex justify-between text-xs" style={{ color: C.slate }}>
                  <span>{it.name} × {it.qty ?? it.quantity ?? 1}</span>
                  <span className="font-bold">{Number(it.price ?? 0).toLocaleString("ar-SA")} ر.س</span>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
