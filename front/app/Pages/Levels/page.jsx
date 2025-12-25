
'use client'

import React, { useMemo, Suspense, lazy } from 'react'
import { motion } from 'framer-motion'
import {
  FaUserGraduate, FaMedal, FaCrown, FaFireAlt, FaStar, FaTrophy,
  FaThumbsUp, FaCommentDots, FaShareAlt, FaPenNib, FaUserPlus, FaCalendarCheck, FaChevronRight
} from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import { useGetData } from '@/app/Custome/useGetData'
import { useAuth } from '@/app/Context/AuthContext'

/* ---------------- LEVELS & METHODS ---------------- */
const LEVELS = [
  { name: 'Junior', min: 0, max: 1999, color: 'from-blue-500 to-indigo-600', icon: FaUserGraduate },
  { name: 'Challenger', min: 2000, max: 3999, color: 'from-indigo-500 to-blue-400', icon: FaMedal },
  { name: 'Warrior', min: 4000, max: 6999, color: 'from-orange-500 to-amber-400', icon: FaFireAlt },
  { name: 'Elite', min: 7000, max: 9999, color: 'from-green-400 to-emerald-500', icon: FaStar },
  { name: 'Master', min: 10000, max: 14999, color: 'from-purple-600 to-fuchsia-500', icon: FaTrophy },
  { name: 'Legend', min: 15000, max: Infinity, color: 'from-amber-400 to-yellow-400', icon: FaCrown },
]

const EARN_METHODS = [
  { icon: FaThumbsUp, text: 'Like a post', points: 5 },
  { icon: FaCommentDots, text: 'Comment on a post', points: 10 },
  { icon: FaShareAlt, text: 'Share a post', points: 20 },
  { icon: FaPenNib, text: 'Create a post', points: 50 },
  { icon: FaUserPlus, text: 'Gain a follower', points: 15 },
  { icon: FaCalendarCheck, text: 'Daily login', points: 25 },
]

/* ---------------- HELPERS ---------------- */
function formatPoints(num) {
  return num.toLocaleString()
}

function getCurrentLevel(levelName) {
  return LEVELS.find((l) => l.name === levelName) || LEVELS[0]
}

/* ---------------- COMPONENTS ---------------- */

