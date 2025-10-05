'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import {
  Lock,
  Info,
  Share2,
  ShieldCheck,
  RefreshCw,
  Mail,
  UserCheck,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';

/**
 * Enhanced Privacy Policy Page
 * - Light + Dark support
 * - Glassmorphism panels
 * - Scroll progress bar (spring)
 * - Animated entry for sections
 * - Desktop TOC with active highlighting
 * - Mobile TOC overlay and bottom quick bar
 * - Smooth scrolling + accessibility
 */

const sectionsData = [
  {
    id: 'info',
    title: '1. Information We Collect',
    icon: <Info className="w-5 h-5 text-indigo-500" />,
    content:
      'We may collect information you provide directly such as name, email, profile picture, posts, messages, and other content. We may also collect IP address, device info, browser type, and usage data automatically.',
  },
  {
    id: 'use',
    title: '2. How We Use Your Information',
    icon: <UserCheck className="w-5 h-5 text-green-500" />,
    content:
      'We use your information to operate and improve our platform, personalize your experience, respond to inquiries, and provide customer support. Notifications and updates may also be sent.',
  },
  {
    id: 'share',
    title: '3. Sharing of Information',
    icon: <Share2 className="w-5 h-5 text-purple-500" />,
    content:
      'We do not sell your personal information. We may share it with trusted service providers, legal authorities if required, or in case of a business transfer.',
  },
  {
    id: 'security',
    title: '4. Data Security',
    icon: <Lock className="w-5 h-5 text-red-500" />,
    content:
      'We implement reasonable security measures to protect your data. However, no method of transmission over the internet is completely secure.',
  },
  {
    id: 'choices',
    title: '5. Your Choices',
    icon: <ShieldCheck className="w-5 h-5 text-indigo-500" />,
    content:
      'You may update your profile, delete your account, or request data removal at any time. Contact us for assistance.',
  },
  {
    id: 'changes',
    title: '6. Changes to This Policy',
    icon: <RefreshCw className="w-5 h-5 text-orange-500" />,
    content:
      'We may update this policy occasionally. Continued use of the platform means you agree to the updated terms.',
  },
  {
    id: 'contact',
    title: '7. Contact',
    icon: <Mail className="w-5 h-5 text-teal-500" />,
    content: (
      <>
        If you have any questions regarding our Privacy Policy, please contact us at:{' '}
        <a href="mailto:privacy@socialmediaapp.com" className="text-indigo-600 dark:text-indigo-300 underline">
          privacy@socialmediaapp.com
        </a>
      </>
    ),
  },
];

