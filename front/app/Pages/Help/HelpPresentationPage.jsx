'use client';
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiHelpCircle, FiChevronDown } from 'react-icons/fi';
import { TOPICS } from '@/app/utils/Data';

// =================================================================
// HelpPresentationPage Component (Optimized)
// =================================================================

const HelpPresentationPage = memo(({
  query,
  setQuery,
  filteredTopics,
  selectedTopic,
  setSelectedTopic,
  finalFaq,
  openFaq,
  setOpenFaq,
  setShowContact,
}) => {
  const { t } = useTranslation();

  // -------------------- Render Helpers --------------------
  const handleSearch = (e) => {
    setQuery(e.target.value);
    setOpenFaq(null);
  };

  const handleTopicSelect = (topicKey) => {
    setSelectedTopic(topicKey === selectedTopic ? null : topicKey);
    setOpenFaq(null);
  };

  // -------------------- Render --------------------
  return (
    <div className="min-h-screen w-full bg-[#000] text-[#e6eef8] py-16 px-6">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold flex items-center justify-center gap-3">
          <span className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-[#fbbf24] shadow-lg shadow-[#fbbf24]/30">
            <FiHelpCircle className="text-black text-2xl" />
          </span>
          {t('Help Center')}
        </h1>
        <p className="mt-3 text-gray-400 max-w-2xl mx-auto">
          {t('Search for help articles, technical issues, or specific topics...')}
        </p>

        <div className="mt-8">
          <motion.div whileFocus={{ scale: 1.01 }} className="mx-auto max-w-3xl">
            <label htmlFor="search" className="relative block">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                id="search"
                value={query}
                onChange={handleSearch}
                placeholder={t('Search for help articles, technical issues, or specific topics...')}
                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-[#111827] border border-white/10 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#fbbf24] transition"
              />
            </label>
          </motion.div>
        </div>
      </motion.header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Topics & FAQ */}
        <section className="lg:col-span-2 space-y-8">
          {/* Topics */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid sm:grid-cols-2 gap-4"
          >
            {filteredTopics.map((topic) => (
              <motion.button
                key={topic.key}
                whileHover={{ scale: 1.02, backgroundColor: '#1f2937' }}
                onClick={() => handleTopicSelect(topic.key)}
                className={`text-left p-5 rounded-2xl bg-gray-900/50 border border-white/10 flex gap-4 items-start transition ${
                  selectedTopic === topic.key
                    ? 'ring-2 ring-[#fbbf24] bg-gray-800'
                    : ''
                }`}
              >
                <div className="w-12 h-12 rounded-lg bg-[#5558f1]/20 flex items-center justify-center text-xl text-[#5558f1]">
                  {topic.icon}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-white">{t(topic.title)}</div>
                  <div className="text-sm text-gray-400 mt-1">{t(topic.desc)}</div>
                </div>
              </motion.button>
            ))}
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl bg-[#111827] border border-white/10"
          >
            <h3 className="font-bold text-xl mb-4 text-[#fbbf24]">
              {t('Frequently Asked Questions')} (
              {selectedTopic
                ? t(TOPICS.find((x) => x.key === selectedTopic)?.title)
                : t('General')}
              )
            </h3>

            {finalFaq.length === 0 ? (
              <p className="text-gray-400 py-4 text-center">
                {t('No matching questions found for your query or selected topic.')}
              </p>
            ) : (
              <div className="space-y-3">
                {finalFaq.map((faq, index) => (
                  <div
                    key={index}
                    className="rounded-xl overflow-hidden bg-white/5 border border-white/10"
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                      className="w-full flex items-center justify-between p-4 text-left"
                    >
                      <div className="flex-1 px-4">
                        <div className="font-medium text-white">{t(faq.q)}</div>
                        <AnimatePresence>
                          {openFaq === index && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="text-sm text-gray-400 mt-3 pt-3 border-t border-white/5"
                            >
                              {t(faq.a)}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      <FiChevronDown
                        className={`transition transform ${
                          openFaq === index
                            ? 'rotate-180 text-[#fbbf24]'
                            : 'rotate-0 text-gray-500'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </section>

        {/* Sidebar */}
        <aside className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl bg-[#5558f1] text-white shadow-2xl"
          >
            <h4 className="font-bold text-lg mb-2">{t('Need more help? 📞')}</h4>
            <p className="text-sm mb-4 opacity-90">
              {t(
                'Contact our support team or start a live chat. We usually respond within an hour.'
              )}
            </p>
            <div className="grid gap-3">
              <button
                onClick={() => setShowContact(true)}
                className="w-full py-3 rounded-xl bg-black/20 font-semibold hover:bg-black/30 transition"
              >
                {t('Contact Support')}
              </button>
              <a
                href="/support/live-chat"
                className="w-full text-center py-3 rounded-xl bg-white/20 font-semibold hover:bg-white/30 transition"
              >
                {t('Live Chat 💬')}
              </a>
            </div>
          </motion.div>
        </aside>
      </div>
    </div>
  );
});
HelpPresentationPage.displayName = "HelpPresentationPage"
export default HelpPresentationPage;
