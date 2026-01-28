'use client';
import React from 'react';
import { motion } from 'framer-motion';

const PrimaryToggle = ({ checked, onChange, onColor = 'bg-indigo-600' }) => {
    return (
        <button
            onClick={() => onChange(!checked)}
            className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none ${checked ? onColor : 'bg-gray-200 dark:bg-gray-800'
                }`}
        >
            <motion.div
                animate={{ x: checked ? 26 : 2 }}
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="absolute top-1 left-0 w-4 h-4 rounded-full bg-white shadow-md flex items-center justify-center pointer-events-none"
            >
                {checked && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`w-1.5 h-1.5 rounded-full ${onColor.replace('bg-', 'text-').replace('600', '500')}`}
                    />
                )}
            </motion.div>
        </button>
    );
};

export default React.memo(PrimaryToggle);
