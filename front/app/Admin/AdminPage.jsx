'use client';

import React from 'react';
import { useAdminUser } from '@/app/Context/AdminContext';
import { useTranslation } from 'react-i18next';
import AdminUsersPage from '../Component/Admin/Users/UsersTab';
import AdminReportsPage from '../Component/Admin/Reports/ReportsTab';
import DashboardTab from '../Component/Admin/DashboardTab';

const Admin = ({ activeTab }) => {
  const { stats, loading, getAdminStats } = useAdminUser();
  const { t } = useTranslation();

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
      </div>
    );

  return (
    <div className="min-h-screen w-full flex flex-col bg-lightMode-bg dark:bg-darkMode-bg text-lightMode-text2 dark:text-darkMode-text2">
      {activeTab === 'Dashboard' && (
        <DashboardTab t={t} stats={stats} loading={loading} getAdminStats={getAdminStats} />
      )}

      {activeTab === 'Users' && (
        <div className="flex-1 w-full h-full p-6 md:p-8 overflow-y-auto">
          <AdminUsersPage />
        </div>
      )}

      {activeTab === 'Reports' && (
        <div className="flex-1 w-full h-full p-6 md:p-8 overflow-y-auto">
          <AdminReportsPage />
        </div>
      )}

      {!activeTab && (
        <div className="flex-1 flex justify-center items-center text-gray-400">
          <p>Select a tab</p>
        </div>
      )}
    </div>
  );
}
export default Admin;
