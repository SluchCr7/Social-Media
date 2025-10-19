'use client'

import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  FaUserGraduate,
  FaMedal,
  FaCrown,
  FaFireAlt,
  FaStar,
  FaTrophy,
  FaThumbsUp,
  FaCommentDots,
  FaShareAlt,
  FaPenNib,
  FaUserPlus,
  FaCalendarCheck,
  FaChevronRight,
  FaSparkles
} from 'react-icons/fa'
import { useTranslation } from 'react-i18next'

/*
  LevelsPage.Dark.Design.jsx
  - نسخة Dark Modern Futuristic من صفحة الـ Levels
  - متطلب: TailwindCSS + Framer Motion + react-icons
  - استبدل/مرر currentPoints كمعلومة حقيقية من الـ backend لتفعيل الـ progress.
*/

const LEVELS = [
  { name: 'Junior', min: 0, max: 1999, color: 'from-violet-600 to-indigo-500', icon: <FaUserGraduate className="text-4xl" /> },
  { name: 'Challenger', min: 2000, max: 3999, color: 'from-blue-500 to-cyan-400', icon: <FaMedal className="text-4xl" /> },
  { name: 'Warrior', min: 4000, max: 6999, color: 'from-orange-400 to-yellow-400', icon: <FaFireAlt className="text-4xl" /> },
  { name: 'Elite', min: 7000, max: 9999, color: 'from-teal-400 to-green-400', icon: <FaStar className="text-4xl" /> },
  { name: 'Master', min: 10000, max: 14999, color: 'from-indigo-600 to-purple-600', icon: <FaTrophy className="text-4xl" /> },
  { name: 'Legend', min: 15000, max: Infinity, color: 'from-yellow-400 to-amber-500', icon: <FaCrown className="text-4xl" /> }
]

const EARN_METHODS = [
  { icon: <FaThumbsUp />, text: 'Like a post', points: 5 },
  { icon: <FaCommentDots />, text: 'Comment on a post', points: 10 },
  { icon: <FaShareAlt />, text: 'Share a post', points: 20 },
  { icon: <FaPenNib />, text: 'Create a post', points: 50 },
  { icon: <FaUserPlus />, text: 'Gain a follower', points: 15 },
  { icon: <FaCalendarCheck />, text: 'Daily login', points: 25 }
]

function formatPoints(num) {
  return num.toLocaleString()
}

function getCurrentLevel(points) {
  return LEVELS.find((l) => points >= l.min && points <= (l.max === Infinity ? Infinity : l.max)) || LEVELS[0]
}

