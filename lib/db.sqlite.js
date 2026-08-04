// طبقة الوصول لقاعدة البيانات.
//
// للتطوير والتجربة المحلية الآن: نستخدم SQLite (ملف حقيقي على القرص عبر وحدة node:sqlite المدمجة في Node.js).
// عند النشر الفعلي على Vercel لاحقًا: يتم استبدال محتوى هذا الملف فقط باستخدام @vercel/postgres
// بنفس أسماء الدوال بالضبط (getCategories, getProducts, createProduct...) — لن تحتاج أي صفحة
// أو مسار API آخر في المشروع للتعديل، لأنها كلها تستدعي هذه الدوال فقط ولا تعرف نوع القاعدة الفعلي.

import { DatabaseSync } from "node:sqlite";
import path from "path";
import crypto from "crypto";
import fs from "fs";

const DB_PATH = path.join(process.cwd(), "data", "areej.db");

const globalForDb = globalThis;
function getDb() {
  if (globalForDb.__areejDb) return globalForDb.__areejDb;

  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

  const db = new DatabaseSync(DB_PATH);
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      tagline TEXT,
      color TEXT DEFAULT '#0C1C77',
      icon TEXT DEFAULT 'Package',
      bannerUrl TEXT,
      sortOrder INTEGER DEFAULT 0,
      createdAt TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT DEFAULT '',
      fullDescription TEXT DEFAULT '',
      price REAL NOT NULL,
      oldPrice REAL,
      badge TEXT,
      imageUrl TEXT,
      freeShipping INTEGER DEFAULT 0,
      freeInstall INTEGER DEFAULT 0,
      published INTEGER DEFAULT 1,
      brand TEXT,
      stock TEXT DEFAULT 'in_stock',
      sortOrder INTEGER DEFAULT 0,
      featuredOffer INTEGER DEFAULT 0,
      rating REAL,
      reviewCount INTEGER,
      categoryId TEXT NOT NULL,
      createdAt TEXT DEFAULT (datetime('now')),
      updatedAt TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS banners (
      id TEXT PRIMARY KEY,
      placement TEXT NOT NULL,
      categoryId TEXT,
      title TEXT NOT NULL,
      subtitle TEXT,
      imageUrl TEXT,
      linkCategorySlug TEXT,
      sortOrder INTEGER DEFAULT 0,
      active INTEGER DEFAULT 1,
      ratio TEXT DEFAULT 'auto',
      ctaLabel TEXT,
      ctaHref TEXT,
      createdAt TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      customerName TEXT NOT NULL,
      customerPhone TEXT NOT NULL,
      customerCity TEXT,
      itemsJson TEXT NOT NULL,
      total REAL NOT NULL,
      status TEXT DEFAULT 'جديد',
      orderNumber TEXT,
      source TEXT,
      medium TEXT,
      campaign TEXT,
      landingPath TEXT,
      notes TEXT,
      createdAt TEXT DEFAULT (datetime('now'))
    );
  `);

  globalForDb.__areejDb = db;
  return db;
}

const newId = () => crypto.randomBytes(12).toString("hex");
const toBool = (v) => !!v;
const fromBool = (v) => (v ? 1 : 0);

const numOrNull = (v) =>
  v === "" || v === null || v === undefined || Number.isNaN(Number(v)) ? null : Number(v);

/* ============ التصنيفات ============ */
export async function getCategories() {
  const db = getDb();
  const cats = db.prepare(`SELECT * FROM categories ORDER BY sortOrder ASC`).all();
  return cats.map((c) => ({
    ...c,
    _count: {
      products: db.prepare(`SELECT COUNT(*) as n FROM products WHERE categoryId = ?`).get(c.id).n,
    },
  }));
}

export async function getCategoryBySlug(slug) {
  const db = getDb();
  return db.prepare(`SELECT * FROM categories WHERE slug = ?`).get(slug) || null;
}

export async function createCategory({ name, slug, tagline, color, icon }) {
  const db = getDb();
  const id = newId();
  const count = db.prepare(`SELECT COUNT(*) as n FROM categories`).get().n;
  db.prepare(
    `INSERT INTO categories (id, slug, name, tagline, color, icon, sortOrder) VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(id, slug, name, tagline || null, color || "#0C1C77", icon || "Package", count + 1);
  return db.prepare(`SELECT * FROM categories WHERE id = ?`).get(id);
}

