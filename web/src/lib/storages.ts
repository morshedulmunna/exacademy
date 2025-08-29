/**
 * Client-side storage utilities for browser environments
 * These functions only work in client-side code and check for window availability
 */

// Import js-cookie library
import Cookies from "js-cookie";

export const cookiesStorages = {
  set: (
    name: string,
    value: string,
    options?: {
      expires?: Date;
      maxAge?: number;
      domain?: string;
      path?: string;
      secure?: boolean;
      sameSite?: "lax" | "strict" | "none";
    }
  ): void => {
    if (typeof window !== "undefined") {
      try {
        Cookies.set(name, value, options);
      } catch (error) {
        console.error("Error setting cookie:", error);
      }
    }
  },
  get: (name: string): string | undefined => {
    try {
      const result = Cookies.get(name);
      console.log(result, "result");
      return result;
    } catch (error) {
      console.error("Error getting cookie:", error);
      return undefined;
    }
  },

  getAll: (): Array<{ name: string; value: string }> => {
    if (typeof window !== "undefined") {
      try {
        return Object.entries(Cookies.get()).map(([name, value]) => ({
          name: name,
          value: String(value),
        }));
      } catch (error) {
        console.error("Error getting all cookies:", error);
        return [];
      }
    }
    return [];
  },
  has: (name: string): boolean => {
    if (typeof window !== "undefined") {
      try {
        return Cookies.get(name) !== undefined;
      } catch (error) {
        console.error("Error checking cookie:", error);
        return false;
      }
    }
    return false;
  },
  delete: (name: string): void => {
    if (typeof window !== "undefined") {
      try {
        Cookies.remove(name);
      } catch (error) {
        console.error("Error deleting cookie:", error);
      }
    }
  },
  clearAll: (): void => {
    if (typeof window !== "undefined") {
      try {
        // Get all cookies and remove them individually
        const allCookies = Cookies.get();
        Object.keys(allCookies).forEach((name) => {
          Cookies.remove(name);
        });
      } catch (error) {
        console.error("Error clearing cookies:", error);
      }
    }
  },
  toString: (): string => {
    if (typeof window !== "undefined") {
      try {
        return JSON.stringify(Cookies.get());
      } catch (error) {
        console.error("Error converting cookies to string:", error);
        return "";
      }
    }
    return "";
  },
};

/**
 * LocalStorage utility functions for client-side storage
 */
export const localStorages = {
  /**
   * Set a value in localStorage
   */
  set: (key: string, value: any): void => {
    if (typeof window !== "undefined") {
      try {
        const serializedValue = JSON.stringify(value);
        window.localStorage.setItem(key, serializedValue);
      } catch (error) {
        console.error("Error setting localStorage item:", error);
      }
    }
  },

  /**
   * Get a value from localStorage
   */
  get: <T = any>(key: string, defaultValue?: T): T | null => {
    if (typeof window !== "undefined") {
      try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue || null;
      } catch (error) {
        console.error("Error getting localStorage item:", error);
        return defaultValue || null;
      }
    }
    return defaultValue || null;
  },

  /**
   * Remove a value from localStorage
   */
  remove: (key: string): void => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem(key);
      } catch (error) {
        console.error("Error removing localStorage item:", error);
      }
    }
  },

  /**
   * Check if a key exists in localStorage
   */
  has: (key: string): boolean => {
    if (typeof window !== "undefined") {
      try {
        return window.localStorage.getItem(key) !== null;
      } catch (error) {
        console.error("Error checking localStorage item:", error);
        return false;
      }
    }
    return false;
  },

  /**
   * Clear all localStorage items
   */
  clearAll: (): void => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.clear();
      } catch (error) {
        console.error("Error clearing localStorage:", error);
      }
    }
  },

  /**
   * Get all keys from localStorage
   */
  keys: (): string[] => {
    if (typeof window !== "undefined") {
      try {
        return Object.keys(window.localStorage);
      } catch (error) {
        console.error("Error getting localStorage keys:", error);
        return [];
      }
    }
    return [];
  },

  /**
   * Get the size of localStorage
   */
  size: (): number => {
    if (typeof window !== "undefined") {
      try {
        return window.localStorage.length;
      } catch (error) {
        console.error("Error getting localStorage size:", error);
        return 0;
      }
    }
    return 0;
  },
};

