// 'use client'

// import React, { useMemo } from 'react'
// import { motion } from 'framer-motion'
// import {
//   FaUserGraduate,
//   FaMedal,
//   FaCrown,
//   FaFireAlt,
//   FaStar,
//   FaTrophy,
//   FaThumbsUp,
//   FaCommentDots,
//   FaShareAlt,
//   FaPenNib,
//   FaUserPlus,
//   FaCalendarCheck,
//   FaChevronRight,
// } from 'react-icons/fa'
// import { useTranslation } from 'react-i18next'
// import { useGetData } from '@/app/Custome/useGetData'
// import { useAuth } from '@/app/Context/AuthContext'

// const LEVELS = [
//   { name: 'Junior', min: 0, max: 1999, color: 'from-[#5558f1] to-indigo-700', icon: FaUserGraduate },
//   { name: 'Challenger', min: 2000, max: 3999, color: 'from-[#5558f1] to-[#6b7bff]', icon: FaMedal },
//   { name: 'Warrior', min: 4000, max: 6999, color: 'from-yellow-500 to-amber-400', icon: FaFireAlt },
//   { name: 'Elite', min: 7000, max: 9999, color: 'from-green-400 to-emerald-500', icon: FaStar },
//   { name: 'Master', min: 10000, max: 14999, color: 'from-purple-600 to-violet-500', icon: FaTrophy },
//   { name: 'Legend', min: 15000, max: Infinity, color: 'from-amber-400 to-yellow-400', icon: FaCrown },
// ]

// const EARN_METHODS = [
//   { icon: FaThumbsUp, text: 'Like a post', points: 5 },
//   { icon: FaCommentDots, text: 'Comment on a post', points: 10 },
//   { icon: FaShareAlt, text: 'Share a post', points: 20 },
//   { icon: FaPenNib, text: 'Create a post', points: 50 },
//   { icon: FaUserPlus, text: 'Gain a follower', points: 15 },
//   { icon: FaCalendarCheck, text: 'Daily login', points: 25 },
// ]

// function formatPoints(num) {
//   return num.toLocaleString()
// }

// function getCurrentLevel(levelName) {
//   return LEVELS.find((l) => l.name === levelName) || LEVELS[0]
// }

// export default function LevelsPage() {
//   const { t } = useTranslation()
//   const { user } = useAuth()
//   const { userData } = useGetData(user?._id)

//   const currentPoints = userData?.userLevelPoints || 0
//   const userLevelRank = userData?.userLevelRank || LEVELS[0].name
//   const nextLevelPoints = userData?.nextLevelPoints || LEVELS[1].min

//   const currentLevel = useMemo(() => getCurrentLevel(userLevelRank), [userLevelRank])

//   const progressToNext = useMemo(() => {
//     if (currentLevel.max === Infinity) return 100
//     const currentMin = currentLevel.min
//     const currentMax = nextLevelPoints
//     if (currentPoints < currentMin) return 0
//     const range = currentMax - currentMin
//     if (range <= 0) return 100
//     const currentInRange = Math.max(0, currentPoints - currentMin)
//     return Math.round((currentInRange / range) * 100)
//   }, [currentLevel, currentPoints, nextLevelPoints])

//   const nextLevelIndex = LEVELS.findIndex((l) => l.name === currentLevel.name) + 1
//   const nextLevel = nextLevelIndex < LEVELS.length ? LEVELS[nextLevelIndex] : null
//   const requiredPointsForNextLevel = nextLevel ? nextLevel.min : currentPoints
//   const pointsRemaining = nextLevel ? Math.max(0, requiredPointsForNextLevel - currentPoints) : 0

//   return (
//     <div className="min-h-screen bg-lightMode-bg dark:bg-darkMode-bg text-lightMode-fg dark:text-darkMode-fg antialiased relative">
//       {/* خلفيات الإضاءة */}
//       <div className="absolute inset-0 pointer-events-none overflow-hidden">
//         <div className="absolute -left-32 -top-20 w-96 h-96 rounded-full blur-3xl opacity-25 bg-gradient-to-tr from-[#5558f1] to-indigo-400"></div>
//         <div className="absolute -right-32 -bottom-20 w-96 h-96 rounded-full blur-3xl opacity-20 bg-gradient-to-br from-amber-400 to-yellow-400"></div>
//       </div>

