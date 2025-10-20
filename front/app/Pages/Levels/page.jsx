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
} from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import { useGetData } from '@/app/Custome/useGetData'
import { useAuth } from '@/app/Context/AuthContext'

const LEVELS = [
  { name: 'Junior', min: 0, max: 1999, color: 'from-indigo-500 to-indigo-700', icon: FaUserGraduate },
  { name: 'Challenger', min: 2000, max: 3999, color: 'from-blue-500 to-cyan-500', icon: FaMedal },
  { name: 'Warrior', min: 4000, max: 6999, color: 'from-orange-400 to-yellow-400', icon: FaFireAlt },
  { name: 'Elite', min: 7000, max: 9999, color: 'from-teal-400 to-green-400', icon: FaStar },
  { name: 'Master', min: 10000, max: 14999, color: 'from-purple-600 to-violet-500', icon: FaTrophy },
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

function formatPoints(num) {
  return num.toLocaleString()
}

// تم تعديل هذه الدالة لتحديد المستوى بناءً على اسم المستوى المحفوظ في قاعدة البيانات
function getCurrentLevel(levelName) {
    return LEVELS.find((l) => l.name === levelName) || LEVELS[0]
}

export default function LevelsPage() {
  const { t } = useTranslation()
  const { user } = useAuth()
  // افتراض أن userData يحتوي على الخصائص المطلوبة
  const { userData } = useGetData(user?._id)

  // تحديد النقاط والمستوى الحالي من بيانات المستخدم
  const currentPoints = userData?.userLevelPoints || 0
  const userLevelRank = userData?.userLevelRank || LEVELS[0].name
  const nextLevelPoints = userData?.nextLevelPoints || LEVELS[1].min

  const currentLevel = useMemo(() => getCurrentLevel(userLevelRank), [userLevelRank])

  const progressToNext = useMemo(() => {
    if (currentLevel.max === Infinity) return 100 // إذا كان المستوى الحالي هو Legend
    
    // الحد الأدنى للمستوى الحالي
    const currentMin = currentLevel.min
    // الحد الأقصى للمستوى الحالي، وهو ما يُفترض أن يكون nextLevelPoints في السكيما لغير مستوى Legend
    const currentMax = nextLevelPoints 

    // إذا كانت النقاط الحالية أقل من الحد الأدنى للمستوى، نعيد 0 (حالة غير متوقعة إذا كانت البيانات صحيحة)
    if (currentPoints < currentMin) return 0
    
    // حساب المدى الكلي للنقاط في المستوى الحالي
    const range = currentMax - currentMin
    
    // إذا كان المدى صفرًا (مثل 0 - 0) لتجنب القسمة على صفر، نعيد 100
    if (range <= 0) return 100

    // النقاط التي تم كسبها في هذا المستوى
    const currentInRange = Math.max(0, currentPoints - currentMin)
    
    // حساب النسبة المئوية
    return Math.round((currentInRange / range) * 100)
  }, [currentLevel, currentPoints, nextLevelPoints])
  
  // لتبسيط عرض المستوى التالي، نجد المستوى التالي في مصفوفة LEVELS
  const nextLevelIndex = LEVELS.findIndex(l => l.name === currentLevel.name) + 1
  const nextLevel = nextLevelIndex < LEVELS.length ? LEVELS[nextLevelIndex] : null
  const requiredPointsForNextLevel = nextLevel ? nextLevel.min : currentPoints
  const pointsRemaining = nextLevel ? Math.max(0, requiredPointsForNextLevel - currentPoints) : 0


  return (
    <div className="min-h-screen bg-black text-white antialiased">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -left-32 -top-20 w-96 h-96 rounded-full blur-3xl opacity-25 bg-gradient-to-tr from-indigo-500 to-cyan-400"></div>
        <div className="absolute -right-32 -bottom-20 w-96 h-96 rounded-full blur-3xl opacity-20 bg-gradient-to-br from-yellow-400 to-orange-400"></div>
      </div>

      <div className="relative z-10 w-full px-6 py-20">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-lg">
                <FaStar className="text-white text-xl" />
              </span>
              {t('Level Up System')}
            </h1>
            <p className="mt-2 text-gray-300 max-w-2xl">
              {t('Earn XP for meaningful activity. Unlock advanced features and climb to Legend status.')}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-gray-400">{t('Current Points')}</div>
              {/* استخدام النقاط الديناميكية */}
              <div className="text-2xl font-semibold text-amber-400">{formatPoints(currentPoints)} XP</div>
            </div>

            <button className="ml-2 inline-flex items-center gap-2 px-5 py-2 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-300 text-black font-semibold shadow-lg hover:scale-105 transition">
              {t('Go to Dashboard')} <FaChevronRight />
            </button>
          </div>
        </header>

        {/* Main grid */}
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Levels */}
          <section className="lg:col-span-2">
            <div className="bg-gradient-to-b from-gray-900/50 to-gray-800/50 border border-gray-700 backdrop-blur-md rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                {/* عرض المستوى الحالي */}
                <h2 className="text-lg font-bold text-amber-400">{t('Your Level:')} {t(currentLevel.name)}</h2>
                <div className="text-sm text-gray-300">{t('Progress:')} {progressToNext}%</div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden mb-6">
                <motion.div
                  initial={{ width: 0 }}
                  // استخدام النسبة المئوية المحسوبة ديناميكياً
                  animate={{ width: `${progressToNext}%` }}
                  transition={{ duration: 0.8 }}
                  className="h-3 bg-gradient-to-r from-indigo-500 to-cyan-400"
                />
              </div>
              
              {/* رسالة النقاط المتبقية للمستوى التالي */}
              {nextLevel && (
                  <div className="text-center text-sm text-gray-300 mb-6">
                    {t('You need')} <strong className="text-cyan-400">{formatPoints(pointsRemaining)} XP</strong> {t('to reach')} <strong className="text-amber-400">{t(nextLevel.name)}</strong>
                  </div>
              )}


              {/* Level Cards */}
              <div className="space-y-6">
                {LEVELS.map((lvl, idx) => {
                  // تحديد حالة البطاقة بناءً على المستوى الديناميكي
                  const isCurrent = currentLevel.name === lvl.name
                  const completed = currentPoints >= (lvl.max === Infinity ? Infinity : lvl.max + 1) && !isCurrent
                  
                  // ملاحظة: تم تعديل شرط completed قليلاً ليتوافق مع طريقة تحديد المستوى في الدالة getCurrentLevel
                  // ولكن الاعتماد الأساسي هو على userLevelRank من السكيما.

                  return (
                    <motion.div
                      key={lvl.name}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.06 }}
                      className={`relative p-5 rounded-2xl border border-gray-700 bg-gray-900/60 backdrop-blur-md flex items-center gap-6 transition ${
                        isCurrent ? 'ring-2 ring-cyan-400/40' : ''
                      }`}
                    >
                      <div className={`flex-shrink-0 w-20 h-20 rounded-xl flex items-center justify-center bg-gradient-to-br ${lvl.color} shadow-lg`}>
                        {React.createElement(lvl.icon, { className: 'text-4xl text-white' })}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-semibold text-xl text-white">{t(lvl.name)}</h3>
                            <div className="text-sm text-gray-400 mt-1">
                              {lvl.min.toLocaleString()} - {lvl.max === Infinity ? '∞' : lvl.max.toLocaleString()} XP
                            </div>
                          </div>

                          <div className="text-right">
                            {isCurrent ? (
                              <div className="text-sm px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 font-medium">{t('Current')}</div>
                            ) : completed ? (
                              <div className="text-sm px-3 py-1 rounded-full bg-green-500/10 text-green-300 font-medium">{t('Unlocked')}</div>
                            ) : (
                              <div className="text-sm px-3 py-1 rounded-full bg-gray-600/20 text-gray-300 font-medium">{t('Locked')}</div>
                            )}
                          </div>
                        </div>

                        <p className="mt-3 text-gray-300 text-sm">
                          {t('Unlock new tools and perks as you level up!')}
                        </p>

                        {isCurrent && lvl.max !== Infinity && (
                          <div className="mt-4">
                            <div className="text-xs text-gray-400 mb-2">{t('Progress to next level')}</div>
                            <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                // استخدام النسبة المئوية المحسوبة ديناميكياً
                                animate={{ width: `${progressToNext}%` }}
                                transition={{ duration: 0.8 }}
                                className="h-2 bg-gradient-to-r from-indigo-400 to-cyan-300"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </section>

          {/* Sidebar */}
          <aside>
            <div className="sticky top-24 space-y-6">
              {/* How to earn XP */}
              <div className="bg-gray-900/60 border border-gray-700 rounded-2xl p-6 shadow-lg backdrop-blur-md">
                <h3 className="font-bold text-lg mb-3 text-amber-400">{t('How to Earn XP')}</h3>
                <div className="grid grid-cols-1 gap-3">
                  {EARN_METHODS.map((m, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 8 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center justify-between gap-4 p-3 rounded-lg bg-gray-800/50 border border-gray-700"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center text-amber-400">
                          {React.createElement(m.icon, { className: 'text-lg' })}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">{t(m.text)}</div>
                          <div className="text-xs text-gray-400">{m.points} XP</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-4 text-sm text-gray-400">
                  {t('Pro tip: Stay active and log in daily to keep your XP streak growing!')}
                </div>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-br from-indigo-600 to-cyan-500 rounded-2xl p-6 shadow-xl text-black">
                <h4 className="font-bold text-xl mb-2">{t('Ready to climb?')}</h4>
                <p className="text-sm mb-4">
                  {t('Complete actions, earn XP, and unlock exclusive perks at higher tiers.')}
                </p>
                <button className="w-full py-3 rounded-xl font-semibold bg-black/10 backdrop-blur-sm hover:scale-105 transition">
                  {t('Complete tasks')} • <strong className="ml-2">{t('Earn +50 XP')}</strong>
                </button>
              </div>
            </div>
          </aside>
        </main>

        {/* Footer CTA */}
        <div className="mt-12">
          <div className="rounded-3xl p-8 bg-gray-900/60 border border-gray-700 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold text-amber-400">{t('Start gaining XP today')}</h3>
              <p className="text-gray-300 mt-2">
                {t('Engage with the community and unlock exclusive profile features.')}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-400 font-semibold text-black shadow hover:scale-105 transition">
                {t('Do Tasks')}
              </button>
              <button className="px-6 py-3 rounded-2xl border border-gray-700 text-gray-200 hover:bg-gray-800/50 transition">
                {t('View Leaderboard')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}