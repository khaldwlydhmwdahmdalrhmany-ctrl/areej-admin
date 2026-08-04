import pg from "pg";
import crypto from "crypto";

const { Pool } = pg;

const globalForDb = globalThis;
function getPool() {
  if (globalForDb.__areejPgPool) return globalForDb.__areejPgPool;
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }, // مطلوب للاتصال بـ Supabase
    max: 5,
  });
  globalForDb.__areejPgPool = pool;
  return pool;
}

let schemaReady = null;
async function ensureSchema() {
  if (schemaReady) return schemaReady;
  const pool = getPool();
  schemaReady = pool.query(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      tagline TEXT,
      color TEXT DEFAULT '#0C1C77',
      icon TEXT DEFAULT 'Package',
      "bannerUrl" TEXT,
      "sortOrder" INTEGER DEFAULT 0,
      "createdAt" TIMESTAMPTZ DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT DEFAULT '',
      "fullDescription" TEXT DEFAULT '',
      price DOUBLE PRECISION NOT NULL,
      "oldPrice" DOUBLE PRECISION,
      badge TEXT,
      "imageUrl" TEXT,
      "freeShipping" BOOLEAN DEFAULT false,
      "freeInstall" BOOLEAN DEFAULT false,
      published BOOLEAN DEFAULT true,
      brand TEXT,
      stock TEXT DEFAULT 'in_stock',
      "sortOrder" INTEGER DEFAULT 0,
      "featuredOffer" BOOLEAN DEFAULT false,
      rating DOUBLE PRECISION,
      "reviewCount" INTEGER,
      "categoryId" TEXT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
      "createdAt" TIMESTAMPTZ DEFAULT now(),
      "updatedAt" TIMESTAMPTZ DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS banners (
      id TEXT PRIMARY KEY,
      placement TEXT NOT NULL,
      "categoryId" TEXT,
      title TEXT NOT NULL,
      subtitle TEXT,
      "imageUrl" TEXT,
      "linkCategorySlug" TEXT,
      "sortOrder" INTEGER DEFAULT 0,
      active BOOLEAN DEFAULT true,
      ratio TEXT DEFAULT 'auto',
      "ctaLabel" TEXT,
      "ctaHref" TEXT,
      "createdAt" TIMESTAMPTZ DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      "customerName" TEXT NOT NULL,
      "customerPhone" TEXT NOT NULL,
      "customerCity" TEXT,
      "itemsJson" TEXT NOT NULL,
      total DOUBLE PRECISION NOT NULL,
      status TEXT DEFAULT 'جديد',
      "orderNumber" TEXT,
      notes TEXT,
      "createdAt" TIMESTAMPTZ DEFAULT now()
    );
    CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1001;
    CREATE TABLE IF NOT EXISTS visits (
      id TEXT PRIMARY KEY,
      "sessionId" TEXT,
      path TEXT,
      source TEXT,
      medium TEXT,
      campaign TEXT,
      referrer TEXT,
      device TEXT,
      "isNew" BOOLEAN DEFAULT true,
      "createdAt" TIMESTAMPTZ DEFAULT now()
    );
    CREATE INDEX IF NOT EXISTS idx_visits_created ON visits("createdAt" DESC);
    CREATE INDEX IF NOT EXISTS idx_visits_source ON visits(source, medium);
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT,
      "updatedAt" TIMESTAMPTZ DEFAULT now()
    );
  `).then(() => pool.query(`
    ALTER TABLE products
      ADD COLUMN IF NOT EXISTS brand TEXT,
      ADD COLUMN IF NOT EXISTS stock TEXT DEFAULT 'in_stock',
      ADD COLUMN IF NOT EXISTS rating DOUBLE PRECISION,
      ADD COLUMN IF NOT EXISTS "reviewCount" INTEGER,
      ADD COLUMN IF NOT EXISTS "sortOrder" INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS "featuredOffer" BOOLEAN DEFAULT false;
    ALTER TABLE orders
      ADD COLUMN IF NOT EXISTS notes TEXT,
      ADD COLUMN IF NOT EXISTS "orderNumber" TEXT,
      ADD COLUMN IF NOT EXISTS source TEXT,
      ADD COLUMN IF NOT EXISTS medium TEXT,
      ADD COLUMN IF NOT EXISTS campaign TEXT,
      ADD COLUMN IF NOT EXISTS "landingPath" TEXT;
    ALTER TABLE banners
      ADD COLUMN IF NOT EXISTS ratio TEXT DEFAULT 'auto',
      ADD COLUMN IF NOT EXISTS "ctaLabel" TEXT,
      ADD COLUMN IF NOT EXISTS "ctaHref" TEXT;
  `));
  return schemaReady;
}

const newId = () => crypto.randomBytes(12).toString("hex");

// يحوّل القيم الفارغة إلى NULL بدل 0 — مهم للتقييمات:
// تقييم غير مُدخل يجب ألا يُعرض إطلاقًا، لا أن يظهر كصفر.
const numOrNull = (v) =>
  v === "" || v === null || v === undefined || Number.isNaN(Number(v)) ? null : Number(v);

/* ============ التصنيفات ============ */
export async function getCategories() {
  await ensureSchema();
  const pool = getPool();
  const { rows } = await pool.query(`SELECT * FROM categories ORDER BY "sortOrder" ASC`);
  const counts = await pool.query(`SELECT "categoryId", COUNT(*) as n FROM products GROUP BY "categoryId"`);
  const countMap = Object.fromEntries(counts.rows.map((r) => [r.categoryId, Number(r.n)]));
  return rows.map((c) => ({ ...c, _count: { products: countMap[c.id] || 0 } }));
}

export async function getCategoryBySlug(slug) {
  await ensureSchema();
  const { rows } = await getPool().query(`SELECT * FROM categories WHERE slug = $1`, [slug]);
  return rows[0] || null;
}

export async function createCategory({ name, slug, tagline, color, icon }) {
  await ensureSchema();
  const pool = getPool();
  const id = newId();
  const { rows: countRows } = await pool.query(`SELECT COUNT(*) as n FROM categories`);
  const sortOrder = Number(countRows[0].n) + 1;
  await pool.query(
    `INSERT INTO categories (id, slug, name, tagline, color, icon, "sortOrder") VALUES ($1,$2,$3,$4,$5,$6,$7)`,
    [id, slug, name, tagline || null, color || "#0C1C77", icon || "Package", sortOrder]
  );
  const { rows } = await pool.query(`SELECT * FROM categories WHERE id = $1`, [id]);
  return rows[0];
}

export async function updateCategory(id, { name, tagline, color, icon, bannerUrl, sortOrder }) {
  await ensureSchema();
  await getPool().query(
    `UPDATE categories SET name=$1, tagline=$2, color=$3, icon=$4, "bannerUrl"=$5, "sortOrder"=$6 WHERE id=$7`,
    [name, tagline || null, color || "#0C1C77", icon || "Package", bannerUrl || null, sortOrder ?? 0, id]
  );
  const { rows } = await getPool().query(`SELECT * FROM categories WHERE id = $1`, [id]);
  return rows[0];
}

export async function deleteCategory(id) {
  await ensureSchema();
  const pool = getPool();
  const { rows } = await pool.query(`SELECT COUNT(*) as n FROM products WHERE "categoryId" = $1`, [id]);
  const inUse = Number(rows[0].n);
  if (inUse > 0) throw new Error(`لا يمكن حذف هذا التصنيف لأنه يحتوي على ${inUse} منتج`);
  await pool.query(`DELETE FROM categories WHERE id = $1`, [id]);
}

/* ============ البنرات ============ */
export async function getBanners({ placement } = {}) {
  await ensureSchema();
  const pool = getPool();
  const { rows } = placement
    ? await pool.query(`SELECT * FROM banners WHERE placement = $1 ORDER BY "sortOrder" ASC`, [placement])
    : await pool.query(`SELECT * FROM banners ORDER BY "sortOrder" ASC`);
  return rows;
}

export async function createBanner(data) {
  await ensureSchema();
  const id = newId();
  await getPool().query(
    `INSERT INTO banners (id, placement, "categoryId", title, subtitle, "imageUrl", "linkCategorySlug", "sortOrder", active, ratio, "ctaLabel", "ctaHref")
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
    [id, data.placement, data.categoryId || null, data.title, data.subtitle || null, data.imageUrl || null, data.linkCategorySlug || null, data.sortOrder ?? 0, data.active !== false, data.ratio || "auto", data.ctaLabel || null, data.ctaHref || null]
  );
  const { rows } = await getPool().query(`SELECT * FROM banners WHERE id = $1`, [id]);
  return rows[0];
}

