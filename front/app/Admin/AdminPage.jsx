'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiChartBar, HiUsers, HiDocumentText, HiCog, HiSignal } from 'react-icons/hi2';
import { useAdminUser } from '@/app/Context/AdminContext';
import AdminUsersPage from '../Component/Admin/Users/UsersTab';
import AdminReportsPage from '../Component/Admin/Reports/ReportsTab';
import DashboardTab from '../Component/Admin/DashboardTab';
import SettingsTab from '../Component/Admin/Settings/SettingsTab';
import { useTranslation } from 'react-i18next';

const Admin = () => {
  const { stats, loading, getAdminStats } = useAdminUser();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('Dashboard');

  const tabs = [
    { name: 'Dashboard', icon: <HiChartBar className="w-5 h-5" />, label: t('Dashboard') },
    { name: 'Users', icon: <HiUsers className="w-5 h-5" />, label: t('Users') },
    { name: 'Reports', icon: <HiDocumentText className="w-5 h-5" />, label: t('Reports') },
    { name: 'Settings', icon: <HiCog className="w-5 h-5" />, label: t('Settings') },
  ];

  if (loading)
    return (
      <div className="flex flex-col justify-center items-center h-screen w-full bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full"
        />
        <p className="mt-6 text-sm font-black uppercase tracking-[0.3em] text-indigo-500">{t("Loading Admin Console")}</p>
      </div>
    );

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-[#050505] dark:via-[#0A0A0A] dark:to-[#050505]">
      {/* 🎭 Premium Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#0A0A0A]/90 backdrop-blur-3xl border-b border-gray-200 dark:border-white/5 shadow-xl transition-all duration-300">
        <div className="w-full px-6 md:px-10 py-5">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
                <HiCog className="w-6 h-6 text-indigo-500 animate-spin-slow" />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tighter text-gray-900 dark:text-white uppercase transition-colors">
                  {t('Admin')} <span className="text-indigo-500">{t('Console')}</span>
                </h1>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-500">
                  <HiSignal className="w-3 h-3 animate-pulse" />
                  {t('System Operational')}
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
            {tabs.map((tab) => (
              <motion.button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-3 px-6 py-4 rounded-2xl transition-all whitespace-nowrap border-2 ${activeTab === tab.name
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-500/30'
                    : 'bg-transparent border-transparent hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-gray-400'
                  }`}
              >
                {tab.icon}
                <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </header>

      {/* 📊 Content Area */}
      <main className="flex-1 w-full bg-transparent">
        <AnimatePresence mode="wait">
          {activeTab === 'Dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <DashboardTab stats={stats} loading={loading} getAdminStats={getAdminStats} />
            </motion.div>
          )}

          {activeTab === 'Users' && (
            <motion.div
              key="users"
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <AdminUsersPage />
            </motion.div>
          )}

          {activeTab === 'Reports' && (
            <motion.div
              key="reports"
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <AdminReportsPage />
            </motion.div>
          )}

          {activeTab === 'Settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <SettingsTab />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Admin;
