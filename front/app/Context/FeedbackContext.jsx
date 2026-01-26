'use client';

import React, { createContext, useContext, useCallback } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import swal from 'sweetalert';

const FeedbackContext = createContext();

export const FeedbackProvider = ({ children }) => {

    /**
     * Unified missing/notification system
     * Support types: success, error, warning, info, loading
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
    const confirmAction = useCallback(async ({
        title = 'Are you sure?',
        text = "You won't be able to revert this!",
        icon = 'warning',
        dangerMode = true,
        confirmButtonText = 'Confirm',
        cancelButtonText = 'Cancel'
    }) => {
        return swal({
            title,
            text,
            icon,
            buttons: {
                cancel: {
                    text: cancelButtonText,
                    value: null,
                    visible: true,
                    closeModal: true,
                },
                confirm: {
                    text: confirmButtonText,
                    value: true,
                    visible: true,
                    closeModal: true,
                },
            },
            dangerMode,
        });
    }, []);

    // Backward compatibility for AlertContext's showAlert
    const showAlert = useCallback((message) => {
        showToast(message, 'success');
    }, [showToast]);

    const value = {
        showToast,
        confirmAction,
        showAlert, // for backward compatibility
        toast, // exposing raw toast for advanced usage
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
                        theme: {
                            primary: '#10b981',
                        },
                    },
                    error: {
                        duration: 5000,
                        theme: {
                            primary: '#ef4444',
                        },
                    },
                }}
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
