'use client'
import React, { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { usePost } from '@/app/Context/PostContext'
import SluchitEntry from '@/app/Component/SluchitEntry'
import { HiVideoCamera, HiSparkles } from 'react-icons/hi2'
import Loading from '@/app/Component/Loading'

const Page = () => {
  const { t } = useTranslation()
  const { posts, isLoading } = usePost()

  // ✅ Filter posts that contain at least one video
  const videoPosts = useMemo(() => {
    return posts.filter(post =>
      post.media?.some(m => m.type === 'video') ||
      post.Videos?.length > 0 // Legacy support
    )
  }, [posts])

  return (
    <div className="relative min-h-screen bg-[#fafafa] dark:bg-[#080808] transition-colors duration-700">
      {/* 🎭 Premium Ambient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12 md:py-20">
        {/* 🎬 Header Section */}
        <header className="mb-16 text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]"
          >
            <HiSparkles className="animate-spin-slow" />
            {t("Premium Experience")}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tighter"
          >
            {t("Visual")} <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">{t("Signals")}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 dark:text-gray-400 font-medium text-lg max-w-xl mx-auto"
          >
            {t("Dive into the most engaging video content from across the network.")}
          </motion.p>
        </header>

        {/* 📺 Content Feed */}
        <div className="space-y-12">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loading />
              <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-gray-400 animate-pulse">
                {t("Fetching Visual Streams...")}
              </p>
            </div>
          ) : videoPosts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-32 rounded-[3rem] bg-white dark:bg-white/[0.02] border border-dashed border-gray-200 dark:border-white/10"
            >
              <HiVideoCamera className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-700 mb-6" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t("No Visuals Found")}</h3>
              <p className="text-gray-500 text-sm max-w-xs mx-auto">
                {t("Be the first to broadcast a video to the world!")}
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 gap-12">
              {videoPosts.map((post, idx) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true, margin: "-100px" }}
                >
                  <SluchitEntry post={post} />
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* 🔄 Footer / Infinite Scroll Indicator */}
        {!isLoading && videoPosts.length > 0 && (
          <div className="mt-20 text-center">
            <div className="inline-block px-8 py-px bg-gradient-to-r from-transparent via-gray-200 dark:via-white/10 to-transparent w-full mb-8" />
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              {t("End of Signal Broadcast")}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Page
