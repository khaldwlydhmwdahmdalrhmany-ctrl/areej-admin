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
      "createdAt" TIMESTAMPTZ DEFAULT now()
    );
  `).then(() => pool.query(`
    ALTER TABLE products
      ADD COLUMN IF NOT EXISTS brand TEXT,
      ADD COLUMN IF NOT EXISTS stock TEXT DEFAULT 'in_stock',
      ADD COLUMN IF NOT EXISTS rating DOUBLE PRECISION,
      ADD COLUMN IF NOT EXISTS "reviewCount" INTEGER;
    ALTER TABLE orders
      ADD COLUMN IF NOT EXISTS notes TEXT;
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
    `INSERT INTO banners (id, placement, "categoryId", title, subtitle, "imageUrl", "linkCategorySlug", "sortOrder", active)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
    [id, data.placement, data.categoryId || null, data.title, data.subtitle || null, data.imageUrl || null, data.linkCategorySlug || null, data.sortOrder ?? 0, data.active !== false]
  );
  const { rows } = await getPool().query(`SELECT * FROM banners WHERE id = $1`, [id]);
  return rows[0];
}

export async function updateBanner(id, data) {
  await ensureSchema();
  await getPool().query(
    `UPDATE banners SET placement=$1, "categoryId"=$2, title=$3, subtitle=$4, "imageUrl"=$5, "linkCategorySlug"=$6, "sortOrder"=$7, active=$8 WHERE id=$9`,
    [data.placement, data.categoryId || null, data.title, data.subtitle || null, data.imageUrl || null, data.linkCategorySlug || null, data.sortOrder ?? 0, data.active !== false, id]
  );
  const { rows } = await getPool().query(`SELECT * FROM banners WHERE id = $1`, [id]);
  return rows[0];
}

export async function deleteBanner(id) {
  await ensureSchema();
  await getPool().query(`DELETE FROM banners WHERE id = $1`, [id]);
}

/* ============ المنتجات ============ */
export async function getProducts({ categorySlug } = {}) {
  await ensureSchema();
  const pool = getPool();
  const query = categorySlug
    ? {
        text: `SELECT p.*, c.name as "categoryName", c.slug as "categorySlug", c.color as "categoryColor", c.icon as "categoryIcon"
               FROM products p JOIN categories c ON p."categoryId" = c.id
               WHERE c.slug = $1 ORDER BY p."createdAt" DESC`,
        values: [categorySlug],
      }
    : {
        text: `SELECT p.*, c.name as "categoryName", c.slug as "categorySlug", c.color as "categoryColor", c.icon as "categoryIcon"
               FROM products p JOIN categories c ON p."categoryId" = c.id
               ORDER BY p."createdAt" DESC`,
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
    `INSERT INTO products (id, name, description, "fullDescription", price, "oldPrice", badge, "imageUrl", "freeShipping", "freeInstall", "categoryId", brand, stock, rating, "reviewCount")
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)`,
    [
      id, data.name, data.description || "", data.fullDescription || "", Number(data.price),
      data.oldPrice ? Number(data.oldPrice) : null, data.badge || null, data.imageUrl || null,
      !!data.freeShipping, !!data.freeInstall, data.categoryId,
      data.brand || null, data.stock || "in_stock",
      numOrNull(data.rating), numOrNull(data.reviewCount),
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
    `UPDATE products SET name=$1, description=$2, "fullDescription"=$3, price=$4, "oldPrice"=$5, badge=$6, "imageUrl"=$7, "freeShipping"=$8, "freeInstall"=$9, "categoryId"=$10, published=$11, brand=$12, stock=$13, rating=$14, "reviewCount"=$15, "updatedAt"=now()
     WHERE id=$16`,
    [
      merged.name, merged.description, merged.fullDescription, Number(merged.price),
      merged.oldPrice === "" || merged.oldPrice === null || merged.oldPrice === undefined ? null : Number(merged.oldPrice),
      merged.badge || null, merged.imageUrl || null, !!merged.freeShipping, !!merged.freeInstall,
      merged.categoryId, !!merged.published,
      merged.brand || null, merged.stock || "in_stock",
      numOrNull(merged.rating), numOrNull(merged.reviewCount),
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
    `INSERT INTO orders (id, "customerName", "customerPhone", "customerCity", "itemsJson", total) VALUES ($1,$2,$3,$4,$5,$6)`,
    [id, customerName, customerPhone, customerCity || null, JSON.stringify(items), Number(total)]
  );
  const { rows } = await getPool().query(`SELECT * FROM orders WHERE id = $1`, [id]);
  return rows[0];
}
