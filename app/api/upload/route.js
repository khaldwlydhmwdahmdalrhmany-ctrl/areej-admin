import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

export async function POST(request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "لم يتم إرفاق ملف" }, { status: 400 });
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: "صيغة الصورة غير مدعومة (jpg, png, webp فقط)" }, { status: 400 });
  }
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "حجم الصورة أكبر من 5 ميغابايت" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const fileName = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}.${ext}`;

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });
  await writeFile(path.join(uploadsDir, fileName), buffer);

  return NextResponse.json({ url: `/uploads/${fileName}` });
}

// ملاحظة للمستقبل: عند النشر الفعلي على Vercel، نظام الملفات هناك للقراءة فقط،
// لذا سيتم استبدال هذا المسار برفع إلى Vercel Blob Storage بدلاً من الحفظ محليًا.
// الواجهة الأمامية لن تتغير — فقط هذا الملف سيُستبدل داخليًا.
