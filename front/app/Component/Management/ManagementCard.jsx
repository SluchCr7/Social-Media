'use client';
import React from 'react';
import { motion } from 'framer-motion';

const ManagementCard = ({ id, title, icon, children, delay = 0 }) => {
    return (
        <motion.section
            id={id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay, duration: 0.5 }}
            className="group p-8 md:p-12 rounded-[3.5rem] bg-white dark:bg-[#080808] border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-500"
        >
            <div className="space-y-8">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-500 shadow-inner group-hover:rotate-12">
                        {icon}
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight uppercase">
                        {title}
                    </h2>
                </div>

                <div className="prose prose-indigo dark:prose-invert max-w-none text-gray-600 dark:text-gray-400 font-medium leading-relaxed space-y-4">
                    {children}
                </div>
            </div>
        </motion.section>
    );
};

export default ManagementCard;
