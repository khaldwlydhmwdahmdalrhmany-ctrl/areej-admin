const isPostgres = (process.env.DATABASE_URL || "").startsWith("postgres");

const impl = isPostgres ? await import("./db.pg.js") : await import("./db.sqlite.js");

export const {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  countProducts,
  countCategories,
  countOrders,
  getOrders,
  createOrder,
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
} = impl;
