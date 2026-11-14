
'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import Image from 'next/image'

const Page = () => {
  const { t } = useTranslation()

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-[#080B18] text-center px-6 w-full">

      {/* Animated background decorations */}
      <motion.div
        className="absolute -top-40 -left-40 w-[350px] h-[350px] bg-violet-600/20 rounded-full blur-3xl"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.4 }}
      />

      <motion.div
        className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-cyan-500/15 rounded-full blur-3xl"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.8, delay: 0.3 }}
      />

      <motion.div
        className="absolute top-1/3 right-1/4 w-[250px] h-[250px] bg-fuchsia-600/10 rounded-full blur-3xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      />

      {/* Main content */}
      <motion.div
        className="z-10 flex flex-col items-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Animated image */}
        <motion.div
          animate={{ rotate: [0, 6, -6, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
        >
          <Image
            src="/soon.svg"
            alt="Coming Soon"
            width={200}
            height={200}
            className="mb-6 drop-shadow-[0_0_25px_rgba(139,92,246,0.25)]"
          />
        </motion.div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3 tracking-tight">
          <span className="text-cyan-400">⚡</span>{' '}
          {t("Challenges Coming Soon!")}
        </h1>

        {/* Description */}
        <p className="max-w-2xl text-slate-300/80 text-base md:text-lg leading-relaxed">
          {t("We’re crafting an exciting challenges feature full of fun competitions, leaderboards, and achievements. Get ready to test your skills and rise to the top!")}
        </p>

        {/* Development badge */}
        <motion.div
          className="mt-10 px-7 py-3 bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-500 text-white rounded-full font-semibold shadow-[0_0_30px_rgba(139,92,246,0.25)] transition-transform transform hover:scale-105 cursor-default"
          animate={{ opacity: [0.85, 1, 0.85] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🏗️ {t("Under Development")}
        </motion.div>
      </motion.div>

      {/* Footer */}
      <motion.div
        className="absolute bottom-6 text-slate-500 text-sm select-none"
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
