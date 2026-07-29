import React from "react";
import { getOrders } from "../../../lib/db.js";

const C = { navy: "#0C1C77", slate: "#5C6B72", line: "#E1ECE8" };

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <div>
      <h1 className="font-display text-xl mb-2" style={{ color: C.navy, fontWeight: 800 }}>الطلبات</h1>
      {orders.length === 0 ? (
        <p className="text-sm p-6 rounded-2xl" style={{ background: "#fff", border: `1px solid ${C.line}`, color: C.slate }}>
          لا توجد طلبات مسجّلة بعد. ربط استقبال الطلبات تلقائيًا من متجر واتساب قادم في مرحلة لاحقة.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((o) => (
            <div key={o.id} className="p-4 rounded-2xl" style={{ background: "#fff", border: `1px solid ${C.line}` }}>
              <p className="font-bold text-sm">{o.customerName} — {o.customerPhone}</p>
              <p className="text-xs mt-1" style={{ color: C.slate }}>{o.total} ر.س — {o.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
