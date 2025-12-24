'use client';

import React from 'react';
import { motion } from 'framer-motion';

const tabs = ['Posts', 'Comments', 'Reels', 'Photos', 'Music'];

const Tabs = ({ activeTab, setActiveTab }) => (
  <div className="w-full mt-12 mb-8">
    <div className="max-w-fit mx-auto bg-white/[0.03] border border-white/5 p-1.5 rounded-[1.8rem] flex items-center gap-1 overflow-x-auto scrollbar-hide">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`relative px-8 py-3 rounded-[1.4rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 whitespace-nowrap ${activeTab === tab
              ? 'text-white'
              : 'text-white/30 hover:text-white/60'
            }`}
        >
          <span className="relative z-10">{tab}</span>
          {activeTab === tab && (
            <motion.div
              layoutId="activeProfileTab"
              className="absolute inset-0 bg-white/10 rounded-[1.4rem] border border-white/10 shadow-lg"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
        </button>
      ))}
    </div>
  </div>
);

export default Tabs;