export default function PrivacyPolicyPage() {
  // open all by default (like your original), you can change initial state
  const [openIds, setOpenIds] = useState(sectionsData.map((s) => s.id));
  const [mobileTocOpen, setMobileTocOpen] = useState(false);
  const sectionRefs = useRef({});
  const [activeId, setActiveId] = useState(sectionsData[0].id);

  // Scroll progress
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  // intersection observer to mark active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { root: null, rootMargin: '-35% 0px -45% 0px', threshold: 0 }
    );

    Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const toggleSection = (id) => {
    setOpenIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const goTo = (id) => {
    const el = sectionRefs.current[id];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setMobileTocOpen(false);
      // small focus for accessibility
      setTimeout(() => el?.querySelector('h2')?.focus?.(), 400);
    }
  };

  // helper to render a single section (with improved styling)
  const renderSection = (sec) => {
    const isOpen = openIds.includes(sec.id);

    return (
      <section
        key={sec.id}
        id={sec.id}
        ref={(el) => (sectionRefs.current[sec.id] = el)}
        className="bg-white/70 dark:bg-gray-900/60 backdrop-blur-sm border border-gray-100 dark:border-gray-800 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition"
        aria-labelledby={`${sec.id}-title`}
      >
        <div className="flex items-start gap-4">
          <div className="mt-1">{sec.icon}</div>
          <div className="flex-1">
            <div className="flex items-center justify-between gap-4">
              <h2
                id={`${sec.id}-title`}
                className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-100"
                tabIndex={-1}
              >
                {sec.title}
              </h2>

              <button
                aria-expanded={isOpen}
                onClick={() => toggleSection(sec.id)}
                className="ml-3 inline-flex items-center justify-center w-9 h-9 rounded-md bg-white/60 dark:bg-black/40 border hover:scale-105 transition"
                title={isOpen ? 'Collapse' : 'Expand'}
              >
                <span className="sr-only">{isOpen ? 'Collapse section' : 'Expand section'}</span>
                <motion.span
                  initial={{ rotate: isOpen ? 180 : 0 }}
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <ChevronRight className={`w-4 h-4 text-gray-600 dark:text-gray-300 ${isOpen ? 'rotate-90' : ''}`} />
                </motion.span>
              </button>
            </div>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.28 }}
                  className="mt-4 text-sm md:text-base leading-7 text-gray-600 dark:text-gray-300"
                >
                  {sec.content}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 text-gray-900 dark:text-gray-100">
      {/* progress bar */}
      <motion.div style={{ scaleX }} className="origin-left fixed top-0 left-0 right-0 h-1 z-50 bg-gradient-to-r from-indigo-600 to-purple-600" />

      {/* header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/60 dark:bg-black/40 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/20">
              <Lock className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Privacy Policy</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hidden md:inline-flex items-center gap-2 text-sm text-indigo-600 hover:underline"
            >
              Back to top
            </button>

            <button
              onClick={() => setMobileTocOpen((s) => !s)}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border bg-white/60 dark:bg-black/40 md:hidden"
              aria-expanded={mobileTocOpen}
              aria-controls="mobile-toc"
            >
              <Menu className="w-4 h-4" />
              Contents
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 md:px-8 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* desktop TOC */}
        <aside className="hidden md:block md:col-span-1 sticky top-28 self-start">
          <div className="bg-white/60 dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 shadow-sm">
            <h3 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-200">Table of contents</h3>
            <nav className="space-y-2 text-sm" aria-label="Table of contents">
              {sectionsData.map((s) => (
                <button
                  key={s.id}
                  onClick={() => goTo(s.id)}
                  className={`w-full flex items-center gap-3 p-2 rounded-lg text-left transition ${
                    activeId === s.id
                      ? 'bg-indigo-50 dark:bg-indigo-900/40 ring-1 ring-indigo-200 dark:ring-indigo-900'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800/40'
                  }`}
                  aria-current={activeId === s.id ? 'true' : undefined}
                >
                  <span className="w-6 h-6 flex items-center justify-center">{s.icon}</span>
                  <span className="truncate">{s.title}</span>
                </button>
              ))}
            </nav>

            <div className="mt-4 text-xs text-gray-500">Tip: click any section to jump to it</div>
          </div>
        </aside>

        {/* mobile TOC overlay */}
        <AnimatePresence>
          {mobileTocOpen && (
            <motion.aside
              id="mobile-toc"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 z-50 p-6"
              aria-modal="true"
            >
              <div className="absolute inset-0 bg-black/30" onClick={() => setMobileTocOpen(false)} aria-hidden="true" />
              <motion.div
                initial={{ y: 30 }}
                animate={{ y: 0 }}
                exit={{ y: 30 }}
                className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-5 max-w-md mx-auto"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">Contents</h4>
                  <button onClick={() => setMobileTocOpen(false)} className="p-2 rounded-md border">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-2">
                  {sectionsData.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => goTo(s.id)}
                      className="w-full flex items-center gap-3 p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800/40 text-left"
                    >
                      <span>{s.icon}</span>
                      <span>{s.title}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* main content */}
        <div className="md:col-span-3 space-y-8">
          <div className="prose max-w-none prose-lg dark:prose-invert">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Your privacy matters. This privacy policy explains what data we collect and how we use it. We aim to keep things transparent and straightforward.
            </p>
          </div>

          <div className="space-y-6">
            {sectionsData.map(renderSection)}
          </div>

          {/* CTA banner */}
          <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white shadow-xl">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold">Stay Secure & Informed</h3>
              <p className="mt-2 opacity-90">
                Review your settings and keep your account safe. Manage your privacy preferences in Settings.
              </p>
              <div className="mt-4">
                <a
                  href="/Pages/Settings"
                  className="inline-block bg-white text-indigo-600 px-5 py-2 rounded-lg font-semibold shadow hover:scale-101 transform transition"
                  aria-label="Go to settings"
                >
                  Go to Settings
                </a>
              </div>
            </div>

            <div className="absolute -right-24 -bottom-24 opacity-10 transform rotate-12">
              <svg width="260" height="260" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="120" cy="120" r="120" fill="white" />
              </svg>
            </div>
          </section>

          <footer className="mt-6 text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Zocial. All rights reserved.
          </footer>
        </div>
      </main>

      {/* mobile quick toc (bottom) */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 z-50">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur rounded-full p-2 shadow-lg flex items-center justify-between gap-2">
          <button
            onClick={() => setMobileTocOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-600 text-white font-medium shadow"
            aria-label="Open contents"
          >
            <Menu className="w-4 h-4" /> Contents
          </button>
          <div className="flex items-center gap-3 px-2">
            <span className="text-xs text-gray-600 dark:text-gray-300">{activeId.toUpperCase()}</span>
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="p-2 rounded-full border">
              <ChevronRight className="w-4 h-4 transform rotate-90" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
