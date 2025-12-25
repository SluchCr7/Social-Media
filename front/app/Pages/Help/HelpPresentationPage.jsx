'use client';
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiHelpCircle, FiChevronDown } from 'react-icons/fi';
import { TOPICS } from '@/app/utils/Data';
import { Sparkles, MessageCircle, Headphones } from 'lucide-react';

const HelpPresentationPage = memo(
  ({
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

    const handleSearch = (e) => {
      setQuery(e.target.value);
      setOpenFaq(null);
    };

    const handleTopicSelect = (topicKey) => {
      setSelectedTopic(topicKey === selectedTopic ? null : topicKey);
      setOpenFaq(null);
    };

    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 text-gray-900 dark:text-gray-100 py-16 px-6">
        {/* Decorative background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto">
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 shadow-2xl shadow-blue-500/30 mb-6"
            >
              <FiHelpCircle className="text-white text-4xl" />
            </motion.div>

            <h1 className="text-5xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              {t('Help Center')}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t('Search for help articles, technical issues, or specific topics...')}
            </p>

            {/* Search bar */}
            <div className="mt-10">
              <motion.div
                whileFocus={{ scale: 1.02 }}
                className="mx-auto max-w-3xl relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl blur-xl opacity-20" />
                <label htmlFor="search" className="relative block">
                  <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                  <input
                    id="search"
                    value={query}
                    onChange={handleSearch}
                    placeholder={t('Search for help articles, technical issues, or specific topics...')}
                    className="relative w-full pl-16 pr-6 py-5 rounded-3xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-xl"
                  />
                </label>
              </motion.div>
            </div>
          </motion.header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Topics & FAQ */}
            <section className="lg:col-span-2 space-y-8">
              {/* Topics Grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid sm:grid-cols-2 gap-5"
              >
                {filteredTopics.map((topic, index) => (
                  <motion.button
                    key={topic.key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleTopicSelect(topic.key)}
                    className={`group relative text-left p-6 rounded-3xl backdrop-blur-xl border transition-all duration-300 overflow-hidden ${selectedTopic === topic.key
                        ? 'bg-gradient-to-br from-blue-500/20 via-purple-500/15 to-pink-500/10 border-blue-500/50 shadow-xl shadow-blue-500/20'
                        : 'bg-white/60 dark:bg-gray-800/60 border-white/20 dark:border-gray-700/30 hover:border-blue-400/50 hover:shadow-lg'
                      }`}
                  >
                    {/* Background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative flex gap-4 items-start">
                      <div className={`p-4 rounded-2xl transition-all ${selectedTopic === topic.key
                          ? 'bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg'
                          : 'bg-blue-500/10 group-hover:bg-blue-500/20'
                        }`}>
                        <div className={`text-2xl ${selectedTopic === topic.key ? 'text-white' : 'text-blue-600 dark:text-blue-400'
                          }`}>
                          {topic.icon}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-lg text-gray-900 dark:text-white mb-1">
                          {t(topic.title)}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {t(topic.desc)}
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </motion.div>

              {/* FAQ Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative p-8 rounded-3xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 shadow-xl overflow-hidden"
              >
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl" />

                <div className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {t('Frequently Asked Questions')} (
                      {selectedTopic
                        ? t(TOPICS.find((x) => x.key === selectedTopic)?.title)
                        : t('General')}
                      )
                    </h3>
                  </div>

                  {finalFaq.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-12"
                    >
                      <div className="inline-flex p-6 rounded-full bg-gray-100 dark:bg-gray-700/50 mb-4">
                        <FiHelpCircle className="w-12 h-12 text-gray-400" />
                      </div>
                      <p className="text-gray-500 dark:text-gray-400">
                        {t('No matching questions found for your query or selected topic.')}
                      </p>
                    </motion.div>
                  ) : (
                    <div className="space-y-4">
                      {finalFaq.map((faq, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="rounded-2xl overflow-hidden bg-white/50 dark:bg-gray-700/30 backdrop-blur-sm border border-white/20 dark:border-gray-600/30"
                        >
                          <button
                            onClick={() => setOpenFaq(openFaq === index ? null : index)}
                            className="w-full flex items-center justify-between p-5 text-left group"
                          >
                            <div className="flex-1 pr-4">
                              <div className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {t(faq.q)}
                              </div>
                            </div>
                            <motion.div
                              animate={{ rotate: openFaq === index ? 180 : 0 }}
                              transition={{ duration: 0.3 }}
                              className={`p-2 rounded-lg ${openFaq === index
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                                }`}
                            >
                              <FiChevronDown className="text-lg" />
                            </motion.div>
                          </button>
                          <AnimatePresence>
                            {openFaq === index && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                              >
                                <div className="px-5 pb-5 pt-2 text-sm text-gray-700 dark:text-gray-300 leading-relaxed border-t border-gray-200/50 dark:border-gray-600/30">
                                  {t(faq.a)}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </section>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* Contact Support Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative p-8 rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white shadow-2xl shadow-blue-500/30 overflow-hidden"
              >
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-2xl" />

                <div className="relative">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="inline-flex p-3 rounded-2xl bg-white/20 backdrop-blur-sm mb-4"
                  >
                    <Headphones className="w-6 h-6" />
                  </motion.div>
                  <h4 className="font-bold text-2xl mb-3">{t('Need more help? 📞')}</h4>
                  <p className="text-sm mb-6 text-white/90">
                    {t(
                      'Contact our support team or start a live chat. We usually respond within an hour.'
                    )}
                  </p>
                  <div className="grid gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowContact(true)}
                      className="w-full py-4 rounded-2xl bg-white/20 backdrop-blur-sm font-semibold hover:bg-white/30 transition-all shadow-lg"
                    >
                      {t('Contact Support')}
                    </motion.button>
                    <motion.a
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      href="/support/live-chat"
                      className="w-full text-center py-4 rounded-2xl bg-white text-blue-600 font-semibold hover:bg-white/90 transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-5 h-5" />
                      {t('Live Chat')}
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            </aside>
          </div>
        </div>
      </div>
    );
  }
);
HelpPresentationPage.displayName = 'HelpPresentationPage';
export default HelpPresentationPage;
