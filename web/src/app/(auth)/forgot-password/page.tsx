"use client";

import React, { useState } from "react";
import LightBackgroundEffect from "@/common/Effect/light-backgound-effect";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { forgotPasswordAction } from "@/actions/auth/password.action";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  return (
    <>
      <LightBackgroundEffect />
      <div className="w-full mt-24 max-w-sm sm:max-w-md md:max-w-lg mx-auto">
        <div className="bg-white/80 dark:bg-black/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-900 shadow-sm">
          <div className="text-center mb-4 sm:mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1">Forgot password</h1>
            <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">Enter your email to receive a verification code.</p>
          </div>

          {error && <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-2 text-red-600 dark:text-red-300 text-xs mb-3">{error}</div>}
          {success && <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-2 text-green-600 dark:text-green-300 text-xs mb-3">{success}</div>}

          <Formik
            initialValues={{ email: "" }}
            validationSchema={Yup.object({ email: Yup.string().email().required() })}
            onSubmit={async (values, { setSubmitting }) => {
              setError("");
              setSuccess("");
              try {
                await forgotPasswordAction({ email: values.email });
                setSuccess("We sent a code to your email.");
                router.push(`/reset-password?email=${encodeURIComponent(values.email)}`);
              } catch (e: any) {
                setError("Failed to send code.");
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-3">
                <div>
                  <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    className="w-full px-3 py-2 sm:py-2.5 bg-white/50 dark:bg-black/50 border border-gray-300 dark:border-gray-900 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-sm"
                  />
                  <ErrorMessage name="email" component="div" className="mt-1 text-xs text-red-600 dark:text-red-300" />
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full gradient-bg text-white py-2 sm:py-2.5 px-4 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50">
                  {isSubmitting ? "Sending..." : "Send code"}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
}
