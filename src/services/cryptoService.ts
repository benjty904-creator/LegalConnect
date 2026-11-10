/**
 * Web Crypto API Utility for salted password hashing and secure token/id generation.
 * Operates in standard W3C Web Cryptography API environments.
 */

function getCrypto(): Crypto {
  if (typeof window !== "undefined" && window.crypto) {
    return window.crypto;
  }
  return globalThis.crypto;
}

export async function generateSalt(length = 16): Promise<string> {
  const bytes = new Uint8Array(length);
  getCrypto().getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function hashPassword(password: string, salt: string): Promise<string> {
  const enc = new TextEncoder();
  // Combine password and salt with separator
  const data = enc.encode(`${salt}:${password}`);
  const hashBuffer = await getCrypto().subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function verifyPassword(
  attempt: string,
  salt: string,
  storedHash: string
): Promise<boolean> {
  const computedHash = await hashPassword(attempt, salt);
  return computedHash === storedHash;
}

export function generateId(): string {
  const cryptoObj = getCrypto();
  if (typeof cryptoObj.randomUUID === "function") {
    return cryptoObj.randomUUID();
  }
  return "id-" + Date.now().toString(36) + "-" + Math.random().toString(36).substring(2, 9);
}

export function generateReferenceCode(prefix = "LC"): string {
  const year = new Date().getFullYear();
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${year}-${randomPart}`;
}

export function generateTrackingCode(prefix = "ANON"): string {
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${random}`;
}
