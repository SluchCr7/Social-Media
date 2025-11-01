'use client';
import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiX } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

const ContactModal = memo(({ show, setShow, sent, setSent }) => {
  const { t } = useTranslation();
  const [form, setForm] = React.useState({ email: '', subject: '', message: '' });
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // محاكاة الإرسال
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      setForm({ email: '', subject: '', message: '' });
      setTimeout(() => setShow(false), 1500);
    }, 1200);
  };

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="contact-modal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-md bg-[#111827] text-white rounded-2xl border border-white/10 shadow-2xl p-6"
        >
          {/* Close Button */}
          <button
            onClick={() => setShow(false)}
            className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
          >
            <FiX size={22} />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 flex items-center justify-center bg-[#fbbf24] rounded-xl text-black text-xl shadow-lg">
              <FiMail />
            </div>
            <div>
              <h2 className="text-xl font-bold">{t('Contact Support')}</h2>
              <p className="text-gray-400 text-sm">{t('We’re here to help you 24/7')}</p>
            </div>
          </div>

          {/* Sent Message */}
          {sent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="text-4xl mb-2">✅</div>
              <p className="text-lg font-semibold text-[#fbbf24]">{t('Message sent successfully!')}</p>
              <p className="text-gray-400 text-sm mt-1">{t('We’ll get back to you soon.')}</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="grid gap-4">
              <input
                type="email"
                placeholder={t('Your Email')}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="p-3 rounded-lg bg-[#1f2937] border border-white/10 text-sm placeholder-gray-400 focus:ring-2 focus:ring-[#fbbf24]"
                required
              />
              <input
                type="text"
                placeholder={t('Subject')}
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="p-3 rounded-lg bg-[#1f2937] border border-white/10 text-sm placeholder-gray-400 focus:ring-2 focus:ring-[#fbbf24]"
                required
              />
              <textarea
                placeholder={t('Your message...')}
                rows="4"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="p-3 rounded-lg bg-[#1f2937] border border-white/10 text-sm placeholder-gray-400 focus:ring-2 focus:ring-[#fbbf24] resize-none"
                required
              />

              <button
                type="submit"
                disabled={loading}
                className="py-3 rounded-xl bg-[#fbbf24] text-black font-semibold hover:bg-yellow-400 transition disabled:opacity-50"
              >
                {loading ? t('Sending...') : t('Send Message')}
              </button>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
});

export default ContactModal;
