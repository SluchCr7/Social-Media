'use client';

import React from 'react';
import { useAdmin } from '@/app/redux/hooks/useAdmin';
import UserManagePresintation from './UserManagePresintation';

const AdminUsersPage = () => {
  const {
    users,
    usersTotal,
    usersPage,
    usersTotalPages,
    usersSearch,
    usersStatusFilter,
    usersRoleFilter,
    usersSort,
    isUsersLoading,
    setUsersPage,
    setUsersSearch,
    setUsersStatusFilter,
    setUsersRoleFilter,
    setUsersSort,
    updateUserStatus,
    toggleUserRole,
    toggleUserVerify,
    forceLogoutUser,
    deleteUser,
    refetchUsers,
  } = useAdmin();

  return (
    <UserManagePresintation
      users={users}
      usersTotal={usersTotal}
      currentPage={usersPage}
      totalPages={usersTotalPages}
      search={usersSearch}
      setSearch={setUsersSearch}
      statusFilter={usersStatusFilter}
      setStatusFilter={setUsersStatusFilter}
      roleFilter={usersRoleFilter}
      setRoleFilter={setUsersRoleFilter}
      sortBy={usersSort}
      setSortBy={setUsersSort}
      isLoading={isUsersLoading}
      setCurrentPage={setUsersPage}
      updateAccountStatus={updateUserStatus}
      toggleAdminRole={toggleUserRole}
      toggleUserVerify={toggleUserVerify}
      forceLogoutUser={forceLogoutUser}
      deleteUser={deleteUser}
      refetchUsers={refetchUsers}
    />
  );
};

export default AdminUsersPage;
