"use client";

import React, { useEffect, useState } from "react";
// Auth removed; keep UI only
import { useRouter } from "next/navigation";
import Link from "next/link";
import SocialLoginButtons from "@/components/ui/social-login-buttons";
import LightBackgroundEffect from "@/common/Effect/light-backgound-effect";
import { Formik, Form, Field, ErrorMessage, FieldInputProps } from "formik";
import * as Yup from "yup";
import { loginAction } from "@/actions/auth/login";
import { cookiesStorages, localStorages, sessionStorages } from "@/lib/storages";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Note: Do not clear storage automatically on login page load to avoid wiping tokens

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Email is required"),
    password: Yup.string().min(8, "Password must be at least 8 characters").max(72).required("Password is required"),
  });

  const initialValues = {
    email: "",
    password: "",
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      {/* Background Elements */}
      <LightBackgroundEffect />
      <div className="w-full mt-24 max-w-sm sm:max-w-md md:max-w-lg mx-auto">
        <div className="bg-white/80 dark:bg-black/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-900 shadow-sm">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome Back</h1>
            <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">Sign in to your account</p>
          </div>

          {/* Form */}
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={async (values, { setSubmitting }) => {
              setError("");
              setSubmitting(true);
              setIsLoading(true);
              try {
                const response = await loginAction(values);

                if (!response.success) {
                  setError(response.message || "An error occurred");
                  return;
                }

                // Persist tokens and user on successful login
                const accessToken = response.data?.access_token;
                const refreshToken = response.data?.refresh_token;
                if (accessToken) {
                  document.cookie = `access_token=${encodeURIComponent(accessToken)}; Path=/; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
                }
                if (refreshToken) {
                  document.cookie = `refresh_token=${encodeURIComponent(refreshToken)}; Path=/; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
                }
                if (response.data?.user) {
                  localStorages.set("user", response.data.user);
                }

                router.push("/");
              } catch (error: any) {
                console.log(error);
                setError(error.error?.message || "An unexpected error occurred");
              } finally {
                setSubmitting(false);
                setIsLoading(false);
              }
            }}
          >
            {({ isSubmitting }) => (
              <>
                {error && (
                  <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm text-center">
                    <span>{error}</span>
                  </div>
                )}

                <Form className="space-y-4 sm:space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    <Field
                      id="email"
                      name="email"
                      type="email"
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/50 dark:bg-black/50 border border-gray-300 dark:border-gray-900 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                      placeholder="Enter your email"
                    />
                    <ErrorMessage name="email" component="div" className="mt-1 text-xs text-red-600 dark:text-red-300" />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Field name="password">
                        {({ field }: { field: FieldInputProps<string> }) => (
                          <input
                            {...field}
                            id="password"
                            type={showPassword ? "text" : "password"}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/50 dark:bg-black/50 border border-gray-300 dark:border-gray-900 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base pr-12"
                            placeholder="Enter your password"
                          />
                        )}
                      </Field>
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-300 focus:outline-none"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                            />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                      <ErrorMessage name="password" component="div" className="mt-1 text-xs text-red-600 dark:text-red-300" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || isLoading}
                    className="w-full gradient-bg text-white py-2.5 sm:py-3 px-4 rounded-lg font-semibold  transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base"
                  >
                    {isSubmitting || isLoading ? "Signing in..." : "Sign In"}
                  </button>
                </Form>

                {/* Social Login Buttons */}
                <SocialLoginButtons isLoading={isSubmitting || isLoading} />
              </>
            )}
          </Formik>

          {/* Footer */}
          <div className="mt-6 sm:mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
              Don't have an account?{" "}
              <Link href="/register" className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors duration-300">
                Sign up
              </Link>
            </p>
            <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm mt-2">
              <Link href="/forgot-password" className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors duration-300">
                Forgot your password?
              </Link>
            </p>
          </div>

          {/* Back to Home */}
          <div className="mt-4 sm:mt-6 text-center">
            <Link href="/" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-xs sm:text-sm transition-colors duration-300">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
