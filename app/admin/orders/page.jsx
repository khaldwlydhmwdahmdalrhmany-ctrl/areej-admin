import React from "react";
import { getOrders } from "../../../lib/db.js";
import OrderCard from "../../../components/OrderCard.jsx";

const C = { navy: "#0C1C77", slate: "#4A5A63", line: "#E1ECE8" };

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  const counts = orders.reduce((acc, o) => {
    const k = o.status || "جديد";
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <h1 className="font-display text-xl mb-1" style={{ color: C.navy, fontWeight: 800 }}>الطلبات</h1>
      <p className="text-xs mb-5" style={{ color: C.slate }}>
        تُسجَّل الطلبات تلقائيًا عند إتمام أي عملية من السلة، قبل التحويل إلى واتساب.
      </p>

      {orders.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">
          {Object.entries(counts).map(([k, n]) => (
            <span key={k} className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: "#fff", border: `1px solid ${C.line}`, color: C.navy }}>
              {k}: {n}
            </span>
          ))}
        </div>
      )}

      {orders.length === 0 ? (
        <p className="text-sm p-6 rounded-2xl" style={{ background: "#fff", border: `1px solid ${C.line}`, color: C.slate }}>
          لا توجد طلبات مسجّلة بعد.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((o) => (<OrderCard key={o.id} order={o} />))}
        </div>
      )}
    </div>
  );
}
