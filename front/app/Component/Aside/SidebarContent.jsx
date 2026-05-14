'use client';

import React, { memo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  LogOut, 
} from 'lucide-react';
import { navSections } from '../../utils/Data';
import { Avatar } from '../ui/Avatar';

const SidebarContent = memo(({ isCollapsed, setIsCollapsed, isMobile, setIsMobileMenuOpen, user, onlineUsers }) => {
  const { t } = useTranslation();
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full select-none">
      {/* 🚀 Logo Section */}
      <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} mb-8 px-2 pt-2`}>
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <Link href="/">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center gap-3 group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-black dark:bg-white flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-105">
                  <span className="text-white dark:text-black font-bold text-lg">Z</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-gray-900 dark:text-white tracking-tight leading-none">
                    {process.env.NEXT_PUBLIC_WEBSITE_NAME || "Zocial"}
                  </span>
                  <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-0.5">
                    {t('Network')}
                  </span>
                </div>
              </motion.div>
            </Link>
          )}
        </AnimatePresence>

        {!isMobile && (
          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`flex items-center justify-center rounded-lg bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all duration-300 ${isCollapsed ? 'w-10 h-10 mt-2' : 'w-7 h-7'}`}
          >
            <ChevronLeft size={18} className={`transition-transform duration-500 ${isCollapsed ? "rotate-180" : ""}`} />
          </motion.button>
        )}
      </div>

      {/* 🧭 Navigation Sections */}
      <div className="flex-1 overflow-y-auto no-scrollbar space-y-8 pr-1 pb-6">
        {navSections.map((section) => (
          <div key={section.title} className="space-y-2">
            {!isCollapsed && (
              <motion.h4
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="px-4 text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500/80"
              >
                {t(section.title)}
              </motion.h4>
            )}
            <div className={`flex flex-col ${isCollapsed ? 'gap-2' : 'gap-0.5'}`}>
              {section.items.map(({ icon, text, link }) => {
                const isActive = pathname === link;
                return (
                  <Link
                    key={text}
                    href={link}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="relative px-1 group"
                  >
                    <motion.div
                      whileTap={{ scale: 0.98 }}
                      className={`
                        flex items-center gap-3.5 px-3 py-2.5 rounded-xl transition-all duration-200 relative
                        ${isActive
                          ? 'bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white'
                          : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'}
                        ${isCollapsed ? 'justify-center p-0 h-11 w-11 mx-auto' : ''}
                      `}
                    >
                      <span className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                        {icon}
                      </span>
                      {!isCollapsed && (
                        <span className={`flex-1 text-[14px] font-semibold tracking-tight truncate`}>
                          {t(text)}
                        </span>
                      )}

                      {/* Active Indicator */}
                      {isActive && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute left-0 w-1 h-5 bg-black dark:bg-white rounded-r-full"
                        />
                      )}
                    </motion.div>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* 👤 User Profile Section */}
      <div className="mt-auto pt-4 border-t border-gray-100 dark:border-white/5">
        <div
          className={`
            group flex items-center gap-3 p-2 rounded-xl transition-all duration-200
            ${isCollapsed ? 'justify-center' : 'hover:bg-gray-50 dark:hover:bg-white/5'}
          `}
        >
          <div className="relative shrink-0">
            <Avatar 
              src={user?.profilePhoto?.url} 
              alt={user?.username}
              size={isCollapsed ? "sm" : "default"}
              className={user?.stories?.length > 0 ? "ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-black" : ""}
            />
            {onlineUsers?.includes(user?._id) && (
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-black z-10" />
            )}
          </div>

          {!isCollapsed && (
            <div className="flex flex-col flex-1 truncate">
              <p className="text-[14px] font-bold text-gray-900 dark:text-white truncate tracking-tight">
                {user?.username || t("Guest")}
              </p>
              <p className="text-[12px] font-medium text-gray-500 dark:text-gray-400 truncate">
                @{user?.profileName || "syncing"}
              </p>
            </div>
          )}

          {!isCollapsed && (
            <button
              onClick={user?.logout}
              className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
              title={t('Logout')}
            >
              <LogOut size={18} />
            </button>
          )}
        </div>

        {isCollapsed && (
          <button
            onClick={user?.logout}
            className="flex mx-auto mt-4 p-2.5 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
            title={t('Logout')}
          >
            <LogOut size={20} />
          </button>
        )}
      </div>
    </div>
  )
});

SidebarContent.displayName = "SidebarContent";
export default SidebarContent;