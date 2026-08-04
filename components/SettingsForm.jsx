"use client";
import React, { useState } from "react";
import { Save, Check, Loader2, ExternalLink } from "lucide-react";
import { SOCIAL_LINKS, CONTACT_SETTINGS, STORE_SETTINGS } from "../lib/settings.js";
import { ANALYTICS_SETTINGS, validateAnalyticsId } from "../lib/analytics.js";
import { getIcon } from "../lib/iconMap.js";

const C = { navy: "#0C1C77", slate: "#4A5A63", line: "#E1ECE8", teal: "#00C6C7", success: "#1B9C68", danger: "#D64545", offWhite: "#F6FAF9" };

export default function SettingsForm({ initial = {} }) {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = async () => {
    // تحقّق من صيغ المعرّفات قبل الحفظ — معرّف خاطئ يعطّل التتبّع بصمت
    for (const a of ANALYTICS_SETTINGS) {
      const msg = validateAnalyticsId(a.key, form[a.key]);
      if (msg) { setError(msg); return; }
    }
    setSaving(true); setError("");
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error((await res.json()).error || "فشل الحفظ");
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const field = "w-full px-4 py-2.5 rounded-xl text-sm outline-none";
  const fStyle = { border: `1.5px solid ${C.line}`, background: "#fff" };

  return (
    <div className="flex flex-col gap-6">
      {/* إعدادات المتجر */}
      <section className="p-5 sm:p-6 rounded-2xl" style={{ background: "#fff", border: `1px solid ${C.line}` }}>
        <h2 className="font-bold text-sm mb-1" style={{ color: C.navy }}>إعدادات المتجر</h2>
        <p className="text-xs mb-5" style={{ color: C.slate }}>
          نصوص وأرقام كانت ثابتة في الكود — صارت تحت تحكمك.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {STORE_SETTINGS.map((c) => (
            <div key={c.key} className={c.key === "store_ticker" || c.key === "announcement" ? "sm:col-span-2" : ""}>
              <label className="text-xs font-bold block mb-1.5" style={{ color: C.navy }}>{c.label}</label>
              <input value={form[c.key] || ""} onChange={set(c.key)} placeholder={c.placeholder} className={field} style={fStyle} />
              {c.note && <p className="text-[11px] mt-1.5 leading-relaxed" style={{ color: C.slate }}>{c.note}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* روابط التواصل */}
      <section className="p-5 sm:p-6 rounded-2xl" style={{ background: "#fff", border: `1px solid ${C.line}` }}>
        <h2 className="font-bold text-sm mb-1" style={{ color: C.navy }}>روابط التواصل الاجتماعي</h2>
        <p className="text-xs mb-5" style={{ color: C.slate }}>
          الروابط المتروكة فارغة لا تظهر أيقونتها في الموقع — لا حاجة لتعبئتها كلها.
        </p>

        <div className="grid sm:grid-cols-2 gap-4">
          {SOCIAL_LINKS.map((s) => {
            const Icon = getIcon(s.icon);
            const val = form[s.key] || "";
            return (
              <div key={s.key}>
                <label className="text-xs font-bold flex items-center gap-2 mb-1.5" style={{ color: C.navy }}>
                  <span className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${s.color}18` }}>
                    <Icon size={13} color={s.color === "#FFFC00" ? "#B8A200" : s.color} />
                  </span>
                  {s.label}
                  {val && (
                    <a href={val} target="_blank" rel="noopener noreferrer" className="mr-auto" title="فتح الرابط">
                      <ExternalLink size={12} color={C.teal} />
                    </a>
                  )}
                </label>
                <input value={val} onChange={set(s.key)} placeholder={s.placeholder} dir="ltr" className={`${field} text-left`} style={fStyle} />
              </div>
            );
          })}
        </div>
      </section>

      {/* التتبّع والتحليلات */}
      <section className="p-5 sm:p-6 rounded-2xl" style={{ background: "#fff", border: `1px solid ${C.line}` }}>
        <h2 className="font-bold text-sm mb-1" style={{ color: C.navy }}>التتبّع والتحليلات</h2>
        <p className="text-xs mb-5 leading-relaxed" style={{ color: C.slate }}>
          أضف معرّف Google Tag Manager وحده، ثم ثبّت كل بكسلات المنصات (ميتا، تيك توك، سناب، X)
          من داخل حاوية GTM — بلا حاجة لتعديل كود الموقع مرة أخرى.
        </p>

        <div className="grid sm:grid-cols-2 gap-4">
          {ANALYTICS_SETTINGS.map((a) => (
            <div key={a.key} className={a.primary ? "sm:col-span-2" : ""}>
              <label className="text-xs font-bold flex items-center gap-2 mb-1.5" style={{ color: C.navy }}>
                {a.label}
                {a.primary && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded" style={{ background: "#EAF8F1", color: "#0C7A55" }}>
                    الأهم
                  </span>
                )}
              </label>
              <input
                value={form[a.key] || ""}
                onChange={set(a.key)}
                placeholder={a.placeholder}
                dir="ltr"
                className={`${field} text-left`}
                style={{ ...fStyle, borderColor: a.primary && form[a.key] ? C.teal : C.line }}
              />
              {a.note && <p className="text-[11px] mt-1.5" style={{ color: C.slate }}>{a.note}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* بيانات التواصل */}
      <section className="p-5 sm:p-6 rounded-2xl" style={{ background: "#fff", border: `1px solid ${C.line}` }}>
        <h2 className="font-bold text-sm mb-1" style={{ color: C.navy }}>بيانات التواصل</h2>
        <p className="text-xs mb-5" style={{ color: C.slate }}>
          تظهر في تذييل الموقع وصفحة «تواصل معنا».
        </p>

        <div className="grid sm:grid-cols-2 gap-4">
          {CONTACT_SETTINGS.map((c) => (
            <div key={c.key} className={c.key === "map_query" ? "sm:col-span-2" : ""}>
              <label className="text-xs font-bold block mb-1.5" style={{ color: C.navy }}>{c.label}</label>
              <input value={form[c.key] || ""} onChange={set(c.key)} placeholder={c.placeholder} className={field} style={fStyle} />
              {c.key === "map_query" && (
                <p className="text-[11px] mt-1.5" style={{ color: C.slate }}>
                  اكتب اسم المعرض أو العنوان أو إحداثيات مثل <span dir="ltr">24.7136, 46.6753</span>.
                  اتركه فارغًا لإخفاء الخريطة بدل عرض موقع خاطئ.
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {error && (
        <p className="text-xs font-bold px-4 py-3 rounded-xl" style={{ background: `${C.danger}12`, color: C.danger }}>{error}</p>
      )}

      <div className="sticky bottom-4">
        <button
          onClick={save}
          disabled={saving}
          className="btn w-full py-3.5 text-sm shadow-lg"
          style={{ background: saved ? C.success : C.navy, color: "#fff" }}
        >
          {saving ? <><Loader2 size={16} className="animate-spin" /> جارٍ الحفظ…</>
            : saved ? <><Check size={16} className="pop-in" /> حُفظت الإعدادات</>
            : <><Save size={16} /> حفظ الإعدادات</>}
        </button>
      </div>
    </div>
  );
}
