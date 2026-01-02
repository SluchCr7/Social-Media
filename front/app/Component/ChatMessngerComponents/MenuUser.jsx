'use client';
import { Settings, UserCheck, Users2, Shield } from 'lucide-react';
import React from 'react'
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const MenuUser = ({
  setMenuOpen,
  router,
  users,
  markAllAsReadBetweenUsers
}) => {
  const { t } = useTranslation()
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -10 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="
          absolute right-0 top-10 w-60
          bg-[#1a1a1a]/95 backdrop-blur-xl
          border border-white/10
          rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] 
          overflow-hidden z-[60]
          p-1.5
        "
    >
      <div className="flex flex-col gap-1">
        {/* Profile */}
        <button
          onClick={() => {
            router.push(`/Pages/Profile`);
            setMenuOpen(false);
          }}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 transition-all group"
        >
          <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
            <UserCheck size={16} />
          </span>
          {t("View Profile")}
        </button>

        {/* Mark all as read */}
        <button
          onClick={() => {
            users.forEach(u => markAllAsReadBetweenUsers(u._id));
            setMenuOpen(false);
          }}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 transition-all group"
        >
          <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
            <Users2 size={16} />
          </span>
          {t("Mark All Read")}
        </button>

        <div className="h-px bg-white/5 my-1 mx-2" />

        {/* Settings */}
        <button
          onClick={() => {
            router.push('/Pages/Setting');
            setMenuOpen(false);
          }}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 transition-all group"
        >
          <span className="p-1.5 rounded-lg bg-white/5 text-white/40 group-hover:bg-white/20 group-hover:text-white transition-colors">
            <Settings size={16} />
          </span>
          {t("Preferences")}
        </button>
      </div>

      {/* Footer tiny text */}
      <div className="px-3 py-2 mt-1 bg-black/20 -mx-1.5 -mb-1.5 flex items-center justify-between">
        <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Secure Conn.</span>
        <Shield size={10} className="text-white/20" />
      </div>

    </motion.div>
  )
}

export default MenuUser