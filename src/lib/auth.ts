import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "node:crypto";

// Authentification minimaliste par mot de passe unique.
// - Le mot de passe est dans la variable d'env ADMIN_PASSWORD.
// - Une fois connecté, on pose un cookie signé (HMAC) sans état serveur.

const COOKIE_NAME = "sci_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 jours

function getSecret(): string {
  // SESSION_SECRET en prod ; repli sur ADMIN_PASSWORD pour ne jamais planter en local.
  return process.env.SESSION_SECRET || process.env.ADMIN_PASSWORD || "dev-secret-change-me";
}

function sign(value: string): string {
  return crypto.createHmac("sha256", getSecret()).update(value).digest("hex");
}

// Compare deux mots de passe en temps constant.
export function passwordMatches(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD || "";
  if (!expected) return false;
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export async function createSession(): Promise<void> {
  const expiry = String(Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS);
  const token = `${expiry}.${sign(expiry)}`;
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return false;
  const [expiry, sig] = token.split(".");
  if (!expiry || !sig) return false;
  // Signature valide ?
  const expectedSig = sign(expiry);
  if (
    sig.length !== expectedSig.length ||
    !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))
  ) {
    return false;
  }
  // Pas expiré ?
  return Number(expiry) > Math.floor(Date.now() / 1000);
}

// À appeler en tête des pages admin protégées.
export async function requireAuth(): Promise<void> {
  if (!(await isAuthenticated())) redirect("/admin/login");
}
