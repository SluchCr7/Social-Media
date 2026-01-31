'use client'
import SluchitEntry from '@/app/Component/SluchitEntry'
import { usePost } from '@/app/Context/PostContext'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FaHashtag } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import { HiTrendingUp, HiSparkles, HiArrowLeft } from 'react-icons/hi2'

const Page = ({ params }) => {
  const [postsRelated, setPostsRelated] = useState([])
  const { posts } = usePost()
  const text = params.text
  const { t } = useTranslation()

  const filteredPosts = useMemo(() => {
    if (!Array.isArray(posts)) return []
    return posts.filter((post) =>
      Array.isArray(post?.Hashtags) && post.Hashtags.includes(text)
    )
  }, [posts, text])

  useEffect(() => {
    setPostsRelated(filteredPosts)
  }, [filteredPosts])

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-[#0A0A0A] dark:via-[#0F0F0F] dark:to-[#0A0A0A] transition-colors duration-300">
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-indigo-500/10 dark:bg-indigo-500/5 blur-[120px] rounded-full"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -40, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-purple-500/10 dark:bg-purple-500/5 blur-[120px] rounded-full"
        />
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => window.history.back()}
          className="mb-6 flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/10 transition-all group"
        >
          <HiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">{t("Go Back")}</span>
        </motion.button>

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-10 overflow-hidden rounded-3xl bg-white dark:bg-white/[0.02] backdrop-blur-xl border border-gray-200 dark:border-white/10 shadow-xl"
        >
          {/* Gradient Accent */}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

          <div className="p-8 md:p-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              {/* Left Side - Hashtag Info */}
              <div className="flex items-start gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-500 blur-xl opacity-50" />
                  <div className="relative w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-lg">
                    <FaHashtag className="text-2xl md:text-3xl" />
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                      #{text}
                    </h1>
                    {postsRelated.length > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex items-center gap-1 px-2 py-1 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                      >
                        <HiTrendingUp className="w-3 h-3" />
                        <span className="text-xs font-bold">{t("Trending")}</span>
                      </motion.div>
                    )}
                  </div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {postsRelated.length} {postsRelated.length === 1 ? t("post") : t("posts")} {t("found")}
                  </p>
                </div>
              </div>

              {/* Right Side - Stats Badge */}
              <div className="flex items-center gap-3">
                <div className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 dark:border-indigo-500/10">
                  <div className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                    {postsRelated.length}
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                    {t("results")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Posts List */}
        <AnimatePresence mode="wait">
          {postsRelated.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {postsRelated.map((post, index) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="w-full"
                >
                  <SluchitEntry post={post} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center py-20 px-6"
            >
              {/* Empty State */}
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 blur-3xl" />
                <div className="relative w-24 h-24 flex items-center justify-center rounded-3xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-xl">
                  <HiSparkles className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                </div>
              </div>

              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3">
                {t("No posts found")}
              </h3>
              <p className="text-center text-gray-500 dark:text-gray-400 max-w-md mb-8">
                {t("No posts found with")} <span className="font-bold text-indigo-600 dark:text-indigo-400">#{text}</span>. {t("Be the first to create content with this hashtag!")}
              </p>

              <button
                onClick={() => window.history.back()}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm hover:shadow-lg hover:shadow-indigo-500/25 transition-all hover:scale-105 active:scale-95"
              >
                {t("Go Back")}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default React.memo(Page)
