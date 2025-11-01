'use client';
import ConfirmModal from '@/app/Component/ReportsComponents/ConfirmModal'
import ReportsTable from '@/app/Component/ReportsComponents/ReportsTable'
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';


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
  const { t } = useTranslation()
  return (
    <div className="min-h-screen bg-lightMode-bg dark:bg-darkMode-bg p-6 w-full">
      <h1 className="text-3xl font-bold mb-6 text-lightMode-text2 dark:text-darkMode-text2">
        {t("Reports Management")}
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-white dark:bg-darkMode-card rounded-xl shadow">
          <p className="text-sm text-gray-500">{t("Total Reports")}</p>
          <p className="text-2xl font-bold">{reports.length}</p>
        </div>
        <div className="p-4 bg-white dark:bg-darkMode-card rounded-xl shadow">
          <p className="text-sm text-gray-500">{t("Posts")}</p>
          <p className="text-2xl font-bold">{postsReports.length}</p>
        </div>
        <div className="p-4 bg-white dark:bg-darkMode-card rounded-xl shadow">
          <p className="text-sm text-gray-500">{t("Users")}</p>
          <p className="text-2xl font-bold">{usersReports.length}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 mb-6">
        {['post', 'comment', 'user'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === tab
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)} {t("Reports")}
          </button>
        ))}
      </div>

      {/* Reports Table */}
      {loading ? (
        <p>{t("Loading")}...</p>
      ) : activeTab === 'post' ? (
        <ReportsTable reports={postsReports} type="post" openModal={openModal} />
      ) : activeTab === 'comment' ? (
        <ReportsTable
          reports={commentsReports}
          type="comment"
          openModal={openModal}
        />
      ) : (
        <ReportsTable
          reports={usersReports}
          type="user"
          openModal={openModal}
        />
      )}

      {/* Confirm Modal */}
      <ConfirmModal
        open={modal.open}
        onClose={() => setModal({ open: false, action: null, id: null })}
        onConfirm={handleAction}
        title="Are you sure?"
        message="This action cannot be undone."
      />
    </div>
  )
})

export default DesignReports