export async function updateCategory(id, { name, tagline, color, icon, bannerUrl, sortOrder }) {
  const db = getDb();
  db.prepare(`UPDATE categories SET name=?, tagline=?, color=?, icon=?, bannerUrl=?, sortOrder=? WHERE id=?`).run(
    name, tagline || null, color || "#0C1C77", icon || "Package", bannerUrl || null, sortOrder ?? 0, id
  );
  return db.prepare(`SELECT * FROM categories WHERE id = ?`).get(id);
}

export async function deleteCategory(id) {
  const db = getDb();
  const inUse = db.prepare(`SELECT COUNT(*) as n FROM products WHERE categoryId = ?`).get(id).n;
  if (inUse > 0) throw new Error(`لا يمكن حذف هذا التصنيف لأنه يحتوي على ${inUse} منتج`);
  db.prepare(`DELETE FROM categories WHERE id = ?`).run(id);
}

/* ============ البنرات ============ */
export async function getBanners({ placement } = {}) {
  const db = getDb();
  if (placement) return db.prepare(`SELECT * FROM banners WHERE placement = ? ORDER BY sortOrder ASC`).all(placement);
  return db.prepare(`SELECT * FROM banners ORDER BY sortOrder ASC`).all();
}

export async function createBanner(data) {
  const db = getDb();
  const id = newId();
  db.prepare(`
    INSERT INTO banners (id, placement, categoryId, title, subtitle, imageUrl, linkCategorySlug, sortOrder, active, ratio, ctaLabel, ctaHref)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, data.placement, data.categoryId || null, data.title, data.subtitle || null, data.imageUrl || null, data.linkCategorySlug || null, data.sortOrder ?? 0, fromBool(data.active !== false));
  return db.prepare(`SELECT * FROM banners WHERE id = ?`).get(id);
}

export async function updateBanner(id, data) {
  const db = getDb();
  db.prepare(`
    UPDATE banners SET placement=?, categoryId=?, title=?, subtitle=?, imageUrl=?, linkCategorySlug=?, sortOrder=?, active=?, ratio=?, ctaLabel=?, ctaHref=? WHERE id=?
  `).run(data.placement, data.categoryId || null, data.title, data.subtitle || null, data.imageUrl || null, data.linkCategorySlug || null, data.sortOrder ?? 0, fromBool(data.active !== false), id);
  return db.prepare(`SELECT * FROM banners WHERE id = ?`).get(id);
}

export async function deleteBanner(id) {
  getDb().prepare(`DELETE FROM banners WHERE id = ?`).run(id);
}

/* ============ المنتجات ============ */
function mapProduct(row) {
  if (!row) return null;
  return { ...row, freeShipping: toBool(row.freeShipping), freeInstall: toBool(row.freeInstall), published: toBool(row.published) };
}

export async function getProducts({ categorySlug, includeHidden = false } = {}) {
  const db = getDb();
  const visible = includeHidden ? "" : "AND p.published != 0";
  const order = "ORDER BY p.sortOrder ASC, p.createdAt DESC";
  let rows;
  if (categorySlug) {
    rows = db.prepare(`
      SELECT p.*, c.name as categoryName, c.slug as categorySlug, c.color as categoryColor, c.icon as categoryIcon
      FROM products p JOIN categories c ON p.categoryId = c.id
      WHERE c.slug = ? ${visible} ${order}
    `).all(categorySlug);
  } else {
    rows = db.prepare(`
      SELECT p.*, c.name as categoryName, c.slug as categorySlug, c.color as categoryColor, c.icon as categoryIcon
      FROM products p JOIN categories c ON p.categoryId = c.id
      WHERE 1=1 ${visible} ${order}
    `).all();
  }
  return rows.map((r) => ({
    ...mapProduct(r),
    category: { name: r.categoryName, slug: r.categorySlug, color: r.categoryColor, icon: r.categoryIcon },
  }));
}

export async function getProductById(id) {
  const db = getDb();
  const row = db.prepare(`SELECT * FROM products WHERE id = ?`).get(id);
  return mapProduct(row);
}

export async function createProduct(data) {
  const db = getDb();
  const id = newId();
  db.prepare(`
    INSERT INTO products (id, name, description, fullDescription, price, oldPrice, badge, imageUrl, freeShipping, freeInstall, categoryId, brand, stock, rating, reviewCount, sortOrder, featuredOffer)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id, data.name, data.description || "", data.fullDescription || "", Number(data.price),
    data.oldPrice ? Number(data.oldPrice) : null, data.badge || null, data.imageUrl || null,
    fromBool(data.freeShipping), fromBool(data.freeInstall), data.categoryId,
    data.brand || null, data.stock || "in_stock", numOrNull(data.rating), numOrNull(data.reviewCount),
    Number(data.sortOrder) || 0, fromBool(data.featuredOffer)
  );
  return await getProductById(id);
}

