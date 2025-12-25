'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  HiUsers,
  HiDocumentText,
  HiMusicalNote,
  HiFilm,
  HiGlobeAlt,
  HiSignal,
  HiArrowPath,
} from 'react-icons/hi2';
import { chartData } from '@/app/utils/Data';
import { useTranslation } from 'react-i18next';

const DashboardTab = React.memo(({ stats, loading, getAdminStats }) => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 w-full p-6 md:p-10 overflow-y-auto"
    >
      {/* 🎯 Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tighter text-gray-900 dark:text-white uppercase">
            {t('System')} <span className="text-indigo-500">{t('Overview')}</span>
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            {t("Real-time analytics and platform metrics")}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={getAdminStats}
          className="flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-4 rounded-2xl transition-all shadow-xl shadow-indigo-500/30 font-black text-[10px] uppercase tracking-widest"
        >
          <HiArrowPath className="w-4 h-4" />
          {t('Sync Data')}
        </motion.button>
      </div>

      {/* 📊 Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12"
      >
        <StatCard icon={<HiUsers />} title="Users" value={stats?.totalUsers} gradient="from-blue-500 to-blue-600" />
        <StatCard icon={<HiDocumentText />} title="Posts" value={stats?.totalPosts} gradient="from-green-500 to-green-600" />
        <StatCard icon={<HiGlobeAlt />} title="Communities" value={stats?.totalCommunities} gradient="from-purple-500 to-purple-600" />
        <StatCard icon={<HiMusicalNote />} title="Music" value={stats?.totalMusic} gradient="from-pink-500 to-pink-600" />
        <StatCard icon={<HiFilm />} title="Reels" value={stats?.totalReels} gradient="from-rose-500 to-rose-600" />
        <StatCard icon={<HiSignal />} title="Today's Posts" value={stats?.todayPosts} gradient="from-orange-500 to-orange-600" />
      </motion.div>

      {/* 📈 Chart Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white/70 dark:bg-white/[0.02] backdrop-blur-3xl p-8 rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-2xl"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
            <HiSignal className="w-6 h-6 text-indigo-500" />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-tighter text-gray-900 dark:text-white">
              {t('Weekly Activity')}
            </h2>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              {t('Post Distribution')}
            </p>
          </div>
        </div>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <defs>
                <linearGradient id="colorPosts" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(156,163,175,0.1)" />
              <XAxis
                dataKey="name"
                stroke="rgba(156,163,175,0.5)"
                style={{ fontSize: '12px', fontWeight: 'bold' }}
              />
              <YAxis
                stroke="rgba(156,163,175,0.5)"
                style={{ fontSize: '12px', fontWeight: 'bold' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.9)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  fontWeight: 'bold'
                }}
              />
              <Line
                type="monotone"
                dataKey="posts"
                stroke="#6366F1"
                strokeWidth={3}
                fill="url(#colorPosts)"
                dot={{ fill: '#6366F1', strokeWidth: 2, r: 5 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </motion.div>
  );
});

DashboardTab.displayName = 'DashboardTab';

const StatCard = React.memo(({ icon, title, value, gradient }) => {
  const { t } = useTranslation();

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -4 }}
      className="relative group bg-white/70 dark:bg-white/[0.02] backdrop-blur-3xl p-6 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-xl transition-all overflow-hidden"
    >
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2`} />

      <div className="relative flex flex-col items-center justify-center text-center space-y-3">
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg`}>
          {React.cloneElement(icon, { className: 'w-7 h-7' })}
        </div>
        <p className="text-3xl font-black text-gray-900 dark:text-white tabular-nums">
          {value ?? '--'}
        </p>
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
          {t(title)}
        </p>
      </div>
    </motion.div>
  );
});

StatCard.displayName = 'StatCard';
export default DashboardTab;