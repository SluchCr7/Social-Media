'use client'
import SluchitEntry from '@/app/Component/SluchitEntry'
import { usePost } from '@/app/Context/PostContext'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FaHashtag, FaFire, FaClock, FaChartLine } from 'react-icons/fa'
import { HiSparkles, HiMagnifyingGlass, HiArrowTrendingUp } from 'react-icons/hi2'
import { motion, AnimatePresence } from 'framer-motion'

const Page = ({ params }) => {
  const [postsRelated, setPostsRelated] = useState([])
  const [sortBy, setSortBy] = useState('recent') // recent, popular, trending
  const [viewMode, setViewMode] = useState('grid') // grid, list
  const { posts } = usePost()
  const text = params.text
  const { t } = useTranslation()

  const filteredPosts = useMemo(() => {
    if (!Array.isArray(posts)) return []
    return posts.filter((post) =>
      Array.isArray(post?.Hashtags) && post.Hashtags.includes(text)
    )
  }, [posts, text])

  const sortedPosts = useMemo(() => {
    const sorted = [...filteredPosts]
    switch (sortBy) {
      case 'popular':
        return sorted.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
      case 'trending':
        return sorted.sort((a, b) => {
          const aScore = (b.likes?.length || 0) + (b.comments?.length || 0) * 2
          const bScore = (a.likes?.length || 0) + (a.comments?.length || 0) * 2
          return bScore - aScore
        })
      default: // recent
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }
  }, [filteredPosts, sortBy])

  useEffect(() => {
    setPostsRelated(sortedPosts)
  }, [sortedPosts])

  const stats = useMemo(() => {
    const totalLikes = filteredPosts.reduce((sum, post) => sum + (post.likes?.length || 0), 0)
    const totalComments = filteredPosts.reduce((sum, post) => sum + (post.comments?.length || 0), 0)
    return { totalLikes, totalComments, totalPosts: filteredPosts.length }
  }, [filteredPosts])

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 dark:from-[#0A0A0A] dark:via-[#0F0F0F] dark:to-[#0A0A0A] transition-colors duration-300">
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

      <div className="w-full px-4 md:px-8 py-8 relative">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto mb-10"
        >
          <div className="relative rounded-[2.5rem] bg-white/80 dark:bg-white/[0.02] backdrop-blur-xl border border-gray-200/50 dark:border-white/10 shadow-2xl overflow-hidden">
            {/* Gradient Accent */}
            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

            <div className="p-8 md:p-10">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                {/* Left: Hashtag Info */}
                <div className="flex items-start gap-5">
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-500/30"
                  >
                    <FaHashtag className="text-3xl md:text-4xl" />
                  </motion.div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl md:text-5xl font-black tracking-tighter bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                        #{text}
                      </h1>
                      {postsRelated.length > 10 && (
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1"
                        >
                          <HiArrowTrendingUp className="w-3 h-3" />
                          {t('Trending')}
                        </motion.div>
                      )}
                    </div>

                    <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 font-medium">
                      {postsRelated.length} {postsRelated.length === 1 ? t("post") : t("posts")} • {stats.totalLikes} {t("likes")} • {stats.totalComments} {t("comments")}
                    </p>
                  </div>
                </div>

                {/* Right: Stats Cards */}
                <div className="grid grid-cols-3 gap-3">
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-indigo-500/5 dark:from-indigo-500/20 dark:to-indigo-500/10 border border-indigo-500/20"
                  >
                    <HiSparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mb-2" />
                    <div className="text-2xl font-black text-gray-900 dark:text-white">{stats.totalPosts}</div>
                    <div className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">{t('Posts')}</div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="p-4 rounded-2xl bg-gradient-to-br from-pink-500/10 to-pink-500/5 dark:from-pink-500/20 dark:to-pink-500/10 border border-pink-500/20"
                  >
                    <FaFire className="w-5 h-5 text-pink-600 dark:text-pink-400 mb-2" />
                    <div className="text-2xl font-black text-gray-900 dark:text-white">{stats.totalLikes}</div>
                    <div className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">{t('Likes')}</div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 to-purple-500/5 dark:from-purple-500/20 dark:to-purple-500/10 border border-purple-500/20"
                  >
                    <FaChartLine className="w-5 h-5 text-purple-600 dark:text-purple-400 mb-2" />
                    <div className="text-2xl font-black text-gray-900 dark:text-white">{stats.totalComments}</div>
                    <div className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">{t('Comments')}</div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters & Sort */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white/80 dark:bg-white/[0.02] backdrop-blur-xl border border-gray-200/50 dark:border-white/10 shadow-lg">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{t('Sort by')}:</span>
              <div className="flex gap-2">
                {[
                  { id: 'recent', label: t('Recent'), icon: FaClock },
                  { id: 'popular', label: t('Popular'), icon: FaFire },
                  { id: 'trending', label: t('Trending'), icon: HiArrowTrendingUp }
                ].map(({ id, label, icon: Icon }) => (
                  <motion.button
                    key={id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSortBy(id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${sortBy === id
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
                      : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10'
                      }`}
                  >
                    <Icon className="w-3 h-3" />
                    {label}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="w-full max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {postsRelated.length > 0 ? (
              <motion.div
                key="posts-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 gap-6 w-full"
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
                key="empty-state"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center mt-20 flex flex-col items-center space-y-6"
              >
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-24 h-24 flex items-center justify-center rounded-[2rem] bg-gradient-to-br from-gray-200 to-gray-100 dark:from-gray-800 dark:to-gray-700 shadow-xl"
                >
                  <FaHashtag className="text-5xl text-gray-400 dark:text-gray-500" />
                </motion.div>

                <div className="space-y-3">
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                    {t("No posts found")}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-lg max-w-md">
                    {t("No posts found with")} <span className="font-bold text-indigo-600 dark:text-indigo-400">#{text}</span>
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.history.back()}
                  className="mt-6 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black text-sm uppercase tracking-wider shadow-xl shadow-indigo-500/30 hover:shadow-2xl transition-all"
                >
                  {t("Go Back")}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default React.memo(Page)
