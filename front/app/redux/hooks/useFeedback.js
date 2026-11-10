'use client';

import React, { useCallback } from 'react';
import toast from 'react-hot-toast';
import { HiCheckCircle, HiXCircle, HiInformationCircle, HiArrowPath } from 'react-icons/hi2';
import { requestConfirmation } from '../features/feedback/FeedbackBridge';



export const useFeedback = () => {
  const showToast = useCallback((message, type = 'success', options = {}) => {
    const iconMap = {
      success: <HiCheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0" />,
      error: <HiXCircle className="w-6 h-6 text-rose-500 flex-shrink-0" />,
      loading: <HiArrowPath className="w-6 h-6 text-indigo-500 animate-spin flex-shrink-0" />,
      info: <HiInformationCircle className="w-6 h-6 text-blue-500 flex-shrink-0" />,
    };

    const icon = iconMap[type] || iconMap.info;

    return toast.custom(
      (t) => (
        <div
          className={`max-w-md w-full bg-white/90 dark:bg-[#0c0c0e]/95 backdrop-blur-2xl border border-gray-200/80 dark:border-white/5 p-4 rounded-2xl shadow-2xl flex items-center gap-3.5 transition-all duration-300 transform pointer-events-auto ${
            t.visible ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-2'
          }`}
          style={{
            boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.15)',
          }}
        >
          <div className="flex-shrink-0">{icon}</div>
          <div className="flex-1 min-w-0">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-0.5">
              {type === 'success'
                ? 'Success'
                : type === 'error'
                ? 'System Alert'
                : type === 'loading'
                ? 'Loading'
                : 'Notification'}
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
      ),
      {
        id: options.id,
        duration: type === 'loading' ? Infinity : type === 'error' ? 6000 : 3500,
        ...options,
      }
    );
  }, []);

  const confirmAction = useCallback(
    ({
      title = 'Are you sure?',
      text = "You won't be able to revert this!",
      confirmButtonText = 'Confirm',
      cancelButtonText = 'Cancel',
      type = 'warning',
    }) => {
      return requestConfirmation({ title, text, confirmButtonText, cancelButtonText, type });
    },
    []
  );

  const showAlert = useCallback(
    (message) => {
      showToast(message, 'success');
    },
    [showToast]
  );

  return {
    showToast,
    confirmAction,
    showAlert,
    toast,
  };
};

export const useAlert = useFeedback;
export default useFeedback;
