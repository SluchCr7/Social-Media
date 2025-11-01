'use client';
import React, { useMemo, useCallback } from 'react';
import { FiHome, FiUsers, FiBarChart2 } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

const AdminSidebar = React.memo(({ activeTab, setActiveTab }) => {
  const { t } = useTranslation();

  // ✅ نستخدم useMemo لتثبيت قائمة العناصر
  const navItems = useMemo(
    () => [
      { label: 'Dashboard', tag: 'Dashboard', icon: FiHome },
      { label: 'Users', tag: 'Users', icon: FiUsers },
      { label: 'Reports', tag: 'Reports', icon: FiBarChart2 },
    ],
    []
  );

  // ✅ دالة ثابتة لتغيير التبويب
  const handleTabChange = useCallback(
    (tag) => setActiveTab(tag),
    [setActiveTab]
  );

  return (
    <nav className="flex flex-col gap-2">
      {navItems.map(({ label, tag, icon: Icon }) => (
        <button
          key={tag}
          onClick={() => handleTabChange(tag)}
          className={`flex items-center gap-3 px-4 py-2 rounded-lg transition text-sm font-medium ${
            activeTab === tag
              ? 'bg-indigo-600 text-white'
              : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          <Icon className="text-lg" />
          <span>{t(label)}</span>
        </button>
      ))}
    </nav>
  );
});

export default AdminSidebar;
