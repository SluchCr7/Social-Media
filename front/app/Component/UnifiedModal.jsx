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
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 leading-relaxed mb-8">
                            {text}
                        </p>

                        <div className="flex flex-col w-full gap-3">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={onConfirm}
                                disabled={isLoading}
                                className={`w-full py-4 rounded-2xl text-white font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-2 ${buttonStyles[type]}`}
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : confirmText}
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={onClose}
                                disabled={isLoading}
                                className="w-full py-4 text-gray-500 dark:text-gray-400 font-bold text-sm hover:bg-gray-50 dark:hover:bg-white/5 rounded-2xl transition-all"
                            >
                                {cancelText}
                            </motion.button>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
                    >
                        <HiXMark size={20} />
                    </button>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default UnifiedModal;
