'use client';

import axios from 'axios';
import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { useFeedback } from './FeedbackContext';
import { MESSAGES } from '../utils/messages';

const UserAdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(UserAdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within a UserAdminContextProvider');
  }
  return context;
};

export const UserAdminContextProvider = ({ children }) => {
  const { user, setUser, setUsers } = useAuth();
  const { showToast, confirmAction } = useFeedback();
  const [loading, setLoading] = useState(false);

  const getAuthHeader = useCallback(() => ({
    headers: { Authorization: `Bearer ${user?.token}` }
  }), [user?.token]);

  // --- Admin Actions ---

  /**
   * Promote a user to Admin rank
   */
  const makeUserAdmin = useCallback(async (userId) => {
    if (!user?.isAdmin) return showToast(MESSAGES.COMMON.UNAUTHORIZED, 'error');

    const isConfirmed = await confirmAction({
      title: 'Promote User',
      text: 'Are you sure you want to grant admin privileges to this user?',
      confirmButtonText: 'Confirm Promotion'
    });

    if (!isConfirmed) return;

    setLoading(true);
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/admin/${userId}`,
        {},
        getAuthHeader()
      );

      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isAdmin: true } : u))
      );
      showToast(res.data.message || 'User promoted to Admin successfully.', 'success');
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || 'Failed to update user role.', 'error');
    } finally {
      setLoading(false);
    }
  }, [user?.isAdmin, confirmAction, getAuthHeader, setUsers, showToast]);

  /**
   * Block or Unblock a user
   */
  const blockOrUnblockUser = useCallback(async (id) => {
    if (!user?.token) return showToast('Login required', 'error');

    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/block/${id}`,
        {},
        getAuthHeader()
      );

      setUser((prevUser) => {
        const isBlocked = prevUser.blockedUsers?.includes(id);
        const updatedUser = {
          ...prevUser,
          blockedUsers: isBlocked
            ? prevUser.blockedUsers.filter((b) => b !== id)
            : [...(prevUser.blockedUsers || []), id],
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return updatedUser;
      });

      showToast(res.data.message || 'Block status updated.', 'success');
      return res.data.updatedTargetUser;
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || 'Error updating block status.', 'error');
    }
  }, [user?.token, getAuthHeader, setUser, showToast]);

  /**
   * Verify an account (Premium/Blue Badge)
   */
  const makeAccountPremiumVerify = useCallback(async () => {
    if (!user?.token) return;

    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/verify`,
        {},
        getAuthHeader()
      );

      const updatedUser = { ...user, isAccountWithPremiumVerify: true };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      showToast(res.data.message || 'Account verified successfully.', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to verify account.', 'error');
    }
  }, [user, getAuthHeader, setUser, showToast]);

  /**
   * Update account status (e.g., active, suspended)
   */
  const updateAccountStatus = useCallback(async (userId, status, days = 7) => {
    if (!user?.isAdmin) return showToast(MESSAGES.COMMON.UNAUTHORIZED, 'error');

    try {
      const body = { accountStatus: status };
      if (status === 'suspended') body.days = days;

      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/status/${userId}`,
        body,
        getAuthHeader()
      );

      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, accountStatus: status } : u))
      );

      if (user._id === userId) {
        const updatedUser = { ...user, accountStatus: status };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }

      showToast(res.data.message || `Account status updated to ${status}.`, 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to update account status.', 'error');
    }
  }, [user, getAuthHeader, setUser, setUsers, showToast]);

  /**
   * Permanently delete a user account
   */
  const deleteUser = useCallback(async (id) => {
    if (!user?.isAdmin) return showToast(MESSAGES.COMMON.UNAUTHORIZED, 'error');

    const isConfirmed = await confirmAction({
      title: 'Delete User',
      text: 'This action is permanent and cannot be undone!',
      confirmButtonText: 'Delete Permanently'
    });

    if (!isConfirmed) return;

    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/delete/${id}`,
        getAuthHeader()
      );

      showToast(res.data.message || 'User account deleted.', 'success');
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      console.error(err);
      showToast('Failed to delete user account.', 'error');
    }
  }, [user?.isAdmin, confirmAction, getAuthHeader, setUsers, showToast]);

  // --- Context Value ---
  const value = useMemo(() => ({
    makeUserAdmin,
    blockOrUnblockUser,
    updateAccountStatus,
    deleteUser,
    makeAccountPremiumVerify,
    loading,
  }), [
    makeUserAdmin, blockOrUnblockUser, updateAccountStatus,
    deleteUser, makeAccountPremiumVerify, loading
  ]);

  return (
    <UserAdminContext.Provider value={value}>
      {children}
    </UserAdminContext.Provider>
  );
};
