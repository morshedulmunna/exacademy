import React from "react";
import Link from "next/link";
import MaxWidthWrapper from "@/common/MaxWidthWrapper";
import { Header } from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ThemeGradientText } from "@/components/ui/ThemeGradients";
import LightBackgroundEffect from "@/common/Effect/light-backgound-effect";
import { Shield, FileText, User, Wallet, Ban, Power, AlertTriangle, Scale, RefreshCw, Mail } from "lucide-react";
import ReadingProgressBar from "../privacy-policy/_components/ReadingProgressBar";
import ScrollSpyToc from "../privacy-policy/_components/ScrollSpyToc";
import CopyAnchor from "../privacy-policy/_components/CopyAnchor";

/**
 * Terms of Service page using the same modern UI patterns as Privacy Policy.
 */
export default function TermsPage() {
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
                <span className="text-slate-700 dark:text-slate-200">Please read carefully</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
                <ThemeGradientText>Terms of</ThemeGradientText> Service
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">Last updated: {lastUpdated}</p>
            </div>

            <div className="grid md:grid-cols-12 gap-8">
              {/* TOC - mobile */}
              <div className="md:hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 backdrop-blur p-4">
                <nav className="text-sm text-slate-700 dark:text-slate-300 grid grid-cols-2 gap-x-4 gap-y-2">
                  <Link href="#introduction" className="hover:text-blue-600">
                    Intro
                  </Link>
                  <Link href="#accounts" className="hover:text-blue-600">
                    Accounts
                  </Link>
                  <Link href="#content" className="hover:text-blue-600">
                    Content
                  </Link>
                  <Link href="#payments" className="hover:text-blue-600">
                    Payments
                  </Link>
                  <Link href="#prohibited" className="hover:text-blue-600">
                    Prohibited
                  </Link>
                  <Link href="#termination" className="hover:text-blue-600">
                    Termination
                  </Link>
                  <Link href="#disclaimers" className="hover:text-blue-600">
                    Disclaimers
                  </Link>
                  <Link href="#liability" className="hover:text-blue-600">
                    Liability
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
                      { id: "accounts", label: "User accounts" },
                      { id: "content", label: "Content" },
                      { id: "payments", label: "Payments & refunds" },
                      { id: "prohibited", label: "Prohibited activities" },
                      { id: "termination", label: "Termination" },
                      { id: "disclaimers", label: "Disclaimers" },
                      { id: "liability", label: "Limitation of liability" },
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
                  <p className="text-slate-700 dark:text-slate-300">These Terms of Service ("Terms") govern your access to and use of our website and services. By using our services, you agree to these Terms.</p>
                </section>

                <section id="accounts" className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 backdrop-blur p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                      <User className="h-5 w-5 text-blue-600" /> User Accounts
                    </h3>
                    <CopyAnchor id="accounts" />
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-slate-700 dark:text-slate-300">
                    <li>You are responsible for maintaining the confidentiality of your account and password.</li>
                    <li>You must provide accurate, current information and promptly update any changes.</li>
                    <li>You are responsible for all activities that occur under your account.</li>
                  </ul>
                </section>

                <section id="content" className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 backdrop-blur p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                      <FileText className="h-5 w-5 text-blue-600" /> Content
                    </h3>
                    <CopyAnchor id="content" />
                  </div>
                  <p className="text-slate-700 dark:text-slate-300">You retain ownership of content you submit. By posting content, you grant us a non-exclusive, worldwide license to host, store, and display it as necessary to operate the service.</p>
                </section>

                <section id="payments" className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 backdrop-blur p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                      <Wallet className="h-5 w-5 text-blue-600" /> Payments & Refunds
                    </h3>
                    <CopyAnchor id="payments" />
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-slate-700 dark:text-slate-300">
                    <li>All fees are displayed at checkout and may be subject to taxes.</li>
                    <li>Refunds, where applicable, follow the policy stated on the course or product page.</li>
                    <li>Third-party processors handle payments; we do not store full card details.</li>
                  </ul>
                </section>

                <section id="prohibited" className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 backdrop-blur p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                      <Ban className="h-5 w-5 text-blue-600" /> Prohibited Activities
                    </h3>
                    <CopyAnchor id="prohibited" />
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-slate-700 dark:text-slate-300">
                    <li>Violating laws or infringing intellectual property rights</li>
                    <li>Attempting to disrupt or compromise service integrity</li>
                    <li>Harassing, abusive, or hateful conduct</li>
                  </ul>
                </section>

                <section id="termination" className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 backdrop-blur p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                      <Power className="h-5 w-5 text-blue-600" /> Termination
                    </h3>
                    <CopyAnchor id="termination" />
                  </div>
                  <p className="text-slate-700 dark:text-slate-300">We may suspend or terminate access for violations of these Terms. You may stop using the service at any time. Certain provisions survive termination.</p>
                </section>

                <section id="disclaimers" className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 backdrop-blur p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                      <AlertTriangle className="h-5 w-5 text-blue-600" /> Disclaimers
                    </h3>
                    <CopyAnchor id="disclaimers" />
                  </div>
                  <p className="text-slate-700 dark:text-slate-300">Services are provided "as is" and "as available" without warranties of any kind, either express or implied, to the fullest extent permitted by law.</p>
                </section>

                <section id="liability" className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 backdrop-blur p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                      <Scale className="h-5 w-5 text-blue-600" /> Limitation of Liability
                    </h3>
                    <CopyAnchor id="liability" />
                  </div>
                  <p className="text-slate-700 dark:text-slate-300">To the maximum extent permitted by law, we are not liable for any indirect, incidental, special, consequential or punitive damages, or any loss of profits or revenues.</p>
                </section>

                <section id="changes" className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 backdrop-blur p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                      <RefreshCw className="h-5 w-5 text-blue-600" /> Changes to These Terms
                    </h3>
                    <CopyAnchor id="changes" />
                  </div>
                  <p className="text-slate-700 dark:text-slate-300">We may modify these Terms. We will post updates on this page with a revised effective date. Continued use constitutes acceptance.</p>
                </section>

                {/* CTA */}
                <section id="contact" className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/50 backdrop-blur p-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Questions about these terms?</h3>
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