//       <div className="relative z-10 w-full px-6 py-20">
//         {/* Header */}
//         <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
//           <div>
//             <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight flex items-center gap-3">
//               <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-[#5558f1] to-indigo-600 shadow-lg">
//                 <FaStar className="text-white text-xl" />
//               </span>
//               {t('Level Up System')}
//             </h1>
//             <p className="mt-2 text-gray-500 dark:text-darkMode-text2 max-w-2xl">
//               {t('Earn XP for meaningful activity. Unlock advanced features and climb to Legend status.')}
//             </p>
//           </div>

//           <div className="flex items-center gap-4">
//             <div className="text-right">
//               <div className="text-sm text-gray-400">{t('Current Points')}</div>
//               <div className="text-2xl font-semibold text-[#fbbf24] dark:text-darkMode-text">{formatPoints(currentPoints)} XP</div>
//             </div>

//             <button className="ml-2 inline-flex items-center gap-2 px-5 py-2 rounded-2xl bg-gradient-to-r from-[#5558f1] to-[#6b7bff] text-white font-semibold shadow-lg hover:scale-105 transition">
//               {t('Go to Dashboard')} <FaChevronRight />
//             </button>
//           </div>
//         </header>

//         {/* Main grid */}
//         <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Levels */}
//           <section className="lg:col-span-2">
//             <div className="bg-lightMode-menu dark:bg-darkMode-menu border border-gray-200 dark:border-gray-700 rounded-3xl p-6 shadow-xl backdrop-blur-md">
//               <div className="flex items-center justify-between mb-6">
//                 <h2 className="text-lg font-bold text-[#5558f1] dark:text-darkMode-text">
//                   {t('Your Level:')} {t(currentLevel.name)}
//                 </h2>
//                 <div className="text-sm text-gray-600 dark:text-gray-300">{t('Progress:')} {progressToNext}%</div>
//               </div>

//               <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-3 overflow-hidden mb-6">
//                 <motion.div
//                   initial={{ width: 0 }}
//                   animate={{ width: `${progressToNext}%` }}
//                   transition={{ duration: 0.8 }}
//                   className="h-3 bg-gradient-to-r from-[#5558f1] to-[#6b7bff]"
//                 />
//               </div>

//               {nextLevel && (
//                 <div className="text-center text-sm text-gray-600 dark:text-gray-300 mb-6">
//                   {t('You need')} <strong className="text-[#5558f1] dark:text-darkMode-text">{formatPoints(pointsRemaining)} XP</strong> {t('to reach')} <strong className="text-[#fbbf24] dark:text-darkMode-text2">{t(nextLevel.name)}</strong>
//                 </div>
//               )}

//               {/* Level Cards */}
//               <div className="space-y-6">
//                 {LEVELS.map((lvl, idx) => {
//                   const isCurrent = currentLevel.name === lvl.name
//                   const completed = currentPoints >= (lvl.max === Infinity ? Infinity : lvl.max + 1) && !isCurrent

//                   return (
//                     <motion.div
//                       key={lvl.name}
//                       initial={{ opacity: 0, y: 10 }}
//                       whileInView={{ opacity: 1, y: 0 }}
//                       viewport={{ once: true }}
//                       transition={{ delay: idx * 0.06 }}
//                       className={`relative p-5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-lightMode-menu dark:bg-darkMode-menu flex items-center gap-6 transition ${
//                         isCurrent ? 'ring-2 ring-[#5558f1]/50 dark:ring-darkMode-text/40' : ''
//                       }`}
//                     >
//                       <div className={`flex-shrink-0 w-20 h-20 rounded-xl flex items-center justify-center bg-gradient-to-br ${lvl.color} shadow-lg`}>
//                         {React.createElement(lvl.icon, { className: 'text-4xl text-white' })}
//                       </div>

//                       <div className="flex-1">
//                         <div className="flex items-start justify-between gap-4">
//                           <div>
//                             <h3 className="font-semibold text-xl">{t(lvl.name)}</h3>
//                             <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
//                               {lvl.min.toLocaleString()} - {lvl.max === Infinity ? '∞' : lvl.max.toLocaleString()} XP
//                             </div>
//                           </div>

