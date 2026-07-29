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
      createdAt TEXT DEFAULT (datetime('now'))
    );
  `);

  globalForDb.__areejDb = db;
  return db;
}

const newId = () => crypto.randomBytes(12).toString("hex");
const toBool = (v) => !!v;
const fromBool = (v) => (v ? 1 : 0);

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
    INSERT INTO banners (id, placement, categoryId, title, subtitle, imageUrl, linkCategorySlug, sortOrder, active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, data.placement, data.categoryId || null, data.title, data.subtitle || null, data.imageUrl || null, data.linkCategorySlug || null, data.sortOrder ?? 0, fromBool(data.active !== false));
  return db.prepare(`SELECT * FROM banners WHERE id = ?`).get(id);
}

export async function updateBanner(id, data) {
  const db = getDb();
  db.prepare(`
    UPDATE banners SET placement=?, categoryId=?, title=?, subtitle=?, imageUrl=?, linkCategorySlug=?, sortOrder=?, active=? WHERE id=?
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

export async function getProducts({ categorySlug } = {}) {
  const db = getDb();
  let rows;
  if (categorySlug) {
    rows = db.prepare(`
      SELECT p.*, c.name as categoryName, c.slug as categorySlug, c.color as categoryColor, c.icon as categoryIcon
      FROM products p JOIN categories c ON p.categoryId = c.id
      WHERE c.slug = ? ORDER BY p.createdAt DESC
    `).all(categorySlug);
  } else {
    rows = db.prepare(`
      SELECT p.*, c.name as categoryName, c.slug as categorySlug, c.color as categoryColor, c.icon as categoryIcon
      FROM products p JOIN categories c ON p.categoryId = c.id
      ORDER BY p.createdAt DESC
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
    INSERT INTO products (id, name, description, fullDescription, price, oldPrice, badge, imageUrl, freeShipping, freeInstall, categoryId)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id, data.name, data.description || "", data.fullDescription || "", Number(data.price),
    data.oldPrice ? Number(data.oldPrice) : null, data.badge || null, data.imageUrl || null,
    fromBool(data.freeShipping), fromBool(data.freeInstall), data.categoryId
  );
  return await getProductById(id);
}

export async function updateProduct(id, data) {
  const db = getDb();
  const current = await getProductById(id);
  if (!current) throw new Error("المنتج غير موجود");
  const merged = { ...current, ...data };
  db.prepare(`
    UPDATE products SET name=?, description=?, fullDescription=?, price=?, oldPrice=?, badge=?, imageUrl=?, freeShipping=?, freeInstall=?, categoryId=?, published=?, updatedAt=datetime('now')
    WHERE id=?
  `).run(
    merged.name, merged.description, merged.fullDescription, Number(merged.price),
    merged.oldPrice === "" || merged.oldPrice === null || merged.oldPrice === undefined ? null : Number(merged.oldPrice),
    merged.badge || null, merged.imageUrl || null, fromBool(merged.freeShipping), fromBool(merged.freeInstall),
    merged.categoryId, fromBool(merged.published), id
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

export async function createOrder({ customerName, customerPhone, customerCity, items, total }) {
  const db = getDb();
  const id = newId();
  db.prepare(`
    INSERT INTO orders (id, customerName, customerPhone, customerCity, itemsJson, total) VALUES (?, ?, ?, ?, ?, ?)
  `).run(id, customerName, customerPhone, customerCity || null, JSON.stringify(items), Number(total));
  return db.prepare(`SELECT * FROM orders WHERE id = ?`).get(id);
}
