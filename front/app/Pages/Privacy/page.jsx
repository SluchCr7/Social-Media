'use client';

import React, { useEffect, useRef, useState } from 'react';
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
import { useTranslation } from "react-i18next";

export default function PrivacyPolicyPage() {
  const { t } = useTranslation();

  const sectionsData = [
    {
      id: 'info',
      title: t('1. Information We Collect'),
      icon: <Info className="w-5 h-5 text-indigo-500" />,
      content: t('We may collect information you provide directly such as name, email, profile picture, posts, messages, and other content. We may also collect IP address, device info, browser type, and usage data automatically.'),
    },
    {
      id: 'use',
      title: t('2. How We Use Your Information'),
      icon: <UserCheck className="w-5 h-5 text-green-500" />,
      content: t('We use your information to operate and improve our platform, personalize your experience, respond to inquiries, and provide customer support. Notifications and updates may also be sent.'),
    },
    {
      id: 'share',
      title: t('3. Sharing of Information'),
      icon: <Share2 className="w-5 h-5 text-purple-500" />,
      content: t('We do not sell your personal information. We may share it with trusted service providers, legal authorities if required, or in case of a business transfer.'),
    },
    {
      id: 'security',
      title: t('4. Data Security'),
      icon: <Lock className="w-5 h-5 text-red-500" />,
      content: t('We implement reasonable security measures to protect your data. However, no method of transmission over the internet is completely secure.'),
    },
    {
      id: 'choices',
      title: t('5. Your Choices'),
      icon: <ShieldCheck className="w-5 h-5 text-indigo-500" />,
      content: t('You may update your profile, delete your account, or request data removal at any time. Contact us for assistance.'),
    },
    {
      id: 'changes',
      title: t('6. Changes to This Policy'),
      icon: <RefreshCw className="w-5 h-5 text-orange-500" />,
      content: t('We may update this policy occasionally. Continued use of the platform means you agree to the updated terms.'),
    },
    {
      id: 'contact',
      title: t('7. Contact'),
      icon: <Mail className="w-5 h-5 text-teal-500" />,
      content: (
        <>
          {t('If you have any questions regarding our Privacy Policy, please contact us at:')}{' '}
          <a href="mailto:privacy@socialmediaapp.com" className="text-indigo-600 dark:text-indigo-300 underline">
            privacy@socialmediaapp.com
          </a>
        </>
      ),
    },
  ];

  const [openIds, setOpenIds] = useState(sectionsData.map((s) => s.id));
  const [mobileTocOpen, setMobileTocOpen] = useState(false);
  const sectionRefs = useRef({});
  const [activeId, setActiveId] = useState(sectionsData[0].id);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-35% 0px -45% 0px' }
    );

    Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const toggleSection = (id) =>
    setOpenIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const goTo = (id) => {
    const el = sectionRefs.current[id];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setMobileTocOpen(false);
    }
  };

  const renderSection = (sec) => {
    const isOpen = openIds.includes(sec.id);

    return (
      <section
        key={sec.id}
        id={sec.id}
        ref={(el) => (sectionRefs.current[sec.id] = el)}
        className="bg-white/70 dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 md:p-8 shadow-sm transition"
      >
        <div className="flex items-start gap-4">
          <div className="mt-1">{sec.icon}</div>
          <div className="flex-1">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-100">{sec.title}</h2>
              <button
                aria-expanded={isOpen}
                onClick={() => toggleSection(sec.id)}
                className="ml-3 inline-flex items-center justify-center w-9 h-9 rounded-md border hover:scale-105 transition"
                title={isOpen ? t('Collapse') : t('Expand')}
              >
                <motion.span animate={{ rotate: isOpen ? 90 : 0 }}>
                  <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </motion.span>
              </button>
            </div>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="mt-4 text-sm md:text-base text-gray-600 dark:text-gray-300"
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <motion.div style={{ scaleX }} className="origin-left fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 to-purple-600" />

      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/60 dark:bg-black/40 border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/20">
              <Lock className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">{t('Privacy Policy')}</h1>
              <p className="text-xs text-gray-500">{t('Last updated')}: {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hidden md:inline-flex items-center gap-2 text-sm text-indigo-600 hover:underline"
            >
              {t('Back to top')}
            </button>

            <button
              onClick={() => setMobileTocOpen((s) => !s)}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border bg-white/60 dark:bg-black/40 md:hidden"
            >
              <Menu className="w-4 h-4" />
              {t('Contents')}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 md:px-8 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="hidden md:block md:col-span-1 sticky top-28 self-start">
          <div className="bg-white/60 dark:bg-gray-900/60 border rounded-2xl p-4 shadow-sm">
            <h3 className="text-sm font-semibold mb-3">{t('Table of contents')}</h3>
            <nav className="space-y-2 text-sm">
              {sectionsData.map((s) => (
                <button
                  key={s.id}
                  onClick={() => goTo(s.id)}
                  className={`w-full flex items-center gap-3 p-2 rounded-lg text-left ${
                    activeId === s.id ? 'bg-indigo-50 dark:bg-indigo-900/40' : 'hover:bg-gray-50 dark:hover:bg-gray-800/40'
                  }`}
                >
                  <span className="w-6 h-6 flex items-center justify-center">{s.icon}</span>
                  <span className="truncate">{s.title}</span>
                </button>
              ))}
            </nav>
            <div className="mt-4 text-xs text-gray-500">{t('Tip: click any section to jump to it')}</div>
          </div>
        </aside>

        <div className="md:col-span-3 space-y-8">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {t('Your privacy matters. This privacy policy explains what data we collect and how we use it. We aim to keep things transparent and straightforward.')}
          </p>

          <div className="space-y-6">
            {sectionsData.map(renderSection)}
          </div>

          <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white shadow-xl">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold">{t('Stay Secure & Informed')}</h3>
              <p className="mt-2 opacity-90">
                {t('Review your settings and keep your account safe. Manage your privacy preferences in Settings.')}
              </p>
              <div className="mt-4">
                <a
                  href="/Pages/Settings"
                  className="inline-block bg-white text-indigo-600 px-5 py-2 rounded-lg font-semibold shadow"
                >
                  {t('Go to Settings')}
                </a>
              </div>
            </div>
          </section>

          <footer className="mt-6 text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Zocial. {t('All rights reserved.')}
          </footer>
        </div>
      </main>
    </div>
  );
}
