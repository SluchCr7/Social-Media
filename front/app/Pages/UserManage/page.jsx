'use client';
import React, { useState, useMemo } from 'react';
import { useAuth } from '@/app/Context/AuthContext';
import UserManagePresintation from './UserManagePresintation';
import { useAdmin } from '@/app/Context/UserAdminContext';

const AdminUsersPage = () => {
  const { users } = useAuth();
  const {deleteUser, updateAccountStatus, makeUserAdmin} = useAdmin()
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 6;

  // 🔍 فلترة المستخدمين
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchesSearch =
        u.username?.toLowerCase().includes(search.toLowerCase()) ||
        u.profileName?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'admin' && u.isAdmin) ||
        (statusFilter === 'banned' && u.accountStatus === 'banned') ||
        (statusFilter === 'verified' && u.isAccountWithPremiumVerify);

      return matchesSearch && matchesStatus;
    });
  }, [users, search, statusFilter]);

  // 📄 تقسيم الصفحات
  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // ✅ تمرير كل القيم إلى المكون
  return (
    <UserManagePresintation
      search={search}
      setSearch={setSearch}
      statusFilter={statusFilter}
      setStatusFilter={setStatusFilter}
      currentUsers={currentUsers}
      setCurrentPage={setCurrentPage}
      makeUserAdmin={makeUserAdmin}
      updateAccountStatus={updateAccountStatus}
      deleteUser={deleteUser}
      totalPages={totalPages}
    />
  );
};

export default AdminUsersPage;

