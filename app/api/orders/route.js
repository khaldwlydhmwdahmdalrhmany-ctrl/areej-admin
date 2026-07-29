import { NextResponse } from "next/server";
import { createOrder } from "../../../lib/db.js";

export async function POST(request) {
  const body = await request.json();
  const { customerName, customerPhone, items, total } = body;
  if (!customerName || !customerPhone || !items || total === undefined) {
    return NextResponse.json({ error: "بيانات ناقصة" }, { status: 400 });
  }
  const order = await createOrder(body);
  return NextResponse.json(order, { status: 201 });
}
