'use client';

import React from 'react';
import {
  HiChartBar,
  HiUsers,
  HiDocumentDuplicate,
  HiExclamationTriangle,
  HiMegaphone,
  HiShieldCheck,
  HiCog,
} from 'react-icons/hi2';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const NAV_ITEMS = [
  { label: 'Dashboard', tag: 'Dashboard', icon: HiChartBar },
  { label: 'Users', tag: 'Users', icon: HiUsers },
  { label: 'Content', tag: 'Content', icon: HiDocumentDuplicate },
  { label: 'Reports', tag: 'Reports', icon: HiExclamationTriangle },
  { label: 'Broadcast & Jobs', tag: 'Broadcast', icon: HiMegaphone },
  { label: 'Audit Trail', tag: 'Logs', icon: HiShieldCheck },
  { label: 'Settings', tag: 'Settings', icon: HiCog },
];

const AdminSidebar = React.memo(({ activeTab, setActiveTab }) => {
  const { t } = useTranslation();

  return (
    <nav className="flex flex-col gap-2">
      {NAV_ITEMS.map(({ label, tag, icon: Icon }) => (
        <motion.button
          key={tag}
          onClick={() => setActiveTab(tag)}
          whileHover={{ scale: 1.02, x: 4 }}
          whileTap={{ scale: 0.98 }}
          className={`group flex items-center gap-3.5 px-5 py-3.5 rounded-2xl transition-all text-xs font-black uppercase tracking-wider ${
            activeTab === tag
              ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/30'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
          }`}
        >
          <Icon className={`w-5 h-5 flex-shrink-0 ${activeTab === tag ? '' : 'group-hover:scale-110 transition-transform'}`} />
          <span className="truncate">{t(label)}</span>
        </motion.button>
      ))}
    </nav>
  );
});

AdminSidebar.displayName = 'AdminSidebar';
export default AdminSidebar;
