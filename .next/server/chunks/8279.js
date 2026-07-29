"use strict";exports.id=8279,exports.ids=[8279],exports.modules={8279:(e,r,t)=>{t.r(r),t.d(r,{countCategories:()=>D,countOrders:()=>b,countProducts:()=>F,createBanner:()=>S,createCategory:()=>g,createOrder:()=>P,createProduct:()=>U,deleteBanner:()=>y,deleteCategory:()=>O,deleteProduct:()=>f,getBanners:()=>L,getCategories:()=>d,getCategoryBySlug:()=>p,getOrders:()=>X,getProductById:()=>I,getProducts:()=>m,updateBanner:()=>N,updateCategory:()=>R,updateProduct:()=>A});var a=t(5861),n=t(5315),E=t(4770),c=t(2048);let o=n.join(process.cwd(),"data","areej.db"),i=globalThis;function l(){if(i.__areejDb)return i.__areejDb;c.mkdirSync(n.dirname(o),{recursive:!0});let e=new a.DatabaseSync(o);return e.exec(`
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
  `),i.__areejDb=e,e}let T=()=>E.randomBytes(12).toString("hex"),s=e=>!!e,u=e=>e?1:0;async function d(){let e=l();return e.prepare("SELECT * FROM categories ORDER BY sortOrder ASC").all().map(r=>({...r,_count:{products:e.prepare("SELECT COUNT(*) as n FROM products WHERE categoryId = ?").get(r.id).n}}))}async function p(e){return l().prepare("SELECT * FROM categories WHERE slug = ?").get(e)||null}async function g({name:e,slug:r,tagline:t,color:a,icon:n}){let E=l(),c=T(),o=E.prepare("SELECT COUNT(*) as n FROM categories").get().n;return E.prepare("INSERT INTO categories (id, slug, name, tagline, color, icon, sortOrder) VALUES (?, ?, ?, ?, ?, ?, ?)").run(c,r,e,t||null,a||"#0C1C77",n||"Package",o+1),E.prepare("SELECT * FROM categories WHERE id = ?").get(c)}async function R(e,{name:r,tagline:t,color:a,icon:n,bannerUrl:E,sortOrder:c}){let o=l();return o.prepare("UPDATE categories SET name=?, tagline=?, color=?, icon=?, bannerUrl=?, sortOrder=? WHERE id=?").run(r,t||null,a||"#0C1C77",n||"Package",E||null,c??0,e),o.prepare("SELECT * FROM categories WHERE id = ?").get(e)}async function O(e){let r=l(),t=r.prepare("SELECT COUNT(*) as n FROM products WHERE categoryId = ?").get(e).n;if(t>0)throw Error(`لا يمكن حذف هذا التصنيف لأنه يحتوي على ${t} منتج`);r.prepare("DELETE FROM categories WHERE id = ?").run(e)}async function L({placement:e}={}){let r=l();return e?r.prepare("SELECT * FROM banners WHERE placement = ? ORDER BY sortOrder ASC").all(e):r.prepare("SELECT * FROM banners ORDER BY sortOrder ASC").all()}async function S(e){let r=l(),t=T();return r.prepare(`
    INSERT INTO banners (id, placement, categoryId, title, subtitle, imageUrl, linkCategorySlug, sortOrder, active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(t,e.placement,e.categoryId||null,e.title,e.subtitle||null,e.imageUrl||null,e.linkCategorySlug||null,e.sortOrder??0,u(!1!==e.active)),r.prepare("SELECT * FROM banners WHERE id = ?").get(t)}async function N(e,r){let t=l();return t.prepare(`
    UPDATE banners SET placement=?, categoryId=?, title=?, subtitle=?, imageUrl=?, linkCategorySlug=?, sortOrder=?, active=? WHERE id=?
  `).run(r.placement,r.categoryId||null,r.title,r.subtitle||null,r.imageUrl||null,r.linkCategorySlug||null,r.sortOrder??0,u(!1!==r.active),e),t.prepare("SELECT * FROM banners WHERE id = ?").get(e)}async function y(e){l().prepare("DELETE FROM banners WHERE id = ?").run(e)}function C(e){return e?{...e,freeShipping:s(e.freeShipping),freeInstall:s(e.freeInstall),published:s(e.published)}:null}async function m({categorySlug:e}={}){let r=l();return(e?r.prepare(`
      SELECT p.*, c.name as categoryName, c.slug as categorySlug, c.color as categoryColor, c.icon as categoryIcon
      FROM products p JOIN categories c ON p.categoryId = c.id
      WHERE c.slug = ? ORDER BY p.createdAt DESC
    `).all(e):r.prepare(`
      SELECT p.*, c.name as categoryName, c.slug as categorySlug, c.color as categoryColor, c.icon as categoryIcon
      FROM products p JOIN categories c ON p.categoryId = c.id
      ORDER BY p.createdAt DESC
    `).all()).map(e=>({...C(e),category:{name:e.categoryName,slug:e.categorySlug,color:e.categoryColor,icon:e.categoryIcon}}))}async function I(e){return C(l().prepare("SELECT * FROM products WHERE id = ?").get(e))}async function U(e){let r=l(),t=T();return r.prepare(`
    INSERT INTO products (id, name, description, fullDescription, price, oldPrice, badge, imageUrl, freeShipping, freeInstall, categoryId)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(t,e.name,e.description||"",e.fullDescription||"",Number(e.price),e.oldPrice?Number(e.oldPrice):null,e.badge||null,e.imageUrl||null,u(e.freeShipping),u(e.freeInstall),e.categoryId),await I(t)}async function A(e,r){let t=l(),a=await I(e);if(!a)throw Error("المنتج غير موجود");let n={...a,...r};return t.prepare(`
    UPDATE products SET name=?, description=?, fullDescription=?, price=?, oldPrice=?, badge=?, imageUrl=?, freeShipping=?, freeInstall=?, categoryId=?, published=?, updatedAt=datetime('now')
    WHERE id=?
  `).run(n.name,n.description,n.fullDescription,Number(n.price),""===n.oldPrice||null===n.oldPrice||void 0===n.oldPrice?null:Number(n.oldPrice),n.badge||null,n.imageUrl||null,u(n.freeShipping),u(n.freeInstall),n.categoryId,u(n.published),e),await I(e)}async function f(e){l().prepare("DELETE FROM products WHERE id = ?").run(e)}async function F(){return l().prepare("SELECT COUNT(*) as n FROM products").get().n}async function D(){return l().prepare("SELECT COUNT(*) as n FROM categories").get().n}async function b(){return l().prepare("SELECT COUNT(*) as n FROM orders").get().n}async function X(){return l().prepare("SELECT * FROM orders ORDER BY createdAt DESC").all()}async function P({customerName:e,customerPhone:r,customerCity:t,items:a,total:n}){let E=l(),c=T();return E.prepare(`
    INSERT INTO orders (id, customerName, customerPhone, customerCity, itemsJson, total) VALUES (?, ?, ?, ?, ?, ?)
  `).run(c,e,r,t||null,JSON.stringify(a),Number(n)),E.prepare("SELECT * FROM orders WHERE id = ?").get(c)}}};