import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  modalConfig: {
    isOpen: false,
    title: '',
    text: '',
    confirmText: '',
    cancelText: '',
    type: 'warning',
  },
};

export const feedbackSlice = createSlice({
  name: 'feedback',
  initialState,
  reducers: {
    openConfirmModal: (state, action) => {
      state.modalConfig = {
        isOpen: true,
        title: action.payload.title || 'Are you sure?',
        text: action.payload.text || "You won't be able to revert this!",
        confirmText: action.payload.confirmText || 'Confirm',
        cancelText: action.payload.cancelText || 'Cancel',
        type: action.payload.type || 'warning',
      };
    },
    closeConfirmModal: (state) => {
      state.modalConfig.isOpen = false;
    },
  },
});

export const { openConfirmModal, closeConfirmModal } = feedbackSlice.actions;

export default feedbackSlice.reducer;
