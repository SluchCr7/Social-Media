'use client';

import React from 'react';
import { HiXMark } from 'react-icons/hi2';
import { motion, AnimatePresence } from 'framer-motion';
import AdminSidebar from './AdminAside';

const MobileSidebar = React.memo(({ isOpen, onClose, activeTab, setActiveTab }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] md:hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-80 h-full bg-white/95 dark:bg-[#0A0A0A]/98 backdrop-blur-3xl border-r border-gray-200 dark:border-white/10 shadow-2xl p-8"
          >
            <div className="flex items-center justify-between mb-10">
              <div className="space-y-1">
                <h2 className="text-2xl font-black uppercase tracking-tighter text-gray-900 dark:text-white">
                  Admin <span className="text-indigo-500">Panel</span>
                </h2>
                <div className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-500">
                  Neural Console
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
              >
                <HiXMark className="w-6 h-6" />
              </button>
            </div>
            <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});

MobileSidebar.displayName = 'MobileSidebar';
export default MobileSidebar;
