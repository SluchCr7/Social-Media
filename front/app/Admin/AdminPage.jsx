'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiChartBar,
  HiUsers,
  HiDocumentDuplicate,
  HiExclamationTriangle,
  HiMegaphone,
  HiShieldCheck,
  HiCog,
  HiSignal,
  HiBars3,
  HiArrowPath,
} from 'react-icons/hi2';
import { useTranslation } from 'react-i18next';
import { useAdmin } from '@/app/redux/hooks/useAdmin';

import dynamic from 'next/dynamic';

// Subcomponents
import DashboardTab from '../Component/Admin/DashboardTab';
const AdminUsersPage = dynamic(() => import('../Component/Admin/Users/UsersTab'), { ssr: false });
const ContentTab = dynamic(() => import('../Component/Admin/Content/ContentTab'), { ssr: false });
const AdminReportsPage = dynamic(() => import('../Component/Admin/Reports/ReportsTab'), { ssr: false });
const BroadcastTab = dynamic(() => import('../Component/Admin/Broadcast/BroadcastTab'), { ssr: false });
const LogsTab = dynamic(() => import('../Component/Admin/Logs/LogsTab'), { ssr: false });
const SettingsTab = dynamic(() => import('../Component/Admin/Settings/SettingsTab'), { ssr: false });
const MobileSidebar = dynamic(() => import('../Component/Admin/MobileAside'), { ssr: false });

const Admin = () => {
  const {
    stats,
    loading,
    activeTab,
    setActiveTab,
    refetchStats,
  } = useAdmin();
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const tabs = [
    {
      name: 'Dashboard',
      icon: <HiChartBar className="w-5 h-5 flex-shrink-0" />,
      label: t('Dashboard'),
    },
    {
      name: 'Users',
      icon: <HiUsers className="w-5 h-5 flex-shrink-0" />,
      label: t('Users'),
      badge: stats?.totalUsers || null,
    },
    {
      name: 'Content',
      icon: <HiDocumentDuplicate className="w-5 h-5 flex-shrink-0" />,
      label: t('Content'),
      badge: stats?.totalPosts || null,
    },
    {
      name: 'Reports',
      icon: <HiExclamationTriangle className="w-5 h-5 flex-shrink-0" />,
      label: t('Reports'),
      badge: stats?.pendingReports > 0 ? stats.pendingReports : null,
      badgeColor: 'bg-rose-500 text-white',
    },
    {
      name: 'Broadcast',
      icon: <HiMegaphone className="w-5 h-5 flex-shrink-0" />,
      label: t('Broadcast & Jobs'),
    },
    {
      name: 'Logs',
      icon: <HiShieldCheck className="w-5 h-5 flex-shrink-0" />,
      label: t('Audit Trail'),
    },
    {
      name: 'Settings',
      icon: <HiCog className="w-5 h-5 flex-shrink-0" />,
      label: t('Settings'),
    },
  ];

  if (loading && !stats) {
    return (
      <div className="flex flex-col justify-center items-center h-screen w-full bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full"
        />
        <p className="mt-6 text-sm font-black uppercase tracking-[0.3em] text-indigo-500">
          {t('Loading Admin Console')}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-[#050505] dark:via-[#0A0A0A] dark:to-[#050505]">
      {/* 📱 Mobile Drawer */}
      <MobileSidebar
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* 🎭 Premium Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#0A0A0A]/90 backdrop-blur-3xl border-b border-gray-200 dark:border-white/5 shadow-xl transition-all duration-300">
        <div className="w-full px-6 md:px-10 pt-5 pb-3">
          <div className="flex items-center justify-between mb-5">
            {/* Logo & Operational Status */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileOpen(true)}
                className="md:hidden w-11 h-11 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
              >
                <HiBars3 className="w-6 h-6" />
              </button>

              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
                <HiCog className="w-6 h-6 text-indigo-500 animate-spin-slow" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-gray-900 dark:text-white uppercase transition-colors">
                  {t('Admin')} <span className="text-indigo-500">{t('Console')}</span>
                </h1>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-500">
                  <HiSignal className="w-3 h-3 animate-pulse" />
                  {t('Enterprise Network Operational')}
                </div>
              </div>
            </div>

            {/* Quick Refresh & Telemetry Info */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => refetchStats()}
                className="p-3 rounded-2xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition-colors"
                title={t('Refresh System State')}
              >
                <HiArrowPath className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Desktop Tab Navigation */}
          <div className="hidden md:flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {tabs.map((tab) => (
              <motion.button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl transition-all whitespace-nowrap border ${
                  activeTab === tab.name
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-500/30'
                    : 'bg-transparent border-transparent hover:bg-gray-100 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400'
                }`}
              >
                {tab.icon}
                <span className="text-[11px] font-black uppercase tracking-wider">{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                      tab.badgeColor || 'bg-white/20 text-white'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
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
              transition={{ duration: 0.25 }}
              className="w-full"
            >
              <DashboardTab
                stats={stats}
                loading={loading}
                getAdminStats={refetchStats}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />
            </motion.div>
          )}

          {activeTab === 'Users' && (
            <motion.div
              key="users"
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              transition={{ duration: 0.25 }}
              className="w-full"
            >
              <AdminUsersPage />
            </motion.div>
          )}

          {activeTab === 'Content' && (
            <motion.div
              key="content"
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              transition={{ duration: 0.25 }}
              className="w-full"
            >
              <ContentTab />
            </motion.div>
          )}

          {activeTab === 'Reports' && (
            <motion.div
              key="reports"
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              transition={{ duration: 0.25 }}
              className="w-full"
            >
              <AdminReportsPage />
            </motion.div>
          )}

          {activeTab === 'Broadcast' && (
            <motion.div
              key="broadcast"
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              transition={{ duration: 0.25 }}
              className="w-full"
            >
              <BroadcastTab />
            </motion.div>
          )}

          {activeTab === 'Logs' && (
            <motion.div
              key="logs"
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              transition={{ duration: 0.25 }}
              className="w-full"
            >
              <LogsTab />
            </motion.div>
          )}

          {activeTab === 'Settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              transition={{ duration: 0.25 }}
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
