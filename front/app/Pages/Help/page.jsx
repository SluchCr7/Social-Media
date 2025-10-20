'use client';

import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSearch,
  FiHelpCircle,
  FiMessageCircle,
  FiChevronDown,
  FiShield,
  FiUser,
  FiGlobe,
  FiCreditCard,
  FiUsers
} from 'react-icons/fi';

// =================================================================
// 1. Static Data (with translation support)
// =================================================================

export const TOPICS = [
  {
    key: 'account',
    icon: <FiUser />,
    title: 'Account & Profile',
    desc: 'Creating an account, logging in, resetting passwords, and managing your profile settings.'
  },
  {
    key: 'content',
    icon: <FiGlobe />,
    title: 'Content & Posting',
    desc: 'Posting issues, images, videos, copyrights, and deletion problems.'
  },
  {
    key: 'messaging',
    icon: <FiMessageCircle />,
    title: 'Messaging & Chat',
    desc: 'Private messages, group chats, notifications, and message delivery issues.'
  },
  {
    key: 'privacy',
    icon: <FiShield />,
    title: 'Privacy & Security',
    desc: 'Privacy settings, blocking users, reporting abuse, and securing your account.'
  },
  {
    key: 'billing',
    icon: <FiCreditCard />,
    title: 'Subscriptions & Ads',
    desc: 'Managing Premium subscriptions, billing, and advertiser accounts.'
  },
  {
    key: 'community',
    icon: <FiUsers />,
    title: 'Community & Guidelines',
    desc: 'Community rules, reporting violations, and submitting appeals.'
  }
];

export const FAQ = [
  {
    topicKey: 'account',
    q: 'How can I reset my password if I forgot it?',
    a: 'On the login screen, tap "Forgot Password". Enter your email or phone number to receive a reset link or code. Check your spam folder if you don’t see it.'
  },
  {
    topicKey: 'account',
    q: 'What are the steps to verify my account?',
    a: 'Go to Settings > Profile > Request Verification. Fill out the form and upload valid identification (e.g., passport). Review may take up to 7 business days.'
  },
  {
    topicKey: 'content',
    q: 'Why was my post removed or blocked?',
    a: 'Posts are usually removed for violating our content guidelines (e.g., violence, hate, or copyright issues). Review the notice and appeal if you believe it’s a mistake.'
  },
  {
    topicKey: 'content',
    q: 'How can I upload videos in high quality (4K/HD)?',
    a: 'Ensure your original video is high quality. Uploads may be compressed for faster playback. Use our native app instead of a browser for better quality.'
  },
  {
    topicKey: 'messaging',
    q: 'How do I disable read receipts in messages?',
    a: 'Go to Settings > Privacy > Messages and turn off "Read Receipts". Others won’t see if you’ve read their messages.'
  },
  {
    topicKey: 'privacy',
    q: 'What happens when I block a user?',
    a: 'Blocked users can’t see your profile, posts, or message you. They won’t be notified about the block. You can unblock anytime from your blocked accounts list.'
  },
  {
    topicKey: 'billing',
    q: 'How do I request a refund for Premium?',
    a: 'Refund policies depend on your purchase platform (App Store, Google Play, or website). Generally, refunds are available within 14 days if unused.'
  },
  {
    topicKey: 'community',
    q: 'How can I appeal a moderation decision?',
    a: 'If your content or account was removed, you’ll get a notification with an “Appeal” option. Follow the steps and explain why you think it was wrong.'
  }
];

// =================================================================
// 2. HelpCenter Component
// =================================================================

export default function HelpCenter() {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);
  const [showContact, setShowContact] = useState(false);
  const [contactData, setContactData] = useState({ email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const filteredTopics = TOPICS.filter(
    (t) =>
      t.title.toLowerCase().includes(query.toLowerCase()) ||
      t.desc.toLowerCase().includes(query.toLowerCase())
  );

  const finalFaq = useMemo(() => {
    return FAQ.filter((f) => {
      const topicMatch = !selectedTopic || f.topicKey === selectedTopic;
      const queryMatch =
        f.q.toLowerCase().includes(query.toLowerCase()) ||
        f.a.toLowerCase().includes(query.toLowerCase());
      if (query) return queryMatch;
      return topicMatch;
    }).slice(0, 10);
  }, [query, selectedTopic]);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setTimeout(() => {
      setSent(true);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[#000000] text-[#e6eef8] py-16 px-6">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header */}
        <motion.header initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
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
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setOpenFaq(null);
                  }}
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
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="grid sm:grid-cols-2 gap-4">
              {filteredTopics.map((tpc, idx) => (
                <motion.button
                  key={tpc.key}
                  whileHover={{ scale: 1.02, backgroundColor: '#1f2937' }}
                  onClick={() => setSelectedTopic(tpc.key)}
                  className={`text-left p-5 rounded-2xl bg-gray-900/50 border border-white/10 flex gap-4 items-start transition ${
                    selectedTopic === tpc.key ? 'ring-2 ring-[#fbbf24] bg-gray-800' : ''
                  }`}
                >
                  <div className="w-12 h-12 rounded-lg bg-[#5558f1]/20 flex items-center justify-center text-xl text-[#5558f1]">
                    {tpc.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-white">{t(tpc.title)}</div>
                    <div className="text-sm text-gray-400 mt-1">{t(tpc.desc)}</div>
                  </div>
                </motion.button>
              ))}
            </motion.div>

            {/* FAQ Section */}
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-2xl bg-[#111827] border border-white/10">
              <h3 className="font-bold text-xl mb-4 text-[#fbbf24]">
                {t('Frequently Asked Questions')} ({selectedTopic ? t(TOPICS.find(x => x.key === selectedTopic)?.title) : t('General')})
              </h3>
              {finalFaq.length === 0 ? (
                <p className="text-gray-400 py-4 text-center">{t('No matching questions found for your query or selected topic.')}</p>
              ) : (
                <div className="space-y-3">
                  {finalFaq.map((f, i) => (
                    <div key={i} className="rounded-xl overflow-hidden bg-white/5 border border-white/10">
                      <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-4 text-left">
                        <div className="flex-1 px-4">
                          <div className="font-medium text-white">{t(f.q)}</div>
                          <AnimatePresence>
                            {openFaq === i && (
                              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="text-sm text-gray-400 mt-3 pt-3 border-t border-white/5">
                                {t(f.a)}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                        <FiChevronDown className={`transition transform ${openFaq === i ? 'rotate-180 text-[#fbbf24]' : 'rotate-0 text-gray-500'}`} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </section>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Contact Card */}
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-2xl bg-[#5558f1] text-white shadow-2xl">
              <h4 className="font-bold text-lg mb-2">{t('Need more help? 📞')}</h4>
              <p className="text-sm mb-4 opacity-90">{t('Contact our support team or start a live chat. We usually respond within an hour.')}</p>
              <div className="grid gap-3">
                <button onClick={() => setShowContact(true)} className="w-full py-3 rounded-xl bg-black/20 font-semibold hover:bg-black/30 transition">
                  {t('Contact Support')}
                </button>
                <a href="/support/live-chat" className="w-full text-center py-3 rounded-xl bg-white/20 font-semibold hover:bg-white/30 transition">
                  {t('Live Chat 💬')}
                </a>
              </div>
            </motion.div>
          </aside>
        </div>
      </div>
    </div>
  );
}