export async function updateBanner(id, data) {
  await ensureSchema();
  await getPool().query(
    `UPDATE banners SET placement=$1, "categoryId"=$2, title=$3, subtitle=$4, "imageUrl"=$5, "linkCategorySlug"=$6, "sortOrder"=$7, active=$8, ratio=$9, "ctaLabel"=$10, "ctaHref"=$11 WHERE id=$12`,
    [data.placement, data.categoryId || null, data.title, data.subtitle || null, data.imageUrl || null, data.linkCategorySlug || null, data.sortOrder ?? 0, data.active !== false, data.ratio || "auto", data.ctaLabel || null, data.ctaHref || null, id]
  );
  const { rows } = await getPool().query(`SELECT * FROM banners WHERE id = $1`, [id]);
  return rows[0];
}

export async function deleteBanner(id) {
  await ensureSchema();
  await getPool().query(`DELETE FROM banners WHERE id = $1`, [id]);
}

/* ============ المنتجات ============ */
/**
 * جلب المنتجات.
 * افتراضيًا تُستبعد المنتجات المخفية (published = false) — واجهة المتجر
 * يجب ألا تعرضها أبدًا. لوحة التحكم تمرّر includeHidden لرؤيتها كلها.
 * الترتيب: sortOrder اليدوي أولًا، ثم الأحدث.
 */
