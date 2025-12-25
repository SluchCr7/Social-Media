'use client';

import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Menu, ChevronRight, Shield, Eye, Database, UserCheck, Settings as SettingsIcon } from 'lucide-react';

function PrivacyPolicyPresentation({
  t,
  sectionsData,
  openIds,
  toggleSection,
  goTo,
  mobileTocOpen,
  setMobileTocOpen,
  sectionRefs,
  activeId,
  scaleX,
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-300">
      {/* Progress bar */}
      <motion.div
        style={{ scaleX }}
        className="origin-left fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 z-50 shadow-lg shadow-blue-500/50"
      />

      {/* Decorative background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-2xl bg-white/80 dark:bg-gray-900/80 border-b border-white/20 dark:border-gray-800/50 shadow-lg">
        <div className="container mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="p-3 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg"
            >
              <Lock className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t('Privacy Policy')}
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t('Last updated')}: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMobileTocOpen((s) => !s)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm md:hidden hover:shadow-lg transition-all"
          >
            <Menu className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            {t('Contents')}
          </motion.button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative container mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="hidden md:block md:col-span-1 sticky top-32 self-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-3xl p-6 shadow-xl"
          >
            <h3 className="text-sm font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {t('Table of contents')}
            </h3>
            <nav className="space-y-2 text-sm">
              {sectionsData.map((s, index) => (
                <motion.button
                  key={s.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => goTo(s.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${activeId === s.id
                      ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-600 dark:text-blue-400 shadow-lg'
                      : 'hover:bg-gray-100/50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300'
                    }`}
                >
                  <span className="w-6 h-6 flex items-center justify-center">{s.icon}</span>
                  <span className="truncate font-medium">{s.title}</span>
                </motion.button>
              ))}
            </nav>
          </motion.div>
        </aside>

        {/* Content */}
        <div className="md:col-span-3 space-y-8">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-base text-gray-700 dark:text-gray-300 leading-relaxed"
          >
            {t('Your privacy matters. This policy explains what data we collect and how we use it.')}
          </motion.p>

          <div className="space-y-6">
            {sectionsData.map((sec, index) => {
              const isOpen = openIds.includes(sec.id);
              return (
                <motion.section
                  key={sec.id}
                  id={sec.id}
                  ref={(el) => (sectionRefs.current[sec.id] = el)}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  {/* Background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative flex items-start gap-5">
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10">
                      {sec.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-4">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                          {sec.title}
                        </h2>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => toggleSection(sec.id)}
                          className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-700/50 hover:bg-blue-500/10 dark:hover:bg-blue-500/20 transition-all"
                        >
                          <motion.span animate={{ rotate: isOpen ? 90 : 0 }}>
                            <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                          </motion.span>
                        </motion.button>
                      </div>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-5 text-sm text-gray-700 dark:text-gray-300 leading-relaxed"
                          >
                            {sec.content}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.section>
              );
            })}
          </div>

          {/* CTA Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-10 text-white shadow-2xl shadow-blue-500/30 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="relative">
              <h3 className="text-3xl font-bold mb-3">{t('Stay Secure & Informed')}</h3>
              <p className="text-lg mb-6 text-white/90">
                {t('Manage your privacy preferences anytime in Settings.')}
              </p>
              <motion.a
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                href="/Pages/Settings"
                className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all"
              >
                <SettingsIcon className="w-5 h-5" />
                {t('Go to Settings')}
              </motion.a>
            </div>
          </motion.section>

          <footer className="mt-8 text-sm text-gray-500 dark:text-gray-400 text-center">
            &copy; {new Date().getFullYear()} Zocial. {t('All rights reserved.')}
          </footer>
        </div>
      </main>
    </div>
  );
}

export default memo(PrivacyPolicyPresentation);