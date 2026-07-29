"use client";
import React, { useState } from "react";
import { Phone, MapPin, Clock, MessageCircle } from "lucide-react";
import { C, buildWhatsAppLink } from "../../../lib/colors.js";
import CategoryBanner from "../../../components/site/CategoryBanner.jsx";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [touched, setTouched] = useState(false);
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const valid = form.name.trim() && form.phone.trim() && form.message.trim();

  const submit = () => {
    setTouched(true);
    if (!valid) return;
    const msg = `مرحبًا أريج النقاء 🌿\nرسالة من صفحة تواصل معنا:\n\nالاسم: ${form.name}\nالجوال: ${form.phone}\n\n${form.message}`;
    window.open(buildWhatsAppLink(msg), "_blank");
  };

  return (
    <div>
      <CategoryBanner title="تواصل معنا" subtitle="نسعد بخدمتك والإجابة على كل استفساراتك" icon="Package" color={C.cyan} />

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14 grid md:grid-cols-2 gap-10">
        <div className="rounded-2xl p-6 flex flex-col gap-4" style={{ background: "#fff", border: `1px solid ${C.line}` }}>
          <h3 className="font-display text-lg" style={{ color: C.navy }}>أرسل لنا رسالة</h3>
          <input placeholder="الاسم الكامل" value={form.name} onChange={set("name")} className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ border: `1.5px solid ${touched && !form.name.trim() ? "#c05050" : C.line}` }} />
          <input placeholder="رقم الجوال" value={form.phone} onChange={set("phone")} className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ border: `1.5px solid ${touched && !form.phone.trim() ? "#c05050" : C.line}` }} />
          <textarea placeholder="رسالتك" value={form.message} onChange={set("message")} rows={5} className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none" style={{ border: `1.5px solid ${touched && !form.message.trim() ? "#c05050" : C.line}` }} />
          {touched && !valid && (<p className="text-xs" style={{ color: "#c05050" }}>الرجاء تعبئة كل الحقول.</p>)}
          <button onClick={submit} className="w-full py-3 rounded-full font-bold text-sm flex items-center justify-center gap-2" style={{ background: "#25D366", color: "#fff" }}>
            <MessageCircle size={17} /> إرسال عبر واتساب
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-2xl p-6 flex items-center gap-4" style={{ background: C.mintTint }}>
            <Phone size={22} color={C.navy} />
            <div>
              <p className="text-xs font-bold" style={{ color: C.slate }}>اتصال أو واتساب</p>
              <p className="font-display text-lg" style={{ color: C.navy }} dir="ltr">+966 53 254 0595</p>
            </div>
          </div>
          <div className="rounded-2xl p-6 flex items-center gap-4" style={{ background: C.mintTint }}>
            <MapPin size={22} color={C.navy} />
            <div>
              <p className="text-xs font-bold" style={{ color: C.slate }}>نطاق التغطية</p>
              <p className="font-bold text-sm" style={{ color: C.navy }}>توصيل وتركيب لجميع مناطق المملكة العربية السعودية</p>
            </div>
          </div>
          <div className="rounded-2xl p-6 flex items-center gap-4" style={{ background: C.mintTint }}>
            <Clock size={22} color={C.navy} />
            <div>
              <p className="text-xs font-bold" style={{ color: C.slate }}>أوقات الرد</p>
              <p className="font-bold text-sm" style={{ color: C.navy }}>يوميًا من 9 صباحًا حتى 11 مساءً</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
