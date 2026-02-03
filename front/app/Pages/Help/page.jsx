'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  HiQuestionMarkCircle,
  HiMagnifyingGlass,
  HiSparkles,
  HiChatBubbleLeftRight,
  HiChevronDown,
  HiXMark,
  HiArrowRight
} from 'react-icons/hi2';
import { motion, AnimatePresence } from 'framer-motion';

import InfoHero from '@/app/Component/Management/InfoHero';
import { TOPICS, FAQ } from '@/app/utils/Data';
import ContactModal from '@/app/Component/ContactForm';

const HelpPage = () => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);
  const [showContact, setShowContact] = useState(false);

  const filteredTopics = useMemo(() =>
    TOPICS.filter(
      (t) =>
        t.title.toLowerCase().includes(query.toLowerCase()) ||
        t.desc.toLowerCase().includes(query.toLowerCase())
    ),
    [query]);

  const finalFaq = useMemo(() => {
    const lowerQuery = query.toLowerCase();
    return FAQ.filter((f) => {
      const topicMatch = !selectedTopic || f.topicKey === selectedTopic;
      const queryMatch =
        f.q.toLowerCase().includes(lowerQuery) ||
        f.a.toLowerCase().includes(lowerQuery);
      return query ? queryMatch : topicMatch;
    }).slice(0, 15);
  }, [query, selectedTopic]);

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505]">
      <InfoHero
        title={t('Help Center')}
        subtitle={t('Access our global knowledge base for technical protocols and network guidance.')}
        icon={HiQuestionMarkCircle}
        gradient="from-blue-600 to-indigo-600"
      />

      <div className="max-w-7xl mx-auto px-6 pb-24 space-y-24">
        {/* 🔍 Search Interface */}
        <div className="max-w-4xl mx-auto -mt-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 blur-3xl rounded-[4rem] group-focus-within:opacity-100 transition-opacity duration-700 -z-10" />
            <div className="relative flex items-center bg-white dark:bg-[#0A0A0A] backdrop-blur-3xl rounded-[3rem] border border-gray-200 dark:border-white/10 shadow-2xl transition-all duration-500 group-focus-within:border-blue-500/50">
              <div className="pl-6 pr-2">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-xl shadow-blue-500/30">
                  <HiMagnifyingGlass className="w-7 h-7 text-white" />
                </div>
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('How can we synchronize your experience?')}
                className="w-full h-24 bg-transparent text-xl font-black outline-none placeholder-gray-400 dark:placeholder-gray-700 text-gray-900 dark:text-white px-6"
              />
              {query && (
                <button onClick={() => setQuery('')} className="pr-8 text-gray-400 hover:text-rose-500 transition-colors">
                  <HiXMark className="w-6 h-6" />
                </button>
              )}
            </div>
          </motion.div>
        </div>

        {/* 📂 Topics Grid */}
        <section className="space-y-12">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-500">
              <HiSparkles className="w-6 h-6" />
            </div>
            <h3 className="text-3xl font-black uppercase tracking-tight text-gray-900 dark:text-white">
              {t('Knowledge Sectors')}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTopics.map((topic, index) => (
              <motion.button
                key={topic.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => {
                  setSelectedTopic(selectedTopic === topic.key ? null : topic.key);
                  setOpenFaq(null);
                }}
                className={`group text-left p-8 rounded-[2.5rem] border transition-all duration-500 relative overflow-hidden ${selectedTopic === topic.key
                    ? 'bg-blue-600 text-white border-blue-500 shadow-2xl shadow-blue-500/30'
                    : 'bg-white dark:bg-white/[0.02] border-gray-100 dark:border-white/5 hover:border-blue-500/30'
                  }`}
              >
                <div className="space-y-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${selectedTopic === topic.key
                      ? 'bg-white/20'
                      : 'bg-gray-50 dark:bg-white/5 text-gray-400 group-hover:bg-blue-600 group-hover:text-white shadow-inner'
                    }`}>
                    <span className="text-2xl">{topic.icon}</span>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xl font-black uppercase tracking-tight">{t(topic.title)}</h4>
                    <p className={`text-xs font-medium leading-relaxed ${selectedTopic === topic.key ? 'opacity-80' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                      {t(topic.desc)}
                    </p>
                  </div>
                </div>
                {selectedTopic === topic.key && (
                  <motion.div layoutId="topicActive" className="absolute -bottom-1 -right-1 w-12 h-12 bg-white/10 rounded-tl-[2rem]" />
                )}
              </motion.button>
            ))}
          </div>
        </section>

        {/* 💬 FAQ Section */}
        <section id="faqs" className="max-w-5xl mx-auto space-y-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <HiQuestionMarkCircle className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                {selectedTopic ? t(TOPICS.find(t => t.key === selectedTopic).title) : t('Frequency Pulses')}
              </h3>
            </div>
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {finalFaq.map((faq, index) => (
                <motion.div
                  key={faq.q}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  className="rounded-[2.5rem] bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 overflow-hidden hover:border-indigo-500/20 transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full flex items-center justify-between p-8 text-left group"
                  >
                    <span className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {t(faq.q)}
                    </span>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${openFaq === index ? 'bg-indigo-600 text-white rotate-180' : 'bg-gray-50 dark:bg-white/5 text-gray-400'
                      }`}>
                      <HiChevronDown className="w-5 h-5" />
                    </div>
                  </button>
                  <AnimatePresence>
                    {openFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-8 pb-8"
                      >
                        <div className="pt-4 border-t border-gray-100 dark:border-white/5 text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                          {t(faq.a)}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>

            {finalFaq.length === 0 && (
              <div className="text-center py-20 px-8 rounded-[3rem] border border-dashed border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.01]">
                <HiQuestionMarkCircle className="w-16 h-16 text-gray-300 dark:text-gray-800 mx-auto mb-6" />
                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">{t('No signals detected')}</h3>
                <p className="text-sm font-medium text-gray-500 mb-8">{t('We couldn’t find an answer in this sector. Try another protocol or reach out.')}</p>
                <button
                  onClick={() => { setQuery(''); setSelectedTopic(null); }}
                  className="px-8 py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[10px] font-black uppercase tracking-widest"
                >
                  {t('Reset Filters')}
                </button>
              </div>
            )}
          </div>
        </section>

        {/* 📞 Contact Call to Action */}
        <section className="relative rounded-[4rem] overflow-hidden p-12 md:p-20 bg-gray-900 dark:bg-white text-white dark:text-gray-900 group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-800 opacity-90 dark:opacity-0 -z-10" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="space-y-6 max-w-xl text-center md:text-left">
              <div className="inline-flex p-4 rounded-2xl bg-white/20 dark:bg-gray-100 flex items-center justify-center">
                <HiChatBubbleLeftRight className="w-8 h-8" />
              </div>
              <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tight leading-[0.9]">
                {t('Still lost in the network?')}
              </h3>
              <p className="text-lg opacity-80 font-medium leading-relaxed">
                {t('Our resonance specialists are available 24/7 to help you synchronize your experience and solve technical anomalies.')}
              </p>
            </div>
            <div className="flex flex-col gap-4 w-full md:w-auto">
              <button
                onClick={() => setShowContact(true)}
                className="px-12 py-5 rounded-2xl bg-white dark:bg-gray-900 text-blue-600 dark:text-white text-xs font-black uppercase tracking-[0.3em] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4"
              >
                {t('Initialize Support')}
                <HiArrowRight className="w-5 h-5" />
              </button>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60 text-center">
                {t('Pulse Response Time: ~15 mins')}
              </p>
            </div>
          </div>
          {/* Background Pattern */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-white/20 to-transparent blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
        </section>
      </div>

      <ContactModal show={showContact} setShow={setShowContact} />
    </div>
  );
};

export default HelpPage;
