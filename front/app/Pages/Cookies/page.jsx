'use client';

import React, { useEffect, useRef, useState, memo } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cookie,
  ShieldCheck,
  Settings,
  MonitorSpeaker,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

// 🧠 Dynamic Import لتقليل حجم الصفحة الأولي
const PreferenceModal = dynamic(() => import('@/app/Component/Cookies/PreferenceModal'), {
  ssr: false,
});

const COOKIE_PREF_KEY = 'zocial_cookie_prefs_v1';

// ✅ Section component مع memo + motion
const Section = memo(({ title, icon, children, id }) => {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ type: 'spring', stiffness: 100, damping: 18 }}
      className="bg-white/70 dark:bg-gray-900/60 backdrop-blur-xl border border-white/10 dark:border-gray-700 rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-md bg-indigo-50 dark:bg-indigo-900/20">
          {icon}
        </div>
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <div className="mt-3 text-gray-700 dark:text-gray-300 leading-relaxed">{children}</div>
    </motion.section>
  );
});
Section.displayName = 'Section';

const CookiesPolicyPage = () => {
  const { t } = useTranslation();
  const contentRef = useRef < HTMLDivElement > (null);
  const [progress, setProgress] = useState(0);
  const [prefsOpen, setPrefsOpen] = useState(false);

  // ✅ Lazy init لـ prefs من localStorage
  const [prefs, setPrefs] = useState(() => {
    try {
      const raw = localStorage.getItem(COOKIE_PREF_KEY);
      return raw ? JSON.parse(raw) : { analytics: false, marketing: false };
    } catch {
      return { analytics: false, marketing: false };
    }
  });

  // ✅ تحديث progress مع requestAnimationFrame
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const rect = el.getBoundingClientRect();
          const winH = window.innerHeight;
          const total = Math.max(rect.height - winH, 1);
          const scrolled = Math.min(Math.max(-rect.top, 0), total);
          const pct = Math.round((scrolled / total) * 100);
          setProgress(Number.isFinite(pct) ? pct : 0);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  // ✅ قبول جميع الكوكيز
  const handleAcceptAll = () => {
    const all = { analytics: true, marketing: true };
    setPrefs(all);
    try {
      localStorage.setItem(COOKIE_PREF_KEY, JSON.stringify(all));
    } catch { }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 text-gray-900 dark:text-gray-100 py-16 px-4 md:px-10">
      {/* Decorative background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto">
        {/* ================= HEADER ================= */}
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 shadow-2xl shadow-blue-500/30 mb-6"
          >
            <Cookie className="w-10 h-10 text-white" />
          </motion.div>

          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            {t('Cookies Policy')}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
            {t('We use cookies to enhance your experience, analyze site usage, and deliver personalized content.')}
          </p>

          {/* Action buttons */}
          <div className="flex items-center justify-center gap-4 flex-wrap mb-8">
            <motion.button
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.02, y: -2 }}
              onClick={handleAcceptAll}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold shadow-2xl shadow-emerald-500/30"
            >
              <ShieldCheck className="w-5 h-5" /> {t('Accept All')}
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.02, y: -2 }}
              onClick={() => setPrefsOpen(true)}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:shadow-xl font-bold"
            >
              <Settings className="w-5 h-5" /> {t('Manage Preferences')}
            </motion.button>
          </div>

          {/* Progress bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative h-3 bg-gray-200/50 dark:bg-gray-800/50 rounded-full overflow-hidden backdrop-blur-sm">
              <motion.div
                style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 shadow-lg"
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                />
              </motion.div>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-3 font-medium">
              {t('Reading progress')}: {progress}%
            </div>
          </div>
        </motion.div>

        {/* ================= MAIN CONTENT ================= */}
        <main ref={contentRef} className="space-y-8">
          <Section
            id="what-are"
            title={t('What are Cookies?')}
            icon={<Cookie className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />}
          >
            <p>
              {t(
                'Cookies are small text files stored on your device when you visit a website. They help us recognize your device, remember preferences (like language), and provide a personalized experience.'
              )}
            </p>
            <p className="mt-3">
              {t(
                'Cookies can be first-party (set by this site) or third-party (set by external services we use). We use several types of cookies to deliver the best experience while respecting your privacy.'
              )}
            </p>
          </Section>

          <Section
            id="how-we-use"
            title={t('How We Use Cookies')}
            icon={<ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />}
          >
            <ul className="list-disc list-inside space-y-2">
              <li>{t('To remember your login and settings for a smoother experience.')}</li>
              <li>{t('To analyze traffic and improve the product (analytics cookies).')}</li>
              <li>{t('To show personalized content and recommended items (marketing cookies).')}</li>
              <li>{t('To secure the service and detect fraud.')}</li>
            </ul>
          </Section>

          <Section
            id="types"
            title={t('Types of Cookies We Use')}
            icon={<Cookie className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />}
          >
            <div className="grid gap-4 md:grid-cols-2">
              {[
                {
                  title: t('Essential Cookies'),
                  desc: t(
                    'Required for core functionality (login, security, accessibility). These are always active.'
                  ),
                },
                {
                  title: t('Performance & Analytics'),
                  desc: t(
                    'Help us understand how users interact with the site to improve features and performance.'
                  ),
                },
                {
                  title: t('Functional Cookies'),
                  desc: t(
                    'Remember choices and preferences to provide personalized features.'
                  ),
                },
                {
                  title: t('Advertising & Marketing'),
                  desc: t(
                    'Used by third-party partners to display relevant ads and track ad performance.'
                  ),
                },
              ].map(({ title, desc }) => (
                <div
                  key={title}
                  className="p-4 rounded-lg border border-white/10 dark:border-gray-700 bg-white/60 dark:bg-gray-900/40 shadow-sm"
                >
                  <h4 className="font-semibold">{title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{desc}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section
            id="choices"
            title={t('Your Choices')}
            icon={<Settings className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />}
          >
            <p>
              {t(
                'You can accept all cookies, or manage preferences to enable only the categories you want. Disabling some cookies may reduce functionality or personalization.'
              )}
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <motion.button
                whileTap={{ scale: 0.97 }}
                whileHover={{ y: -1 }}
                onClick={handleAcceptAll}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-semibold shadow-lg"
              >
                <ShieldCheck className="w-4 h-4" /> {t('Accept All Cookies')}
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                whileHover={{ y: -1 }}
                onClick={() => setPrefsOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/80 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 hover:shadow-lg"
              >
                <Settings className="w-4 h-4" /> {t('Manage Preferences')}
              </motion.button>
            </div>
          </Section>

          <Section
            id="contact"
            title={t('Contact Us')}
            icon={<Settings className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />}
          >
            <p>
              {t('For questions about this policy or your preferences, email us at ')}
              <a
                href="mailto:support@example.com"
                className="text-indigo-600 dark:text-indigo-300 underline"
              >
                support@example.com
              </a>
              .
            </p>
            <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
              {t('Last updated')}: {new Date().toLocaleDateString()}
            </p>
          </Section>
        </main>

        {/* ================= FOOTER ================= */}
        <footer className="mt-10 text-center text-sm text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} Zocial. {t('All rights reserved.')}
        </footer>
      </div>

      {/* ================= PREFERENCES MODAL ================= */}
      <AnimatePresence>
        {prefsOpen && (
          <PreferenceModal
            open={prefsOpen}
            onClose={() => setPrefsOpen(false)}
            prefs={prefs}
            setPrefs={setPrefs}
            COOKIE_PREF_KEY={COOKIE_PREF_KEY}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CookiesPolicyPage;
