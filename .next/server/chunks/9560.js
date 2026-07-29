"use strict";exports.id=9560,exports.ids=[9560],exports.modules={9560:(e,t,r)=>{r.a(e,async(e,a)=>{try{r.r(t),r.d(t,{countCategories:()=>w,countOrders:()=>A,countProducts:()=>C,createBanner:()=>y,createCategory:()=>T,createOrder:()=>U,createProduct:()=>N,deleteBanner:()=>L,deleteCategory:()=>d,deleteProduct:()=>p,getBanners:()=>g,getCategories:()=>l,getCategoryBySlug:()=>u,getOrders:()=>I,getProductById:()=>$,getProducts:()=>R,updateBanner:()=>O,updateCategory:()=>s,updateProduct:()=>S});var n=r(8678),i=r(4770),o=e([n]);let{Pool:m}=(n=(o.then?(await o)():o)[0]).default,f=globalThis;function E(){if(f.__areejPgPool)return f.__areejPgPool;let e=new m({connectionString:process.env.DATABASE_URL,ssl:{rejectUnauthorized:!1},max:5});return f.__areejPgPool=e,e}let F=null;async function c(){return F||(F=E().query(`
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
  `))}let D=()=>i.randomBytes(12).toString("hex");async function l(){await c();let e=E(),{rows:t}=await e.query('SELECT * FROM categories ORDER BY "sortOrder" ASC'),r=await e.query('SELECT "categoryId", COUNT(*) as n FROM products GROUP BY "categoryId"'),a=Object.fromEntries(r.rows.map(e=>[e.categoryId,Number(e.n)]));return t.map(e=>({...e,_count:{products:a[e.id]||0}}))}async function u(e){await c();let{rows:t}=await E().query("SELECT * FROM categories WHERE slug = $1",[e]);return t[0]||null}async function T({name:e,slug:t,tagline:r,color:a,icon:n}){await c();let i=E(),o=D(),{rows:l}=await i.query("SELECT COUNT(*) as n FROM categories"),u=Number(l[0].n)+1;await i.query('INSERT INTO categories (id, slug, name, tagline, color, icon, "sortOrder") VALUES ($1,$2,$3,$4,$5,$6,$7)',[o,t,e,r||null,a||"#0C1C77",n||"Package",u]);let{rows:T}=await i.query("SELECT * FROM categories WHERE id = $1",[o]);return T[0]}async function s(e,{name:t,tagline:r,color:a,icon:n,bannerUrl:i,sortOrder:o}){await c(),await E().query('UPDATE categories SET name=$1, tagline=$2, color=$3, icon=$4, "bannerUrl"=$5, "sortOrder"=$6 WHERE id=$7',[t,r||null,a||"#0C1C77",n||"Package",i||null,o??0,e]);let{rows:l}=await E().query("SELECT * FROM categories WHERE id = $1",[e]);return l[0]}async function d(e){await c();let t=E(),{rows:r}=await t.query('SELECT COUNT(*) as n FROM products WHERE "categoryId" = $1',[e]),a=Number(r[0].n);if(a>0)throw Error(`لا يمكن حذف هذا التصنيف لأنه يحتوي على ${a} منتج`);await t.query("DELETE FROM categories WHERE id = $1",[e])}async function g({placement:e}={}){await c();let t=E(),{rows:r}=e?await t.query('SELECT * FROM banners WHERE placement = $1 ORDER BY "sortOrder" ASC',[e]):await t.query('SELECT * FROM banners ORDER BY "sortOrder" ASC');return r}async function y(e){await c();let t=D();await E().query(`INSERT INTO banners (id, placement, "categoryId", title, subtitle, "imageUrl", "linkCategorySlug", "sortOrder", active)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,[t,e.placement,e.categoryId||null,e.title,e.subtitle||null,e.imageUrl||null,e.linkCategorySlug||null,e.sortOrder??0,!1!==e.active]);let{rows:r}=await E().query("SELECT * FROM banners WHERE id = $1",[t]);return r[0]}async function O(e,t){await c(),await E().query('UPDATE banners SET placement=$1, "categoryId"=$2, title=$3, subtitle=$4, "imageUrl"=$5, "linkCategorySlug"=$6, "sortOrder"=$7, active=$8 WHERE id=$9',[t.placement,t.categoryId||null,t.title,t.subtitle||null,t.imageUrl||null,t.linkCategorySlug||null,t.sortOrder??0,!1!==t.active,e]);let{rows:r}=await E().query("SELECT * FROM banners WHERE id = $1",[e]);return r[0]}async function L(e){await c(),await E().query("DELETE FROM banners WHERE id = $1",[e])}async function R({categorySlug:e}={}){await c();let t=E(),r=e?{text:`SELECT p.*, c.name as "categoryName", c.slug as "categorySlug", c.color as "categoryColor", c.icon as "categoryIcon"
               FROM products p JOIN categories c ON p."categoryId" = c.id
               WHERE c.slug = $1 ORDER BY p."createdAt" DESC`,values:[e]}:{text:`SELECT p.*, c.name as "categoryName", c.slug as "categorySlug", c.color as "categoryColor", c.icon as "categoryIcon"
               FROM products p JOIN categories c ON p."categoryId" = c.id
               ORDER BY p."createdAt" DESC`,values:[]},{rows:a}=await t.query(r);return a.map(e=>({...e,category:{name:e.categoryName,slug:e.categorySlug,color:e.categoryColor,icon:e.categoryIcon}}))}async function $(e){await c();let{rows:t}=await E().query("SELECT * FROM products WHERE id = $1",[e]);return t[0]||null}async function N(e){await c();let t=E(),r=D();return await t.query(`INSERT INTO products (id, name, description, "fullDescription", price, "oldPrice", badge, "imageUrl", "freeShipping", "freeInstall", "categoryId")
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,[r,e.name,e.description||"",e.fullDescription||"",Number(e.price),e.oldPrice?Number(e.oldPrice):null,e.badge||null,e.imageUrl||null,!!e.freeShipping,!!e.freeInstall,e.categoryId]),await $(r)}async function S(e,t){await c();let r=await $(e);if(!r)throw Error("المنتج غير موجود");let a={...r,...t};return await E().query(`UPDATE products SET name=$1, description=$2, "fullDescription"=$3, price=$4, "oldPrice"=$5, badge=$6, "imageUrl"=$7, "freeShipping"=$8, "freeInstall"=$9, "categoryId"=$10, published=$11, "updatedAt"=now()
     WHERE id=$12`,[a.name,a.description,a.fullDescription,Number(a.price),""===a.oldPrice||null===a.oldPrice||void 0===a.oldPrice?null:Number(a.oldPrice),a.badge||null,a.imageUrl||null,!!a.freeShipping,!!a.freeInstall,a.categoryId,!!a.published,e]),await $(e)}async function p(e){await c(),await E().query("DELETE FROM products WHERE id = $1",[e])}async function C(){await c();let{rows:e}=await E().query("SELECT COUNT(*) as n FROM products");return Number(e[0].n)}async function w(){await c();let{rows:e}=await E().query("SELECT COUNT(*) as n FROM categories");return Number(e[0].n)}async function A(){await c();let{rows:e}=await E().query("SELECT COUNT(*) as n FROM orders");return Number(e[0].n)}async function I(){await c();let{rows:e}=await E().query('SELECT * FROM orders ORDER BY "createdAt" DESC');return e}async function U({customerName:e,customerPhone:t,customerCity:r,items:a,total:n}){await c();let i=D();await E().query('INSERT INTO orders (id, "customerName", "customerPhone", "customerCity", "itemsJson", total) VALUES ($1,$2,$3,$4,$5,$6)',[i,e,t,r||null,JSON.stringify(a),Number(n)]);let{rows:o}=await E().query("SELECT * FROM orders WHERE id = $1",[i]);return o[0]}a()}catch(e){a(e)}})}};