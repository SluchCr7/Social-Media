'use client';
import React from 'react'
import { navSections } from '../../utils/Data'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { memo } from 'react'
import { FiChevronLeft, FiLogOut } from "react-icons/fi"
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const SidebarContent = memo(({ isCollapsed, setIsCollapsed, isMobile, setIsMobileMenuOpen, user, onlineUsers }) => {
  const { t } = useTranslation()
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full">
      {/* 🚀 Logo Section */}
      <div className="flex items-center justify-between mb-8 px-2 pt-2">
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center gap-2 group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                <span className="text-white font-bold text-lg">Z</span>
              </div>
              <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-indigo-600 to-purple-600 dark:from-white dark:via-indigo-400 dark:to-purple-400 tracking-tight">
                {process.env.NEXT_PUBLIC_WEBSITE_NAME || "Zocial"}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {!isMobile && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
          >
            <FiChevronLeft className={`text-xl transition-transform duration-500 ${isCollapsed ? "rotate-180" : ""}`} />
          </motion.button>
        )}
      </div>

      {/* 🧭 Navigation Sections */}
      <div className="flex-1 overflow-y-auto aside_scroll space-y-8 pr-1">
        {navSections.map((section, sIdx) => (
          <div key={section.title} className="space-y-2">
            {!isCollapsed && (
              <motion.h4
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400/80 dark:text-gray-500"
              >
                {t(section.title)}
              </motion.h4>
            )}
            <div className="flex flex-col gap-1.5">
              {section.items.map(({ icon, text, link }, iIdx) => {
                const isActive = pathname === link;
                return (
                  <Link
                    key={text}
                    href={link}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="relative group px-2"
                  >
                    <motion.div
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      className={`
                        flex items-center gap-3.5 px-3 py-2.5 rounded-2xl transition-all duration-300
                        ${isActive
                          ? 'bg-gradient-to-r from-indigo-600/10 to-purple-600/10 dark:from-indigo-600/20 dark:to-purple-600/20 text-indigo-600 dark:text-indigo-400 shadow-[inset_0_0_0_1px_rgba(99,102,241,0.2)]'
                          : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'}
                      `}
                    >
                      <span className={`text-xl transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                        {icon}
                      </span>
                      {!isCollapsed && (
                        <span className={`flex-1 text-sm font-semibold tracking-wide truncate ${isActive ? 'text-gray-900 dark:text-white font-bold' : ''}`}>
                          {t(text)}
                        </span>
                      )}

                      {/* Active Indicator Line */}
                      {isActive && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute left-0 w-1 h-6 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-r-full"
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
      <div className="mt-6 pt-4 border-t border-gray-100 dark:border-white/5">
        <motion.div
          className={`
            group flex items-center gap-3 p-2 rounded-2xl transition-all duration-300
            ${isCollapsed ? 'justify-center' : 'hover:bg-gray-50 dark:hover:bg-white/5'}
          `}
        >
          <div className="relative shrink-0">
            <div className={`
              relative p-[2px] rounded-2xl transition-transform duration-300 group-hover:scale-105
              ${user?.stories?.length > 0 ? 'bg-gradient-to-tr from-amber-500 via-red-500 to-purple-500 p-[3px]' : 'bg-gray-200 dark:bg-gray-800'}
            `}>
              <Image
                src={user?.profilePhoto?.url || '/default-profile.png'}
                alt="Profile"
                width={44}
                height={44}
                className="rounded-[14px] w-11 h-11 object-cover border-2 border-white dark:border-gray-900"
              />
            </div>
            {onlineUsers?.includes(user?._id) && (
              <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-[2.5px] border-white dark:border-gray-900 shadow-sm" />
            )}
          </div>

          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex flex-col flex-1 truncate"
              >
                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                  {user?.username || "Guest"}
                </p>
                <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 truncate tracking-tight">
                  {user?.profileName || "@guest"}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {!isCollapsed && (
            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
              whileTap={{ scale: 0.9 }}
              onClick={user?.Logout}
              className="p-2 rounded-xl text-red-500 hover:text-red-600 transition-colors"
              title={t('Logout')}
            >
              <FiLogOut className="text-lg" />
            </motion.button>
          )}
        </motion.div>

        {isCollapsed && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={user?.Logout}
            className="flex mx-auto mt-2 p-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
          >
            <FiLogOut className="text-lg" />
          </motion.button>
        )}
      </div>
    </div>
  )
});

SidebarContent.displayName = "SidebarContent"
export default SidebarContent