'use client';

import React, { createContext, useContext, useCallback, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import UnifiedModal from '../Component/UnifiedModal';
import { HiCheckCircle, HiXCircle, HiInformationCircle, HiArrowPath } from 'react-icons/hi2';

const FeedbackContext = createContext();

export const FeedbackProvider = ({ children }) => {
    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        title: '',
        text: '',
        confirmText: '',
        cancelText: '',
        type: 'warning',
        resolve: null
    });

    /**
     * Unified premium custom notification system
     */
    const showToast = useCallback((message, type = 'success', options = {}) => {
        const iconMap = {
            success: <HiCheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0" />,
            error: <HiXCircle className="w-6 h-6 text-rose-500 flex-shrink-0" />,
            loading: <HiArrowPath className="w-6 h-6 text-indigo-500 animate-spin flex-shrink-0" />,
            info: <HiInformationCircle className="w-6 h-6 text-blue-500 flex-shrink-0" />
        };

        const icon = iconMap[type] || iconMap.info;

        // Use custom rendering for premium SaaS style look and feel
        toast.custom((t) => (
            <div
                className={`max-w-md w-full bg-white/90 dark:bg-[#0c0c0e]/95 backdrop-blur-2xl border border-gray-200/80 dark:border-white/5 p-4 rounded-2xl shadow-2xl flex items-center gap-3.5 transition-all duration-300 transform pointer-events-auto ${
                    t.visible ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-2'
                }`}
                style={{
                    boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.15)',
                }}
            >
                <div className="flex-shrink-0">
                    {icon}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-0.5">
                        {type === 'success' ? 'Success' : type === 'error' ? 'System Alert' : type === 'loading' ? 'Loading' : 'Notification'}
                    </p>
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-100 leading-tight">
                        {message}
                    </p>
                </div>
                <button
                    onClick={() => toast.dismiss(t.id)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors text-xs font-black uppercase tracking-widest px-2.5 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 flex-shrink-0"
                >
                    Dismiss
                </button>
            </div>
        ), {
            id: options.id,
            duration: type === 'loading' ? Infinity : (type === 'error' ? 6000 : 3500),
            ...options
        });
    }, []);

    /**
     * Professional confirmation modal (replaces basic swal)
     */
    const confirmAction = useCallback(({
        title = 'Are you sure?',
        text = "You won't be able to revert this!",
        confirmButtonText = 'Confirm',
        cancelButtonText = 'Cancel',
        type = 'warning'
    }) => {
        return new Promise((resolve) => {
            setModalConfig({
                isOpen: true,
                title,
                text,
                confirmText: confirmButtonText,
                cancelText: cancelButtonText,
                type: type === 'warning' && confirmButtonText === 'Log Out' ? 'danger' : type,
                resolve
            });
        });
    }, []);

    const handleConfirm = () => {
        if (modalConfig.resolve) modalConfig.resolve(true);
        setModalConfig(prev => ({ ...prev, isOpen: false }));
    };

    const handleCancel = () => {
        if (modalConfig.resolve) modalConfig.resolve(false);
        setModalConfig(prev => ({ ...prev, isOpen: false }));
    };

    const showAlert = useCallback((message) => {
        showToast(message, 'success');
    }, [showToast]);

    const value = {
        showToast,
        confirmAction,
        showAlert,
        toast,
    };

    return (
        <FeedbackContext.Provider value={value}>
            {children}
            <Toaster
                position="top-center"
                reverseOrder={false}
                gutter={8}
            />
            <UnifiedModal
                isOpen={modalConfig.isOpen}
                onClose={handleCancel}
                onConfirm={handleConfirm}
                title={modalConfig.title}
                text={modalConfig.text}
                confirmText={modalConfig.confirmText}
                cancelText={modalConfig.cancelText}
                type={modalConfig.type}
            />
        </FeedbackContext.Provider>
    );
};

export const useFeedback = () => {
    const context = useContext(FeedbackContext);
    if (!context) {
        throw new Error('useFeedback must be used within a FeedbackProvider');
    }
    return context;
};

// Aliases for backward compatibility
export const useAlert = useFeedback;