export async function getProducts({ categorySlug, includeHidden = false } = {}) {
  await ensureSchema();
  const pool = getPool();
  const visible = includeHidden ? "" : "AND p.published IS NOT FALSE";
  const order = `ORDER BY p."sortOrder" ASC NULLS LAST, p."createdAt" DESC`;

  const query = categorySlug
    ? {
        text: `SELECT p.*, c.name as "categoryName", c.slug as "categorySlug", c.color as "categoryColor", c.icon as "categoryIcon"
               FROM products p JOIN categories c ON p."categoryId" = c.id
               WHERE c.slug = $1 ${visible} ${order}`,
        values: [categorySlug],
      }
    : {
        text: `SELECT p.*, c.name as "categoryName", c.slug as "categorySlug", c.color as "categoryColor", c.icon as "categoryIcon"
               FROM products p JOIN categories c ON p."categoryId" = c.id
               WHERE true ${visible} ${order}`,
        values: [],
      };
  const { rows } = await pool.query(query);
  return rows.map((r) => ({
    ...r,
    category: { name: r.categoryName, slug: r.categorySlug, color: r.categoryColor, icon: r.categoryIcon },
  }));
}

export async function getProductById(id) {
  await ensureSchema();
  const { rows } = await getPool().query(`SELECT * FROM products WHERE id = $1`, [id]);
  return rows[0] || null;
}

export async function createProduct(data) {
  await ensureSchema();
  const pool = getPool();
  const id = newId();
  await pool.query(
    `INSERT INTO products (id, name, description, "fullDescription", price, "oldPrice", badge, "imageUrl", "freeShipping", "freeInstall", "categoryId", brand, stock, rating, "reviewCount", "sortOrder", "featuredOffer")
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)`,
    [
      id, data.name, data.description || "", data.fullDescription || "", Number(data.price),
      data.oldPrice ? Number(data.oldPrice) : null, data.badge || null, data.imageUrl || null,
      !!data.freeShipping, !!data.freeInstall, data.categoryId,
      data.brand || null, data.stock || "in_stock",
      numOrNull(data.rating), numOrNull(data.reviewCount),
      Number(data.sortOrder) || 0, !!data.featuredOffer,
    ]
  );
  return await getProductById(id);
}

