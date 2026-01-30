'use client';
import React from "react";
import Image from "next/image";
import { FiUserCheck, FiUserX, FiTrash2, FiSearch, FiFilter } from "react-icons/fi";
import { HiBadgeCheck, HiOutlineMail, HiOutlineIdentification } from "react-icons/hi";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

const UserManagePresintation = React.memo(({
  search, setSearch, statusFilter, setStatusFilter, setCurrentPage,
  currentPage, currentUsers, makeUserAdmin, updateAccountStatus,
  deleteUser, totalPages
}) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen w-full p-6 md:p-10 space-y-8">
      {/* 🚀 Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-gray-900 dark:text-white uppercase">
            {t("Users")} <span className="text-indigo-500">{t("Management")}</span>
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-2">
            {t("Manage user roles, statuses, and permissions")}
          </p>
        </div>

        {/* 🔍 Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative group w-full sm:w-64">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
            <input
              type="text"
              placeholder={t("Search users...")}
              className="w-full pl-11 pr-4 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium text-gray-800 dark:text-gray-200 placeholder-gray-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="relative w-full sm:w-48">
            <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              className="w-full pl-11 pr-8 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium text-gray-800 dark:text-gray-200 appearance-none cursor-pointer"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">{t("All Users")}</option>
              <option value="admin">{t("Admins")}</option>
              <option value="banned">{t("Banned")}</option>
              <option value="verified">{t("Verified")}</option>
            </select>
          </div>
        </div>
      </div>

      {/* 📋 Users Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {currentUsers?.length > 0 ? (
            currentUsers.map((user) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={user._id}
                className="group relative bg-white dark:bg-[#0A0A0A] border border-gray-100 dark:border-white/5 p-6 rounded-[2rem] hover:border-indigo-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 overflow-hidden"
              >
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-500/10 transition-colors" />

                {/* User Header */}
                <div className="relative flex items-center gap-4 mb-6">
                  <div className="relative">
                    <div className={`w-16 h-16 rounded-2xl overflow-hidden ring-4 ${user.isAdmin ? "ring-indigo-500/30" : "ring-gray-100 dark:ring-white/5"
                      }`}>
                      <Image
                        src={user.profilePhoto?.url || "/default-profile.png"}
                        alt={user.username}
                        fill
                        className="object-cover"
                      />
                    </div>
                    {user.isAdmin && (
                      <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-1 rounded-lg shadow-sm">
                        <FiUserCheck className="w-3 h-3" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate">
                        {user.username}
                      </h3>
                      {user.isAccountWithPremiumVerify && (
                        <HiBadgeCheck className="w-5 h-5 text-blue-500 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user.profileName}</p>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-400">
                      <HiOutlineMail className="w-3.5 h-3.5" />
                      <span className="truncate">{user.email}</span>
                    </div>
                  </div>
                </div>

                {/* Status Badges */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {user.userLevelRank && (
                    <span className="px-3 py-1 rounded-lg text-[10px] uppercase font-bold tracking-wider bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                      {user.userLevelRank}
                    </span>
                  )}
                  {user.accountStatus === 'banned' ? (
                    <span className="px-3 py-1 rounded-lg text-[10px] uppercase font-bold tracking-wider bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                      {t("Banned")}
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-lg text-[10px] uppercase font-bold tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {t("Active")}
                    </span>
                  )}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-2 mb-6">
                  <div className="text-center p-3 rounded-xl bg-gray-50 dark:bg-white/5">
                    <span className="block text-lg font-black text-gray-900 dark:text-white">{user.posts?.length || 0}</span>
                    <span className="text-[10px] uppercase tracking-wider text-gray-500">{t("Posts")}</span>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-gray-50 dark:bg-white/5">
                    <span className="block text-lg font-black text-gray-900 dark:text-white">{user.followers?.length || 0}</span>
                    <span className="text-[10px] uppercase tracking-wider text-gray-500">{t("Fans")}</span>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-gray-50 dark:bg-white/5">
                    <span className="block text-lg font-black text-gray-900 dark:text-white">{user.loginHistory?.length || 0}</span>
                    <span className="text-[10px] uppercase tracking-wider text-gray-500">{t("Logins")}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3">
                  {!user.isAdmin && (
                    <button
                      onClick={() => makeUserAdmin(user._id)}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wide hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors"
                    >
                      <HiOutlineIdentification className="w-4 h-4" /> {t("Promote")}
                    </button>
                  )}
                  <button
                    onClick={() => updateAccountStatus(user._id, user.accountStatus === "banned" ? "active" : "banned")}
                    className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wide transition-colors ${user.accountStatus === 'banned'
                        ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100'
                        : 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 hover:bg-orange-100'
                      }`}
                  >
                    <FiUserX className="w-4 h-4" />
                    {user.accountStatus === "banned" ? t("Unban") : t("Ban")}
                  </button>
                  <button
                    onClick={() => deleteUser(user._id)}
                    className="col-span-2 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 font-bold text-xs uppercase tracking-wide hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
                  >
                    <FiTrash2 className="w-4 h-4" /> {t("Delete Account")}
                  </button>
                </div>

              </motion.div>
            ))
          ) : (
            <motion.div
              layout
              className="col-span-full flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                <FiSearch className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t("No users found")}</h3>
              <p className="text-gray-500 max-w-sm">{t("Try adjusting your search or filter to find what you're looking for.")}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-12 gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-10 h-10 rounded-xl font-bold transition-all ${currentPage === i + 1
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-110"
                  : "bg-white dark:bg-white/5 text-gray-500 hover:bg-gray-50 dark:hover:bg-white/10"
                }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
});

UserManagePresintation.displayName = 'UserManagePresintation';

export default UserManagePresintation;
