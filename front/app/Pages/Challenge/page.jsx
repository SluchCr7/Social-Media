'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import Image from 'next/image'

const Page = () => {
  const { t } = useTranslation()

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-yellow-50 via-white to-orange-100 dark:from-gray-900 dark:via-gray-950 dark:to-black text-center px-6">

      {/* خلفيات زخرفية متحركة */}
      <motion.div
        className="absolute -top-40 -left-40 w-[350px] h-[350px] bg-yellow-400/20 dark:bg-yellow-500/10 rounded-full blur-3xl"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.4 }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-orange-500/20 dark:bg-orange-700/10 rounded-full blur-3xl"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.8, delay: 0.3 }}
      />

      {/* المحتوى الرئيسي */}
      <motion.div
        className="z-10 flex flex-col items-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* صورة متحركة */}
        <motion.div
          animate={{ rotate: [0, 6, -6, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
        >
          <Image
            src="/soon.svg"
            alt="Coming Soon"
            width={200}
            height={200}
            className="mb-6 drop-shadow-lg"
          />
        </motion.div>

        {/* العنوان */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-3 tracking-tight">
          ⚡ {t("Challenges Coming Soon!")}
        </h1>

        {/* الوصف */}
        <p className="max-w-2xl text-gray-700 dark:text-gray-400 text-base md:text-lg leading-relaxed">
          {t("We’re crafting an exciting challenges feature full of fun competitions, leaderboards, and achievements. Get ready to test your skills and rise to the top!")}
        </p>

        {/* شارة تحت التطوير */}
        <motion.div
          className="mt-10 px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-transform transform hover:scale-105 cursor-default"
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🏗️ {t("Under Development")}
        </motion.div>
      </motion.div>

      {/* التذييل */}
      <motion.div
        className="absolute bottom-6 text-gray-400 dark:text-gray-600 text-sm select-none"
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
