'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiXMark, HiExclamationTriangle, HiInformationCircle, HiCheckCircle } from 'react-icons/hi2';

const UnifiedModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    text,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'warning', // warning, info, success, danger
    isLoading = false
}) => {
    const icons = {
        warning: <HiExclamationTriangle className="w-12 h-12 text-amber-500" />,
        info: <HiInformationCircle className="w-12 h-12 text-blue-500" />,
        success: <HiCheckCircle className="w-12 h-12 text-green-500" />,
        danger: <HiExclamationTriangle className="w-12 h-12 text-red-500" />,
    };

    const buttonStyles = {
        warning: 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20',
        info: 'bg-blue-500 hover:bg-blue-600 shadow-blue-500/20',
        success: 'bg-green-500 hover:bg-green-600 shadow-green-500/20',
        danger: 'bg-red-500 hover:bg-red-600 shadow-red-500/20',
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-md"
                />

                {/* Modal Card */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative w-full max-w-sm bg-white dark:bg-[#0D1117] rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-white/5 overflow-hidden"
                >
                    <div className="p-8 flex flex-col items-center text-center">
                        <div className="mb-6 p-4 rounded-3xl bg-gray-50 dark:bg-white/5">
                            {icons[type]}
                        </div>

                        <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">
                            {title}
                        </h3>

                        {text && (
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                                {text}
                            </p>
                        )}

                        <div className="flex items-center gap-3 w-full">
                            {onConfirm && (
                                <button
                                    onClick={onConfirm}
                                    disabled={isLoading}
                                    className={`flex-1 py-3.5 px-6 rounded-2xl text-white text-xs font-black tracking-widest uppercase transition-all duration-300 shadow-lg ${buttonStyles[type]} disabled:opacity-50`}
                                >
                                    {isLoading ? '...' : confirmText}
                                </button>
                            )}

                            <button
                                onClick={onClose}
                                disabled={isLoading}
                                className="flex-1 py-3.5 px-6 rounded-2xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 text-xs font-black tracking-widest uppercase transition-all duration-300"
                            >
                                {cancelText}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default UnifiedModal;
