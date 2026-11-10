import { createSelector } from '@reduxjs/toolkit';

const EMPTY_ARRAY = [];
const EMPTY_OBJECT = Object.freeze({});

export const selectMessagesState = (state) => state.messages;
export const selectConversationUsers = createSelector([selectMessagesState], (msg) => msg?.users || EMPTY_ARRAY);
export const selectIsUserLoading = createSelector([selectMessagesState], (msg) => Boolean(msg?.isUserLoading));
export const selectSelectedUser = createSelector([selectMessagesState], (msg) => msg?.selectedUser);
export const selectMessages = createSelector([selectMessagesState], (msg) => msg?.messages || EMPTY_ARRAY);
export const selectIsMessagesLoading = createSelector([selectMessagesState], (msg) => Boolean(msg?.isMessagesLoading));
export const selectMessagesByUser = createSelector([selectMessagesState], (msg) => msg?.messagesByUser || EMPTY_ARRAY);
export const selectReplyingTo = createSelector([selectMessagesState], (msg) => msg?.replyingTo);
export const selectUnreadTotalMessages = createSelector([selectMessagesState], (msg) => msg?.unReadedMessage || 0);
export const selectUnreadCountPerUser = createSelector([selectMessagesState], (msg) => msg?.unreadCountPerUser || EMPTY_OBJECT);