// 💎 Level Card (Memoized)
const LevelCard = React.memo(({ lvl, idx, isCurrent, completed, progressToNext, t }) => {
  const Icon = lvl.icon
  return (
    <motion.div
      key={lvl.name}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.05 }}
      className={`relative p-5 rounded-2xl border border-gray-200 dark:border-gray-700
        bg-white/10 dark:bg-[#1a1a1a]/60 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)]
        flex items-center gap-6 transition-all hover:shadow-[0_0_25px_rgba(85,88,241,0.2)]
        ${isCurrent ? 'ring-2 ring-[#5558f1]/40' : ''}`}
    >
      <div className={`w-20 h-20 rounded-xl flex items-center justify-center bg-gradient-to-br ${lvl.color} shadow-lg`}>
        <Icon className="text-4xl text-white" />
      </div>

      <div className="flex-1">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-semibold text-xl">{t(lvl.name)}</h3>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {lvl.min.toLocaleString()} - {lvl.max === Infinity ? '∞' : lvl.max.toLocaleString()} XP
            </div>
          </div>
          <div className="text-right">
            {isCurrent ? (
              <div className="text-sm px-3 py-1 rounded-full bg-[#5558f1]/10 text-[#5558f1] font-medium">{t('Current')}</div>
            ) : completed ? (
              <div className="text-sm px-3 py-1 rounded-full bg-green-500/10 text-green-500 font-medium">{t('Unlocked')}</div>
            ) : (
              <div className="text-sm px-3 py-1 rounded-full bg-gray-300/20 text-gray-500 font-medium">{t('Locked')}</div>
            )}
          </div>
        </div>

        {isCurrent && lvl.max !== Infinity && (
          <div className="mt-4">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t('Progress to next level')}</div>
            <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressToNext}%` }}
                transition={{ duration: 0.6 }}
                className="h-2 bg-gradient-to-r from-[#5558f1] to-[#6b7bff]"
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
})
LevelCard.displayName = 'LevelCard'
// 💎 Earn Method Card (Memoized)
const EarnMethodCard = React.memo(({ m, i, t }) => {
  const Icon = m.icon
  return (
    <motion.div
      key={i}
      initial={{ opacity: 0, x: 10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.05 }}
      className="flex items-center justify-between gap-4 p-3 rounded-lg
      bg-white/10 dark:bg-[#1a1a1a]/60 backdrop-blur-md border border-white/20
      shadow-[0_4px_20px_rgba(0,0,0,0.05)]"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-[#5558f1]/10 text-[#5558f1] flex items-center justify-center">
          <Icon className="text-lg" />
        </div>
        <div>
          <div className="text-sm font-medium">{t(m.text)}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{m.points} XP</div>
        </div>
      </div>
    </motion.div>
  )
})
EarnMethodCard.displayName = "EarnMethodCard"
/* ---------------- MAIN COMPONENT ---------------- */
export default function LevelsPage() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { userData } = useGetData(user?._id)

  const currentPoints = userData?.userLevelPoints || 0
  const userLevelRank = userData?.userLevelRank || LEVELS[0].name
  const nextLevelPoints = userData?.nextLevelPoints || LEVELS[1].min

  const currentLevel = useMemo(() => getCurrentLevel(userLevelRank), [userLevelRank])
  const progressToNext = useMemo(() => {
    if (currentLevel.max === Infinity) return 100
    const min = currentLevel.min
    const max = nextLevelPoints
    const range = Math.max(1, max - min)
    return Math.min(100, Math.round(((currentPoints - min) / range) * 100))
  }, [currentLevel, currentPoints, nextLevelPoints])

  const nextLevelIndex = LEVELS.findIndex((l) => l.name === currentLevel.name) + 1
  const nextLevel = nextLevelIndex < LEVELS.length ? LEVELS[nextLevelIndex] : null
  const pointsRemaining = nextLevel ? Math.max(0, nextLevel.min - currentPoints) : 0

  const renderedLevels = useMemo(() =>
    LEVELS.map((lvl, idx) => {
      const isCurrent = currentLevel.name === lvl.name
      const completed = currentPoints > lvl.max && !isCurrent
      return (
        <LevelCard
          key={lvl.name}
          lvl={lvl}
          idx={idx}
          isCurrent={isCurrent}
          completed={completed}
          progressToNext={progressToNext}
          t={t}
        />
      )
    }), [currentLevel, currentPoints, progressToNext, t]
  )

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 text-gray-900 dark:text-gray-100 antialiased">
      {/* Decorative background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full px-6 py-20 max-w-7xl mx-auto">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 mb-16"
        >
          <div>
            <div className="flex items-center gap-4 mb-4">
              <motion.div
                animate={{ y: [0, -5, 0], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 shadow-2xl shadow-amber-500/30"
              >
                <FaStar className="text-white text-3xl" />
              </motion.div>
              <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
                {t('Level Up System')}
              </h1>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
              {t('Earn XP for meaningful activity. Unlock advanced features and climb to Legend status.')}
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">
                {t('Current Points')}
              </div>
              <div className="text-4xl font-extrabold bg-gradient-to-r from-amber-500 to-yellow-600 bg-clip-text text-transparent">
                {formatPoints(currentPoints)} XP
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all"
            >
              {t('Go to Dashboard')} <FaChevronRight />
            </motion.button>
          </div>
        </motion.header>

        {/* Main grid */}
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative rounded-3xl p-8 shadow-2xl backdrop-blur-xl border border-white/20 dark:border-gray-700/30 bg-white/60 dark:bg-gray-800/60 overflow-hidden"
            >
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5" />

              <div className="relative">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-600">
                      <FaTrophy className="text-white text-2xl" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {t('Your Level:')} {t(currentLevel.name)}
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t('Progress:')} {progressToNext}%
                      </p>
                    </div>
                  </div>
                </div>

                <div className="w-full bg-gray-200/50 dark:bg-gray-700/50 rounded-full h-4 overflow-hidden mb-8 shadow-inner">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressToNext}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-4 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 shadow-lg relative"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                    />
                  </motion.div>
                </div>

                {nextLevel && (
                  <div className="text-center text-base text-gray-700 dark:text-gray-300 mb-8 p-4 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
                    {t('You need')} <strong className="text-blue-600 dark:text-blue-400">{formatPoints(pointsRemaining)} XP</strong> {t('to reach')} <strong className="text-amber-600 dark:text-amber-400">{t(nextLevel.name)}</strong>
                  </div>
                )}

                <div className="space-y-5">{renderedLevels}</div>
              </div>
            </motion.div>
          </section>

          {/* Sidebar */}
          <aside>
            <div className="sticky top-24 space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-8 rounded-3xl shadow-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/20 dark:border-gray-700/30"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
                    <FaStar className="text-white text-xl" />
                  </div>
                  <h3 className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {t('How to Earn XP')}
                  </h3>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {EARN_METHODS.map((m, i) => <EarnMethodCard key={i} m={m} i={i} t={t} />)}
                </div>
                <div className="mt-6 text-sm text-gray-600 dark:text-gray-400 p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10">
                  💡 {t('Pro tip: Stay active and log in daily to keep your XP streak growing!')}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 shadow-2xl text-white overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                <div className="relative">
                  <h4 className="font-bold text-2xl mb-3">{t('Ready to climb?')}</h4>
                  <p className="text-sm mb-6 text-white/90">
                    {t('Complete actions, earn XP, and unlock exclusive perks at higher tiers.')}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 rounded-2xl font-bold bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all shadow-lg"
                  >
                    {t('Complete tasks')} • <strong>{t('Earn +50 XP')}</strong>
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </aside>
        </main>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="relative rounded-3xl p-10 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5" />
            <div className="relative">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                {t('Start gaining XP today')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('Engage with the community and unlock exclusive profile features.')}
              </p>
            </div>

            <div className="relative flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 font-bold text-white shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all"
              >
                {t('Do Tasks')}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-2xl border-2 border-gray-300/50 dark:border-gray-600/50 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-200/20 dark:hover:bg-gray-700/20 transition-all"
              >
                {t('View Leaderboard')}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