/**
 * SessionStorage utility functions for client-side session storage
 */
export const sessionStorages = {
  /**
   * Set a value in sessionStorage
   */
  set: (key: string, value: any): void => {
    if (typeof window !== "undefined") {
      try {
        const serializedValue = JSON.stringify(value);
        window.sessionStorage.setItem(key, serializedValue);
      } catch (error) {
        console.error("Error setting sessionStorage item:", error);
      }
    }
  },

  /**
   * Get a value from sessionStorage
   */
  get: <T = any>(key: string, defaultValue?: T): T | null => {
    if (typeof window !== "undefined") {
      try {
        const item = window.sessionStorage.getItem(key);
        console.log(item, "item");
        return item ? JSON.parse(item) : defaultValue || null;
      } catch (error) {
        console.error("Error getting sessionStorage item:", error);
        return defaultValue || null;
      }
    }
    return defaultValue || null;
  },

  /**
   * Remove a value from sessionStorage
   */
  remove: (key: string): void => {
    if (typeof window !== "undefined") {
      try {
        window.sessionStorage.removeItem(key);
      } catch (error) {
        console.error("Error removing sessionStorage item:", error);
      }
    }
  },

  /**
   * Check if a key exists in sessionStorage
   */
  has: (key: string): boolean => {
    if (typeof window !== "undefined") {
      try {
        return window.sessionStorage.getItem(key) !== null;
      } catch (error) {
        console.error("Error checking sessionStorage item:", error);
        return false;
      }
    }
    return false;
  },

  /**
   * Clear all sessionStorage items
   */
  clearAll: (): void => {
    if (typeof window !== "undefined") {
      try {
        window.sessionStorage.clear();
      } catch (error) {
        console.error("Error clearing sessionStorage:", error);
      }
    }
  },

  /**
   * Get all keys from sessionStorage
   */
  keys: (): string[] => {
    if (typeof window !== "undefined") {
      try {
        return Object.keys(window.sessionStorage);
      } catch (error) {
        console.error("Error getting sessionStorage keys:", error);
        return [];
      }
    }
    return [];
  },

  /**
   * Get the size of sessionStorage
   */
  size: (): number => {
    if (typeof window !== "undefined") {
      try {
        return window.sessionStorage.length;
      } catch (error) {
        console.error("Error getting sessionStorage size:", error);
        return 0;
      }
    }
    return 0;
  },
};

/**
 * Utility function to check if storage is available
 */
export const isStorageAvailable = (type: "localStorage" | "sessionStorage"): boolean => {
  if (typeof window === "undefined") return false;

  try {
    const storage = window[type];
    const testKey = "__storage_test__";
    storage.setItem(testKey, "test");
    storage.removeItem(testKey);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Utility function to get storage usage information
 */
export const getStorageInfo = () => {
  if (typeof window === "undefined") {
    return {
      localStorage: { available: false, size: 0, used: 0 },
      sessionStorage: { available: false, size: 0, used: 0 },
    };
  }

  const localStorageAvailable = isStorageAvailable("localStorage");
  const sessionStorageAvailable = isStorageAvailable("sessionStorage");

  return {
    localStorage: {
      available: localStorageAvailable,
      size: localStorageAvailable ? localStorages.size() : 0,
      used: localStorageAvailable ? localStorages.size() : 0,
    },
    sessionStorage: {
      available: sessionStorageAvailable,
      size: sessionStorageAvailable ? sessionStorages.size() : 0,
      used: sessionStorageAvailable ? sessionStorages.size() : 0,
    },
  };
};

/**
 * Export default storage utilities
 */
export default {
  localStorages,
  sessionStorages,
  isStorageAvailable,
  getStorageInfo,
  cookiesStorages,
};
