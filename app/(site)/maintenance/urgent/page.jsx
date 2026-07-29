"use client";
import React, { useState } from "react";
import { Siren, MessageCircle } from "lucide-react";
import { C, buildWhatsAppLink } from "../../../../lib/colors.js";
import CategoryBanner from "../../../../components/site/CategoryBanner.jsx";

export default function UrgentMaintenancePage() {
  const [form, setForm] = useState({ name: "", phone: "", city: "", device: "", issue: "" });
  const [touched, setTouched] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const valid = form.name.trim() && form.phone.trim() && form.issue.trim();

  const submit = () => {
    setTouched(true);
    if (!valid) return;
    const msg =
      `مرحبًا أريج النقاء 🌿\n🚨 طلب صيانة عاجلة\n\n` +
      `الاسم: ${form.name}\nالجوال: ${form.phone}\nالمدينة: ${form.city || "—"}\n` +
      `نوع الجهاز/الموديل: ${form.device || "—"}\nوصف العطل: ${form.issue}`;
    window.open(buildWhatsAppLink(msg), "_blank");
  };

  return (
    <div>
      <CategoryBanner title="طلب صيانة عاجلة" subtitle="فريقنا الفني يتواصل معك خلال أقصر وقت ممكن" icon="Wrench" color="#B23A3A" />

      <section className="max-w-2xl mx-auto px-4 sm:px-6 py-14">
        <div className="rounded-2xl p-6 flex flex-col gap-4" style={{ background: "#fff", border: `1px solid ${C.line}` }}>
          <p className="text-sm" style={{ color: C.slate }}>
            عبّئ البيانات التالية وسيتم تجهيز رسالة تلقائية وتحويلك لواتساب لإرسالها مباشرة لفريق الصيانة.
          </p>
          <input placeholder="الاسم الكامل" value={form.name} onChange={set("name")} className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ border: `1.5px solid ${touched && !form.name.trim() ? "#c05050" : C.line}` }} />
          <input placeholder="رقم الجوال" value={form.phone} onChange={set("phone")} className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ border: `1.5px solid ${touched && !form.phone.trim() ? "#c05050" : C.line}` }} />
          <input placeholder="المدينة" value={form.city} onChange={set("city")} className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ border: `1.5px solid ${C.line}` }} />
          <input placeholder="نوع الجهاز أو الموديل (إن وُجد)" value={form.device} onChange={set("device")} className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ border: `1.5px solid ${C.line}` }} />
          <textarea placeholder="صف العطل بإيجاز" value={form.issue} onChange={set("issue")} rows={4} className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none" style={{ border: `1.5px solid ${touched && !form.issue.trim() ? "#c05050" : C.line}` }} />
          {touched && !valid && (<p className="text-xs" style={{ color: "#c05050" }}>الرجاء تعبئة الاسم والجوال ووصف العطل.</p>)}
          <button onClick={submit} className="w-full py-3 rounded-full font-bold text-sm flex items-center justify-center gap-2" style={{ background: "#25D366", color: "#fff" }}>
            <MessageCircle size={17} /> إرسال الطلب عبر واتساب
          </button>
        </div>
      </section>
    </div>
  );
}
