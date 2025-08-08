import React from "react";
import Link from "next/link";
import MaxWidthWrapper from "@/common/MaxWidthWrapper";
import { Header } from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ThemeGradientText } from "@/components/ui/ThemeGradients";
import LightBackgroundEffect from "@/common/Effect/light-backgound-effect";
import { Shield, FileText, ListChecks, Share2, Clock, UserCheck, Lock, Users, RefreshCw, Mail } from "lucide-react";
import ReadingProgressBar from "./_components/ReadingProgressBar";
import ScrollSpyToc from "./_components/ScrollSpyToc";
import CopyAnchor from "./_components/CopyAnchor";

/**
 * Privacy Policy page with structured sections. Content is general-purpose and
 * can be customized as needed. This page is static and SEO-friendly.
 */
export default function PrivacyPolicyPage() {
  const lastUpdated = "2025-01-01";

  return (
    <>
      <Header />
      <ReadingProgressBar />
      <div className="mt-24 relative">
        <LightBackgroundEffect />
        <MaxWidthWrapper>
          <div className="py-16 px-4">
            {/* Hero */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center rounded-full border border-slate-200/60 dark:border-slate-700 bg-white/60 dark:bg-slate-800/40 px-3 py-1 text-sm backdrop-blur mb-4">
                <Shield className="h-4 w-4 text-blue-500 mr-2" />
                <span className="text-slate-700 dark:text-slate-200">Your privacy matters</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
                <ThemeGradientText>Privacy</ThemeGradientText> Policy
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">Last updated: {lastUpdated}</p>
            </div>

            <div className="grid md:grid-cols-12 gap-8">
              {/* TOC - mobile */}
              <div className="md:hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 backdrop-blur p-4">
                <nav className="text-sm text-slate-700 dark:text-slate-300 grid grid-cols-2 gap-x-4 gap-y-2">
                  <Link href="#introduction" className="hover:text-blue-600">
                    Introduction
                  </Link>
                  <Link href="#information-we-collect" className="hover:text-blue-600">
                    Information
                  </Link>
                  <Link href="#how-we-use" className="hover:text-blue-600">
                    How We Use
                  </Link>
                  <Link href="#data-sharing" className="hover:text-blue-600">
                    Data Sharing
                  </Link>
                  <Link href="#data-retention" className="hover:text-blue-600">
                    Retention
                  </Link>
                  <Link href="#your-rights" className="hover:text-blue-600">
                    Your Rights
                  </Link>
                  <Link href="#security" className="hover:text-blue-600">
                    Security
                  </Link>
                  <Link href="#children" className="hover:text-blue-600">
                    Children
                  </Link>
                  <Link href="#changes" className="hover:text-blue-600">
                    Changes
                  </Link>
                  <Link href="#contact" className="hover:text-blue-600">
                    Contact
                  </Link>
                </nav>
              </div>

              {/* TOC - desktop */}
              <aside className="hidden md:block md:col-span-4 lg:col-span-3">
                <div className="sticky top-28 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 backdrop-blur p-4">
                  <h2 className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">On this page</h2>
                  <ScrollSpyToc
                    items={[
                      { id: "introduction", label: "Introduction" },
                      { id: "information-we-collect", label: "Information we collect" },
                      { id: "how-we-use", label: "How we use information" },
                      { id: "data-sharing", label: "Data sharing" },
                      { id: "data-retention", label: "Data retention" },
                      { id: "your-rights", label: "Your rights" },
                      { id: "security", label: "Security" },
                      { id: "children", label: "Children's privacy" },
                      { id: "changes", label: "Changes" },
                      { id: "contact", label: "Contact" },
                    ]}
                    className="space-y-1"
                  />
                </div>
              </aside>

              {/* Content */}
              <div className="md:col-span-8 lg:col-span-9 space-y-6">
                <section id="introduction" className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 backdrop-blur p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                      <FileText className="h-5 w-5 text-blue-600" /> Introduction
                    </h3>
                    <CopyAnchor id="introduction" />
                  </div>
                  <p className="text-slate-700 dark:text-slate-300">We value your privacy. This Privacy Policy explains how we collect, use, and protect your information when you use our website and services.</p>
                </section>

                <section id="information-we-collect" className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 backdrop-blur p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                      <FileText className="h-5 w-5 text-blue-600" /> Information We Collect
                    </h3>
                    <CopyAnchor id="information-we-collect" />
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-slate-700 dark:text-slate-300">
                    <li>Account information such as name and email address</li>
                    <li>Usage data including pages visited and actions taken</li>
                    <li>Payment-related information processed by our trusted partners</li>
                  </ul>
                </section>

                <section id="how-we-use" className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 backdrop-blur p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                      <ListChecks className="h-5 w-5 text-blue-600" /> How We Use Your Information
                    </h3>
                    <CopyAnchor id="how-we-use" />
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-slate-700 dark:text-slate-300">
                    <li>To provide and improve our services</li>
                    <li>To personalize your learning experience</li>
                    <li>To communicate important updates and support messages</li>
                  </ul>
                </section>

                <section id="data-sharing" className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 backdrop-blur p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                      <Share2 className="h-5 w-5 text-blue-600" /> Data Sharing and Third Parties
                    </h3>
                    <CopyAnchor id="data-sharing" />
                  </div>
                  <p className="text-slate-700 dark:text-slate-300">We do not sell your personal data. We may share information with trusted service providers solely to operate our services (e.g., payment processing, analytics), subject to confidentiality obligations.</p>
                </section>

                <section id="data-retention" className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 backdrop-blur p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                      <Clock className="h-5 w-5 text-blue-600" /> Data Retention
                    </h3>
                    <CopyAnchor id="data-retention" />
                  </div>
                  <p className="text-slate-700 dark:text-slate-300">We retain personal data only for as long as necessary to fulfill the purposes outlined in this policy or as required by law. You may request deletion of your data, subject to legal obligations.</p>
                </section>

                <section id="your-rights" className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 backdrop-blur p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                      <UserCheck className="h-5 w-5 text-blue-600" /> Your Rights
                    </h3>
                    <CopyAnchor id="your-rights" />
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-slate-700 dark:text-slate-300">
                    <li>Access, update, or delete your information</li>
                    <li>Object to or restrict certain processing</li>
                    <li>Request data portability</li>
                  </ul>
                </section>

                <section id="security" className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 backdrop-blur p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                      <Lock className="h-5 w-5 text-blue-600" /> Security
                    </h3>
                    <CopyAnchor id="security" />
                  </div>
                  <p className="text-slate-700 dark:text-slate-300">We implement reasonable safeguards to protect your information. No method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.</p>
                </section>

                <section id="children" className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 backdrop-blur p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                      <Users className="h-5 w-5 text-blue-600" /> Children's Privacy
                    </h3>
                    <CopyAnchor id="children" />
                  </div>
                  <p className="text-slate-700 dark:text-slate-300">Our services are not directed to children under the age of 13. We do not knowingly collect personal information from children.</p>
                </section>

                <section id="changes" className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 backdrop-blur p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                      <RefreshCw className="h-5 w-5 text-blue-600" /> Changes to This Policy
                    </h3>
                    <CopyAnchor id="changes" />
                  </div>
                  <p className="text-slate-700 dark:text-slate-300">We may update this policy from time to time. We will post the new policy on this page with an updated effective date.</p>
                </section>

                {/* CTA */}
                <section id="contact" className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/50 backdrop-blur p-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Questions about this policy?</h3>
                      <p className="text-slate-700 dark:text-slate-300">We’re here to help. Reach out and we’ll get back to you soon.</p>
                    </div>
                    <Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700">
                      <Link href="/contact">
                        <Mail className="h-4 w-4 mr-2" /> Contact us
                      </Link>
                    </Button>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </MaxWidthWrapper>
      </div>
      <Footer />
    </>
  );
}
