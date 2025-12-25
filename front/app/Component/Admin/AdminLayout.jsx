'use client';

import React, { useState } from 'react';
import { HiBars3, HiXMark } from 'react-icons/hi2';
import { motion, AnimatePresence } from 'framer-motion';
import MobileSidebar from './MobileAside';

const AdminLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-[#050505] dark:via-[#0A0A0A] dark:to-[#050505]">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white/90 dark:bg-[#0A0A0A]/95 backdrop-blur-3xl border-b border-gray-200 dark:border-white/10 shadow-xl z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 flex items-center justify-center">
            <span className="text-indigo-500 font-black text-sm">A</span>
          </div>
          <h1 className="text-lg font-black uppercase tracking-tighter">
            Admin <span className="text-indigo-500">Console</span>
          </h1>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-700 dark:text-gray-300"
        >
          <HiBars3 className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Drawer */}
      <MobileSidebar
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        activeTab={children?.props?.activeTab}
        setActiveTab={children?.props?.setActiveTab}
      />

      {/* Main Content */}
      <main className="w-full pt-20 md:pt-0">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
