import React from 'react'
import { motion } from 'framer-motion'
import { IoIosWarning } from 'react-icons/io'
import { HiEye } from 'react-icons/hi2'

const ShowSensitiveContent = ({
  setShowSensitive,
  t
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="
        absolute inset-0 z-[60] 
        flex items-center justify-center 
        rounded-2xl overflow-hidden
        p-4 sm:p-8
      "
    >
      {/* 🔮 Premium Mesh Gradient Background */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-white/40 dark:bg-black/40 backdrop-blur-3xl" />
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="absolute inset-0 border border-white/20 dark:border-white/10 rounded-2xl" />

      {/* ⚠️ Content Container */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 10 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="
          relative z-10 flex flex-col items-center 
          bg-white/10 dark:bg-white/[0.03]
          backdrop-blur-md
          rounded-3xl p-8 sm:p-12
          max-w-sm w-full text-center
          shadow-2xl shadow-black/5
        "
      >
        {/* Warning Icon with Glow */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-amber-500/40 blur-2xl rounded-full" />
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              repeat: Infinity,
              duration: 4,
              ease: "easeInOut"
            }}
            className="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-xl shadow-orange-500/20"
          >
            <IoIosWarning className="text-4xl" />
          </motion.div>
        </div>

        {/* Text Content */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          {t('Sensitive Content')}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
          {t('This content may contain sensitive material. Would you like to view it?')}
        </p>

        {/* Action Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowSensitive(false)}
          className="
            group relative flex items-center justify-center gap-2
            w-full py-4 px-8 
            bg-gray-900 dark:bg-white
            text-white dark:text-gray-900
            rounded-2xl font-bold text-sm
            transition-all duration-300
            hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-white/10
          "
        >
          <HiEye className="text-lg group-hover:scale-110 transition-transform" />
          <span>{t('Show Content')}</span>

          {/* Subtle Shine Effect */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
            <div className="absolute inset-0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

export default ShowSensitiveContent