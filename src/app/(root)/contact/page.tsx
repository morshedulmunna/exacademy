"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import MaxWidthWrapper from "@/common/MaxWidthWrapper";
import { Header } from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import LightBackgroundEffect from "@/common/Effect/light-backgound-effect";
import { Mail, MessageSquareText, User } from "lucide-react";

/**
 * Contact page with a client-side form that opens the user's email client via mailto.
 * Avoids server endpoints while enabling direct communication.
 */
export default function ContactPage() {
  const SUPPORT_EMAIL = useMemo(() => process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "support@example.com", []);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const isValid = useMemo(() => {
    if (!fullName.trim() || !email.trim() || !message.trim()) return false;
    // Simple email format check
    return /.+@.+\..+/.test(email);
  }, [fullName, email, message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!isValid) {
      setError("Please complete all fields with a valid email.");
      return;
    }
    const subject = `New contact from ${fullName}`;
    const body = `Name: ${fullName}\nEmail: ${email}\n\nMessage:\n${message}`;
    const href = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
  };

  return (
    <>
      <Header />
      <div className="mt-24 relative">
        <LightBackgroundEffect />
        <MaxWidthWrapper>
          <div className="py-16 px-4">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-3">Contact Us</h1>
              <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">We’d love to hear from you. Send us a message and we’ll get back to you shortly.</p>
            </div>

            <div className="grid md:grid-cols-5 gap-8 items-start">
              {/* Info card */}
              <div className="md:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 backdrop-blur p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Get in touch</h2>
                <div className="space-y-4 text-slate-700 dark:text-slate-300">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <div className="font-medium">Email</div>
                      <a className="text-blue-600 hover:underline" href={`mailto:${SUPPORT_EMAIL}`}>
                        {SUPPORT_EMAIL}
                      </a>
                    </div>
                  </div>
                  <p className="text-sm">Prefer not to use the form? Email us directly and we’ll respond as soon as possible.</p>
                </div>
              </div>

              {/* Form card */}
              <div className="md:col-span-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 backdrop-blur p-6 shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Full name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        id="fullName"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Jane Doe"
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/30 pl-10 pr-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        autoComplete="name"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="jane@example.com"
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/30 pl-10 pr-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Message
                    </label>
                    <div className="relative">
                      <MessageSquareText className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="How can we help?"
                        rows={6}
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/30 pl-10 pr-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  {error ? (
                    <p className="text-red-600 text-sm" role="alert" aria-live="polite">
                      {error}
                    </p>
                  ) : null}

                  <div className="flex items-center gap-3">
                    <Button type="submit" size="lg" disabled={!isValid} className="gradient-bg text-white hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60">
                      Send message
                    </Button>
                    <Link href="/" className="text-slate-600 dark:text-slate-300 hover:underline text-sm">
                      Back to home
                    </Link>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    By contacting us, you agree to our{" "}
                    <Link className="underline" href="/privacy-policy">
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </form>
              </div>
            </div>
          </div>
        </MaxWidthWrapper>
      </div>
      <Footer />
    </>
  );
}