//                           <div className="text-right">
//                             {isCurrent ? (
//                               <div className="text-sm px-3 py-1 rounded-full bg-[#5558f1]/10 text-[#5558f1] dark:text-darkMode-text font-medium">{t('Current')}</div>
//                             ) : completed ? (
//                               <div className="text-sm px-3 py-1 rounded-full bg-green-500/10 text-green-500 font-medium">{t('Unlocked')}</div>
//                             ) : (
//                               <div className="text-sm px-3 py-1 rounded-full bg-gray-300/20 text-gray-500 font-medium">{t('Locked')}</div>
//                             )}
//                           </div>
//                         </div>

//                         <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm">
//                           {t('Unlock new tools and perks as you level up!')}
//                         </p>

//                         {isCurrent && lvl.max !== Infinity && (
//                           <div className="mt-4">
//                             <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">{t('Progress to next level')}</div>
//                             <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
//                               <motion.div
//                                 initial={{ width: 0 }}
//                                 animate={{ width: `${progressToNext}%` }}
//                                 transition={{ duration: 0.8 }}
//                                 className="h-2 bg-gradient-to-r from-[#5558f1] to-[#6b7bff]"
//                               />
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </motion.div>
//                   )
//                 })}
//               </div>
//             </div>
//           </section>

//           {/* Sidebar */}
//           <aside>
//             <div className="sticky top-24 space-y-6">
//               <div className="bg-lightMode-menu dark:bg-darkMode-menu border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-lg">
//                 <h3 className="font-bold text-lg mb-3 text-[#5558f1] dark:text-darkMode-text">{t('How to Earn XP')}</h3>
//                 <div className="grid grid-cols-1 gap-3">
//                   {EARN_METHODS.map((m, i) => (
//                     <motion.div
//                       key={i}
//                       initial={{ opacity: 0, x: 8 }}
//                       whileInView={{ opacity: 1, x: 0 }}
//                       viewport={{ once: true }}
//                       transition={{ delay: i * 0.05 }}
//                       className="flex items-center justify-between gap-4 p-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
//                     >
//                       <div className="flex items-center gap-3">
//                         <div className="w-10 h-10 rounded-lg bg-[#5558f1]/10 text-[#5558f1] dark:text-darkMode-text flex items-center justify-center">
//                           {React.createElement(m.icon, { className: 'text-lg' })}
//                         </div>
//                         <div>
//                           <div className="text-sm font-medium">{t(m.text)}</div>
//                           <div className="text-xs text-gray-500 dark:text-gray-400">{m.points} XP</div>
//                         </div>
//                       </div>
//                     </motion.div>
//                   ))}
//                 </div>
//                 <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
//                   {t('Pro tip: Stay active and log in daily to keep your XP streak growing!')}
//                 </div>
//               </div>

//               <div className="bg-gradient-to-br from-[#5558f1] to-[#6b7bff] rounded-2xl p-6 shadow-xl text-white">
//                 <h4 className="font-bold text-xl mb-2">{t('Ready to climb?')}</h4>
//                 <p className="text-sm mb-4">
//                   {t('Complete actions, earn XP, and unlock exclusive perks at higher tiers.')}
//                 </p>
//                 <button className="w-full py-3 rounded-xl font-semibold bg-white/10 backdrop-blur-sm hover:scale-105 transition">
//                   {t('Complete tasks')} • <strong className="ml-2">{t('Earn +50 XP')}</strong>
//                 </button>
//               </div>
//             </div>
//           </aside>
//         </main>

//         {/* Footer CTA */}
//         <div className="mt-12">
//           <div className="rounded-3xl p-8 bg-lightMode-menu dark:bg-darkMode-menu border border-gray-200 dark:border-gray-700 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-6">
//             <div>
//               <h3 className="text-2xl font-bold text-[#5558f1] dark:text-darkMode-text">{t('Start gaining XP today')}</h3>
//               <p className="text-gray-600 dark:text-gray-400 mt-2">
//                 {t('Engage with the community and unlock exclusive profile features.')}
//               </p>
//             </div>

