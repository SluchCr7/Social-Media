'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  FiUserCheck,
  FiUserX,
  FiTrash2,
  FiSearch,
  FiFilter,
  FiMoreVertical,
  FiGrid,
  FiList,
  FiLogOut,
  FiShield,
  FiEye,
  FiX,
  FiCheckCircle,
  FiClock,
} from 'react-icons/fi';
import {
  HiBadgeCheck,
  HiOutlineMail,
  HiOutlineIdentification,
  HiChevronLeft,
  HiChevronRight,
} from 'react-icons/hi';
import { HiArrowPath } from 'react-icons/hi2';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const UserManagePresintation = React.memo(({
  users,
  usersTotal,
  currentPage,
  totalPages,
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  roleFilter,
  setRoleFilter,
  sortBy,
  setSortBy,
  isLoading,
  setCurrentPage,
  updateAccountStatus,
  toggleAdminRole,
  toggleUserVerify,
  forceLogoutUser,
  deleteUser,
  refetchUsers,
}) => {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Suspend Modal State
  const [suspendModal, setSuspendModal] = useState({
    isOpen: false,
    user: null,
    days: 7,
    reason: '',
  });

  // User Details Inspector Modal State
  const [inspectUser, setInspectUser] = useState(null);

  const handleOpenSuspend = (user) => {
    setSuspendModal({
      isOpen: true,
      user,
      days: 7,
      reason: '',
    });
  };

  const handleConfirmSuspend = async () => {
    if (!suspendModal.user) return;
    await updateAccountStatus(
      suspendModal.user._id,
      'suspended',
      Number(suspendModal.days) || 7,
      suspendModal.reason
    );
    setSuspendModal({ isOpen: false, user: null, days: 7, reason: '' });
  };

  return (
    <div className="min-h-screen w-full p-6 md:p-10 space-y-8">
      {/* 🚀 Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-black tracking-tighter text-gray-900 dark:text-white uppercase">
              {t('Users')} <span className="text-indigo-500">{t('Control Center')}</span>
            </h1>
            <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500 text-xs font-black">
              {usersTotal} {t('registered')}
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">
            {t('Manage user privileges, verification, account suspensions, and session state')}
          </p>
        </div>

        {/* View Switcher & Refresh */}
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-2xl border border-gray-200 dark:border-white/10">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2.5 rounded-xl transition-all ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-[#0A0A0A] text-indigo-500 shadow-md'
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-white'
              }`}
            >
              <FiGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2.5 rounded-xl transition-all ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-[#0A0A0A] text-indigo-500 shadow-md'
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-white'
              }`}
            >
              <FiList className="w-4 h-4" />
            </button>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => refetchUsers()}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-500/20 disabled:opacity-50"
          >
            <HiArrowPath className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            {t('Sync')}
          </motion.button>
        </div>
      </div>

      {/* 🔍 Search & Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative group">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
          <input
            type="text"
            placeholder={t('Search by username, email, name...')}
            className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm font-semibold text-gray-900 dark:text-white placeholder-gray-400 transition-all shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Status Filter */}
        <div>
          <select
            className="w-full px-4 py-3.5 bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm font-semibold text-gray-900 dark:text-white cursor-pointer transition-all shadow-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">{t('All Statuses')}</option>
            <option value="active">{t('Active Only')}</option>
            <option value="suspended">{t('Suspended')}</option>
            <option value="banned">{t('Banned')}</option>
          </select>
        </div>

        {/* Role Filter */}
        <div>
          <select
            className="w-full px-4 py-3.5 bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm font-semibold text-gray-900 dark:text-white cursor-pointer transition-all shadow-sm"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">{t('All Roles')}</option>
            <option value="admin">{t('Admins Only')}</option>
            <option value="user">{t('Standard Users')}</option>
          </select>
        </div>

        {/* Sort By */}
        <div>
          <select
            className="w-full px-4 py-3.5 bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm font-semibold text-gray-900 dark:text-white cursor-pointer transition-all shadow-sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">{t('Sort: Newest First')}</option>
            <option value="oldest">{t('Sort: Oldest First')}</option>
            <option value="points">{t('Sort: Top Points')}</option>
            <option value="followers">{t('Sort: Most Followers')}</option>
          </select>
        </div>
      </div>

      {/* 📋 Content: Grid View or Table View */}
      {viewMode === 'grid' ? (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {users?.length > 0 ? (
              users.map((user) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={user._id}
                  className="group relative bg-white dark:bg-[#0A0A0A] border border-gray-100 dark:border-white/5 p-6 rounded-[2.5rem] hover:border-indigo-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 flex flex-col justify-between"
                >
                  <div>
                    {/* Top User Info */}
                    <div className="flex items-start justify-between gap-3 mb-5">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative">
                          <div
                            className={`w-14 h-14 rounded-2xl overflow-hidden ring-4 ${
                              user.isAdmin ? 'ring-indigo-500/30' : 'ring-gray-100 dark:ring-white/5'
                            }`}
                          >
                            <Image
                              src={user.profilePhoto?.url || '/default-profile.png'}
                              alt={user.username}
                              fill
                              className="object-cover"
                            />
                          </div>
                          {user.isAdmin && (
                            <div className="absolute -bottom-1 -right-1 bg-indigo-600 text-white p-1 rounded-lg shadow-sm">
                              <FiShield className="w-3 h-3" />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h3 className="font-black text-sm text-gray-900 dark:text-white truncate">
                              {user.username}
                            </h3>
                            {user.isAccountWithPremiumVerify && (
                              <HiBadgeCheck className="w-4 h-4 text-blue-500 flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-gray-400 truncate">
                            {user.profileName || user.username}
                          </p>
                          <p className="text-[11px] text-gray-400 truncate flex items-center gap-1 mt-0.5">
                            <HiOutlineMail className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{user.email}</span>
                          </p>
                        </div>
                      </div>

                      {/* Detail Inspector Button */}
                      <button
                        onClick={() => setInspectUser(user)}
                        className="w-8 h-8 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-indigo-500 transition-colors flex-shrink-0"
                        title={t('Inspect User')}
                      >
                        <FiEye className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Status & Role Badges */}
                    <div className="flex flex-wrap gap-2 mb-5">
                      {user.isAdmin ? (
                        <span className="px-2.5 py-1 rounded-lg text-[9px] uppercase font-black tracking-wider bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                          Admin
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-lg text-[9px] uppercase font-black tracking-wider bg-gray-500/10 text-gray-400 border border-gray-500/20">
                          User
                        </span>
                      )}

                      {user.accountStatus === 'banned' ? (
                        <span className="px-2.5 py-1 rounded-lg text-[9px] uppercase font-black tracking-wider bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                          {t('Banned')}
                        </span>
                      ) : user.accountStatus === 'suspended' ? (
                        <span className="px-2.5 py-1 rounded-lg text-[9px] uppercase font-black tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          {t('Suspended')}
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-lg text-[9px] uppercase font-black tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          {t('Active')}
                        </span>
                      )}

                      {user.userLevelRank && (
                        <span className="px-2.5 py-1 rounded-lg text-[9px] uppercase font-black tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20">
                          {user.userLevelRank}
                        </span>
                      )}
                    </div>

                    {/* Telemetry Numbers */}
                    <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 mb-5 text-center">
                      <div>
                        <span className="block text-sm font-black text-gray-900 dark:text-white">
                          {user.posts?.length || user.postsCount || 0}
                        </span>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                          {t('Posts')}
                        </span>
                      </div>
                      <div>
                        <span className="block text-sm font-black text-gray-900 dark:text-white">
                          {user.followers?.length || user.followersCount || 0}
                        </span>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                          {t('Followers')}
                        </span>
                      </div>
                      <div>
                        <span className="block text-sm font-black text-gray-900 dark:text-white">
                          {user.userPoints || 0}
                        </span>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                          {t('Points')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Toolbar */}
                  <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-white/5">
                    <div className="grid grid-cols-2 gap-2">
                      {/* Toggle Admin */}
                      <button
                        onClick={() => toggleAdminRole(user._id)}
                        className="py-2 px-3 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-[10px] uppercase tracking-wider hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors flex items-center justify-center gap-1.5"
                      >
                        <FiShield className="w-3.5 h-3.5" />
                        {user.isAdmin ? t('Revoke Admin') : t('Make Admin')}
                      </button>

                      {/* Toggle Verify */}
                      <button
                        onClick={() => toggleUserVerify(user._id)}
                        className="py-2 px-3 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-[10px] uppercase tracking-wider hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors flex items-center justify-center gap-1.5"
                      >
                        <HiBadgeCheck className="w-3.5 h-3.5" />
                        {user.isAccountWithPremiumVerify ? t('Unverify') : t('Verify')}
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {/* Suspend Modal Trigger */}
                      <button
                        onClick={() => handleOpenSuspend(user)}
                        className="py-2 px-2 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-[10px] uppercase tracking-wider hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-colors flex items-center justify-center gap-1"
                      >
                        <FiClock className="w-3 h-3" />
                        {t('Suspend')}
                      </button>

                      {/* Ban / Activate */}
                      <button
                        onClick={() =>
                          updateAccountStatus(
                            user._id,
                            user.accountStatus === 'banned' ? 'active' : 'banned'
                          )
                        }
                        className={`py-2 px-2 rounded-xl font-bold text-[10px] uppercase tracking-wider transition-colors flex items-center justify-center gap-1 ${
                          user.accountStatus === 'banned'
                            ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100'
                            : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-100'
                        }`}
                      >
                        <FiUserX className="w-3 h-3" />
                        {user.accountStatus === 'banned' ? t('Unban') : t('Ban')}
                      </button>

                      {/* Force Logout */}
                      <button
                        onClick={() => forceLogoutUser(user._id)}
                        className="py-2 px-2 rounded-xl bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-[10px] uppercase tracking-wider hover:bg-orange-100 dark:hover:bg-orange-500/20 transition-colors flex items-center justify-center gap-1"
                        title={t('Terminate all user sessions')}
                      >
                        <FiLogOut className="w-3 h-3" />
                        {t('Logout')}
                      </button>
                    </div>

                    {/* Delete Permanently */}
                    <button
                      onClick={() => deleteUser(user._id)}
                      className="w-full py-2 rounded-xl bg-gray-50 dark:bg-white/[0.02] hover:bg-rose-500 hover:text-white dark:hover:bg-rose-600 text-gray-400 font-black text-[9px] uppercase tracking-widest transition-all flex items-center justify-center gap-1.5"
                    >
                      <FiTrash2 className="w-3.5 h-3.5" />
                      {t('Permanently Delete')}
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center">
                <p className="text-gray-400 font-medium">{t('No users found matching your filters')}</p>
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      ) : (
        /* Table View */
        <div className="bg-white dark:bg-[#0A0A0A] rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02]">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    {t('User')}
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    {t('Status')}
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    {t('Role')}
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    {t('Metrics')}
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    {t('Joined')}
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">
                    {t('Actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5 text-xs">
                {users?.length > 0 ? (
                  users.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-gray-50/60 dark:hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl overflow-hidden relative border border-gray-200 dark:border-white/10 flex-shrink-0">
                            <Image
                              src={user.profilePhoto?.url || '/default-profile.png'}
                              alt={user.username}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <p className="font-bold text-gray-900 dark:text-white">
                                {user.username}
                              </p>
                              {user.isAccountWithPremiumVerify && (
                                <HiBadgeCheck className="w-4 h-4 text-blue-500" />
                              )}
                            </div>
                            <p className="text-[11px] text-gray-400">{user.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.accountStatus === 'banned' ? (
                          <span className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider bg-rose-500/10 text-rose-500 border border-rose-500/20">
                            {t('Banned')}
                          </span>
                        ) : user.accountStatus === 'suspended' ? (
                          <span className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/20">
                            {t('Suspended')}
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                            {t('Active')}
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.isAdmin ? (
                          <span className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                            Admin
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider bg-gray-500/10 text-gray-400 border border-gray-500/20">
                            User
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-500 dark:text-gray-400">
                        <span>{user.posts?.length || 0} posts</span> ·{' '}
                        <span>{user.followers?.length || 0} fans</span> ·{' '}
                        <span>{user.userPoints || 0} pts</span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-gray-400 font-medium text-[11px]">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })
                          : '--'}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setInspectUser(user)}
                            className="p-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500 dark:text-gray-300 transition-colors"
                            title={t('Inspect')}
                          >
                            <FiEye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => toggleAdminRole(user._id)}
                            className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition-colors"
                            title={user.isAdmin ? t('Revoke Admin') : t('Make Admin')}
                          >
                            <FiShield className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenSuspend(user)}
                            className="p-2 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-100 transition-colors"
                            title={t('Suspend')}
                          >
                            <FiClock className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              updateAccountStatus(
                                user._id,
                                user.accountStatus === 'banned' ? 'active' : 'banned'
                              )
                            }
                            className={`p-2 rounded-xl transition-colors ${
                              user.accountStatus === 'banned'
                                ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100'
                                : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-100'
                            }`}
                            title={user.accountStatus === 'banned' ? t('Unban') : t('Ban')}
                          >
                            <FiUserX className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => forceLogoutUser(user._id)}
                            className="p-2 rounded-xl bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 hover:bg-orange-100 transition-colors"
                            title={t('Terminate Sessions')}
                          >
                            <FiLogOut className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteUser(user._id)}
                            className="p-2 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition-colors"
                            title={t('Delete User')}
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-gray-400 font-medium">
                      {t('No users found')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 📄 Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-white/5">
          <span className="text-xs text-gray-400 font-medium">
            {t('Page')} <span className="font-bold text-gray-900 dark:text-white">{currentPage}</span> {t('of')}{' '}
            <span className="font-bold text-gray-900 dark:text-white">{totalPages}</span>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage <= 1}
              className="w-10 h-10 rounded-xl bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-white/10 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-white/5 flex items-center justify-center text-gray-700 dark:text-gray-300 transition-all shadow-sm"
            >
              <HiChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage >= totalPages}
              className="w-10 h-10 rounded-xl bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-white/10 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-white/5 flex items-center justify-center text-gray-700 dark:text-gray-300 transition-all shadow-sm"
            >
              <HiChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* ⏰ Suspend Modal */}
      <AnimatePresence>
        {suspendModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white dark:bg-[#0A0A0A] rounded-[2.5rem] border border-gray-200 dark:border-white/10 p-8 shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                    <FiClock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-gray-900 dark:text-white">
                      {t('Suspend User Account')}
                    </h3>
                    <p className="text-xs text-gray-400">@{suspendModal.user?.username}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSuspendModal({ isOpen: false, user: null, days: 7, reason: '' })}
                  className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-white"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
                    {t('Suspension Duration')}
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 3, 7, 30].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setSuspendModal((prev) => ({ ...prev, days: d }))}
                        className={`py-2.5 rounded-xl font-black text-xs transition-all border ${
                          suspendModal.days === d
                            ? 'bg-amber-500 border-amber-500 text-white shadow-md shadow-amber-500/20'
                            : 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300'
                        }`}
                      >
                        {d} {d === 1 ? 'Day' : 'Days'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
                    {t('Suspension Reason')}
                  </label>
                  <textarea
                    rows={3}
                    placeholder={t('Enter the reason for suspension (visible to user)...')}
                    value={suspendModal.reason}
                    onChange={(e) =>
                      setSuspendModal((prev) => ({ ...prev, reason: e.target.value }))
                    }
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-xs font-medium text-gray-900 dark:text-white placeholder-gray-400 resize-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSuspendModal({ isOpen: false, user: null, days: 7, reason: '' })}
                  className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  {t('Cancel')}
                </button>
                <button
                  onClick={handleConfirmSuspend}
                  className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-colors"
                >
                  {t('Confirm Suspend')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 🔍 User Detail Inspector Drawer */}
      <AnimatePresence>
        {inspectUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-end p-0 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="w-full max-w-lg h-full bg-white dark:bg-[#0A0A0A] border-l border-gray-200 dark:border-white/10 p-8 shadow-2xl flex flex-col justify-between overflow-y-auto"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black uppercase tracking-tighter text-gray-900 dark:text-white">
                    {t('User Profile Dossier')}
                  </h3>
                  <button
                    onClick={() => setInspectUser(null)}
                    className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center gap-4 p-5 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden relative border-2 border-indigo-500/30 flex-shrink-0">
                    <Image
                      src={inspectUser.profilePhoto?.url || '/default-profile.png'}
                      alt={inspectUser.username}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-black text-lg text-gray-900 dark:text-white">
                        {inspectUser.username}
                      </h4>
                      {inspectUser.isAccountWithPremiumVerify && (
                        <HiBadgeCheck className="w-5 h-5 text-blue-500" />
                      )}
                    </div>
                    <p className="text-xs text-gray-400">{inspectUser.email}</p>
                    <p className="text-xs text-indigo-500 font-bold mt-1">
                      ID: {inspectUser._id}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block mb-1">
                      {t('Account Status')}
                    </span>
                    <span className="font-bold text-sm capitalize text-gray-900 dark:text-white">
                      {inspectUser.accountStatus || 'active'}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block mb-1">
                      {t('Role Level')}
                    </span>
                    <span className="font-bold text-sm text-gray-900 dark:text-white">
                      {inspectUser.isAdmin ? 'Platform Administrator' : 'Standard Member'}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block mb-1">
                      {t('Joined Date')}
                    </span>
                    <span className="font-bold text-sm text-gray-900 dark:text-white">
                      {inspectUser.createdAt
                        ? new Date(inspectUser.createdAt).toLocaleDateString()
                        : '--'}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block mb-1">
                      {t('Loyalty Points')}
                    </span>
                    <span className="font-bold text-sm text-gray-900 dark:text-white">
                      {inspectUser.userPoints || 0}
                    </span>
                  </div>
                </div>

                {inspectUser.bio && (
                  <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block mb-1">
                      {t('Biography')}
                    </span>
                    <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">
                      {inspectUser.bio}
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-gray-100 dark:border-white/5 flex gap-3">
                <button
                  onClick={() => {
                    toggleAdminRole(inspectUser._id);
                    setInspectUser(null);
                  }}
                  className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-wider transition-colors"
                >
                  {inspectUser.isAdmin ? t('Demote to User') : t('Elevate to Admin')}
                </button>
                <button
                  onClick={() => setInspectUser(null)}
                  className="px-6 py-3 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 font-bold text-xs uppercase tracking-wider"
                >
                  {t('Close')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
});

UserManagePresintation.displayName = 'UserManagePresintation';
export default UserManagePresintation;
