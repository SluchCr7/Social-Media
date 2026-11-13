import { createSelector } from '@reduxjs/toolkit';

export const selectAdminState = (state) => state.admin;
export const selectAdminActiveTab = createSelector([selectAdminState], (admin) => admin?.activeTab || 'Dashboard');
export const selectAdminUsersPage = createSelector([selectAdminState], (admin) => admin?.usersPage || 1);
export const selectAdminUsersSearch = createSelector([selectAdminState], (admin) => admin?.usersSearch || '');
export const selectAdminUsersStatusFilter = createSelector([selectAdminState], (admin) => admin?.usersStatusFilter || 'all');
export const selectAdminUsersRoleFilter = createSelector([selectAdminState], (admin) => admin?.usersRoleFilter || 'all');
export const selectAdminUsersSort = createSelector([selectAdminState], (admin) => admin?.usersSort || 'newest');
export const selectAdminContentTab = createSelector([selectAdminState], (admin) => admin?.contentTab || 'posts');
export const selectAdminContentSearch = createSelector([selectAdminState], (admin) => admin?.contentSearch || '');
export const selectAdminContentPage = createSelector([selectAdminState], (admin) => admin?.contentPage || 1);
export const selectAdminLogsPage = createSelector([selectAdminState], (admin) => admin?.logsPage || 1);
export const selectAdminSelectedUser = createSelector([selectAdminState], (admin) => admin?.selectedUser || null);