//             <div className="flex items-center gap-4">
//               <button className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#5558f1] to-[#6b7bff] font-semibold text-white shadow hover:scale-105 transition">
//                 {t('Do Tasks')}
//               </button>
//               <button className="px-6 py-3 rounded-2xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-gray-800/50 transition">
//                 {t('View Leaderboard')}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
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
    <div className="min-h-screen relative bg-gradient-to-b from-lightMode-bg to-lightMode-bg dark:from-[#0b0b0f] dark:to-[#12121a] text-lightMode-fg dark:text-darkMode-fg antialiased">
      {/* خلفية إضاءة ديناميكية */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(85,88,241,0.15),transparent_60%),radial-gradient(circle_at_80%_70%,rgba(251,191,36,0.1),transparent_60%)] pointer-events-none"></div>

      <div className="relative z-10 w-full px-6 py-20 max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-[#5558f1] to-indigo-600 shadow-lg">
                <FaStar className="text-white text-xl" />
              </span>
              {t('Level Up System')}
            </h1>
            <p className="mt-2 text-gray-500 dark:text-gray-400 max-w-2xl">
              {t('Earn XP for meaningful activity. Unlock advanced features and climb to Legend status.')}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-gray-400">{t('Current Points')}</div>
              <div className="text-2xl font-semibold text-[#fbbf24]">{formatPoints(currentPoints)} XP</div>
            </div>

            <button className="ml-2 inline-flex items-center gap-2 px-5 py-2 rounded-2xl bg-gradient-to-r from-[#5558f1] to-[#6b7bff] text-white font-semibold shadow-lg hover:scale-105 transition">
              {t('Go to Dashboard')} <FaChevronRight />
            </button>
          </div>
        </header>

        {/* Main grid */}
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className="lg:col-span-2">
            <div className="rounded-3xl p-6 shadow-xl backdrop-blur-xl border border-white/10 bg-white/10 dark:bg-[#1a1a1a]/60">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-[#5558f1]">{t('Your Level:')} {t(currentLevel.name)}</h2>
                <div className="text-sm text-gray-500">{t('Progress:')} {progressToNext}%</div>
              </div>

              <div className="w-full bg-gray-300/30 dark:bg-gray-700/40 rounded-full h-3 overflow-hidden mb-6">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressToNext}%` }}
                  transition={{ duration: 0.8 }}
                  className="h-3 bg-gradient-to-r from-[#5558f1] to-[#6b7bff]"
                />
              </div>

              {nextLevel && (
                <div className="text-center text-sm text-gray-500 mb-6">
                  {t('You need')} <strong className="text-[#5558f1]">{formatPoints(pointsRemaining)} XP</strong> {t('to reach')} <strong className="text-[#fbbf24]">{t(nextLevel.name)}</strong>
                </div>
              )}

              <div className="space-y-6">{renderedLevels}</div>
            </div>
          </section>

          {/* Sidebar */}
          <aside>
            <div className="sticky top-24 space-y-6">
              <div className="p-6 rounded-2xl shadow-xl bg-white/10 dark:bg-[#1a1a1a]/60 border border-white/20 backdrop-blur-xl">
                <h3 className="font-bold text-lg mb-3 text-[#5558f1]">{t('How to Earn XP')}</h3>
                <div className="grid grid-cols-1 gap-3">
                  {EARN_METHODS.map((m, i) => <EarnMethodCard key={i} m={m} i={i} t={t} />)}
                </div>
                <div className="mt-4 text-sm text-gray-500">{t('Pro tip: Stay active and log in daily to keep your XP streak growing!')}</div>
              </div>

              <div className="bg-gradient-to-br from-[#5558f1] to-[#6b7bff] rounded-2xl p-6 shadow-xl text-white">
                <h4 className="font-bold text-xl mb-2">{t('Ready to climb?')}</h4>
                <p className="text-sm mb-4">{t('Complete actions, earn XP, and unlock exclusive perks at higher tiers.')}</p>
                <button className="w-full py-3 rounded-xl font-semibold bg-white/10 hover:scale-105 transition">
                  {t('Complete tasks')} • <strong className="ml-2">{t('Earn +50 XP')}</strong>
                </button>
              </div>
            </div>
          </aside>
        </main>

        {/* Footer CTA */}
        <div className="mt-12">
          <div className="rounded-3xl p-8 bg-white/10 dark:bg-[#1a1a1a]/60 border border-white/10 backdrop-blur-xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold text-[#5558f1]">{t('Start gaining XP today')}</h3>
              <p className="text-gray-500 mt-2">{t('Engage with the community and unlock exclusive profile features.')}</p>
            </div>

            <div className="flex items-center gap-4">
              <button className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#5558f1] to-[#6b7bff] font-semibold text-white shadow hover:scale-105 transition">
                {t('Do Tasks')}
              </button>
              <button className="px-6 py-3 rounded-2xl border border-gray-300/40 text-gray-200 hover:bg-gray-200/10 transition">
                {t('View Leaderboard')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
