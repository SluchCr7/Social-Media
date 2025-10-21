'use client'

import React from 'react'
import { motion } from 'framer-motion'
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts'
import { FaDownload, FaCalendarAlt } from 'react-icons/fa'
import OverviewCard from '@/app/Component/OverviewCard'
import { useTranslation } from 'react-i18next'

const COLORS = ['#5558f1', '#6b7bff', '#fbbf24', '#facc15', '#fb7185']
const formatNumber = (v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v)

export default function AnalyticsPresentation({
  userData, user, followers, userPosts,
  totalLikes, totalComments, engagementRate,
  timeSeries, topPosts, peakHours, engagement,
  exporting, exportCSV, period, setPeriod
}) {
  const { t } = useTranslation()

  return (
    <div className="p-6 max-w-7xl mx-auto w-full 
      bg-lightMode-bg dark:bg-darkMode-bg 
      text-lightMode-fg dark:text-darkMode-fg transition-colors duration-300">

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-lightMode-text dark:text-darkMode-text">
            {t("Analytics")}
          </h1>
          <p className="text-sm text-lightMode-text2 dark:text-darkMode-text2 mt-1">
            {t("Quick overview of")}{" "}
            <span className="font-semibold text-lightMode-text dark:text-darkMode-text">
              {userData?.username || user?.email}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-lightMode-menu dark:bg-darkMode-menu rounded-lg p-2 border border-gray-200 dark:border-gray-700">
            <FaCalendarAlt className="text-lightMode-text2 dark:text-darkMode-text2" />
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="bg-transparent outline-none text-sm text-lightMode-text2 dark:text-darkMode-text2"
            >
              <option value="7">{t("Last 7 days")}</option>
              <option value="30">{t("Last 30 days")}</option>
              <option value="90">{t("Last 90 days")}</option>
            </select>
          </div>
          <button
            onClick={exportCSV}
            disabled={exporting}
            className="px-3 py-2 bg-lightMode-text dark:bg-darkMode-text 
              hover:opacity-90 rounded-lg shadow-md flex items-center gap-2 text-sm text-white transition"
          >
            <FaDownload />
            {exporting ? t("Exporting...") : t("Export CSV")}
          </button>
        </div>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <OverviewCard title={t("Posts")} value={userPosts.length} formatNumber={formatNumber} />
        <OverviewCard title={t("Followers")} value={followers.length} formatNumber={formatNumber} />
        <OverviewCard title={t("Likes")} value={totalLikes} formatNumber={formatNumber} />
        <OverviewCard title={`${t("Engagement")} %`} value={Number(engagementRate)} formatNumber={formatNumber} />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Activity Line Chart */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="lg:col-span-2 p-4 rounded-2xl 
            bg-lightMode-menu dark:bg-darkMode-menu 
            border border-gray-200 dark:border-gray-700 shadow-sm"
        >
          <h4 className="text-lg font-semibold mb-2 text-lightMode-text dark:text-darkMode-text">
            {t("Activity Over Time")}
          </h4>
          <div style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeSeries}>
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    background: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    color: '#111827'
                  }}
                  labelStyle={{ color: '#5558f1' }}
                />
                <Line dataKey="posts" stroke={COLORS[0]} dot={false} strokeWidth={2} />
                <Line dataKey="likes" stroke={COLORS[1]} dot={false} strokeWidth={2} />
                <Line dataKey="comments" stroke={COLORS[2]} dot={false} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Engagement Pie */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="p-4 rounded-2xl 
            bg-lightMode-menu dark:bg-darkMode-menu 
            border border-gray-200 dark:border-gray-700 shadow-sm"
        >
          <h4 className="text-lg font-semibold mb-2 text-lightMode-text dark:text-darkMode-text">
            {t("Engagement")}
          </h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={engagement} dataKey="value" nameKey="name" outerRadius={70} innerRadius={35}>
                {engagement.map((e, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Top Posts */}
        <div className="lg:col-span-2 p-4 rounded-2xl 
          bg-lightMode-menu dark:bg-darkMode-menu 
          border border-gray-200 dark:border-gray-700 shadow-sm">
          <h4 className="text-lg font-semibold mb-3 text-lightMode-text dark:text-darkMode-text">
            {t("Top Posts")}
          </h4>
          {topPosts.length ? topPosts.map((p) => {
            const score = (p.likes?.length || 0) + (p.comments?.length || 0) * 2
            const maxScore = Math.max(...topPosts.map(tp => (tp.likes?.length || 0) + (tp.comments?.length || 0) * 2), 1)
            return (
              <div
                key={p._id}
                className="flex items-center justify-between p-3 mb-2 
                  bg-gray-100 dark:bg-gray-800/40 rounded-xl transition"
              >
                <div className="flex-1 pr-4">
                  <div className="truncate text-sm font-medium text-lightMode-fg dark:text-darkMode-fg">
                    {p.text || p.caption || '—'}
                  </div>
                  <div className="text-xs text-lightMode-text2 dark:text-darkMode-text2 mt-1">
                    {p.likes?.length || 0} {t("likes")} • {p.comments?.length || 0} {t("comments")}
                  </div>
                </div>
                <div className="w-36 flex items-center gap-3">
                  <div className="text-sm font-semibold text-lightMode-text dark:text-darkMode-text">{score}</div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-2 bg-lightMode-text dark:bg-darkMode-text rounded-full"
                      style={{ width: `${(score / maxScore) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            )
          }) : (
            <div className="text-sm text-lightMode-text2 dark:text-darkMode-text2">
              {t("No posts yet")}
            </div>
          )}
        </div>

        {/* Peak Hours */}
        <div className="p-4 rounded-2xl 
          bg-lightMode-menu dark:bg-darkMode-menu 
          border border-gray-200 dark:border-gray-700 shadow-sm">
          <h4 className="text-lg font-semibold mb-3 text-lightMode-text dark:text-darkMode-text">
            {t("Peak Hours")}
          </h4>
          <div className="grid grid-cols-7 gap-1 h-36 px-2">
            {Array.from({ length: 24 }).map((_, h) => {
              const max = Math.max(...Object.values(peakHours || {}), 1)
              const value = peakHours[h] || 0
              return (
                <div key={h} className="flex flex-col items-center text-xs text-lightMode-text2 dark:text-darkMode-text2">
                  <div
                    className="w-4 rounded-sm"
                    style={{
                      height: `${(value / max) * 100}%`,
                      background: 'linear-gradient(180deg, #5558f1, #6b7bff)',
                    }}
                  />
                  <div className="mt-1">{h}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
