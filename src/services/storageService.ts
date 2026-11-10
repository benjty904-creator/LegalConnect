/**
 * Centralized, type-safe localStorage manager.
 * Dispatches custom events to ensure reactive updates across components.
 */

export const STORAGE_KEYS = {
  USERS: "lc_users",
  ACTIVE_USER: "lc_active_user",
  REQUESTS: "lc_service_requests",
  REPORTS: "lc_whistleblower_reports",
  ADMIN_SETUP: "lc_admin_initialized",
} as const;

export function getItem<T>(key: string, defaultValue: T): T {
  try {
    if (typeof localStorage === "undefined") return defaultValue;
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch (error) {
    console.error(`Error reading key "${key}" from localStorage:`, error);
    return defaultValue;
  }
}

export function setItem<T>(key: string, value: T): void {
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(key, JSON.stringify(value));
    }
    // Dispatch custom event to notify listeners in the same window/tab
    if (typeof window !== "undefined" && typeof window.dispatchEvent === "function") {
      window.dispatchEvent(
        new CustomEvent("lc_storage_change", {
          detail: { key, value },
        })
      );
    }
  } catch (error) {
    console.error(`Error writing key "${key}" to localStorage:`, error);
  }
}

export function removeItem(key: string): void {
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem(key);
    }
    if (typeof window !== "undefined" && typeof window.dispatchEvent === "function") {
      window.dispatchEvent(
        new CustomEvent("lc_storage_change", {
          detail: { key, value: null },
        })
      );
    }
  } catch (error) {
    console.error(`Error removing key "${key}" from localStorage:`, error);
  }
}
