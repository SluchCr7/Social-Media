'use client';
import React from 'react';
import { motion } from 'framer-motion';

const ContentSidebar = ({ items, activeId, onItemClick }) => {
    return (
        <div className="sticky top-24 space-y-2 p-2 rounded-[2.5rem] bg-white/50 dark:bg-white/[0.02] backdrop-blur-xl border border-gray-100 dark:border-white/5 shadow-sm">
            {items.map((item) => {
                const isActive = activeId === item.id;
                return (
                    <button
                        key={item.id}
                        onClick={() => onItemClick(item.id)}
                        className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group ${
                            isActive 
                            ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-xl' 
                            : 'hover:bg-gray-50 dark:hover:bg-white/5 text-gray-500 hover:text-gray-900 dark:hover:text-white'
                        }`}
                    >
                        <div className={`p-2 rounded-xl transition-colors ${
                            isActive 
                            ? 'bg-white/20 dark:bg-gray-900/10' 
                            : 'bg-gray-100 dark:bg-white/5 group-hover:bg-indigo-500 group-hover:text-white'
                        }`}>
                            {item.icon}
                        </div>
                        <span className="text-[11px] font-black uppercase tracking-widest text-left truncate">
                            {item.label}
                        </span>
                        {isActive && (
                            <motion.div 
                                layoutId="sidebarDot"
                                className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500" 
                            />
                        )}
                    </button>
                );
            })}
        </div>
    );
};

export default ContentSidebar;
