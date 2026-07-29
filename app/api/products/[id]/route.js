import { NextResponse } from "next/server";
import { getProductById, updateProduct, deleteProduct } from "../../../../lib/db.js";

export async function GET(request, { params }) {
  const product = await getProductById(params.id);
  if (!product) return NextResponse.json({ error: "غير موجود" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(request, { params }) {
  const body = await request.json();
  try {
    const product = await updateProduct(params.id, body);
    return NextResponse.json(product);
  } catch (e) {
    return NextResponse.json({ error: e.message || "تعذّر تحديث المنتج" }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await deleteProduct(params.id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "تعذّر حذف المنتج" }, { status: 400 });
  }
}
