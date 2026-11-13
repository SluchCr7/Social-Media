'use client';

import { useMemo, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
  selectAdminActiveTab,
  selectAdminUsersPage,
  selectAdminUsersSearch,
  selectAdminUsersStatusFilter,
  selectAdminUsersRoleFilter,
  selectAdminUsersSort,
  selectAdminContentTab,
  selectAdminContentSearch,
  selectAdminContentPage,
  selectAdminLogsPage,
  selectAdminSelectedUser,
} from '../features/admin/adminSelectors';
import {
  setActiveTab,
  setUsersPage,
  setUsersSearch,
  setUsersStatusFilter,
  setUsersRoleFilter,
  setUsersSort,
  setContentTab,
  setContentSearch,
  setContentPage,
  setLogsPage,
  setSelectedUser,
} from '../features/admin/adminSlice';
import {
  useGetAdminStatsQuery,
  useGetAdminUsersQuery,
  useUpdateUserStatusMutation,
  useToggleUserRoleMutation,
  useToggleUserVerifyMutation,
  useForceLogoutUserMutation,
  useDeleteUserByAdminMutation,
  useGetAdminContentQuery,
  useDeleteContentItemMutation,
  useBroadcastAnnouncementMutation,
  useGetAdminLogsQuery,
  useRunSystemCleanupMutation,
} from '../features/admin/adminApi';
import { useAuth } from './useAuth';
import { useFeedback } from './useFeedback';

