import { NextResponse } from "next/server";
import { getSettings, saveSettings } from "../../../lib/db.js";
import { ALL_SETTING_KEYS } from "../../../lib/settings.js";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json(await getSettings());
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    // لا نقبل إلا المفاتيح المعروفة — يمنع حشو جدول الإعدادات بمدخلات عشوائية
    const clean = Object.fromEntries(
      Object.entries(body).filter(([k]) => ALL_SETTING_KEYS.includes(k))
    );
    return NextResponse.json(await saveSettings(clean));
  } catch (err) {
    return NextResponse.json({ error: err.message || "تعذّر الحفظ" }, { status: 400 });
  }
}
