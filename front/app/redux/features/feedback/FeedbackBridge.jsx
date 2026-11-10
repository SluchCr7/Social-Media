'use client';

import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import UnifiedModal from '../../../Component/UnifiedModal';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { selectModalConfig } from './feedbackSelectors';
import { closeConfirmModal } from './feedbackSlice';

// Global resolve handler for confirmAction promise
let confirmResolver = null;

export const requestConfirmation = ({
  title = 'Are you sure?',
  text = "You won't be able to revert this!",
  confirmButtonText = 'Confirm',
  cancelButtonText = 'Cancel',
  type = 'warning',
}) => {
  return new Promise((resolve) => {
    confirmResolver = resolve;
    const event = new CustomEvent('app:open-confirm-modal', {
      detail: {
        title,
        text,
        confirmText: confirmButtonText,
        cancelText: cancelButtonText,
        type: type === 'warning' && confirmButtonText === 'Log Out' ? 'danger' : type,
      },
    });
    window.dispatchEvent(event);
  });
};

export default function FeedbackBridge() {
  const dispatch = useAppDispatch();
  const reduxConfig = useAppSelector(selectModalConfig);
  const [localModal, setLocalModal] = useState({
    isOpen: false,
    title: '',
    text: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    type: 'warning',
  });

  React.useEffect(() => {
    const handleCustomOpen = (e) => {
      setLocalModal({
        isOpen: true,
        ...e.detail,
      });
    };
    window.addEventListener('app:open-confirm-modal', handleCustomOpen);
    return () => window.removeEventListener('app:open-confirm-modal', handleCustomOpen);
  }, []);

  const isOpen = localModal.isOpen || reduxConfig.isOpen;
  const activeConfig = localModal.isOpen ? localModal : reduxConfig;

  const handleConfirm = () => {
    if (confirmResolver) {
      confirmResolver(true);
      confirmResolver = null;
    }
    setLocalModal((prev) => ({ ...prev, isOpen: false }));
    dispatch(closeConfirmModal());
  };

  const handleCancel = () => {
    if (confirmResolver) {
      confirmResolver(false);
      confirmResolver = null;
    }
    setLocalModal((prev) => ({ ...prev, isOpen: false }));
    dispatch(closeConfirmModal());
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} gutter={8} />
      <UnifiedModal
        isOpen={isOpen}
        onClose={handleCancel}
        onConfirm={handleConfirm}
        title={activeConfig.title}
        text={activeConfig.text}
        confirmText={activeConfig.confirmText}
        cancelText={activeConfig.cancelText}
        type={activeConfig.type}
      />
    </>
  );
}
