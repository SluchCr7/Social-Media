'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';
import { FaDownload, FaCalendarAlt, FaChartLine, FaFire, FaTrophy } from 'react-icons/fa';
import { TrendingUp, Users, Heart, MessageCircle } from 'lucide-react';
import OverviewCard from '@/app/Component/OverviewCard';
import { useTranslation } from 'react-i18next';

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];
const formatNumber = (v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v);

function AnalyticsPresentation({
  userData, user, followers, userPosts,
  totalLikes, totalComments, engagementRate,
  timeSeries, topPosts, peakHours, engagement,
  exporting, exportCSV, period, setPeriod
}) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-300">
      {/* Decorative background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative p-6 max-w-7xl mx-auto w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg">
                <FaChartLine className="text-white text-2xl" />
              </div>
              <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t("Analytics")}
              </h1>
            </div>
            <p className="text-base text-gray-600 dark:text-gray-400">
              {t("Quick overview of")}{" "}
              <span className="font-bold text-gray-900 dark:text-white">
                {userData?.username || user?.email}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-3 border border-white/20 dark:border-gray-700/30 shadow-lg">
              <FaCalendarAlt className="text-blue-600 dark:text-blue-400" />
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="bg-transparent outline-none text-sm font-medium text-gray-900 dark:text-white cursor-pointer"
              >
                <option value="7">{t("Last 7 days")}</option>
                <option value="30">{t("Last 30 days")}</option>
                <option value="90">{t("Last 90 days")}</option>
              </select>
            </div>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={exportCSV}
              disabled={exporting}
              className="px-5 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-2xl shadow-lg flex items-center gap-2 text-sm font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaDownload />
              {exporting ? t("Exporting...") : t("Export CSV")}
            </motion.button>
          </div>
        </motion.div>

        {/* Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <OverviewCard title={t("Posts")} value={userPosts.length} formatNumber={formatNumber} />
          <OverviewCard title={t("Followers")} value={followers.length} formatNumber={formatNumber} />
          <OverviewCard title={t("Likes")} value={totalLikes} formatNumber={formatNumber} />
          <OverviewCard title={`${t("Engagement")} %`} value={Number(engagementRate)} formatNumber={formatNumber} />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Activity Line Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="lg:col-span-2 relative p-6 rounded-3xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 shadow-xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10">
                  <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                  {t("Activity Over Time")}
                </h4>
              </div>
              <div style={{ height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timeSeries}>
                    <XAxis dataKey="date" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{
                        background: 'rgba(255, 255, 255, 0.9)',
                        border: '1px solid rgba(229, 231, 235, 0.5)',
                        borderRadius: '12px',
                        backdropFilter: 'blur(10px)',
                        color: '#111827'
                      }}
                      labelStyle={{ color: '#3b82f6', fontWeight: 'bold' }}
                    />
                    <Line dataKey="posts" stroke={COLORS[0]} dot={false} strokeWidth={3} />
                    <Line dataKey="likes" stroke={COLORS[1]} dot={false} strokeWidth={3} />
                    <Line dataKey="comments" stroke={COLORS[2]} dot={false} strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>

          {/* Engagement Pie */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="relative p-6 rounded-3xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 shadow-xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-blue-500/5" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10">
                  <FaFire className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                  {t("Engagement")}
                </h4>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={engagement} dataKey="value" nameKey="name" outerRadius={70} innerRadius={35}>
                    {engagement.map((e, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Posts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 relative p-6 rounded-3xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 shadow-xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-yellow-500/5 to-orange-500/5" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500/10 to-yellow-500/10">
                  <FaTrophy className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                  {t("Top Posts")}
                </h4>
              </div>
              {topPosts.length ? topPosts.map((p) => {
                const score = (p.likes?.length || 0) + (p.comments?.length || 0) * 2;
                const maxScore = Math.max(...topPosts.map(tp => (tp.likes?.length || 0) + (tp.comments?.length || 0) * 2), 1);
                return (
                  <motion.div
                    key={p._id}
                    whileHover={{ scale: 1.01, x: 5 }}
                    className="flex items-center justify-between p-4 mb-3 bg-gradient-to-r from-white/50 to-white/30 dark:from-gray-700/50 dark:to-gray-800/30 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-600/30 transition"
                  >
                    <div className="flex-1 pr-4">
                      <div className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                        {p.text || p.caption || '—'}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400 mt-2">
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3" /> {p.likes?.length || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-3 h-3" /> {p.comments?.length || 0}
                        </span>
                      </div>
                    </div>
                    <div className="w-36 flex items-center gap-3">
                      <div className="text-sm font-bold text-blue-600 dark:text-blue-400">{score}</div>
                      <div className="w-full h-2 bg-gray-200/50 dark:bg-gray-700/50 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(score / maxScore) * 100}%` }}
                          transition={{ duration: 0.5 }}
                          className="h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              }) : (
                <div className="text-center text-gray-500 dark:text-gray-400 py-12">
                  {t("No posts yet")}
                </div>
              )}
            </div>
          </motion.div>

          {/* Peak Hours */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative p-6 rounded-3xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 shadow-xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-emerald-500/5 to-teal-500/5" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10">
                  <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                  {t("Peak Hours")}
                </h4>
              </div>
              <div className="grid grid-cols-12 gap-1 h-36 px-2">
                {Array.from({ length: 24 }).map((_, h) => {
                  const max = Math.max(...Object.values(peakHours || {}), 1);
                  const value = peakHours[h] || 0;
                  return (
                    <div key={h} className="flex flex-col items-center text-xs text-gray-600 dark:text-gray-400">
                      <div
                        className="w-full rounded-sm transition-all hover:opacity-80"
                        style={{
                          height: `${(value / max) * 100}%`,
                          background: 'linear-gradient(180deg, #3b82f6, #8b5cf6)',
                        }}
                      />
                      <div className="mt-1 font-medium">{h}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(AnalyticsPresentation);