'use client';

import React from 'react';
import ConfirmModal from '@/app/Component/ReportsComponents/ConfirmModal';
import ReportsTable from '@/app/Component/ReportsComponents/ReportsTable';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { HiDocumentText, HiUsers, HiExclamationTriangle } from 'react-icons/hi2';

const StatCard = ({ icon, title, value, colorClass }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="p-6 rounded-3xl bg-white dark:bg-[#0A0A0A] border border-gray-100 dark:border-white/5 shadow-xl relative overflow-hidden group"
  >
    <div className={`absolute top-0 right-0 w-24 h-24 ${colorClass} opacity-10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-500`} />
    <div className="relative z-10">
      <div className={`w-12 h-12 rounded-2xl ${colorClass} bg-opacity-10 flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</p>
      <p className="text-3xl font-black text-gray-900 dark:text-white mt-1">{value}</p>
    </div>
  </motion.div>
);

const DesignReports = React.memo(({
  reports,
  postsReports,
  commentsReports,
  usersReports,
  loading,
  activeTab,
  setActiveTab,
  modal,
  openModal,
  handleAction,
}) => {
  const { t } = useTranslation();

  const tabs = [
    { id: 'post', label: t('Post Reports'), icon: <HiDocumentText className="w-4 h-4" /> },
    { id: 'comment', label: t('Comment Reports'), icon: <HiExclamationTriangle className="w-4 h-4" /> },
    { id: 'user', label: t('User Reports'), icon: <HiUsers className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen w-full p-6 md:p-10 space-y-8">
      {/* 🚀 Header */}
      <div>
        <h1 className="text-4xl font-black tracking-tighter text-gray-900 dark:text-white uppercase">
          {t("Reports")} <span className="text-red-500">{t("Center")}</span>
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-2">
          {t("Review and manage reported content and users")}
        </p>
      </div>

      {/* 📊 Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          icon={<HiExclamationTriangle className="w-6 h-6 text-red-500" />}
          title={t("Total Reports")}
          value={reports.length}
          colorClass="bg-red-500"
        />
        <StatCard
          icon={<HiDocumentText className="w-6 h-6 text-orange-500" />}
          title={t("Post Reports")}
          value={postsReports.length}
          colorClass="bg-orange-500"
        />
        <StatCard
          icon={<HiUsers className="w-6 h-6 text-blue-500" />}
          title={t("User Reports")}
          value={usersReports.length}
          colorClass="bg-blue-500"
        />
      </div>

      {/* 📑 Tabs Navigation */}
      <div className="flex items-center gap-2 p-1 bg-gray-100 dark:bg-white/5 rounded-2xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wide transition-all ${activeTab === tab.id
                ? 'bg-white dark:bg-[#0A0A0A] text-gray-900 dark:text-white shadow-lg'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* 📋 Reports Table Material */}
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-[#0A0A0A] rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-xl overflow-hidden"
      >
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center text-gray-400">
            <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4" />
            <p className="text-xs font-bold uppercase tracking-widest">{t("Loading Reports...")}</p>
          </div>
        ) : (
          <ReportsTable
            reports={
              activeTab === 'post' ? postsReports :
                activeTab === 'comment' ? commentsReports :
                  usersReports
            }
            type={activeTab}
            openModal={openModal}
          />
        )}
      </motion.div>

      {/* Confirm Modal */}
      <ConfirmModal
        open={modal.open}
        onClose={() => modal.closeModal && modal.closeModal()} // Ensure safe call if passed prop varies
        onConfirm={handleAction}
        title={t("Are you sure?")}
        message={t("This action cannot be undone.")}
      />
    </div>
  );
});

DesignReports.displayName = 'DesignReports';

export default DesignReports;