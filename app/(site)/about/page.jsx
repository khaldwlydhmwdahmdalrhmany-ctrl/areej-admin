import React from "react";
import { Droplet, Target, Eye, HeartHandshake, ShieldCheck, Wrench, Recycle } from "lucide-react";
import { getBanners } from "../../../lib/queries.js";
import { pickBanner } from "../../../lib/banners.js";
import { C, G, SH } from "../../../lib/colors.js";
import PageHero from "../../../components/site/PageHero.jsx";
import TrustStrip from "../../../components/site/TrustStrip.jsx";
import SectionHead from "../../../components/site/SectionHead.jsx";
import CtaBand from "../../../components/site/CtaBand.jsx";

export const metadata = {
  title: "نبذة عن الشركة",
  description: "أريج النقاء المتميز لتحلية المياه — من نحن، رسالتنا، وقيمنا في خدمة السوق السعودي.",
};

const VALUES = [
  { icon: ShieldCheck, t: "الصدق قبل البيع", d: "نرشّح الجهاز المناسب حتى لو كان الأرخص. الثقة تعود بعميل دائم، والمبالغة تعود بمرتجع." },
  { icon: Wrench, t: "ما بعد البيع هو البيع", d: "الجهاز يُشترى مرة، ويُصان سنوات. نبني علاقتنا على الثانية لا الأولى." },
  { icon: Recycle, t: "قطع أصلية دائمًا", d: "نحتفظ بشمعات وأغشية أصلية لكل جهاز نبيعه، حتى بعد انقطاع الموديل." },
  { icon: HeartHandshake, t: "فريق لا وسطاء", d: "فنيونا موظفون لدينا، لا مقاولون من الباطن. المسؤولية واضحة ولا تُحال." },
];

export default async function AboutPage() {
  const pageBanner = pickBanner(await getBanners({ placement: "about" }));

  return (
    <div>
      <PageHero
        title="نبذة عن أريج النقاء"
        subtitle="متجر سعودي متخصص في أجهزة تحلية وتنقية المياه — نبيع ما نثق به، ونصون ما نبيعه."
        imageUrl={pageBanner?.imageUrl}
        ratio={pageBanner?.ratio}
        bannerCta={pageBanner?.ctaHref ? { label: pageBanner.ctaLabel, href: pageBanner.ctaHref } : undefined}
        icon="Droplet"
        color={C.navy}
      />

      <TrustStrip />

      {/* من نحن */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 section-y">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="flex flex-col gap-5">
            <span className="eyebrow">من نحن</span>
            <h2 className="h-section font-display" style={{ color: C.navy }}>
              مياه نقية ليست رفاهية
            </h2>
            <div className="flex flex-col gap-4 text-sm sm:text-base leading-loose" style={{ color: C.slate }}>
              <p>
                جودة المياه في المملكة تختلف من حيّ إلى حيّ، ومن مدينة إلى أخرى. جهاز يعمل ببراعة
                في منطقة قد يستهلك شمعاته خلال شهرين في منطقة أخرى. لهذا لا نبيع «أفضل جهاز» —
                نبيع الجهاز الأنسب لمياهك أنت.
              </p>
              <p>
                بدأنا من ملاحظة بسيطة: أغلب شكاوى العملاء لم تكن من الأجهزة نفسها، بل مما يأتي بعدها —
                فني لا يرد، قطعة غيار غير متوفرة، وضمان يتهرّب منه البائع. فبنينا عملنا على معالجة
                هذا الجانب تحديدًا.
              </p>
              <p>
                اليوم نقدّم تشكيلة تمتد من الفلتر المنزلي البسيط إلى محطات التحلية الصناعية، مدعومة
                بفريق تركيب وصيانة تابع لنا مباشرة، ومخزون قطع أصلية لكل جهاز نطرحه.
              </p>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden p-8 sm:p-10 flex flex-col gap-6" style={{ background: G.deep }}>
            <span className="absolute -top-24 -left-16 w-72 h-72 rounded-full blur-3xl opacity-25 pointer-events-none" style={{ background: C.teal }} />
            <div className="relative flex flex-col gap-6">
              {[
                { icon: Target, t: "رسالتنا", d: "أن نجعل الحصول على مياه نقية قرارًا سهلًا وواضحًا لكل بيت ومنشأة في المملكة." },
                { icon: Eye, t: "رؤيتنا", d: "أن نكون المرجع الذي يُستشار قبل الشراء، لا مجرد متجر يُشترى منه." },
                { icon: Droplet, t: "تخصصنا", d: "تحلية وتنقية المياه حصريًا — لا نبيع ما لا نتقنه." },
              ].map((b, i) => (
                <div key={i} className="flex gap-4">
                  <span className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,.1)" }}>
                    <b.icon size={20} color={C.mint} strokeWidth={1.9} />
                  </span>
                  <div>
                    <h3 className="font-bold text-sm mb-1" style={{ color: "#fff" }}>{b.t}</h3>
                    <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,.72)" }}>{b.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* قيمنا */}
      <section style={{ background: C.offWhite }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 section-y">
          <SectionHead
            align="center"
            eyebrow="ما نلتزم به"
            title="أربع قواعد لا نتنازل عنها"
            desc="ليست شعارات تسويقية — هذه المعايير التي نُقيّم بها أنفسنا داخليًا."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {VALUES.map((v, i) => (
              <div key={i} className="lift group p-6 rounded-2xl flex flex-col gap-3" style={{ background: "#fff", border: `1px solid ${C.line}`, boxShadow: SH.sm }}>
                <span className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110" style={{ background: G.aqua }}>
                  <v.icon size={21} color="#fff" strokeWidth={1.9} />
                </span>
                <h3 className="font-bold text-[15px]" style={{ color: C.navy }}>{v.t}</h3>
                <p className="text-sm leading-relaxed" style={{ color: C.slate }}>{v.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        eyebrow="نبدأ من سؤال"
        title="ما نوع المياه في منطقتك؟"
        desc="أخبرنا بمدينتك وعدد أفراد أسرتك، ونرشّح لك الجهاز المناسب — بلا التزام بالشراء."
        primaryLabel="تصفّح المنتجات"
        primaryHref="/shop"
        whatsappMessage="السلام عليكم، أرغب في معرفة الجهاز المناسب لمنطقتي."
      />
    </div>
  );
}
