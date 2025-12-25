'use client';

import React, { useMemo, useCallback } from 'react';
import { HiChartBar, HiUsers, HiDocumentText } from 'react-icons/hi2';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const AdminSidebar = React.memo(({ activeTab, setActiveTab }) => {
  const { t } = useTranslation();

  const navItems = useMemo(
    () => [
      { label: 'Dashboard', tag: 'Dashboard', icon: HiChartBar },
      { label: 'Users', tag: 'Users', icon: HiUsers },
      { label: 'Reports', tag: 'Reports', icon: HiDocumentText },
    ],
    []
  );

  const handleTabChange = useCallback(
    (tag) => setActiveTab(tag),
    [setActiveTab]
  );

  return (
    <nav className="flex flex-col gap-3">
      {navItems.map(({ label, tag, icon: Icon }) => (
        <motion.button
          key={tag}
          onClick={() => handleTabChange(tag)}
          whileHover={{ scale: 1.02, x: 4 }}
          whileTap={{ scale: 0.98 }}
          className={`group flex items-center gap-4 px-6 py-4 rounded-2xl transition-all text-sm font-black uppercase tracking-widest ${activeTab === tag
              ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/30'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
            }`}
        >
          <Icon className={`w-5 h-5 ${activeTab === tag ? '' : 'group-hover:scale-110 transition-transform'}`} />
          <span>{t(label)}</span>
        </motion.button>
      ))}
    </nav>
  );
});

AdminSidebar.displayName = 'AdminSidebar';
export default AdminSidebar;
