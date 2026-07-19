import crypto from "crypto";

// ---- Password hashing (scrypt, built into Node — no extra dependency) ----
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const check = crypto.scryptSync(password, salt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(check));
}

// ---- Signed session cookie (HMAC, stateless — no sessions table needed) ----
const SECRET = process.env.SESSION_SECRET || "fitforge-dev-secret-change-me";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 90; // 90 days — "stay logged in"

export function createSessionToken(userId: number): string {
  const payload = JSON.stringify({ uid: userId, exp: Date.now() + MAX_AGE_SECONDS * 1000 });
  const b64 = Buffer.from(payload).toString("base64url");
  const sig = crypto.createHmac("sha256", SECRET).update(b64).digest("base64url");
  return `${b64}.${sig}`;
}

export function verifySessionToken(token: string | undefined | null): number | null {
  if (!token) return null;
  const [b64, sig] = token.split(".");
  if (!b64 || !sig) return null;
  const expectedSig = crypto.createHmac("sha256", SECRET).update(b64).digest("base64url");
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))) return null;
  try {
    const payload = JSON.parse(Buffer.from(b64, "base64url").toString());
    if (payload.exp < Date.now()) return null;
    return payload.uid as number;
  } catch {
    return null;
  }
}

export const SESSION_COOKIE = "ff_session";
export const SESSION_MAX_AGE = MAX_AGE_SECONDS;
