"use client";
export const dynamic = "force-dynamic";

import React, { useMemo, useRef, useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import LightBackgroundEffect from "@/common/Effect/light-backgound-effect";

function VerifyPageInner() {
  const params = useSearchParams();
  const router = useRouter();
  const email = useMemo(() => params.get("email") || "", [params]);

  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([null, null, null, null, null, null]);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // Resend control
  const [attemptCount, setAttemptCount] = useState(0);
  const [resendDisabledUntil, setResendDisabledUntil] = useState<number>(0);
  const [timerNow, setTimerNow] = useState<number>(Date.now());
  const remainingMs = Math.max(0, resendDisabledUntil - timerNow);
  const remainingSec = Math.ceil(remainingMs / 1000);

  useEffect(() => {
    if (resendDisabledUntil === 0) return;
    const id = setInterval(() => {
      setTimerNow(Date.now());
      if (Date.now() >= resendDisabledUntil) {
        clearInterval(id);
      }
    }, 1000);
    return () => clearInterval(id);
  }, [resendDisabledUntil]);

  const onChangeDigit = useCallback(
    (index: number, value: string) => {
      if (!/^\d?$/.test(value)) return; // only digits, single char
      const next = [...code];
      next[index] = value;
      setCode(next);
      if (value && index < inputsRef.current.length - 1) {
        inputsRef.current[index + 1]?.focus();
      }
    },
    [code]
  );

  const onKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && !code[index] && index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    },
    [code]
  );

  const handleVerify = async () => {
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
    setIsVerifying(true);
    try {
      // await verifyEmailAction({ email, code: joined });
      // setSuccess("Email verified successfully.");
      // router.push("/login");
    } catch (e: any) {
      setError("Invalid or expired code.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (isResending) return;
    setError("");
    setSuccess("");
    if (!email) {
      setError("Missing email.");
      return;
    }
    const nowTs = Date.now();
    if (nowTs < resendDisabledUntil) return;

    try {
      // setIsResending(true);
    } catch (e: any) {
      setError("Failed to resend code.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <>
      <LightBackgroundEffect />
      <div className="w-full mt-24 max-w-sm sm:max-w-md md:max-w-lg mx-auto">
        <div className="bg-white/80 dark:bg-black/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-900 shadow-sm">
          <div className="text-center mb-4 sm:mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1">Verify your email</h1>
            <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">Enter the 6-digit code sent to {email ? <span className="font-medium">{email}</span> : "your email"}.</p>
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

          <button type="button" onClick={handleVerify} disabled={isVerifying} className="w-full gradient-bg text-white py-2 sm:py-2.5 px-4 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50">
            {isVerifying ? "Verifying..." : "Verify"}
          </button>

          <div className="mt-4 flex items-center justify-between text-xs sm:text-sm">
            <button type="button" onClick={handleResend} disabled={isResending || timerNow < resendDisabledUntil} className="text-purple-600 dark:text-purple-400 disabled:opacity-50">
              {isResending ? "Sending..." : timerNow < resendDisabledUntil ? `Resend in ${remainingSec}s` : "Resend code"}
            </button>
            <Link href="/login" className="text-gray-600 dark:text-gray-300">
              Back to Sign in
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="mt-24 text-center text-sm text-gray-500">Loading…</div>}>
      <VerifyPageInner />
    </Suspense>
  );
}