export async function updateProduct(id, data) {
  const db = getDb();
  const current = await getProductById(id);
  if (!current) throw new Error("المنتج غير موجود");
  const merged = { ...current, ...data };
  db.prepare(`
    UPDATE products SET name=?, description=?, fullDescription=?, price=?, oldPrice=?, badge=?, imageUrl=?, freeShipping=?, freeInstall=?, categoryId=?, published=?, brand=?, stock=?, rating=?, reviewCount=?, sortOrder=?, featuredOffer=?, updatedAt=datetime('now')
    WHERE id=?
  `).run(
    merged.name, merged.description, merged.fullDescription, Number(merged.price),
    merged.oldPrice === "" || merged.oldPrice === null || merged.oldPrice === undefined ? null : Number(merged.oldPrice),
    merged.badge || null, merged.imageUrl || null, fromBool(merged.freeShipping), fromBool(merged.freeInstall),
    merged.categoryId, fromBool(merged.published),
    merged.brand || null, merged.stock || "in_stock", numOrNull(merged.rating), numOrNull(merged.reviewCount),
    Number(merged.sortOrder) || 0, fromBool(merged.featuredOffer),
    id
  );
  return await getProductById(id);
}

export async function deleteProduct(id) {
  const db = getDb();
  db.prepare(`DELETE FROM products WHERE id = ?`).run(id);
}

export async function countProducts() {
  return getDb().prepare(`SELECT COUNT(*) as n FROM products`).get().n;
}
export async function countCategories() {
  return getDb().prepare(`SELECT COUNT(*) as n FROM categories`).get().n;
}
export async function countOrders() {
  return getDb().prepare(`SELECT COUNT(*) as n FROM orders`).get().n;
}

/* ============ الطلبات ============ */
export async function getOrders() {
  return getDb().prepare(`SELECT * FROM orders ORDER BY createdAt DESC`).all();
}

export const ORDER_STATUSES = ["جديد", "قيد التجهيز", "تم الشحن", "مكتمل", "ملغي"];

export async function updateOrderStatus(id, status, notes) {
  const db = getDb();
  if (!ORDER_STATUSES.includes(status)) throw new Error("حالة طلب غير معروفة");
  db.prepare(`UPDATE orders SET status = ?, notes = COALESCE(?, notes) WHERE id = ?`).run(status, notes ?? null, id);
  return db.prepare(`SELECT * FROM orders WHERE id = ?`).get(id) || null;
}

