'use client';
import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiX, FiCheck, FiSend } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

/**
 * @component ContactModal
 * @description A premium, high-fidelity contact support modal with glassmorphic aesthetics.
 */
const ContactModal = memo(({ show, setShow, sent, setSent }) => {
  const { t } = useTranslation();
  const [form, setForm] = React.useState({ email: '', subject: '', message: '' });
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API transmission
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      setForm({ email: '', subject: '', message: '' });
      setTimeout(() => {
        setShow(false);
        // Reset sent state after closing so it's fresh next time
        setTimeout(() => setSent(false), 500);
      }, 2500);
    }, 1500);
  };

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="contact-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-[9999] p-4 sm:p-6"
        onClick={() => !loading && setShow(false)}
      >
        <motion.div
          initial={{ y: 50, scale: 0.9, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
          exit={{ y: 30, scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="relative w-full max-w-[500px] bg-white/80 dark:bg-[#0A0A0A]/80 backdrop-blur-2xl rounded-[2.5rem] border border-black/5 dark:border-white/5 shadow-[0_32px_128px_-16px_rgba(0,0,0,0.3)] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Subtle Decorative Gradient */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-500/20 blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/20 blur-[100px] pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={() => setShow(false)}
            className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-2xl bg-black/5 dark:bg-white/5 text-gray-400 hover:text-black dark:hover:text-white transition-all z-20"
          >
            <FiX size={20} />
          </button>

          <div className="p-8 sm:p-10 relative z-10">
            {/* Header */}
            <div className="flex flex-col items-center text-center mb-10">
              <motion.div
                initial={{ rotate: -15, scale: 0.8 }}
                animate={{ rotate: 0, scale: 1 }}
                className="w-20 h-20 flex items-center justify-center bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-[2.2rem] text-white text-3xl shadow-xl shadow-indigo-500/30 mb-6"
              >
                <FiMail />
              </motion.div>
              <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter mb-2">
                {t('Contact Support')}
              </h2>
              <p className="text-gray-500 dark:text-slate-400 font-medium text-sm max-w-[280px]">
                {t('Our specialized support matrix is available 24/7 to assist with your journey.')}
              </p>
            </div>

            {/* Content Switcher */}
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  key="success-message"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex flex-col items-center py-10"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-6">
                    <FiCheck size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">{t('Message Transmitted')}</h3>
                  <p className="text-gray-400 text-sm font-medium tracking-wide">
                    {t('Expect a response in your primary inbox soon.')}
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="contact-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onSubmit={handleSubmit}
                  className="grid gap-5"
                >
                  <div className="group space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4 group-focus-within:text-indigo-500 transition-colors">
                      {t('Gateway ID')}
                    </label>
                    <input
                      type="email"
                      placeholder={t('user@example.com')}
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full p-4 rounded-2xl bg-black/[0.03] dark:bg-white/[0.03] border border-black/5 dark:border-white/5 text-sm text-gray-900 dark:text-white placeholder-black/20 dark:placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all font-semibold"
                      required
                    />
                  </div>

                  <div className="group space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4 group-focus-within:text-indigo-500 transition-colors">
                      {t('Frequency Subject')}
                    </label>
                    <input
                      type="text"
                      placeholder={t('What is your query?')}
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full p-4 rounded-2xl bg-black/[0.03] dark:bg-white/[0.03] border border-black/5 dark:border-white/5 text-sm text-gray-900 dark:text-white placeholder-black/20 dark:placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all font-semibold"
                      required
                    />
                  </div>

                  <div className="group space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4 group-focus-within:text-indigo-500 transition-colors">
                      {t('Transmission Substance')}
                    </label>
                    <textarea
                      placeholder={t('Provide detailed context...')}
                      rows="4"
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full p-4 rounded-2xl bg-black/[0.03] dark:bg-white/[0.03] border border-black/5 dark:border-white/5 text-sm text-gray-900 dark:text-white placeholder-black/20 dark:placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all resize-none font-semibold"
                      required
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-6 flex items-center justify-center gap-3 py-5 rounded-[1.6rem] bg-indigo-600 shadow-xl shadow-indigo-600/20 text-white font-black text-xs uppercase tracking-[0.3em] hover:bg-indigo-500 transition-all disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <FiSend size={16} />
                        {t('Send Transmission')}
                      </>
                    )}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
});

ContactModal.displayName = 'ContactModal'
export default ContactModal;
