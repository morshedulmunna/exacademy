import React from "react";
import Link from "next/link";
import MaxWidthWrapper from "@/common/MaxWidthWrapper";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Navbar";
import Footer from "@/components/Footer";
import LightBackgroundEffect from "@/common/Effect/light-backgound-effect";
import { ThemeGradientText } from "@/components/ui/ThemeGradients";
import { CheckCircle2, Target, Users, Shield, Rocket, Compass, BookOpen } from "lucide-react";

/**
 * About page component displaying basic information about the platform/company
 */
export default function AboutMePage() {
  return (
    <>
      <Header />
      <div className="mt-24 relative">
        {/* Subtle ambient background */}
        <LightBackgroundEffect />
        <MaxWidthWrapper>
          <div className="py-16 px-4">
            {/* Header Section */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center rounded-full border border-slate-200/60 dark:border-slate-700 bg-white/60 dark:bg-slate-800/40 px-3 py-1 text-sm backdrop-blur mb-4">
                <Shield className="h-4 w-4 text-blue-500 mr-2" />
                <span className="text-slate-700 dark:text-slate-200">Learning for everyone</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
                Learn, Build, and <ThemeGradientText>Grow Faster</ThemeGradientText>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">Empowering learners worldwide with quality education and practical learning experiences.</p>
            </div>

            {/* Our Story + Mission */}
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start mb-16">
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 backdrop-blur p-8 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="h-5 w-5 text-blue-600" />
                  <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Our Mission</h2>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  We believe education should be accessible, engaging, and transformative. Our platform connects passionate instructors with eager learners, creating a community of knowledge sharing and growth.
                </p>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">Through comprehensive courses and interactive tools, we strive to make quality education available to everyone, everywhere.</p>
              </div>

              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 backdrop-blur p-8 shadow-sm">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">What We Offer</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="h-5 w-5 mt-0.5 text-blue-500" />
                    <span>Expert-led courses across various disciplines</span>
                  </li>
                  <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="h-5 w-5 mt-0.5 text-blue-500" />
                    <span>Interactive, outcome-focused learning experiences</span>
                  </li>
                  <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="h-5 w-5 mt-0.5 text-blue-500" />
                    <span>Flexible schedules that fit your lifestyle</span>
                  </li>
                  <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="h-5 w-5 mt-0.5 text-blue-500" />
                    <span>Community-driven support and collaboration</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Core Values */}
            <div className="mb-16">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-6 text-center">Our Core Values</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="rounded-xl p-6 bg-white/70 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" /> Learner-Centric
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300">We design experiences that drive real outcomes and long-term growth.</p>
                </div>
                <div className="rounded-xl p-6 bg-white/70 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-blue-600" /> Quality First
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300">Curated, reviewed, and continuously improved to meet high standards.</p>
                </div>
                <div className="rounded-xl p-6 bg-white/70 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" /> Community
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300">We foster collaboration between instructors and learners to support shared success.</p>
                </div>
              </div>
            </div>

            {/* How We Work */}
            <div className="mb-16">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-6 text-center">How We Work</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="rounded-xl p-6 bg-white/70 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">Step 1</div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                    <Compass className="h-5 w-5 text-blue-600" /> Discover
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300">Browse curated courses and find the path that matches your goals.</p>
                </div>
                <div className="rounded-xl p-6 bg-white/70 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">Step 2</div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-blue-600" /> Learn
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300">Engage with lessons, projects, and resources built for practical mastery.</p>
                </div>
                <div className="rounded-xl p-6 bg-white/70 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">Step 3</div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                    <Rocket className="h-5 w-5 text-blue-600" /> Grow
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300">Apply your skills, track progress, and keep advancing your career.</p>
                </div>
              </div>
            </div>

            {/* FAQs */}
            <div className="mb-16">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-6 text-center">Frequently Asked Questions</h2>
              <div className="mx-auto w-full bg-white/80 dark:bg-slate-900/40 rounded-xl p-4 border border-slate-200 dark:border-slate-800 backdrop-blur">
                <Accordion type="single" collapsible>
                  <AccordionItem value="item-1">
                    <AccordionTrigger>How do I start learning?</AccordionTrigger>
                    <AccordionContent>Create an account, choose a course that fits your goals, and begin at your own pace. You can track your progress as you go.</AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>Are there prerequisites?</AccordionTrigger>
                    <AccordionContent>Most beginner-friendly courses require no prior experience. Advanced courses may recommend relevant foundations, noted in the course details.</AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>Can I learn on mobile?</AccordionTrigger>
                    <AccordionContent>Yes. Our platform is responsive and works across devices so you can learn anywhere, anytime.</AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>

            {/* Contact Section */}
            <div className="text-center bg-white/80 dark:bg-slate-900/40 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 backdrop-blur shadow-sm">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">Get in Touch</h2>
              <p className="text-slate-600 dark:text-slate-300 mb-6">Have questions or want to learn more? We’d love to hear from you.</p>
              <Link href="/" className="inline-block">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700">
                  Browse Courses
                </Button>
              </Link>
            </div>
          </div>
        </MaxWidthWrapper>
      </div>
      <Footer />
    </>
  );
}
