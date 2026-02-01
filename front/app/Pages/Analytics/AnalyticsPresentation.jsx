'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, ResponsiveContainer,
  AreaChart, Area, BarChart, Bar
} from 'recharts';
import { FaDownload, FaCalendarAlt, FaChartLine, FaFire, FaTrophy, FaArrowUp, FaUsers, FaHeart, FaComment, FaEye } from 'react-icons/fa';
import { TrendingUp, Users, Heart, MessageCircle, BarChart3, PieChart as PieIcon, Activity, Zap } from 'lucide-react';
import OverviewCard from '@/app/Component/OverviewCard';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';

const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f59e0b', '#10b981'];
const formatNumber = (v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 dark:bg-black/80 backdrop-blur-xl border border-white/20 dark:border-white/10 p-4 rounded-2xl shadow-2xl">
        <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-3 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-tighter">
              {entry.name}: <span className="text-indigo-600 dark:text-indigo-400">{entry.value}</span>
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

function AnalyticsPresentation({
  userData, user, followers, userPosts,
  totalLikes, totalComments, engagementRate,
  timeSeries, topPosts, peakHours, engagement,
  exporting, exportCSV, period, setPeriod
}) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen w-full bg-[#030712] text-white selection:bg-indigo-500/30 overflow-x-hidden p-3 sm:p-4 md:p-8">
      {/* 🌌 Cinematic Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      </div>

      <div className="relative max-w-7xl mx-auto w-full space-y-10">

        {/* 🏔️ Hero Section */}
        <header className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 pt-4">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-6"
          >
            <div className="relative">
              <div className="w-20 h-20 rounded-3xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center relative z-10 overflow-hidden group">
                <Image
                  src={userData?.profilePhoto?.url || user?.profilePhoto?.url || '/default-avatar.png'}
                  alt="Profile"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="absolute -inset-2 bg-indigo-500/20 blur-xl rounded-[2rem] -z-0 animate-pulse" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl lg:text-5xl font-black tracking-tighter uppercase italic">
                  {t("Insights")}
                </h1>
                <div className="px-3 py-1 bg-indigo-600/20 border border-indigo-500/30 rounded-full">
                  <span className="text-[10px] font-black uppercase text-indigo-400 tracking-[0.2em]">{period}D DATA</span>
                </div>
              </div>
              <p className="text-gray-500 font-bold text-sm tracking-widest uppercase">
                {t("Network Resonance Analysis for")}{" "}
                <span className="text-white">@{userData?.username || user?.username || "Signal"}</span>
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 w-full lg:w-auto"
          >
            <div className="flex-1 lg:flex-none relative group">
              <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500 z-10" />
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="w-full lg:w-48 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-xs font-black uppercase tracking-widest outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all appearance-none cursor-pointer"
              >
                <option value="7" className="bg-[#030712]">{t("Cycle: 07 Days")}</option>
                <option value="30" className="bg-[#030712]">{t("Cycle: 30 Days")}</option>
                <option value="90" className="bg-[#030712]">{t("Cycle: 90 Days")}</option>
              </select>
            </div>

            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={exportCSV}
              disabled={exporting}
              className="flex items-center justify-center gap-3 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl shadow-xl shadow-indigo-600/30 transition-all disabled:opacity-50"
            >
              <Zap size={18} className={exporting ? 'animate-spin' : ''} />
              <span className="text-xs font-black uppercase tracking-widest leading-none">
                {exporting ? t("Syncing...") : t("Export Matrix")}
              </span>
            </motion.button>
          </motion.div>
        </header>

        {/* 📊 KPI Grid */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            { label: t("Signals"), value: userPosts.length, icon: <Activity />, color: 'from-blue-600 to-cyan-500' },
            { label: t("Network"), value: followers?.length || 0, icon: <Users />, color: 'from-purple-600 to-indigo-500' },
            { label: t("Resonance"), value: totalLikes, icon: <Heart />, color: 'from-pink-600 to-rose-500' },
            { label: t("Sync Rate"), value: `${engagementRate}%`, icon: <Zap />, color: 'from-amber-600 to-orange-500' },
          ].map((kpi, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              className="relative group cursor-default"
            >
              <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-[2.5rem] blur-xl" />
              <div className="relative h-full bg-white/[0.03] border border-white/5 rounded-3xl sm:rounded-[2.5rem] p-5 sm:p-8 backdrop-blur-3xl overflow-hidden">
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${kpi.color} opacity-5 blur-[40px] -translate-y-1/2 translate-x-1/2`} />
                <div className="flex flex-col gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform duration-500">
                    {kpi.icon}
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">{kpi.label}</h3>
                    <p className="text-3xl font-black tracking-tighter italic">{kpi.value}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </section>

        {/* 📈 Primary Visualizations */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Activity Area */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-8 bg-white/[0.03] border border-white/5 rounded-3xl sm:rounded-[3rem] p-5 sm:p-8 lg:p-10 backdrop-blur-3xl relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-20 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
              <div className="space-y-1">
                <h2 className="text-2xl font-black tracking-tight uppercase flex items-center gap-3">
                  <BarChart3 className="text-indigo-500" />
                  {t("Signal Frequency")}
                </h2>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">{t("Temporal Distribution Analysis")}</p>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-500" />
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t("Posts")}</span>
                </div>
                <div className="flex items-center gap-2 text-purple-500">
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t("Likes")}</span>
                </div>
              </div>
            </div>

            <div className="h-[400px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeSeries}>
                  <defs>
                    <linearGradient id="colorPosts" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorLikes" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#4b5563', fontSize: 10, fontWeight: 900 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#4b5563', fontSize: 10, fontWeight: 900 }}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '4 4' }} />
                  <Area type="monotone" dataKey="posts" name="Posts" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorPosts)" />
                  <Area type="monotone" dataKey="likes" name="Likes" stroke="#a855f7" strokeWidth={4} fillOpacity={1} fill="url(#colorLikes)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Engagement Segmentation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-4 bg-white/[0.03] border border-white/5 rounded-3xl sm:rounded-[3rem] p-5 sm:p-8 backdrop-blur-3xl flex flex-col items-center justify-between"
          >
            <div className="w-full space-y-1 mb-8">
              <h2 className="text-xl font-black tracking-tight uppercase flex items-center gap-3">
                <PieIcon className="text-purple-500" />
                {t("Resonance Mix")}
              </h2>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">{t("Interaction Profile")}</p>
            </div>

            <div className="relative w-full aspect-square flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={engagement}
                    dataKey="value"
                    nameKey="name"
                    innerRadius="65%"
                    outerRadius="90%"
                    paddingAngle={8}
                    stroke="none"
                  >
                    {engagement.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={10} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{t("Sync Total")}</span>
                <span className="text-4xl font-black tracking-tighter italic">
                  {formatNumber(engagement.reduce((s, e) => s + e.value, 0))}
                </span>
              </div>
            </div>

            <div className="w-full grid grid-cols-2 gap-4 mt-8">
              {engagement.map((item, idx) => (
                <div key={idx} className="flex flex-col gap-1 p-3 bg-white/5 rounded-2xl border border-white/5 group">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest truncate">{t(item.name)}</span>
                  </div>
                  <span className="text-lg font-black tracking-tighter pl-4 group-hover:text-indigo-400 transition-colors uppercase italic">{item.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* 🌌 High Fidelity Activity Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-10">

          {/* Top Frequency Peaks */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-7 bg-white/[0.03] border border-white/5 rounded-[3rem] p-8 backdrop-blur-3xl"
          >
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
              <div className="space-y-1">
                <h2 className="text-xl font-black tracking-tight uppercase flex items-center gap-3">
                  <FaTrophy className="text-amber-500" />
                  {t("Signal Leaders")}
                </h2>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">{t("Performance Hierarchy")}</p>
              </div>
              <div className="flex items-center gap-2 text-indigo-400">
                <Zap size={14} className="animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest">{t("Realtime Feed")}</span>
              </div>
            </div>

            <div className="space-y-4">
              {topPosts && topPosts.length > 0 ? topPosts.slice(0, 5).map((p, idx) => {
                const score = (p.likes?.length || 0) + (p.comments?.length || 0) * 2;
                const maxScore = Math.max(...topPosts.map(tp => (tp.likes?.length || 0) + (tp.comments?.length || 0) * 2), 1);
                return (
                  <motion.div
                    key={p._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="group flex items-center gap-6 p-5 bg-white/[0.02] border border-white/5 rounded-3xl hover:bg-white/5 transition-all duration-300"
                  >
                    <div className="relative w-16 h-16 rounded-2xl bg-indigo-600/10 flex items-center justify-center shrink-0 overflow-hidden ring-1 ring-white/10 group-hover:ring-indigo-500/50 transition-all">
                      {p.media?.[0]?.url ? (
                        <Image src={p.media[0].url} alt="Post" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                      ) : (
                        <FaChartLine className="text-indigo-500/30 text-xl" />
                      )}
                      <div className="absolute top-1 right-1 w-5 h-5 bg-[#030712] rounded-lg flex items-center justify-center border border-white/10">
                        <span className="text-[8px] font-black text-indigo-400">{idx + 1}</span>
                      </div>
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-white truncate max-w-[200px]">{p.text || t("Visual Signal Only")}</p>
                        <span className="text-xs font-black italic text-indigo-500 tracking-tighter px-3 py-1 bg-indigo-500/20 rounded-full">{score} PTS</span>
                      </div>
                      <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(score / maxScore) * 100}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"
                        />
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-gray-500 group-hover:text-pink-500 transition-colors">
                          <FaHeart size={10} />
                          <span className="text-[9px] font-black uppercase tracking-widest">{p.likes?.length || 0}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 group-hover:text-indigo-400 transition-colors">
                          <FaComment size={10} />
                          <span className="text-[9px] font-black uppercase tracking-widest">{p.comments?.length || 0}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              }) : (
                <div className="h-40 flex items-center justify-center text-gray-600 uppercase font-black tracking-widest text-xs italic">
                  {t("No Signals Detected In This Cycle")}
                </div>
              )}
            </div>
          </motion.div>

          {/* Temporal Peak Analysis */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-5 bg-white/[0.03] border border-white/5 rounded-[3rem] p-8 backdrop-blur-3xl flex flex-col"
          >
            <div className="space-y-1 mb-10">
              <h2 className="text-xl font-black tracking-tight uppercase flex items-center gap-3">
                <Activity className="text-green-500" />
                {t("Transmission Peaks")}
              </h2>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">{t("Optimal Network Activity")}</p>
            </div>

            <div className="flex-1 flex flex-col justify-center gap-8">
              <div className="h-[200px] relative">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={Array.from({ length: 24 }).map((_, h) => ({ hour: h, value: peakHours?.[h] || 0 }))}>
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                    <Bar
                      dataKey="value"
                      fill="#6366f1"
                      radius={[8, 8, 0, 0]}
                    >
                      {Array.from({ length: 24 }).map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={peakHours && peakHours[index] === Math.max(...Object.values(peakHours || {}), 1) ? '#6366f1' : 'rgba(99, 102, 241, 0.2)'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-3xl bg-indigo-600/10 border border-indigo-500/20">
                  <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1">{t("Peak Frequency")}</p>
                  <p className="text-2xl font-black italic">
                    {peakHours ? Object.entries(peakHours).sort((a, b) => b[1] - a[1])[0]?.[0] : '00'}:00
                  </p>
                </div>
                <div className="p-4 rounded-3xl bg-purple-600/10 border border-purple-500/20">
                  <p className="text-[9px] font-black text-purple-400 uppercase tracking-widest mb-1">{t("Efficiency")}</p>
                  <p className="text-2xl font-black italic">High Phase</p>
                </div>
              </div>

              <p className="text-[10px] font-bold text-gray-500 leading-relaxed text-center px-4 uppercase tracking-tighter">
                {t("Signals are strongest during mid-cycle synchronization. Optimal transmission recommended.")}
              </p>
            </div>
          </motion.div>

        </div>

      </div>
    </div>
  );
}

export default React.memo(AnalyticsPresentation);