import { useState, useEffect } from "react";
import { getLocalStorageItem } from "@/lib/utils";

/**
 * Custom hook for managing user information from localStorage
 * Provides user data, loading state, and error handling
 */
export type MinimalUser = {
  id: string;
  email: string;
  username?: string | null;
  name?: string | null;
  role?: string | null;
  avatar?: string | null;
};

export function useGetUserInfo() {
  const [user, setUser] = useState<MinimalUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      setIsLoading(false);
      return;
    }

    try {
      const userData = getLocalStorageItem("user");
      if (userData) {
        try {
          const parsed = JSON.parse(userData);
          if (parsed && typeof parsed === "object") {
            setUser(parsed as MinimalUser);
            setError(null);
          } else {
            setUser(null);
            setError("Invalid user data format");
          }
        } catch (parseError) {
          setUser(null);
          setError("Failed to parse user data");
        }
      } else {
        setUser(null);
        setError(null);
      }
    } catch (error) {
      setUser(null);
      setError("Failed to retrieve user data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearUser = () => {
    setUser(null);
    setError(null);
  };

  const refreshUser = () => {
    setIsLoading(true);
    setError(null);

    if (typeof window === "undefined") {
      setIsLoading(false);
      return;
    }

    try {
      const userData = getLocalStorageItem("user");
      if (userData) {
        try {
          const parsed = JSON.parse(userData);
          if (parsed && typeof parsed === "object") {
            setUser(parsed as MinimalUser);
            setError(null);
          } else {
            setUser(null);
            setError("Invalid user data format");
          }
        } catch (parseError) {
          setUser(null);
          setError("Failed to parse user data");
        }
      } else {
        setUser(null);
        setError(null);
      }
    } catch (error) {
      setUser(null);
      setError("Failed to retrieve user data");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isLoading,
    error,
    clearUser,
    refreshUser,
  };
}
