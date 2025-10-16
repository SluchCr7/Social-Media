import { Settings, UserCheck, Users2 } from 'lucide-react';
import React from 'react'
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
const MenuUser = ({
    setMenuOpen,
    router,
    users,
    markAllAsReadBetweenUsers
}) => {
  const {t} = useTranslation()
  return (
    <motion.div
        initial={{ opacity: 0, scale: 0.9, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: -10 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="
          absolute right-0 mt-3 w-56 
          bg-lightMode-menu dark:bg-darkMode-menu
          border border-lightMode-text/10 dark:border-darkMode-text/20
          rounded-2xl shadow-2xl overflow-hidden z-50
          backdrop-blur-md
        "
      >
        <div className="py-2">
          {/* Profile */}
          <button
            onClick={() => {
              router.push(`/Pages/Profile`);
              setMenuOpen(false);
            }}
            className="
              w-full flex items-center gap-3 px-4 py-3 text-sm font-medium
              text-lightMode-text2 dark:text-gray-300
              hover:bg-lightMode-bg/60 dark:hover:bg-darkMode-bg/50
              transition-all duration-200
            "
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
              <UserCheck className="w-4 h-4" />
            </span>
            {t("Profile")}
          </button>

          {/* Mark all as read */}
          <button
            onClick={() => {
              users.forEach(u => markAllAsReadBetweenUsers(u._id));
              setMenuOpen(false);
            }}
            className="
              w-full flex items-center gap-3 px-4 py-3 text-sm font-medium
              text-lightMode-text2 dark:text-gray-300
              hover:bg-lightMode-bg/60 dark:hover:bg-darkMode-bg/50
              transition-all duration-200
            "
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400">
              <Users2 className="w-4 h-4" />
            </span>
            {t("Mark All as Read")}
          </button>

          {/* Settings */}
          <button
            onClick={() => {
              router.push('/Pages/Setting');
              setMenuOpen(false);
            }}
            className="
              w-full flex items-center gap-3 px-4 py-3 text-sm font-medium
              text-lightMode-text2 dark:text-gray-300
              hover:bg-lightMode-bg/60 dark:hover:bg-darkMode-bg/50
              transition-all duration-200
            "
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400">
              <Settings className="w-4 h-4" />
            </span>
            {t("Settings")}
          </button>
        </div>

    </motion.div>
  )
}

export default MenuUser