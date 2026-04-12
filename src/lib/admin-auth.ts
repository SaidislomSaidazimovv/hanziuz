export const ADMIN_COOKIE_NAME = "admin_session";
export const ADMIN_COOKIE_MAX_AGE = 60 * 60 * 24;

export async function hashSecret(secret: string): Promise<string> {
  const data = new TextEncoder().encode(secret);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function isValidAdminCookie(
  cookieValue: string | undefined | null
): Promise<boolean> {
  if (!cookieValue) return false;
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  const expected = await hashSecret(secret);
  if (cookieValue.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < cookieValue.length; i++) {
    diff |= cookieValue.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}