export async function updateProduct(id, data) {
  await ensureSchema();
  const current = await getProductById(id);
  if (!current) throw new Error("المنتج غير موجود");
  const merged = { ...current, ...data };
  await getPool().query(
    `UPDATE products SET name=$1, description=$2, "fullDescription"=$3, price=$4, "oldPrice"=$5, badge=$6, "imageUrl"=$7, "freeShipping"=$8, "freeInstall"=$9, "categoryId"=$10, published=$11, brand=$12, stock=$13, rating=$14, "reviewCount"=$15, "sortOrder"=$16, "featuredOffer"=$17, "updatedAt"=now()
     WHERE id=$18`,
    [
      merged.name, merged.description, merged.fullDescription, Number(merged.price),
      merged.oldPrice === "" || merged.oldPrice === null || merged.oldPrice === undefined ? null : Number(merged.oldPrice),
      merged.badge || null, merged.imageUrl || null, !!merged.freeShipping, !!merged.freeInstall,
      merged.categoryId, !!merged.published,
      merged.brand || null, merged.stock || "in_stock",
      numOrNull(merged.rating), numOrNull(merged.reviewCount),
      Number(merged.sortOrder) || 0, !!merged.featuredOffer,
      id,
    ]
  );
  return await getProductById(id);
}

export async function deleteProduct(id) {
  await ensureSchema();
  await getPool().query(`DELETE FROM products WHERE id = $1`, [id]);
}

export async function countProducts() {
  await ensureSchema();
  const { rows } = await getPool().query(`SELECT COUNT(*) as n FROM products`);
  return Number(rows[0].n);
}
export async function countCategories() {
  await ensureSchema();
  const { rows } = await getPool().query(`SELECT COUNT(*) as n FROM categories`);
  return Number(rows[0].n);
}
export async function countOrders() {
  await ensureSchema();
  const { rows } = await getPool().query(`SELECT COUNT(*) as n FROM orders`);
  return Number(rows[0].n);
}

/* ============ الطلبات ============ */
export async function getOrders() {
  await ensureSchema();
  const { rows } = await getPool().query(`SELECT * FROM orders ORDER BY "createdAt" DESC`);
  return rows;
}

export const ORDER_STATUSES = ["جديد", "قيد التجهيز", "تم الشحن", "مكتمل", "ملغي"];

export async function updateOrderStatus(id, status, notes) {
  await ensureSchema();
  if (!ORDER_STATUSES.includes(status)) throw new Error("حالة طلب غير معروفة");
  await getPool().query(
    `UPDATE orders SET status = $1, notes = COALESCE($2, notes) WHERE id = $3`,
    [status, notes ?? null, id]
  );
  const { rows } = await getPool().query(`SELECT * FROM orders WHERE id = $1`, [id]);
  return rows[0] || null;
}

export async function createOrder({ customerName, customerPhone, customerCity, items, total }) {
  await ensureSchema();
  const id = newId();
  await getPool().query(
    `INSERT INTO orders (id, "orderNumber", "customerName", "customerPhone", "customerCity", "itemsJson", total, source, medium, campaign, "landingPath")
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
    [id, await nextOrderNumber(), customerName, customerPhone, customerCity || null, JSON.stringify(items), Number(total),
     data.source || null, data.medium || null, data.campaign || null, data.landingPath || null]
  );
  const { rows } = await getPool().query(`SELECT * FROM orders WHERE id = $1`, [id]);
  return rows[0];
}


/* ============ الإعدادات العامة ============ */

export async function getSettings() {
  await ensureSchema();
  const { rows } = await getPool().query(`SELECT key, value FROM settings`);
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}

export async function saveSettings(entries) {
  await ensureSchema();
  const pool = getPool();
  for (const [key, value] of Object.entries(entries)) {
    await pool.query(
      `INSERT INTO settings (key, value, "updatedAt") VALUES ($1, $2, now())
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, "updatedAt" = now()`,
      [key, value ?? null]
    );
  }
  return getSettings();
}

/** رقم طلب مقروء: AR-YYMM-1001 */
export async function nextOrderNumber() {
  await ensureSchema();
  const { rows } = await getPool().query(`SELECT nextval('order_number_seq') AS n`);
  const now = new Date();
  const yy = String(now.getFullYear()).slice(2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  return `AR-${yy}${mm}-${rows[0].n}`;
}


/* ============ التحليلات ============ */

export async function recordVisit(v) {
  await ensureSchema();
  await getPool().query(
    `INSERT INTO visits (id, "sessionId", path, source, medium, campaign, referrer, device, "isNew")
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
    [newId(), v.sessionId || null, v.path || null, v.source || "direct", v.medium || "none",
     v.campaign || null, v.referrer || null, v.device || null, v.isNew !== false]
  );
}