export const useAdmin = () => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { showToast, confirmAction } = useFeedback();

  const activeTab = useAppSelector(selectAdminActiveTab);
  const usersPage = useAppSelector(selectAdminUsersPage);
  const usersSearch = useAppSelector(selectAdminUsersSearch);
  const usersStatusFilter = useAppSelector(selectAdminUsersStatusFilter);
  const usersRoleFilter = useAppSelector(selectAdminUsersRoleFilter);
  const usersSort = useAppSelector(selectAdminUsersSort);
  const contentTab = useAppSelector(selectAdminContentTab);
  const contentSearch = useAppSelector(selectAdminContentSearch);
  const contentPage = useAppSelector(selectAdminContentPage);
  const logsPage = useAppSelector(selectAdminLogsPage);
  const selectedUser = useAppSelector(selectAdminSelectedUser);

  // Queries (only run if user is admin)
  const isAuthorized = Boolean(user?.isAdmin);

  const {
    data: statsData,
    isLoading: isStatsLoading,
    isFetching: isStatsFetching,
    refetch: refetchStats,
  } = useGetAdminStatsQuery(undefined, { skip: !isAuthorized });

  const {
    data: usersData,
    isLoading: isUsersLoading,
    isFetching: isUsersFetching,
    refetch: refetchUsers,
  } = useGetAdminUsersQuery(
    {
      page: usersPage,
      search: usersSearch,
      status: usersStatusFilter,
      role: usersRoleFilter,
      sort: usersSort,
    },
    { skip: !isAuthorized || activeTab !== 'Users' }
  );

  const {
    data: contentData,
    isLoading: isContentLoading,
    isFetching: isContentFetching,
    refetch: refetchContent,
  } = useGetAdminContentQuery(
    {
      type: contentTab,
      page: contentPage,
      search: contentSearch,
    },
    { skip: !isAuthorized || activeTab !== 'Content' }
  );

  const {
    data: logsData,
    isLoading: isLogsLoading,
    isFetching: isLogsFetching,
    refetch: refetchLogs,
  } = useGetAdminLogsQuery(
    {
      page: logsPage,
    },
    { skip: !isAuthorized || activeTab !== 'Logs' }
  );

  // Mutations
  const [updateUserStatusMutation] = useUpdateUserStatusMutation();
  const [toggleUserRoleMutation] = useToggleUserRoleMutation();
  const [toggleUserVerifyMutation] = useToggleUserVerifyMutation();
  const [forceLogoutUserMutation] = useForceLogoutUserMutation();
  const [deleteUserByAdminMutation] = useDeleteUserByAdminMutation();
  const [deleteContentItemMutation] = useDeleteContentItemMutation();
  const [broadcastAnnouncementMutation] = useBroadcastAnnouncementMutation();
  const [runSystemCleanupMutation] = useRunSystemCleanupMutation();

  const handleUpdateUserStatus = useCallback(
    async (id, status, days = 7, reason = '') => {
      try {
        const res = await updateUserStatusMutation({ id, status, days, reason }).unwrap();
        showToast(res.message || 'User status updated', 'success');
        return res;
      } catch (err) {
        showToast(err.data?.message || 'Failed to update status', 'error');
        throw err;
      }
    },
    [updateUserStatusMutation, showToast]
  );

  const handleToggleUserRole = useCallback(
    async (id) => {
      try {
        const res = await toggleUserRoleMutation(id).unwrap();
        showToast(res.message || 'User role updated', 'success');
        return res;
      } catch (err) {
        showToast(err.data?.message || 'Failed to update role', 'error');
        throw err;
      }
    },
    [toggleUserRoleMutation, showToast]
  );

  const handleToggleUserVerify = useCallback(
    async (id) => {
      try {
        const res = await toggleUserVerifyMutation(id).unwrap();
        showToast(res.message || 'Verification updated', 'success');
        return res;
      } catch (err) {
        showToast(err.data?.message || 'Failed to update verification', 'error');
        throw err;
      }
    },
    [toggleUserVerifyMutation, showToast]
  );

  const handleForceLogoutUser = useCallback(
    async (id) => {
      const confirmed = await confirmAction({
        title: 'Terminate Sessions',
        text: 'Are you sure you want to force logout this user from all devices?',
        confirmButtonText: 'Force Logout',
      });
      if (!confirmed) return;
      try {
        const res = await forceLogoutUserMutation(id).unwrap();
        showToast(res.message || 'Sessions terminated', 'success');
      } catch (err) {
        showToast(err.data?.message || 'Failed to force logout', 'error');
      }
    },
    [confirmAction, forceLogoutUserMutation, showToast]
  );

  const handleDeleteUser = useCallback(
    async (id, reason = '') => {
      const confirmed = await confirmAction({
        title: 'Delete User Permanently',
        text: 'This action will permanently delete the user and all their posts, reels, comments, and data. This cannot be undone.',
        confirmButtonText: 'Permanently Delete',
        type: 'danger',
      });
      if (!confirmed) return;
      try {
        const res = await deleteUserByAdminMutation({ id, reason }).unwrap();
        showToast(res.message || 'User deleted', 'success');
      } catch (err) {
        showToast(err.data?.message || 'Failed to delete user', 'error');
      }
    },
    [confirmAction, deleteUserByAdminMutation, showToast]
  );

  const handleDeleteContent = useCallback(
    async (type, id, reason = '') => {
      const confirmed = await confirmAction({
        title: `Delete ${type}`,
        text: `Are you sure you want to remove this ${type}?`,
        confirmButtonText: 'Delete',
        type: 'danger',
      });
      if (!confirmed) return;
      try {
        const res = await deleteContentItemMutation({ type, id, reason }).unwrap();
        showToast(res.message || `${type} removed`, 'success');
      } catch (err) {
        showToast(err.data?.message || `Failed to remove ${type}`, 'error');
      }
    },
    [confirmAction, deleteContentItemMutation, showToast]
  );

  const handleBroadcast = useCallback(
    async (title, content) => {
      try {
        const res = await broadcastAnnouncementMutation({ title, content }).unwrap();
        showToast(res.message || 'Announcement broadcasted', 'success');
        return res;
      } catch (err) {
        showToast(err.data?.message || 'Failed to broadcast', 'error');
        throw err;
      }
    },
    [broadcastAnnouncementMutation, showToast]
  );

  const handleRunCleanup = useCallback(
    async (jobType) => {
      try {
        const res = await runSystemCleanupMutation({ jobType }).unwrap();
        showToast(res.message || 'Cleanup job completed', 'success');
        return res;
      } catch (err) {
        showToast(err.data?.message || 'Cleanup job failed', 'error');
        throw err;
      }
    },
    [runSystemCleanupMutation, showToast]
  );

  return useMemo(
    () => ({
      // State
      stats: statsData?.stats || null,
      loading: isStatsLoading,
      isFetching: isStatsFetching,
      activeTab,
      users: usersData?.users || [],
      usersTotal: usersData?.total || 0,
      usersPage,
      usersTotalPages: usersData?.totalPages || 1,
      usersSearch,
      usersStatusFilter,
      usersRoleFilter,
      usersSort,
      isUsersLoading: isUsersLoading || isUsersFetching,
      contentItems: contentData?.items || [],
      contentTotal: contentData?.total || 0,
      contentTotalPages: contentData?.totalPages || 1,
      contentTab,
      contentSearch,
      contentPage,
      isContentLoading: isContentLoading || isContentFetching,
      logsItems: logsData?.logs || [],
      logs: logsData?.logs || [],
      logsTotal: logsData?.total || 0,
      logsTotalPages: logsData?.totalPages || 1,
      logsPage,
      isLogsLoading: isLogsLoading || isLogsFetching,
      selectedUser,

      // Navigation & filter setters
      setActiveTab: (tab) => dispatch(setActiveTab(tab)),
      setUsersPage: (p) => dispatch(setUsersPage(p)),
      setUsersSearch: (s) => dispatch(setUsersSearch(s)),
      setUsersStatusFilter: (sf) => dispatch(setUsersStatusFilter(sf)),
      setUsersRoleFilter: (rf) => dispatch(setUsersRoleFilter(rf)),
      setUsersSort: (srt) => dispatch(setUsersSort(srt)),
      setContentTab: (ct) => dispatch(setContentTab(ct)),
      setContentSearch: (cs) => dispatch(setContentSearch(cs)),
      setContentPage: (cp) => dispatch(setContentPage(cp)),
      setLogsPage: (lp) => dispatch(setLogsPage(lp)),
      setSelectedUser: (u) => dispatch(setSelectedUser(u)),

      // Actions & mutations
      refetchStats,
      refetchUsers,
      refetchContent,
      refetchLogs,
      updateUserStatus: handleUpdateUserStatus,
      toggleUserRole: handleToggleUserRole,
      toggleUserAdminRole: handleToggleUserRole,
      toggleUserVerify: handleToggleUserVerify,
      toggleUserVerification: handleToggleUserVerify,
      forceLogoutUser: handleForceLogoutUser,
      deleteUser: handleDeleteUser,
      deleteContent: handleDeleteContent,
      deleteContentItem: handleDeleteContent,
      broadcastAnnouncement: handleBroadcast,
      runSystemCleanup: handleRunCleanup,
    }),
    [
      statsData,
      isStatsLoading,
      isStatsFetching,
      activeTab,
      usersData,
      usersPage,
      usersSearch,
      usersStatusFilter,
      usersRoleFilter,
      usersSort,
      isUsersLoading,
      isUsersFetching,
      contentData,
      contentTab,
      contentSearch,
      contentPage,
      isContentLoading,
      isContentFetching,
      logsData,
      logsPage,
      isLogsLoading,
      isLogsFetching,
      selectedUser,
      dispatch,
      refetchStats,
      refetchUsers,
      refetchContent,
      refetchLogs,
      handleUpdateUserStatus,
      handleToggleUserRole,
      handleToggleUserVerify,
      handleForceLogoutUser,
      handleDeleteUser,
      handleDeleteContent,
      handleBroadcast,
      handleRunCleanup,
    ]
  );
};

export default useAdmin;
