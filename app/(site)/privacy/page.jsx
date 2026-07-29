import React from "react";
import { ShieldCheck } from "lucide-react";
import { C } from "../../../lib/colors.js";
import CategoryBanner from "../../../components/site/CategoryBanner.jsx";

const SECTIONS = [
  { t: "المعلومات التي نجمعها", d: "نجمع البيانات التي تزودنا بها مباشرة عند إتمام الطلب أو التواصل معنا، مثل الاسم ورقم الجوال والمدينة/العنوان، وذلك فقط لغرض تنفيذ الطلب والتواصل بشأنه." },
  { t: "كيف نستخدم بياناتك", d: "تُستخدم بياناتك لتنفيذ الطلبات، والتواصل معك بخصوص التوصيل أو التركيب أو الصيانة، وتحسين جودة خدماتنا. لا نشارك بياناتك مع أي طرف ثالث لأغراض تسويقية دون موافقتك." },
  { t: "طرق الدفع والتقسيط", d: "عند اختيار الدفع بالتقسيط عبر تابي أو تمارا، تتم معالجة بياناتك المالية مباشرة عبر أنظمة تلك الجهات وفق سياساتها الخاصة، ولا نطّلع نحن على بيانات بطاقتك البنكية." },
  { t: "أمان البيانات", d: "نتخذ إجراءات معقولة لحماية بياناتك من الوصول غير المصرح به، ونحتفظ بالمعلومات فقط للمدة اللازمة لتقديم الخدمة أو كما يقتضيه النظام." },
  { t: "حقوقك", d: "يحق لك في أي وقت طلب الاطلاع على بياناتك المخزنة لدينا أو تحديثها أو حذفها، وذلك بالتواصل معنا مباشرة عبر واتساب أو صفحة تواصل معنا." },
  { t: "تحديثات هذه السياسة", d: "قد يتم تحديث هذه السياسة من وقت لآخر لتعكس أي تغييرات في ممارساتنا، وسيتم نشر أي تحديث على هذه الصفحة." },
];

export default function PrivacyPage() {
  return (
    <div>
      <CategoryBanner title="سياسة الخصوصية" subtitle="كيف نتعامل مع بياناتك ونحافظ على خصوصيتك" icon="ShieldCheck" color={C.navy} />
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-14 flex flex-col gap-8">
        <p className="text-sm leading-relaxed" style={{ color: C.slate }}>
          نحرص في أريج النقاء على خصوصية عملائنا، وتوضح هذه الصفحة طبيعة البيانات التي نجمعها وكيفية استخدامها وحمايتها.
        </p>
        {SECTIONS.map((s, i) => (
          <div key={i}>
            <h2 className="font-display text-lg mb-2" style={{ color: C.navy }}>{s.t}</h2>
            <p className="text-sm leading-relaxed" style={{ color: C.slate }}>{s.d}</p>
          </div>
        ))}
        <p className="text-xs" style={{ color: C.slate }}>آخر تحديث: {new Date().getFullYear()}</p>
      </section>
    </div>
  );
}
