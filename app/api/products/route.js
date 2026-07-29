import { NextResponse } from "next/server";
import { getProducts, createProduct } from "../../../lib/db.js";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const categorySlug = searchParams.get("category");
  const products = await getProducts({ categorySlug: categorySlug || undefined });
  return NextResponse.json(products);
}

export async function POST(request) {
  const body = await request.json();
  const { name, categoryId, price } = body;

  if (!name || !categoryId || price === undefined || price === null || price === "") {
    return NextResponse.json({ error: "الاسم والتصنيف والسعر مطلوبة" }, { status: 400 });
  }

  const product = await createProduct(body);
  return NextResponse.json(product, { status: 201 });
}
