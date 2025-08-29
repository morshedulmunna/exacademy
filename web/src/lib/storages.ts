/**
 * Client-side storage utilities for browser environments
 * These functions only work in client-side code and check for window availability
 */

/**
 * LocalStorage utility functions for client-side storage
 */
export const localStorage = {
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
 * Client-side cookie utilities using document.cookie
 * Note: These are client-side only and don't have the same security features as server-side cookies
 */
export const cookieStorage = {
  /**
   * Set a cookie with options
   */
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
        let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

        if (options?.expires) {
          cookieString += `; expires=${options.expires.toUTCString()}`;
        }

        if (options?.maxAge) {
          cookieString += `; max-age=${options.maxAge}`;
        }

        if (options?.domain) {
          cookieString += `; domain=${options.domain}`;
        }

        if (options?.path) {
          cookieString += `; path=${options.path}`;
        } else {
          cookieString += "; path=/";
        }

        if (options?.secure) {
          cookieString += "; secure";
        }

        if (options?.sameSite) {
          cookieString += `; samesite=${options.sameSite}`;
        }

        document.cookie = cookieString;
      } catch (error) {
        console.error("Error setting cookie:", error);
      }
    }
  },

  /**
   * Get a cookie value
   */
  get: (name: string): string | undefined => {
    if (typeof window !== "undefined") {
      try {
        const nameEQ = `${name}=`;
        const cookies = document.cookie.split(";");

        for (let cookie of cookies) {
          cookie = cookie.trim();
          if (cookie.indexOf(nameEQ) === 0) {
            return decodeURIComponent(cookie.substring(nameEQ.length));
          }
        }
        return undefined;
      } catch (error) {
        console.error("Error getting cookie:", error);
        return undefined;
      }
    }
    return undefined;
  },

  /**
   * Get all cookies
   */
  getAll: (): Array<{ name: string; value: string }> => {
    if (typeof window !== "undefined") {
      try {
        const cookies = document.cookie.split(";");
        return cookies
          .map((cookie) => cookie.trim().split("="))
          .filter((parts) => parts.length === 2)
          .map(([name, value]) => ({
            name: decodeURIComponent(name),
            value: decodeURIComponent(value),
          }));
      } catch (error) {
        console.error("Error getting all cookies:", error);
        return [];
      }
    }
    return [];
  },

  /**
   * Check if a cookie exists
   */
  has: (name: string): boolean => {
    if (typeof window !== "undefined") {
      try {
        const nameEQ = `${name}=`;
        const cookies = document.cookie.split(";");

        return cookies.some((cookie) => cookie.trim().indexOf(nameEQ) === 0);
      } catch (error) {
        console.error("Error checking cookie:", error);
        return false;
      }
    }
    return false;
  },

  /**
   * Delete a cookie
   */
  delete: (name: string): void => {
    if (typeof window !== "undefined") {
      try {
        // Set cookie with past expiration date to delete it
        document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
      } catch (error) {
        console.error("Error deleting cookie:", error);
      }
    }
  },

  /**
   * Clear all cookies by deleting them individually
   */
  clearAll: (): void => {
    if (typeof window !== "undefined") {
      try {
        const allCookies = cookieStorage.getAll();

        // Delete each cookie individually
        for (const cookie of allCookies) {
          cookieStorage.delete(cookie.name);
        }
      } catch (error) {
        console.error("Error clearing cookies:", error);
      }
    }
  },

  /**
   * Get cookie as string representation
   */
  toString: (): string => {
    if (typeof window !== "undefined") {
      try {
        return document.cookie;
      } catch (error) {
        console.error("Error converting cookies to string:", error);
        return "";
      }
    }
    return "";
  },
};

/**
 * SessionStorage utility functions for client-side session storage
 */
export const sessionStorage = {
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
      size: localStorageAvailable ? localStorage.size() : 0,
      used: localStorageAvailable ? localStorage.size() : 0,
    },
    sessionStorage: {
      available: sessionStorageAvailable,
      size: sessionStorageAvailable ? sessionStorage.size() : 0,
      used: sessionStorageAvailable ? sessionStorage.size() : 0,
    },
  };
};

/**
 * Export default storage utilities
 */
export default {
  localStorage,
  sessionStorage,
  cookieStorage,
  isStorageAvailable,
  getStorageInfo,
};
