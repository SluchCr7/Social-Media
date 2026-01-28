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
    <div className="flex flex-col h-full select-none">
      {/* 🚀 Logo Section */}
      <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} mb-10 px-2 pt-2`}>
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <Link href="/">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center gap-3 group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-xl shadow-indigo-500/20 group-hover:rotate-6 transition-all duration-300">
                  <span className="text-white font-black text-xl">Z</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-black bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-indigo-600 to-purple-600 dark:from-white dark:via-indigo-400 dark:to-purple-400 tracking-tighter leading-none">
                    {process.env.NEXT_PUBLIC_WEBSITE_NAME || "Zocial"}
                  </span>
                  <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-0.5">Network</span>
                </div>
              </motion.div>
            </Link>
          )}
        </AnimatePresence>

        {!isMobile && (
          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(99, 102, 241, 0.1)' }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`flex items-center justify-center rounded-xl bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-indigo-500 transition-all duration-300 ${isCollapsed ? 'w-10 h-10 mt-2' : 'w-8 h-8'}`}
          >
            <FiChevronLeft className={`text-lg transition-transform duration-500 ${isCollapsed ? "rotate-180" : ""}`} />
          </motion.button>
        )}
      </div>

      {/* 🧭 Navigation Sections */}
      <div className="flex-1 overflow-y-auto aside_scroll space-y-10 pr-1 pb-6">
        {navSections.map((section, sIdx) => (
          <div key={section.title} className="space-y-3">
            {!isCollapsed && (
              <motion.h4
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="px-4 text-[10px] font-black uppercase tracking-[0.25em] text-gray-400/60 dark:text-gray-500/60"
              >
                {t(section.title)}
              </motion.h4>
            )}
            <div className={`flex flex-col ${isCollapsed ? 'gap-3' : 'gap-1'}`}>
              {section.items.map(({ icon, text, link }, iIdx) => {
                const isActive = pathname === link;
                return (
                  <Link
                    key={text}
                    href={link}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="relative px-2 group"
                  >
                    <motion.div
                      whileHover={{ x: isCollapsed ? 0 : 4 }}
                      whileTap={{ scale: 0.97 }}
                      className={`
                        flex items-center gap-4 px-3 py-3 rounded-2xl transition-all duration-300 relative
                        ${isActive
                          ? 'bg-gradient-to-r from-indigo-600/10 to-purple-600/10 dark:from-indigo-600/20 dark:to-purple-600/20 text-indigo-600 dark:text-indigo-400 shadow-[inset_0_0_0_1px_rgba(99,102,241,0.15)] ring-1 ring-white/10'
                          : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'}
                        ${isCollapsed ? 'justify-center p-0 h-12 w-12 mx-auto' : ''}
                      `}
                    >
                      <span className={`text-xl transition-all duration-300 ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]' : 'group-hover:scale-110'}`}>
                        {icon}
                      </span>
                      {!isCollapsed && (
                        <span className={`flex-1 text-[13px] font-bold tracking-wide truncate transition-colors ${isActive ? 'text-gray-900 dark:text-white' : ''}`}>
                          {t(text)}
                        </span>
                      )}

                      {/* Active Indicator Pillar */}
                      {isActive && (
                        <motion.div
                          layoutId="activeNav"
                          className={`absolute ${isCollapsed ? '-right-1' : 'left-0'} w-1 h-6 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full shadow-[0_0_12px_rgba(99,102,241,0.5)]`}
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
      <div className="mt-auto pt-6 border-t border-gray-100 dark:border-white/5">
        <motion.div
          className={`
            group flex items-center gap-3 p-2.5 rounded-[1.5rem] transition-all duration-300
            ${isCollapsed ? 'justify-center' : 'hover:bg-gray-50 dark:hover:bg-white/5 bg-white/50 dark:bg-white/[0.02] border border-transparent hover:border-gray-100 dark:hover:border-white/5'}
          `}
        >
          <div className="relative shrink-0">
            <div className={`
              relative p-[2.5px] rounded-2xl transition-all duration-500 group-hover:rotate-3
              ${user?.stories?.length > 0 ? 'bg-gradient-to-tr from-amber-500 via-red-500 to-purple-500 shadow-lg shadow-red-500/20' : 'bg-gray-100 dark:bg-gray-800'}
            `}>
              <div className="bg-white dark:bg-gray-900 rounded-[13px] p-0.5">
                <Image
                  src={user?.profilePhoto?.url || '/default-profile.png'}
                  alt="Profile"
                  width={44}
                  height={44}
                  className="rounded-[11px] w-10 h-10 object-cover"
                />
              </div>
            </div>
            {onlineUsers?.includes(user?._id) && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-[3px] border-white dark:border-[#0B0F1A] shadow-sm z-10" />
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
                <p className="text-[13px] font-black text-gray-900 dark:text-white truncate tracking-tight">
                  {user?.username || "Guest Signal"}
                </p>
                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 truncate uppercase tracking-widest mt-0.5">
                  {user?.profileName || "@syncing..."}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {!isCollapsed && (
            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}
              whileTap={{ scale: 0.9 }}
              onClick={user?.Logout}
              className="p-2.5 rounded-xl text-gray-400 transition-all duration-300"
              title={t('Terminate Session')}
            >
              <FiLogOut className="text-lg" />
            </motion.button>
          )}
        </motion.div>

        {isCollapsed && (
          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}
            whileTap={{ scale: 0.9 }}
            onClick={user?.Logout}
            className="flex mx-auto mt-4 p-3 rounded-2xl text-gray-400 transition-all duration-300"
            title={t('Terminate')}
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