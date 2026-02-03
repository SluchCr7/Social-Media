'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { HiSignal } from 'react-icons/hi2';

const InfoHero = ({ title, subtitle, gradient = "from-indigo-600 to-purple-600", icon: Icon }) => {
    return (
        <div className="relative pt-24 pb-16 overflow-hidden">
            {/* 🔮 Background Effects */}
            <div className="absolute inset-0 pointer-events-none -z-10">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/5 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2" />
            </div>

            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col items-center text-center space-y-8">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 text-[10px] font-black uppercase tracking-[0.2em]"
                    >
                        <HiSignal className="w-3 h-3 animate-pulse" />
                        Network Protocols
                    </motion.div>

                    {/* Content */}
                    <div className="space-y-4 max-w-4xl">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-8xl font-black tracking-tighter text-gray-900 dark:text-white leading-[0.85]"
                        >
                            {title.split(' ').map((word, i) => (
                                <span key={i} className={i === title.split(' ').length - 1 ? `bg-gradient-to-r ${gradient} bg-clip-text text-transparent` : ''}>
                                    {word}{' '}
                                </span>
                            ))}
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-lg md:text-xl text-gray-500 dark:text-gray-400 font-medium tracking-tight max-w-2xl mx-auto leading-relaxed"
                        >
                            {subtitle}
                        </motion.p>
                    </div>

                    {Icon && (
                        <motion.div
                            initial={{ scale: 0, rotate: -20 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.3, type: "spring" }}
                            className="w-20 h-20 rounded-3xl bg-white dark:bg-white/5 shadow-2xl flex items-center justify-center text-indigo-500 border border-gray-100 dark:border-white/10"
                        >
                            <Icon className="w-10 h-10" />
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InfoHero;
