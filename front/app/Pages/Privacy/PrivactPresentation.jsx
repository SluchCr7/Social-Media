'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Menu, ChevronRight } from 'lucide-react';

export default function PrivacyPolicyPresentation({
  t, sectionsData, openIds, toggleSection, goTo,
  mobileTocOpen, setMobileTocOpen, sectionRefs, activeId, scaleX,
}) {
  return (
    <div className="min-h-screen bg-lightMode-bg dark:bg-darkMode-bg transition-colors duration-300">
      {/* ✅ شريط التقدم */}
      <motion.div
        style={{ scaleX }}
        className="origin-left fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-lightMode-text to-purple-500 dark:from-darkMode-text dark:to-darkMode-text z-50"
      />

      {/* ✅ الهيدر */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-lightMode-bg/80 dark:bg-darkMode-bg/70 border-b border-lightMode-menu dark:border-darkMode-menu transition">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-lightMode-menu dark:bg-darkMode-menu">
              <Lock className="w-5 h-5 text-lightMode-text dark:text-darkMode-text" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-lightMode-text2 dark:text-darkMode-text2">
                {t('Privacy Policy')}
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t('Last updated')}: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>

          <button
            onClick={() => setMobileTocOpen((s) => !s)}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-lightMode-menu dark:border-darkMode-menu bg-lightMode-bg dark:bg-darkMode-bg md:hidden"
          >
            <Menu className="w-4 h-4 text-lightMode-text dark:text-darkMode-text" />
            {t('Contents')}
          </button>
        </div>
      </header>

      {/* ✅ المحتوى */}
      <main className="container mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* ✅ الشريط الجانبي */}
        <aside className="hidden md:block md:col-span-1 sticky top-28 self-start">
          <div className="bg-lightMode-menu dark:bg-darkMode-menu border border-lightMode-menu dark:border-darkMode-menu rounded-2xl p-4 shadow-sm">
            <h3 className="text-sm font-semibold mb-3 text-lightMode-text2 dark:text-darkMode-text2">
              {t('Table of contents')}
            </h3>
            <nav className="space-y-2 text-sm">
              {sectionsData.map((s) => (
                <button
                  key={s.id}
                  onClick={() => goTo(s.id)}
                  className={`w-full flex items-center gap-3 p-2 rounded-lg text-left transition ${
                    activeId === s.id
                      ? 'bg-lightMode-bg dark:bg-darkMode-bg text-lightMode-text dark:text-darkMode-text'
                      : 'hover:bg-lightMode-bg/50 dark:hover:bg-darkMode-bg/50 text-lightMode-text2 dark:text-darkMode-text2'
                  }`}
                >
                  <span className="w-6 h-6 flex items-center justify-center">{s.icon}</span>
                  <span className="truncate">{s.title}</span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* ✅ محتوى الأقسام */}
        <div className="md:col-span-3 space-y-8">
          <p className="text-sm text-lightMode-text2 dark:text-darkMode-text2">
            {t('Your privacy matters. This policy explains what data we collect and how we use it.')}
          </p>

          <div className="space-y-6">
            {sectionsData.map((sec) => {
              const isOpen = openIds.includes(sec.id);
              return (
                <section
                  key={sec.id}
                  id={sec.id}
                  ref={(el) => (sectionRefs.current[sec.id] = el)}
                  className="bg-lightMode-menu dark:bg-darkMode-menu border border-lightMode-menu dark:border-darkMode-menu rounded-2xl p-6 shadow-sm transition"
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-1">{sec.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-4">
                        <h2 className="text-lg font-semibold text-lightMode-text2 dark:text-darkMode-text2">
                          {sec.title}
                        </h2>
                        <button
                          onClick={() => toggleSection(sec.id)}
                          className="ml-3 inline-flex items-center justify-center w-8 h-8 rounded-md border border-lightMode-bg dark:border-darkMode-bg hover:scale-105 transition"
                        >
                          <motion.span animate={{ rotate: isOpen ? 90 : 0 }}>
                            <ChevronRight className="w-4 h-4 text-lightMode-text2 dark:text-darkMode-text2" />
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
                            className="mt-4 text-sm text-lightMode-text2 dark:text-darkMode-text2"
                          >
                            {sec.content}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </section>
              );
            })}
          </div>

          {/* ✅ القسم الأخير */}
          <section className="rounded-2xl bg-gradient-to-r from-lightMode-text to-purple-500 dark:from-darkMode-text dark:to-darkMode-text p-8 text-white shadow-lg">
            <h3 className="text-2xl font-bold">{t('Stay Secure & Informed')}</h3>
            <p className="mt-2 opacity-90">
              {t('Manage your privacy preferences anytime in Settings.')}
            </p>
            <div className="mt-4">
              <a
                href="/Pages/Settings"
                className="inline-block bg-lightMode-bg dark:bg-darkMode-bg text-lightMode-text dark:text-darkMode-text px-5 py-2 rounded-lg font-semibold shadow-md hover:scale-105 transition"
              >
                {t('Go to Settings')}
              </a>
            </div>
          </section>

          <footer className="mt-6 text-sm text-lightMode-text2 dark:text-darkMode-text2">
            &copy; {new Date().getFullYear()} Zocial. {t('All rights reserved.')}
          </footer>
        </div>
      </main>
    </div>
  );
}
