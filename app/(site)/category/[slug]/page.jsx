import React from "react";
import { notFound } from "next/navigation";
import { getCategories, getProducts, getCategoryBySlug, getBanners } from "../../../../lib/db.js";
import { C } from "../../../../lib/colors.js";
import PageHero from "../../../../components/site/PageHero.jsx";
import TrustStrip from "../../../../components/site/TrustStrip.jsx";
import ProductBrowser from "../../../../components/site/ProductBrowser.jsx";
import CtaBand from "../../../../components/site/CtaBand.jsx";

export const dynamic = "force-dynamic";

// السلَغ يصل من Next.js مُرمّزًا (percent-encoding) عندما يحتوي حروفًا عربية،
// لذا نفكّ الترميز قبل أي استعلام على قاعدة البيانات.
function decodeSlug(raw) {
  if (!raw) return "";
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw; // ترميز تالف — نستخدم القيمة كما هي بدل رمي استثناء
  }
}

export default async function CategoryPage({ params }) {
  const slug = decodeSlug(params.slug);

  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const [categories, products, catBanners] = await Promise.all([
    getCategories(),
    getProducts({ categorySlug: slug }),
    getBanners({ placement: "category" }),
  ]);

  const relevant = catBanners.filter((b) => b.active && b.categoryId === category.id);
  // بنر التصنيف المخصص له الأولوية، ثم صورة البنر المرفوعة على التصنيف نفسه
  const heroImage = category.bannerUrl || relevant.find((b) => b.imageUrl)?.imageUrl;

  return (
    <div>
      <PageHero
        title={category.name}
        subtitle={category.tagline}
        imageUrl={heroImage}
        icon={category.icon}
        color={category.color || C.navy}
        count={products.length}
      />

      <TrustStrip />

      <section className="max-w-6xl mx-auto px-4 sm:px-6 section-y">
        <ProductBrowser categories={categories} products={products} activeCatSlug={slug} />
      </section>

      <CtaBand
        eyebrow="تحتاج مشورة؟"
        title={`أسئلة عن ${category.name}؟`}
        desc="فريقنا الفني يجيبك عبر واتساب خلال دقائق — بلا التزام بالشراء."
        primaryLabel="كل المنتجات"
        primaryHref="/shop"
        whatsappMessage={`السلام عليكم، عندي استفسار عن قسم: ${category.name}`}
      />
    </div>
  );
}
