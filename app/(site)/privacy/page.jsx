import React from "react";
import { ShieldCheck } from "lucide-react";
import { C } from "../../../lib/colors.js";
import PageHero from "../../../components/site/PageHero.jsx";

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
      <PageHero
        title="سياسة الخصوصية"
        subtitle="كيف نجمع بياناتك ونستخدمها ونحميها."
        icon="Lock"
        color={C.navy}
        compact
      />
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

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-14">
        <div className="max-w-3xl flex flex-col gap-4">
          <h2 className="h-card font-display" style={{ color: C.navy }}>ملفات التتبّع والتحليلات</h2>
          <div className="text-sm leading-loose flex flex-col gap-3" style={{ color: C.slate }}>
            <p>
              نستخدم أدوات تحليل مثل Google Analytics وGoogle Tag Manager وMicrosoft Clarity
              لفهم كيفية استخدام الموقع وتحسين تجربة التسوّق. قد تضع هذه الأدوات ملفات تعريف
              ارتباط (Cookies) على متصفحك.
            </p>
            <p>
              كما نسجّل داخليًا بيانات مجهّلة الهوية عن مصدر الزيارة (مثل: جاءت من بحث جوجل أو
              من إعلان على إنستغرام) والصفحات التي زرتها. <strong>لا نجمع عنوان IP ولا بصمة
              الجهاز ولا أي بيانات تعرّف بك شخصيًا</strong> ضمن هذه السجلات.
            </p>
            <p>
              نستخدم هذه البيانات لقياس أداء حملاتنا التسويقية فقط. يمكنك تعطيل ملفات تعريف
              الارتباط من إعدادات متصفحك، وقد يؤثر ذلك على بعض وظائف الموقع.
            </p>
            <p>
              للاستفسار عن بياناتك أو طلب حذفها، راسلنا عبر صفحة «تواصل معنا».
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
