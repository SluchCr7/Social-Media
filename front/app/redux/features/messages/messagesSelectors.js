import { createSelector } from '@reduxjs/toolkit';

const selectMessagesState = (state) => state.messages;

export const selectSelectedUser = createSelector(
  [selectMessagesState],
  (messages) => messages?.selectedUser
);
export const selectReplyingTo = createSelector(
  [selectMessagesState],
  (messages) => messages?.replyingTo
);
