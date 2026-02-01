'use client';

import React from 'react';
import { motion } from 'framer-motion';

const tabs = ['Posts', 'Comments', 'Reels', 'Photos', 'Music'];

const Tabs = ({ activeTab, setActiveTab }) => (
  <div className="w-full mt-12 mb-8">
    <div className="max-w-fit mx-auto bg-gray-100/50 dark:bg-white/[0.03] border border-gray-200/50 dark:border-white/5 p-1.5 rounded-[2rem] flex items-center gap-1 overflow-x-auto no-scrollbar backdrop-blur-xl">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`relative px-8 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 whitespace-nowrap ${activeTab === tab
            ? 'text-gray-900 dark:text-white'
            : 'text-gray-500 dark:text-white/40 hover:text-gray-700 dark:hover:text-white/70'
            }`}
        >
          <span className="relative z-10">{tab}</span>
          {activeTab === tab && (
            <motion.div
              layoutId="activeProfileTab"
              className="absolute inset-0 bg-white dark:bg-white/10 rounded-[1.5rem] border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-lg"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
        </button>
      ))}
    </div>
  </div>
);

export default Tabs;
