'use client';
import React from 'react';
import { useState } from 'react';
import { FiMenu } from 'react-icons/fi';
import AdminSidebar from './AdminAside';
import MobileSidebar from './MobileAside';
import { useTranslation } from 'react-i18next';

const AdminLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Dashboard'); // ✅ الحالة

  const { t } = useTranslation();
  // ✅ نغلف children بـ React.cloneElement لإضافة prop جديدة له
  const childrenWithProps = children
    ? React.cloneElement(children, { activeTab, setActiveTab })
    : null;

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 w-full">
      {/* ✅ Sidebar for desktop */}
      <aside className="hidden md:block w-64 bg-white dark:bg-gray-800 p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-6">{t("Admin Panel")}</h2>
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </aside>

      {/* ✅ Mobile Topbar */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 shadow z-40 p-4 flex items-center justify-between">
        <button
          onClick={() => setMobileOpen(true)}
          className="text-2xl text-gray-700 dark:text-gray-200"
        >
          <FiMenu />
        </button>
        <h1 className="text-lg font-semibold">Admin</h1>
      </div>

      {/* ✅ Mobile Drawer */}
      <MobileSidebar
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* ✅ Main content */}
      <main className="flex-1 p-4 w-full">
        {childrenWithProps}
      </main>
    </div>
  );
};

export default AdminLayout;
