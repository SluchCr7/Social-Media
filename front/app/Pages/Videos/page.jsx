'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import Image from 'next/image'

const Page = () => {
  const { t } = useTranslation()

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-950 dark:to-black text-center px-6">
      
      {/* خلفية زخرفية */}
      <motion.div
        className="absolute -top-40 -right-40 w-[400px] h-[400px] bg-purple-500/20 dark:bg-purple-600/10 rounded-full blur-3xl"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5 }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-blue-400/20 dark:bg-blue-700/10 rounded-full blur-3xl"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.8, delay: 0.3 }}
      />

      {/* المحتوى */}
      <motion.div
        className="z-10 flex flex-col items-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
        >
          <Image
            src="/soon.svg"
            alt="Coming Soon"
            width={200}
            height={200}
            className="mb-6 drop-shadow-xl"
          />
        </motion.div>

        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-3 tracking-tight">
          🎬 {t("Videos Section Coming Soon!")}
        </h1>

        <p className="max-w-2xl text-gray-600 dark:text-gray-400 text-base md:text-lg leading-relaxed">
          {t("We're building an amazing video experience where you can watch, share, and explore creative content from around the world. Stay tuned for the launch!")}
        </p>

        <motion.div
          className="mt-10 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-transform transform hover:scale-105 cursor-default"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🚧 {t("Under Development")}
        </motion.div>
      </motion.div>

      {/* تأثيرات عائمة خفيفة */}
      <motion.div
        className="absolute bottom-10 text-gray-400 dark:text-gray-600 text-sm select-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        © {new Date().getFullYear()} {t("All rights reserved.")}
      </motion.div>
    </div>
  )
}

export default Page
