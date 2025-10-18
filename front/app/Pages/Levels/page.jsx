'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { FaUserGraduate, FaMedal, FaCrown, FaFireAlt, FaStar, FaTrophy, FaThumbsUp, FaCommentDots, FaShareAlt, FaPenNib, FaUserPlus, FaCalendarCheck } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'

const levels = [
  {
    name: 'Junior',
    color: 'from-purple-500 to-blue-500',
    points: '0 - 1999',
    badge: <FaUserGraduate className="text-5xl" />,
    rewards: [
      'Create posts and comments',
      'Follow other users',
      'React to posts'
    ]
  },
  {
    name: 'Challenger',
    color: 'from-blue-500 to-cyan-500',
    points: '2000 - 3999',
    badge: <FaMedal className="text-5xl" />,
    rewards: [
      'Upload images in posts',
      'Create one private community',
      'Access basic insights'
    ]
  },
  {
    name: 'Warrior',
    color: 'from-orange-500 to-yellow-500',
    points: '4000 - 6999',
    badge: <FaFireAlt className="text-5xl" />,
    rewards: [
      'Post short videos or Reels',
      'Add social links',
      'Report users or posts'
    ]
  },
  {
    name: 'Elite',
    color: 'from-teal-500 to-green-500',
    points: '7000 - 9999',
    badge: <FaStar className="text-5xl" />,
    rewards: [
      'Access advanced analytics',
      'Pin a post in your profile',
      'Elite badge next to your name'
    ]
  },
  {
    name: 'Master',
    color: 'from-indigo-500 to-violet-500',
    points: '10000 - 14999',
    badge: <FaTrophy className="text-5xl" />,
    rewards: [
      'Co-admin communities',
      'Post featured content',
      'Priority in search results'
    ]
  },
  {
    name: 'Legend',
    color: 'from-yellow-400 to-amber-600',
    points: '15000+',
    badge: <FaCrown className="text-5xl" />,
    rewards: [
      '✅ Blue verification badge',
      'Full profile customization',
      'Monetization and exclusive perks'
    ]
  }
]

const earnMethods = [
  { icon: <FaThumbsUp />, text: 'Like a post', points: '+5' },
  { icon: <FaCommentDots />, text: 'Comment on a post', points: '+10' },
  { icon: <FaShareAlt />, text: 'Share a post', points: '+20' },
  { icon: <FaPenNib />, text: 'Create a new post', points: '+50' },
  { icon: <FaUserPlus />, text: 'Gain a new follower', points: '+15' },
  { icon: <FaCalendarCheck />, text: 'Daily login', points: '+25' },
]

export default function LevelsPage() {
    const {t} = useTranslation()
  return (
    <div className="min-h-screen bg-lightMode-bg dark:bg-darkMode-bg text-lightMode-fg dark:text-darkMode-fg">
      {/* Hero Section */}
      <section className="text-center py-20 bg-gradient-to-r from-lightMode-text to-blue-400 dark:from-darkMode-text dark:to-darkMode-text2">
        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-bold text-white">
          {t("Level Up Your Journey")} 🚀
        </motion.h1>
        <p className="text-white/90 mt-4 text-lg">{t("Earn points by engaging, posting, and connecting with the community.")}</p>
      </section>

      {/* Levels Section */}
      <section className="max-w-6xl mx-auto py-16 px-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {levels.map((level, i) => (
          <motion.div
            key={level.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className={`bg-gradient-to-br ${level.color} text-white p-8 rounded-2xl shadow-xl flex flex-col items-center`}
          >
            <div className="mb-4">{level.badge}</div>
            <h3 className="text-2xl font-bold">{t(level.name)}</h3>
            <p className="text-sm mb-4">{t("Points")}: {level.points}</p>
            <ul className="text-left space-y-2 text-white/90">
              {level.rewards.map((r, idx) => (
                <li key={idx}>• {t(r)}</li>
              ))}
            </ul>
          </motion.div>
        ))}
      </section>

      {/* How to Earn Points */}
      <section className="bg-lightMode-menu dark:bg-darkMode-menu py-16">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-lightMode-text dark:text-darkMode-text mb-10">How to Earn Points</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {earnMethods.map((method, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.1 }} className="bg-white dark:bg-darkMode-bg rounded-xl shadow p-6 flex flex-col items-center">
                <div className="text-3xl text-lightMode-text dark:text-darkMode-text mb-3">{method.icon}</div>
                <p className="font-semibold">{t(method.text)}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{method.points} {t("XP")}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Rewards Section */}
      <section className="py-20 text-center max-w-4xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-lightMode-text dark:text-darkMode-text mb-6">{t("Rewards & Achievements")}</h2>
        <p className="text-lightMode-text2 dark:text-darkMode-text2 text-lg mb-10">
            {t(" Reach higher levels to unlock exclusive features, profile customization, analytics tools, and even the blue verification badge.")}
        </p>
        <motion.img
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          src="/images/blue-badge.png"
          alt="Blue Verification Badge"
          className="mx-auto w-32 h-32 mb-6"
        />
        <p className="text-lightMode-text2 dark:text-darkMode-text2">
          {t("The")} <strong>{t("Legend")}</strong> {t("level earns the")} <span className="text-blue-500">{t("Blue Verified Badge")}</span> {t("and access to monetization programs.")}
        </p>
      </section>

      {/* CTA */}
      <section className="text-center py-16 bg-gradient-to-r from-lightMode-text to-blue-400 dark:from-darkMode-text dark:to-darkMode-text2">
        <motion.h3 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6 }} className="text-3xl font-bold text-white mb-4">
          {t("Start Your Journey Now!")}
        </motion.h3>
        <button className="bg-white text-lightMode-text dark:text-darkMode-text font-semibold py-3 px-6 rounded-xl shadow hover:scale-105 transition">
          {t("Go to Dashboard")}
        </button>
      </section>
    </div>
  )
}
