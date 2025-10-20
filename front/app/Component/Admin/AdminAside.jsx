// components/AdminSidebar.tsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FiHome,
  FiUsers,
  FiBarChart2,
  FiSettings,
} from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { Tag } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', Tag : "Dashboard", icon: <FiHome /> },
  { label: 'Users', Tag: "Users", icon: <FiUsers /> },
  { label: 'Reports', Tag: "Reports", icon: <FiBarChart2 /> },
];


const AdminSidebar = ({ activeTab , setActiveTab }) => {

  const { t } = useTranslation();

  return (
    <nav className="flex flex-col gap-2">
      {navItems.map((item) => (
        <div
          key={item.Tag}
          onClick={() => setActiveTab(item.Tag)}
          className={`flex items-center gap-3 px-4 py-2 rounded-lg transition text-sm font-medium ${
            activeTab === item.Tag
              ? 'bg-indigo-600 text-white'
              : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          <span className="text-lg">{item.icon}</span>
          <span>{t(item.label)}</span>
        </div>
      ))}
    </nav>
  );
};

export default AdminSidebar;
