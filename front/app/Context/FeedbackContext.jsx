'use client';

import React, { createContext, useContext, useCallback } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import UnifiedModal from '../Component/UnifiedModal';

const FeedbackContext = createContext();

export const FeedbackProvider = ({ children }) => {
    const [modalConfig, setModalConfig] = React.useState({
        isOpen: false,
        title: '',
        text: '',
        confirmText: '',
        cancelText: '',
        type: 'warning',
        resolve: null
    });

    /**
     * Unified missing/notification system
     */
    const showToast = useCallback((message, type = 'success', options = {}) => {
        switch (type) {
            case 'success':
                toast.success(message, { ...options });
                break;
            case 'error':
                toast.error(message, { ...options });
                break;
            case 'loading':
                return toast.loading(message, { ...options });
            case 'promise':
                return toast.promise(options.promise, options.msgs, options.toastOptions);
            default:
                toast(message, { ...options });
        }
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
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#1f2937',
                        color: '#fff',
                        borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(10px)',
                    },
                    success: {
                        duration: 3000,
                        theme: { primary: '#10b981' },
                    },
                    error: {
                        duration: 5000,
                        theme: { primary: '#ef4444' },
                    },
                }}
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
