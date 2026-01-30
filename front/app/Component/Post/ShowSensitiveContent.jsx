import React from 'react'
import { motion } from 'framer-motion'
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi'
import { RiAlertLine } from 'react-icons/ri'

const ShowSensitiveContent = ({
  setShowSensitive,
  t
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-[60] flex items-center justify-center rounded-2xl overflow-hidden p-6"
    >
      {/* 🌫️ Minimal Professional Glass Glass Overlay */}
      <div className="absolute inset-0 bg-white/60 dark:bg-black/80 backdrop-blur-[20px]" />
      <div className="absolute inset-0 border border-black/5 dark:border-white/5 rounded-2xl" />

      {/* 📦 Minimal Content Box */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative z-10 flex flex-col items-center max-w-[280px] w-full text-center"
      >
        {/* Abstract Iconography */}
        <div className="mb-8 relative">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-1">
            <HiOutlineEyeOff className="text-2xl text-slate-400 dark:text-slate-500" />
          </div>
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] text-white"
          >
            <RiAlertLine />
          </motion.div>
        </div>

        {/* Professional Typography */}
        <div className="space-y-2 mb-10">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            {t('Sensitive Content')}
          </h2>
          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-relaxed">
            {t('Protected by Community Standards')}
          </p>
        </div>

        {/* Refined Action Button */}
        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowSensitive(false)}
          className="
            group relative flex items-center justify-center gap-3
            w-full py-4 px-6
            bg-indigo-600 hover:bg-indigo-500
            text-white rounded-full font-bold text-xs
            transition-all duration-300 shadow-xl shadow-indigo-600/20
          "
        >
          <HiOutlineEye className="text-lg" />
          <span className="tracking-wide">{t('Reveal Content')}</span>
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

export default ShowSensitiveContent