'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, ShieldCheck, Settings, X, ToggleRight, MonitorSpeaker } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import PreferenceModal from '@/app/Component/Cookies/PreferenceModal';

const COOKIE_PREF_KEY = 'zocial_cookie_prefs_v1';

const Section = ({ title, icon, children, id }) => {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.35 }}
      className="bg-white/60 dark:bg-black/40 border border-white/6 dark:border-black/20 rounded-xl p-5"
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
};

const CookiesPolicyPage = () => {
  const { t } = useTranslation();
  const [progress, setProgress] = useState(0);
  const contentRef = useRef(null);
  const [prefsOpen, setPrefsOpen] = useState(false);
  const [prefs, setPrefs] = useState({ analytics: false, marketing: false });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(COOKIE_PREF_KEY);
      if (raw) setPrefs(JSON.parse(raw));
    } catch (e) {}
  }, []);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const winH = window.innerHeight;
      const total = Math.max(rect.height - winH, 1);
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      const pct = Math.round((scrolled / total) * 100);
      setProgress(Number.isFinite(pct) ? pct : 0);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const handleAcceptAll = () => {
    const all = { analytics: true, marketing: true };
    setPrefs(all);
    try {
      localStorage.setItem(COOKIE_PREF_KEY, JSON.stringify(all));
    } catch (e) {}
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 text-gray-900 dark:text-gray-100 py-12 px-4 md:px-10">
      <div className="max-w-4xl mx-auto">

        <div className="mb-8 px-4">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/60 to-purple-100/60 dark:from-indigo-900/10 dark:to-purple-900/10 blur-0 pointer-events-none" />
            <div className="relative z-10 backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border border-white/10 dark:border-black/20 rounded-3xl p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center bg-indigo-50 dark:bg-indigo-900/20">
                    <Cookie className="w-8 h-8 text-indigo-600 dark:text-indigo-300" />
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-300 dark:to-purple-300">
                      {t("Cookies Policy")}
                    </h1>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                      {t("We use cookies to enhance your experience, analyze site usage, and deliver personalized content.")}
                    </p>
                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={handleAcceptAll}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow"
                      >
                        <ShieldCheck className="w-4 h-4" /> {t("Accept All")}
                      </button>
                      <button
                        onClick={() => setPrefsOpen(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 dark:bg-gray-800 text-gray-900 dark:text-gray-200 border hover:shadow"
                      >
                        <Settings className="w-4 h-4" /> {t("Manage Preferences")}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="hidden md:flex flex-col items-end text-sm text-gray-500 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <MonitorSpeaker className="w-4 h-4" />
                    <div>{t("Essential · Analytics · Marketing")}</div>
                  </div>
                  <div className="mt-2 text-xs">{t("You can change these anytime.")}</div>
                </div>
              </div>

              {/* progress bar */}
              <div className="mt-6">
                <div aria-hidden className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
                    className="h-2 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all"
                  />
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  {t("Reading progress")}: {progress}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <main ref={contentRef} className="space-y-6">
          <Section
            id="what-are"
            title={t("What are Cookies?")}
            icon={<Cookie className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />}
          >
            <p>
              {t("Cookies are small text files stored on your device when you visit a website. They help us recognize your device, remember preferences (like language), and provide a personalized experience.")}
            </p>
            <p className="mt-3">
              {t("Cookies can be first-party (set by this site) or third-party (set by external services we use). We use several types of cookies to deliver the best experience while respecting your privacy.")}
            </p>
          </Section>

          <Section
            id="how-we-use"
            title={t("How We Use Cookies")}
            icon={<ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />}
          >
            <ul className="list-disc list-inside space-y-2">
              <li>{t("To remember your login and settings for a smoother experience.")}</li>
              <li>{t("To analyze traffic and improve the product (analytics cookies).")}</li>
              <li>{t("To show personalized content and recommended items (marketing cookies).")}</li>
              <li>{t("To secure the service and detect fraud.")}</li>
            </ul>
          </Section>

          <Section
            id="types"
            title={t("Types of Cookies We Use")}
            icon={<Cookie className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />}
          >
            <div className="grid gap-3 md:grid-cols-2">
              <div className="p-3 rounded-lg border border-white/6 dark:border-black/20 bg-white/60 dark:bg-black/40">
                <h4 className="font-semibold">{t("Essential Cookies")}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {t("Required for core functionality (login, security, accessibility). These are always active.")}
                </p>
              </div>
              <div className="p-3 rounded-lg border border-white/6 dark:border-black/20 bg-white/60 dark:bg-black/40">
                <h4 className="font-semibold">{t("Performance & Analytics")}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {t("Help us understand how users interact with the site to improve features and performance.")}
                </p>
              </div>
              <div className="p-3 rounded-lg border border-white/6 dark:border-black/20 bg-white/60 dark:bg-black/40">
                <h4 className="font-semibold">{t("Functional Cookies")}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {t("Remember choices and preferences to provide personalized features.")}
                </p>
              </div>
              <div className="p-3 rounded-lg border border-white/6 dark:border-black/20 bg-white/60 dark:bg-black/40">
                <h4 className="font-semibold">{t("Advertising & Marketing")}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {t("Used by third-party partners to display relevant ads and track ad performance.")}
                </p>
              </div>
            </div>
          </Section>

          <Section
            id="choices"
            title={t("Your Choices")}
            icon={<Settings className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />}
          >
            <p>
              {t("You can accept all cookies, or manage preferences to enable only the categories you want. Disabling some cookies may reduce functionality or personalization.")}
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={handleAcceptAll}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold shadow"
              >
                <ShieldCheck className="w-4 h-4" /> {t("Accept All Cookies")}
              </button>
              <button
                onClick={() => setPrefsOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/80 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border hover:shadow"
              >
                <Settings className="w-4 h-4" /> {t("Manage Preferences")}
              </button>
            </div>
          </Section>

          <Section
            id="contact"
            title={t("Contact Us")}
            icon={<Settings className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />}
          >
            <p>
              {t("For questions about this policy or your preferences, email us at ")}
              <a href="mailto:support@example.com" className="text-indigo-600 dark:text-indigo-300 underline">
                support@example.com
              </a>.
            </p>
            <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
              {t("Last updated")}: {new Date().toLocaleDateString()}
            </p>
          </Section>
        </main>

        <footer className="mt-10 text-center text-sm text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} Zocial. {t("All rights reserved.")} 
        </footer>
      </div>

      <PreferenceModal open={prefsOpen} onClose={() => setPrefsOpen(false)} prefs={prefs} setPrefs={setPrefs} COOKIE_PREF_KEY={COOKIE_PREF_KEY} />
    </div>
  );
};

export default CookiesPolicyPage;