/**
 * ملخّص تحليلي لفترة محددة.
 * كل الأرقام محسوبة من قاعدة البيانات مباشرة — لا تقديرات ولا عيّنات.
 */
export async function getAnalytics({ days = 30 } = {}) {
  await ensureSchema();
  const pool = getPool();
  const since = `now() - interval '${Number(days)} days'`;

  const [totals, bySource, byMedium, byDay, topProducts, orderSources, topPages] = await Promise.all([
    pool.query(`SELECT
        (SELECT count(*) FROM visits WHERE "createdAt" > ${since}) AS views,
        (SELECT count(DISTINCT "sessionId") FROM visits WHERE "createdAt" > ${since}) AS sessions,
        (SELECT count(*) FROM visits WHERE "isNew" AND "createdAt" > ${since}) AS new_visitors,
        (SELECT count(*) FROM orders WHERE "createdAt" > ${since}) AS orders,
        (SELECT COALESCE(sum(total),0) FROM orders WHERE "createdAt" > ${since}) AS revenue`),

    pool.query(`SELECT source, count(DISTINCT "sessionId") AS sessions, count(*) AS views
                FROM visits WHERE "createdAt" > ${since}
                GROUP BY source ORDER BY sessions DESC LIMIT 10`),

    pool.query(`SELECT medium, count(DISTINCT "sessionId") AS sessions
                FROM visits WHERE "createdAt" > ${since}
                GROUP BY medium ORDER BY sessions DESC`),

    pool.query(`SELECT to_char(d.day,'YYYY-MM-DD') AS day,
                  COALESCE(v.n,0) AS visits, COALESCE(o.n,0) AS orders
                FROM generate_series((now() - interval '${Number(days)} days')::date, now()::date, '1 day') d(day)
                LEFT JOIN (SELECT "createdAt"::date AS day, count(DISTINCT "sessionId") n FROM visits GROUP BY 1) v ON v.day = d.day
                LEFT JOIN (SELECT "createdAt"::date AS day, count(*) n FROM orders GROUP BY 1) o ON o.day = d.day
                ORDER BY d.day`),

    pool.query(`SELECT p.id, p.name, p."imageUrl", count(*) AS times, sum(oi.qty) AS units
                FROM orders o
                CROSS JOIN LATERAL jsonb_to_recordset(o."itemsJson"::jsonb) AS oi(id text, name text, qty int, price numeric)
                JOIN products p ON p.id = oi.id
                WHERE o."createdAt" > ${since}
                GROUP BY p.id, p.name, p."imageUrl"
                ORDER BY units DESC NULLS LAST LIMIT 8`).catch(() => ({ rows: [] })),

    pool.query(`SELECT COALESCE(source,'direct') AS source, COALESCE(medium,'none') AS medium,
                  count(*) AS orders, COALESCE(sum(total),0) AS revenue
                FROM orders WHERE "createdAt" > ${since}
                GROUP BY 1,2 ORDER BY orders DESC LIMIT 12`),

    pool.query(`SELECT path, count(*) AS views FROM visits
                WHERE "createdAt" > ${since} GROUP BY path ORDER BY views DESC LIMIT 8`),
  ]);

  return {
    totals: totals.rows[0] || {},
    bySource: bySource.rows,
    byMedium: byMedium.rows,
    byDay: byDay.rows,
    topProducts: topProducts.rows,
    orderSources: orderSources.rows,
    topPages: topPages.rows,
  };
}
