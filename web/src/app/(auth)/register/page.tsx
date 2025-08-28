"use client";

import React, { useState } from "react";
// Auth removed; keep UI only
import { useRouter } from "next/navigation";
import Link from "next/link";
import SocialLoginButtons from "@/components/ui/social-login-buttons";
import LightBackgroundEffect from "@/common/Effect/light-backgound-effect";
import { Formik, Form, Field, ErrorMessage, FieldInputProps } from "formik";
import * as Yup from "yup";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { login, register } from "@/actions/auth";

export default function RegisterPage() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: EASE, when: "beforeChildren", staggerChildren: 0.06 },
    },
  };
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } },
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required("First name is required").max(50),
    lastName: Yup.string().required("Last name is required").max(50),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    username: Yup.string()
      .matches(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores are allowed")
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username must be at most 30 characters")
      .required("Username is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").max(72).required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), ""], "Passwords do not match")
      .required("Confirm your password"),
  });

  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  return (
    <>
      {/* Background Elements */}
      <LightBackgroundEffect />

      <motion.div className="w-full mt-24 max-w-sm sm:max-w-md md:max-w-lg mx-auto" initial="hidden" animate="visible" variants={containerVariants}>
        <motion.div className="bg-white/80 dark:bg-black/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-900 shadow-sm" variants={itemVariants}>
          {/* Header */}
          <motion.div className="text-center mb-4 sm:mb-6" variants={itemVariants}>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1">Create Account</h1>
            <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">Join our community today</p>
          </motion.div>

          {/* Form */}
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                setSubmitting(true);
                setError("");

                const res = await register(values);
                console.log("Registration successful:", res);

                // Add a small delay to show success message before redirect
                setTimeout(() => {
                  console.log("Redirecting to:", `/verify?email=${encodeURIComponent(values.email)}`);
                  router.push(`/verify?email=${encodeURIComponent(values.email)}`);
                }, 500);
              } catch (error: any) {
                setError(error.message);
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting }) => (
              <>
                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2, ease: EASE }}
                      className=" text-center mb-4 rounded-lg p-2 sm:p-3 text-red-600 dark:text-red-300 text-xs sm:text-sm"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>
                <AnimatePresence mode="wait">
                  {success && (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2, ease: EASE }}
                      className="bg-green-500/20 border border-green-500/30 rounded-lg p-2 sm:p-3 text-green-600 dark:text-green-300 text-xs sm:text-sm"
                    >
                      {success}
                    </motion.div>
                  )}
                </AnimatePresence>

                <Form className="space-y-3 sm:space-y-4">
                  <motion.div className="flex justify-between items-center w-full gap-4" variants={itemVariants}>
                    <motion.div className="w-full" variants={itemVariants}>
                      <label htmlFor="firstName" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        First Name
                      </label>
                      <Field
                        id="firstName"
                        name="firstName"
                        type="text"
                        className="w-full px-3 py-2 sm:py-2.5 bg-white/50 dark:bg-black/50 border border-gray-300 dark:border-gray-900 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-sm"
                        placeholder="Enter your first name"
                      />
                      <ErrorMessage name="firstName" component="div" className="mt-1 text-xs text-red-600 dark:text-red-300" />
                    </motion.div>
                    <motion.div className="w-full" variants={itemVariants}>
                      <label htmlFor="lastName" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Last Name
                      </label>
                      <Field
                        id="lastName"
                        name="lastName"
                        type="text"
                        className="w-full px-3 py-2 sm:py-2.5 bg-white/50 dark:bg-black/50 border border-gray-300 dark:border-gray-900 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-sm"
                        placeholder="Enter your last name"
                      />
                      <ErrorMessage name="lastName" component="div" className="mt-1 text-xs text-red-600 dark:text-red-300" />
                    </motion.div>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label htmlFor="username" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Username
                    </label>
                    <Field
                      id="username"
                      name="username"
                      type="text"
                      className="w-full px-3 py-2 sm:py-2.5 bg-white/50 dark:bg-black/50 border border-gray-300 dark:border-gray-900 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-sm"
                      placeholder="Choose a username"
                    />
                    <ErrorMessage name="username" component="div" className="mt-1 text-xs text-red-600 dark:text-red-300" />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <Field
                      id="email"
                      name="email"
                      type="email"
                      className="w-full px-3 py-2 sm:py-2.5 bg-white/50 dark:bg-black/50 border border-gray-300 dark:border-gray-900 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-sm"
                      placeholder="Enter your email"
                    />
                    <ErrorMessage name="email" component="div" className="mt-1 text-xs text-red-600 dark:text-red-300" />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Field name="password">
                        {({ field }: { field: FieldInputProps<string> }) => (
                          <input
                            {...field}
                            id="password"
                            type={showPassword ? "text" : "password"}
                            className="w-full px-3 py-2 sm:py-2.5 bg-white/50 dark:bg-black/50 border border-gray-300 dark:border-gray-900 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-sm pr-10"
                            placeholder="Create a password"
                          />
                        )}
                      </Field>
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-300 focus:outline-none"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                            />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    <ErrorMessage name="password" component="div" className="mt-1 text-xs text-red-600 dark:text-red-300" />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label htmlFor="confirmPassword" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Field name="confirmPassword">
                        {({ field }: { field: FieldInputProps<string> }) => (
                          <input
                            {...field}
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            className="w-full px-3 py-2 sm:py-2.5 bg-white/50 dark:bg-black/50 border border-gray-300 dark:border-gray-900 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-sm pr-10"
                            placeholder="Confirm your password"
                          />
                        )}
                      </Field>
                      <button
                        type="button"
                        onClick={toggleConfirmPasswordVisibility}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-300 focus:outline-none"
                        aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                      >
                        {showConfirmPassword ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                            />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    <ErrorMessage name="confirmPassword" component="div" className="mt-1 text-xs text-red-600 dark:text-red-300" />
                  </motion.div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                    className="w-full gradient-bg text-white py-2 sm:py-2.5 px-4 rounded-lg font-semibold  transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm"
                  >
                    {isSubmitting ? "Creating account..." : "Create Account"}
                  </motion.button>
                </Form>

                {/* Social Login Buttons */}
                <motion.div variants={itemVariants}>
                  <SocialLoginButtons isLoading={isSubmitting} />
                </motion.div>
              </>
            )}
          </Formik>

          {/* Footer */}
          <motion.div className="mt-4 sm:mt-6 text-center" variants={itemVariants}>
            <p className="text-gray-600 dark:text-gray-300 text-xs">
              Already have an account?{" "}
              <Link href="/login" className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors duration-300">
                Sign in
              </Link>
            </p>
          </motion.div>

          {/* Back to Home */}
          <motion.div className="mt-3 sm:mt-4 text-center" variants={itemVariants}>
            <Link href="/" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-xs transition-colors duration-300">
              ← Back to Home
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  );
}