export async function createOrder({ customerName, customerPhone, customerCity, items, total }) {
  const db = getDb();
  const id = newId();
  db.prepare(`
    INSERT INTO orders (id, orderNumber, customerName, customerPhone, customerCity, itemsJson, total, source, medium, campaign, landingPath)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, await nextOrderNumber(), customerName, customerPhone, customerCity || null, JSON.stringify(items), Number(total),
         data.source || null, data.medium || null, data.campaign || null, data.landingPath || null);
  return db.prepare(`SELECT * FROM orders WHERE id = ?`).get(id);
}


/* ============ الإعدادات العامة ============ */

export async function getSettings() {
  const db = getDb();
  db.exec(`CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT, updatedAt TEXT)`);
  const rows = db.prepare(`SELECT key, value FROM settings`).all();
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}

export async function saveSettings(entries) {
  const db = getDb();
  db.exec(`CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT, updatedAt TEXT)`);
  const stmt = db.prepare(
    `INSERT INTO settings (key, value, updatedAt) VALUES (?, ?, datetime('now'))
     ON CONFLICT(key) DO UPDATE SET value = excluded.value, updatedAt = datetime('now')`
  );
  for (const [key, value] of Object.entries(entries)) stmt.run(key, value ?? null);
  return getSettings();
}

export async function nextOrderNumber() {
  const db = getDb();
  const row = db.prepare(`SELECT COUNT(*) AS n FROM orders`).get();
  const now = new Date();
  const yy = String(now.getFullYear()).slice(2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  return `AR-${yy}${mm}-${1001 + (row?.n ?? 0)}`;
}


/* ============ التحليلات (تطوير محلي) ============ */

function ensureVisits(db) {
  db.exec(`CREATE TABLE IF NOT EXISTS visits (
    id TEXT PRIMARY KEY, sessionId TEXT, path TEXT, source TEXT, medium TEXT,
    campaign TEXT, referrer TEXT, device TEXT, isNew INTEGER DEFAULT 1,
    createdAt TEXT DEFAULT (datetime('now'))
  )`);
}

export async function recordVisit(v) {
  const db = getDb(); ensureVisits(db);
  db.prepare(`INSERT INTO visits (id, sessionId, path, source, medium, campaign, referrer, device, isNew)
              VALUES (?,?,?,?,?,?,?,?,?)`)
    .run(newId(), v.sessionId || null, v.path || null, v.source || "direct", v.medium || "none",
         v.campaign || null, v.referrer || null, v.device || null, v.isNew !== false ? 1 : 0);
}

export async function getAnalytics({ days = 30 } = {}) {
  const db = getDb(); ensureVisits(db);
  const since = `datetime('now','-${Number(days)} days')`;
  const q = (sql) => { try { return db.prepare(sql).all(); } catch { return []; } };
  const one = (sql) => { try { return db.prepare(sql).get() || {}; } catch { return {}; } };

  return {
    totals: one(`SELECT
      (SELECT count(*) FROM visits WHERE createdAt > ${since}) AS views,
      (SELECT count(DISTINCT sessionId) FROM visits WHERE createdAt > ${since}) AS sessions,
      (SELECT count(*) FROM visits WHERE isNew=1 AND createdAt > ${since}) AS new_visitors,
      (SELECT count(*) FROM orders WHERE createdAt > ${since}) AS orders,
      (SELECT COALESCE(sum(total),0) FROM orders WHERE createdAt > ${since}) AS revenue`),
    bySource: q(`SELECT source, count(DISTINCT sessionId) sessions, count(*) views FROM visits WHERE createdAt > ${since} GROUP BY source ORDER BY sessions DESC LIMIT 10`),
    byMedium: q(`SELECT medium, count(DISTINCT sessionId) sessions FROM visits WHERE createdAt > ${since} GROUP BY medium ORDER BY sessions DESC`),
    byDay: q(`SELECT date(createdAt) day, count(DISTINCT sessionId) visits, 0 orders FROM visits WHERE createdAt > ${since} GROUP BY 1 ORDER BY 1`),
    topProducts: [],
    orderSources: q(`SELECT COALESCE(source,'direct') source, COALESCE(medium,'none') medium, count(*) orders, COALESCE(sum(total),0) revenue FROM orders WHERE createdAt > ${since} GROUP BY 1,2 ORDER BY orders DESC LIMIT 12`),
    topPages: q(`SELECT path, count(*) views FROM visits WHERE createdAt > ${since} GROUP BY path ORDER BY views DESC LIMIT 8`),
  };
}


/* ============ فهرس خفيف للسلة ============ */

export async function getProductIndex() {
  const db = getDb();
  const rows = db.prepare(`
    SELECT p.id, p.name, p.price, p.imageUrl, c.color AS categoryColor, c.icon AS categoryIcon
    FROM products p JOIN categories c ON p.categoryId = c.id
    WHERE p.published != 0
  `).all();
  return rows.map((r) => ({
    id: r.id, name: r.name, price: Number(r.price), imageUrl: r.imageUrl,
    category: { color: r.categoryColor, icon: r.categoryIcon },
  }));
}

export async function getSitemapData() {
  const db = getDb();
  return {
    products: db.prepare(`SELECT id, name, updatedAt, createdAt FROM products WHERE published != 0`).all(),
    categories: db.prepare(`SELECT slug, createdAt FROM categories ORDER BY sortOrder`).all(),
  };
}