export default function LevelsPage({ currentPoints = 3625 }) {
  const { t } = useTranslation ? useTranslation() : { t: (s) => s }

  const currentLevel = useMemo(() => getCurrentLevel(currentPoints), [currentPoints])

  const progressToNext = useMemo(() => {
    const lvl = currentLevel
    if (lvl.max === Infinity) return 100
    const range = lvl.max - lvl.min
    const currentInRange = Math.max(0, Math.min(currentPoints - lvl.min, range))
    return Math.round((currentInRange / range) * 100)
  }, [currentLevel, currentPoints])

  return (
    <div className="min-h-screen bg-[#071027] text-[#e6eef8] antialiased">
      {/* Background mesh + glowing shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -left-32 -top-20 w-96 h-96 rounded-full blur-3xl opacity-30 bg-gradient-to-tr from-[#7c3aed] to-[#06b6d4]"></div>
        <div className="absolute -right-32 -bottom-20 w-96 h-96 rounded-full blur-3xl opacity-20 bg-gradient-to-br from-[#f59e0b] to-[#ef4444]"></div>
      </div>

      {/* Content wrapper */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-lg">
                <FaSparkles className="text-white text-xl" />
              </span>
              {t('Level Up — Dark Edition')}
            </h1>
            <p className="mt-2 text-gray-300 max-w-2xl">
              {t('Earn XP for meaningful activity. Unlock advanced features and climb to Legend status.')}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-gray-400">{t('Current Points')}</div>
              <div className="text-2xl font-semibold">{formatPoints(currentPoints)} XP</div>
            </div>

            <button className="ml-2 inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-black font-semibold shadow-lg hover:scale-105 transition">
              {t('Go to Dashboard')} <FaChevronRight />
            </button>
          </div>
        </header>

        {/* Main grid */}
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Timeline / Levels list */}
          <section className="lg:col-span-2">
            <div className="bg-gradient-to-b from-white/3 to-white/2 border border-white/6 backdrop-blur-md rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold">{t('Levels')}</h2>
                <div className="text-sm text-gray-300">{t('Progress:')} {progressToNext}%</div>
              </div>

              {/* Horizontal progress bar */}
              <div className="w-full bg-white/6 rounded-full h-3 overflow-hidden mb-6">
                <motion.div initial={{ width: 0 }} animate={{ width: `${progressToNext}%` }} transition={{ duration: 0.8 }} className="h-3 bg-gradient-to-r from-indigo-500 to-cyan-400 shadow-sm" />
              </div>

              {/* Levels as cards (timeline) */}
              <div className="space-y-6">
                {LEVELS.map((lvl, idx) => {
                  const isCurrent = currentLevel.name === lvl.name
                  const completed = currentPoints >= lvl.max && lvl.max !== Infinity
                  return (
                    <motion.div key={lvl.name} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.06 }} className={`relative p-5 rounded-2xl border border-white/6 backdrop-blur-md overflow-hidden flex items-center gap-6 ${isCurrent ? 'ring-2 ring-cyan-400/40' : ''}`}>

                      <div className={`flex-shrink-0 w-20 h-20 rounded-xl flex items-center justify-center bg-gradient-to-br ${lvl.color} shadow-2xl transform transition-transform group-hover:scale-105`}>
                        {lvl.icon}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-semibold text-xl">{t(lvl.name)}</h3>
                            <div className="text-sm text-gray-300 mt-1">{lvl.min.toLocaleString()} - {lvl.max === Infinity ? '∞' : lvl.max.toLocaleString()} XP</div>
                          </div>

                          <div className="text-right">
                            {isCurrent ? (
                              <div className="text-sm px-3 py-1 rounded-full bg-white/6 text-cyan-200 font-medium">{t('Current')}</div>
                            ) : completed ? (
                              <div className="text-sm px-3 py-1 rounded-full bg-white/6 text-green-300 font-medium">{t('Unlocked')}</div>
                            ) : (
                              <div className="text-sm px-3 py-1 rounded-full bg-white/6 text-gray-300 font-medium">{t('Locked')}</div>
                            )}
                          </div>
                        </div>

                        <p className="mt-3 text-gray-300 text-sm">
                          {t('Unlock perks and tools as you climb.')} {/* you can change text per level */}
                        </p>

                        {/* small CTA for this level: show progress inside */}

                        {isCurrent && lvl.max !== Infinity && (
                          <div className="mt-4">
                            <div className="text-xs text-gray-400 mb-2">{t('Progress to next level')}</div>
                            <div className="w-full bg-white/6 rounded-full h-2 overflow-hidden">
                              <motion.div initial={{ width: 0 }} animate={{ width: `${progressToNext}%` }} transition={{ duration: 0.8 }} className="h-2 bg-gradient-to-r from-indigo-400 to-green-300" />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* subtle decorative border glow */}
                      <div className="absolute -inset-px rounded-2xl pointer-events-none" style={{ boxShadow: isCurrent ? '0 10px 30px rgba(6,182,212,0.12)' : 'none' }} />
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </section>

          {/* Right: How to earn + CTA summary */}
          <aside>
            <div className="sticky top-24 space-y-6">
              <div className="bg-gradient-to-b from-white/3 to-white/2 border border-white/6 backdrop-blur-md rounded-2xl p-6 shadow-xl">
                <h3 className="font-bold text-lg mb-3">{t('How to Earn XP')}</h3>
                <div className="grid grid-cols-1 gap-3">
                  {EARN_METHODS.map((m, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: 8 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="flex items-center justify-between gap-4 p-3 rounded-lg bg-white/3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/6 flex items-center justify-center">{m.icon}</div>
                        <div>
                          <div className="text-sm font-medium">{t(m.text)}</div>
                          <div className="text-xs text-gray-400">{m.points} XP</div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-300">+</div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-4 text-sm text-gray-400">{t('Pro tip: Consistency rewards — login daily to keep your streak alive.')}</div>
              </div>

              {/* CTA card */}
              <div className="bg-gradient-to-br from-indigo-600 to-cyan-500 rounded-2xl p-6 shadow-2xl text-black">
                <h4 className="font-bold text-xl mb-2">{t('Ready to climb?')}</h4>
                <p className="text-sm mb-4">{t('Complete actions, earn XP, and unlock exclusive perks for higher tiers.')}</p>
                <button className="w-full py-3 rounded-xl font-semibold bg-black/10 backdrop-blur-sm hover:scale-105 transition">
                  {t('Complete tasks')} • <strong className="ml-2">{t('Earn +50 XP')}</strong>
                </button>
              </div>

              {/* small badge preview */}
              <div className="bg-white/3 rounded-2xl p-5 border border-white/6 backdrop-blur-md">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg">
                    <FaCrown className="text-black text-2xl" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-300">{t('Next Reward')}</div>
                    <div className="font-semibold">{t('Blue Verification Badge at Legend')}</div>
                    <div className="text-xs text-gray-400 mt-1">{t('Reach 15,000 XP to unlock.')}</div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </main>

        {/* Bottom CTA strip */}
        <div className="mt-12">
          <div className="rounded-3xl p-8 bg-gradient-to-br from-white/3 to-transparent border border-white/6 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold">{t('Start gaining XP today')}</h3>
              <p className="text-gray-300 mt-2">{t('Engage with the community and unlock exclusive profile features.')}</p>
            </div>

            <div className="flex items-center gap-4">
              <button className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-400 font-semibold text-black shadow hover:scale-105 transition">{t('Do Tasks')}</button>
              <button className="px-6 py-3 rounded-2xl border border-white/6 text-gray-200">{t('View Leaderboard')}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
