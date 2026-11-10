/**
 * Frontend Validation Utilities
 */

export function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
}

export function validatePassword(password: string): { valid: boolean; message?: string } {
  if (!password || password.length < 6) {
    return {
      valid: false,
      message: "Password must be at least 6 characters long.",
    };
  }
  return { valid: true };
}

export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-()+]/g, "");
  return cleaned.length >= 7 && /^\d+$/.test(cleaned);
}

