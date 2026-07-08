'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import {
  HiUsers,
  HiDocumentText,
  HiMusicalNote,
  HiFilm,
  HiGlobeAlt,
  HiSignal,
  HiArrowPath,
  HiExclamationTriangle,
  HiCpuChip,
  HiServer,
  HiClock,
  HiSquare3Stack3D,
} from 'react-icons/hi2';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

const DashboardTab = React.memo(({ stats, loading, getAdminStats }) => {
  const { t } = useTranslation();

  // Helper to format seconds into readable uptime (e.g. 2h 45m)
  const formatUptime = (seconds) => {
    if (!seconds) return '0s';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins}m`;
  };

  // Safe fallback for chart data
  const chartData = useMemo(() => {
    return stats?.chartData || [
      { name: 'Mon', posts: 0, users: 0, reels: 0 },
      { name: 'Tue', posts: 0, users: 0, reels: 0 },
      { name: 'Wed', posts: 0, users: 0, reels: 0 },
      { name: 'Thu', posts: 0, users: 0, reels: 0 },
      { name: 'Fri', posts: 0, users: 0, reels: 0 },
      { name: 'Sat', posts: 0, users: 0, reels: 0 },
      { name: 'Sun', posts: 0, users: 0, reels: 0 },
    ];
  }, [stats?.chartData]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 w-full p-6 md:p-10 space-y-10"
    >
      {/* 🎯 Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tighter text-gray-900 dark:text-white uppercase">
            {t('System')} <span className="text-indigo-500">{t('Overview')}</span>
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            {t("Real-time database analytics and server telemetry")}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={getAdminStats}
          disabled={loading}
          className="flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-4 rounded-2xl transition-all shadow-xl shadow-indigo-500/30 font-black text-[10px] uppercase tracking-widest disabled:opacity-50"
        >
          <HiArrowPath className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          {t('Sync Data')}
        </motion.button>
      </div>

      {/* 📊 Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-5"
      >
        <StatCard icon={<HiUsers />} title="Users" value={stats?.totalUsers} gradient="from-blue-500 to-indigo-600" />
        <StatCard icon={<HiDocumentText />} title="Posts" value={stats?.totalPosts} gradient="from-emerald-500 to-teal-600" />
        <StatCard icon={<HiExclamationTriangle />} title="Reports" value={stats?.pendingReports} gradient="from-rose-500 to-red-600" />
        <StatCard icon={<HiGlobeAlt />} title="Communities" value={stats?.totalCommunities} gradient="from-fuchsia-500 to-purple-600" />
        <StatCard icon={<HiMusicalNote />} title="Music" value={stats?.totalMusic} gradient="from-pink-500 to-rose-600" />
        <StatCard icon={<HiFilm />} title="Reels" value={stats?.totalReels} gradient="from-violet-500 to-indigo-600" />
        <StatCard icon={<HiSignal />} title="Today's Posts" value={stats?.todayPosts} gradient="from-amber-500 to-orange-600" />
      </motion.div>

      {/* 📈 Charts & System Health Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Weekly Activity Area Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="xl:col-span-2 bg-white dark:bg-[#0A0A0A] p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-xl relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                <HiSignal className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-black uppercase tracking-tighter text-gray-900 dark:text-white">
                  {t('Weekly Performance')}
                </h2>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  {t('User registration & content creation metrics')}
                </p>
              </div>
            </div>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorPosts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorReels" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(156,163,175,0.07)" />
                <XAxis
                  dataKey="name"
                  stroke="rgba(156,163,175,0.5)"
                  style={{ fontSize: '11px', fontWeight: 'bold' }}
                  tickLine={false}
                />
                <YAxis
                  stroke="rgba(156,163,175,0.5)"
                  style={{ fontSize: '11px', fontWeight: 'bold' }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(10, 10, 10, 0.95)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '16px',
                    fontWeight: 'bold',
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
                  }}
                  itemStyle={{ fontSize: '12px' }}
                  labelStyle={{ color: '#fff', fontSize: '12px', marginBottom: '4px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '15px', fontSize: '11px', fontWeight: 'bold' }} />
                <Area
                  name={t("Posts")}
                  type="monotone"
                  dataKey="posts"
                  stroke="#10B981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorPosts)"
                />
                <Area
                  name={t("Users")}
                  type="monotone"
                  dataKey="users"
                  stroke="#6366F1"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorUsers)"
                />
                <Area
                  name={t("Reels")}
                  type="monotone"
                  dataKey="reels"
                  stroke="#8B5CF6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorReels)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Server & OS Health */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white dark:bg-[#0A0A0A] p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-xl relative overflow-hidden flex flex-col justify-between"
        >
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                <HiServer className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h2 className="text-xl font-black uppercase tracking-tighter text-gray-900 dark:text-white">
                  {t('Server Diagnostics')}
                </h2>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  {t('Hardware and OS metrics')}
                </p>
              </div>
            </div>

            {/* RAM Progress Indicator */}
            <div className="space-y-3 mb-8">
              <div className="flex justify-between items-center text-xs font-black uppercase tracking-wider text-gray-500">
                <span>{t("Memory Load")}</span>
                <span className="text-indigo-500 font-extrabold">{stats?.system?.memoryUsage || '0.0'}%</span>
              </div>
              <div className="w-full h-4 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden p-0.5 border border-gray-200 dark:border-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${stats?.system?.memoryUsage || 0}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"
                />
              </div>
            </div>

            {/* Hardware details grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5">
                <div className="flex items-center gap-2.5 text-xs text-gray-400 font-bold mb-1 uppercase tracking-wider">
                  <HiCpuChip className="w-4 h-4 text-indigo-500" />
                  <span>CPU Cores</span>
                </div>
                <p className="text-lg font-black text-gray-900 dark:text-white">{stats?.system?.cpuCores || '--'}</p>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5">
                <div className="flex items-center gap-2.5 text-xs text-gray-400 font-bold mb-1 uppercase tracking-wider">
                  <HiSquare3Stack3D className="w-4 h-4 text-purple-500" />
                  <span>Platform</span>
                </div>
                <p className="text-lg font-black text-gray-900 dark:text-white capitalize">{stats?.system?.platform || '--'}</p>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5">
                <div className="flex items-center gap-2.5 text-xs text-gray-400 font-bold mb-1 uppercase tracking-wider">
                  <HiClock className="w-4 h-4 text-emerald-500" />
                  <span>Host Uptime</span>
                </div>
                <p className="text-lg font-black text-gray-900 dark:text-white">{formatUptime(stats?.system?.osUptime)}</p>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5">
                <div className="flex items-center gap-2.5 text-xs text-gray-400 font-bold mb-1 uppercase tracking-wider">
                  <HiClock className="w-4 h-4 text-pink-500" />
                  <span>Node Uptime</span>
                </div>
                <p className="text-lg font-black text-gray-900 dark:text-white">{formatUptime(stats?.system?.processUptime)}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 📋 Recent Activity Feed & Audits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Registrations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white dark:bg-[#0A0A0A] p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-xl relative overflow-hidden"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
              <HiUsers className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tighter text-gray-900 dark:text-white">
                {t('Recent Registrations')}
              </h2>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                {t('Latest joined community members')}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {stats?.recentUsers?.length > 0 ? (
              stats.recentUsers.map((user) => (
                <div key={user._id} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 hover:border-blue-500/20 transition-all text-xs md:text-sm">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-11 h-11 rounded-xl overflow-hidden relative border-2 border-gray-200 dark:border-white/10 flex-shrink-0">
                      <Image
                        src={user.profilePhoto?.url || '/default-profile.png'}
                        alt={user.username}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-gray-900 dark:text-white truncate">{user.username}</p>
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 whitespace-nowrap">
                    {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400 text-center py-10 font-medium">{t("No users found")}</p>
            )}
          </div>
        </motion.div>

        {/* Recent Audit/Reports */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white dark:bg-[#0A0A0A] p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-xl relative overflow-hidden"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500">
              <HiExclamationTriangle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tighter text-gray-900 dark:text-white">
                {t('Pending Audits')}
              </h2>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                {t('Latest reported items requiring attention')}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {stats?.recentReports?.length > 0 ? (
              stats.recentReports.map((report) => (
                <div key={report._id} className="p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 flex flex-col gap-2 hover:border-rose-500/20 transition-all">
                  <div className="flex justify-between items-start gap-4 text-xs md:text-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg overflow-hidden relative border border-gray-200 dark:border-white/10 flex-shrink-0">
                        <Image
                          src={report.owner?.profilePhoto?.url || '/default-profile.png'}
                          alt={report.owner?.username || 'reporter'}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-xs font-black text-gray-900 dark:text-white">
                          @{report.owner?.username || t('Anonymous')}
                        </p>
                        <p className="text-[9px] uppercase font-black text-gray-400 tracking-wider">
                          Reported {t(report.reportedOnType)}
                        </p>
                      </div>
                    </div>
                    
                    {/* Severity Badge */}
                    <span className={`px-2 py-0.5 rounded text-[8px] uppercase font-black tracking-widest border ${
                      report.severity === 'critical' || report.severity === 'high'
                        ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                        : report.severity === 'medium'
                        ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                        : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                    }`}>
                      {report.severity || 'low'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-medium line-clamp-2 pl-11">
                    &ldquo;{report.text}&rdquo;
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400 text-center py-10 font-medium">{t("No pending reviews")}</p>
            )}
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
});

DashboardTab.displayName = 'DashboardTab';

const StatCard = React.memo(({ icon, title, value, gradient }) => {
  const { t } = useTranslation();

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      className="relative group bg-white dark:bg-[#0A0A0A] p-5 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-xl transition-all overflow-hidden"
    >
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${gradient} opacity-5 blur-2xl rounded-full -translate-y-1/2 translate-x-1/2 group-hover:opacity-10 transition-opacity`} />

      <div className="relative flex flex-col items-center justify-center text-center space-y-3">
        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg`}>
          {React.cloneElement(icon, { className: 'w-6 h-6' })}
        </div>
        <p className="text-2xl font-black text-gray-900 dark:text-white tabular-nums">
          {value ?? '--'}
        </p>
        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
          {t(title)}
        </p>
      </div>
    </motion.div>
  );
});

StatCard.displayName = 'StatCard';
export default DashboardTab;