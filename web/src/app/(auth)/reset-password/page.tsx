"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LightBackgroundEffect from "@/common/Effect/light-backgound-effect";

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const email = useMemo(() => params.get("email") || "", [params]);
  const router = useRouter();

  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([null, null, null, null, null, null]);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onChangeDigit = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...code];
    next[index] = value;
    setCode(next);
    if (value && index < inputsRef.current.length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const onKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const onSubmit = async () => {
    setError("");
    setSuccess("");
    if (!email) {
      setError("Missing email.");
      return;
    }
    const joined = code.join("");
    if (joined.length !== 6) {
      setError("Enter the 6-digit code.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setSubmitting(true);
    try {
    } catch (e: any) {
    } finally {
    }
  };

  return (
    <>
      <LightBackgroundEffect />
      <div className="w-full mt-24 max-w-sm sm:max-w-md md:max-w-lg mx-auto">
        <div className="bg-white/80 dark:bg-black/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-900 shadow-sm">
          <div className="text-center mb-4 sm:mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1">Reset password</h1>
            <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">Enter the 6-digit code sent to {email ? <span className="font-medium">{email}</span> : "your email"} and your new password.</p>
          </div>

          {error && <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-2 text-red-600 dark:text-red-300 text-xs mb-3">{error}</div>}
          {success && <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-2 text-green-600 dark:text-green-300 text-xs mb-3">{success}</div>}

          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4">
            {code.map((digit, i) => (
              <input
                key={i}
                ref={(el) => {
                  inputsRef.current[i] = el;
                }}
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => onChangeDigit(i, e.target.value.replace(/\D/g, ""))}
                onKeyDown={(e) => onKeyDown(i, e)}
                className="w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl rounded-lg border border-gray-300 dark:border-gray-900 bg-white/60 dark:bg-black/60 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            ))}
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              New Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 sm:py-2.5 bg-white/50 dark:bg-black/50 border border-gray-300 dark:border-gray-900 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-sm"
              placeholder="Enter new password"
            />
          </div>

          <button type="button" onClick={onSubmit} disabled={submitting} className="w-full gradient-bg text-white py-2 sm:py-2.5 px-4 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50">
            {submitting ? "Resetting..." : "Reset password"}
          </button>
        </div>
      </div>
    </>
  );
}
