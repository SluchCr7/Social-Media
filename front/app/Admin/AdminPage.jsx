'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useAdminUser } from '@/app/Context/AdminContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  FiUsers,
  FiFileText,
  FiMusic,
  FiVideo,
  FiGlobe,
  FiActivity,
  FiRefreshCw,
} from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import AdminUsersPage from '../Component/Admin/Users/UsersTab';
import AdminReportsPage from '../Component/Admin/Reports/ReportsTab';
const Admin = ({activeTab}) => {
  const { stats, loading, getAdminStats } = useAdminUser();
  const {t} = useTranslation()
  // بيانات وهمية مؤقتة للرسم البياني
  const chartData = [
    { name: 'Mon', posts: 30 },
    { name: 'Tue', posts: 50 },
    { name: 'Wed', posts: 80 },
    { name: 'Thu', posts: 60 },
    { name: 'Fri', posts: 100 },
    { name: 'Sat', posts: 70 },
    { name: 'Sun', posts: 40 },
  ];

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
      </div>
    );

  return (
    <div className="min-h-screen text-lightMode-text2 dark:text-darkMode-text2 bg-lightMode-bg dark:bg-darkMode-bg p-6 w-full">
      {activeTab === 'dashboard' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold">{t("Admin Dashboard")}</h1>
                <p className="text-gray-500">{t("Welcome back, here’s the latest overview")}</p>
              </div>
              <button
                onClick={getAdminStats}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
              >
                <FiRefreshCw /> {t("Refresh")}
              </button>
            </div>
            {/* 🧱 Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10"
            >
              <StatCard icon={<FiUsers />} title="Users" value={stats?.totalUsers} color="text-blue-500" />
              <StatCard icon={<FiFileText />} title="Posts" value={stats?.totalPosts} color="text-green-500" />
              <StatCard icon={<FiGlobe />} title="Communities" value={stats?.totalCommunities} color="text-purple-500" />
              <StatCard icon={<FiMusic />} title="Music" value={stats?.totalMusic} color="text-pink-500" />
              <StatCard icon={<FiVideo />} title="Reels" value={stats?.totalReels} color="text-red-500" />
              <StatCard icon={<FiActivity />} title="Today’s Posts" value={stats?.todayPosts} color="text-orange-500" />
            </motion.div>
            {/* 📊 Chart Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg"
            >
              <h2 className="text-xl font-semibold mb-4">{t("Weekly Posts Overview")}</h2>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="posts" stroke="#6366F1" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </motion.div>
        )
      }
      {
        activeTab === "Users" && <AdminUsersPage />
      }
      {
        activeTab === "Reports" && <AdminReportsPage />
      }
    </div>
  );
};

// 🧩 Component: Stat Card
const StatCard = ({ icon, title, value, color }) => {
  const {t} = useTranslation()
  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow hover:shadow-lg transition flex flex-col items-center justify-center text-center">
      <div className={`${color} text-3xl mb-2`}>{icon}</div>
      <p className="text-2xl font-bold">{value ?? '--'}</p>
      <p className="text-gray-500">{t(title)}</p>
    </div>
  );
};

export default Admin;
