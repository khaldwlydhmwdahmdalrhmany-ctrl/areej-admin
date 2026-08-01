import { NextResponse } from "next/server";
import { recordVisit } from "../../../lib/db.js";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** حدود طول تمنع حشو الجدول بمدخلات ضخمة أو مفبركة. */
const cap = (v, n) => (typeof v === "string" ? v.slice(0, n) : null);

export async function POST(request) {
  try {
    const b = await request.json();

    await recordVisit({
      sessionId: cap(b.sessionId, 64),
      path: cap(b.path, 200),
      source: cap(b.source, 60),
      medium: cap(b.medium, 40),
      campaign: cap(b.campaign, 120),
      referrer: cap(b.referrer, 300),
      device: b.device === "mobile" ? "mobile" : "desktop",
      isNew: b.isNew !== false,
    });

    // 204: لا محتوى — أخفّ استجابة ممكنة لطلب يُرسل مع كل تنقّل
    return new NextResponse(null, { status: 204 });
  } catch {
    // فشل التتبّع يجب ألا يُزعج الزائر أبدًا
    return new NextResponse(null, { status: 204 });
  }
}
