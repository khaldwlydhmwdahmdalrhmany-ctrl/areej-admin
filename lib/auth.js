// نستخدم Web Crypto API (بدل وحدة crypto التابعة لـ Node) لأن الـ middleware
// يعمل على بيئة Edge Runtime التي لا تدعم وحدات Node التقليدية.

const SECRET = process.env.SESSION_SECRET || "insecure-dev-secret";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // أسبوع

function base64url(bytes) {
  let str = typeof bytes === "string" ? btoa(bytes) : btoa(String.fromCharCode(...new Uint8Array(bytes)));
  return str.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64urlDecode(str) {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/").padEnd(str.length + ((4 - (str.length % 4)) % 4), "=");
  return atob(padded);
}

async function hmacSign(message) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return base64url(sig);
}

export async function createSessionToken(username) {
  const payload = JSON.stringify({ u: username, exp: Date.now() + SESSION_MAX_AGE * 1000 });
  const payloadB64 = base64url(payload);
  const sig = await hmacSign(payloadB64);
  return `${payloadB64}.${sig}`;
}

export async function verifySessionToken(token) {
  if (!token || !token.includes(".")) return null;
  const [payloadB64, sig] = token.split(".");
  const expectedSig = await hmacSign(payloadB64);
  if (sig !== expectedSig) return null;
  try {
    const payload = JSON.parse(base64urlDecode(payloadB64));
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export const SESSION_COOKIE_NAME = "areej_admin_session";
export const SESSION_MAX_AGE_SECONDS = SESSION_MAX_AGE;
