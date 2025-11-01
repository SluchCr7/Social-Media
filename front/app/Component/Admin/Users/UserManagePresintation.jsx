'use client';
import React from "react";
import Image from "next/image";
import { FiUserCheck, FiUserX, FiTrash2 } from "react-icons/fi";
import { HiBadgeCheck } from "react-icons/hi";
import { useTranslation } from "react-i18next";

const UserManagePresintation = React.memo(({
  search, setSearch, statusFilter, setStatusFilter, setCurrentPage,
  currentPage, currentUsers, makeUserAdmin, updateAccountStatus,
  deleteUser, totalPages
}) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen p-8 bg-lightMode-bg dark:bg-darkMode-bg w-full max-w-[1200px] mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-lightMode-text2 dark:text-darkMode-text2">
        {t("Users Management")}
      </h1>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 items-start sm:items-center">
        <input
          type="text"
          placeholder={t("Search users...")}
          className="flex-1 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 transition bg-gray-50 dark:bg-darkMode-card text-gray-800 dark:text-gray-200"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 transition bg-gray-50 dark:bg-darkMode-card text-gray-800 dark:text-gray-200"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">{t("All Users")}</option>
          <option value="admin">{t("Admins")}</option>
          <option value="banned">{t("Banned")}</option>
          <option value="verified">{t("Verified")}</option>
        </select>
      </div>

      {/* Users List */}
      <div className="space-y-6">
        {currentUsers?.length > 0 ? (
          currentUsers.map((user) => (
            <div
              key={user._id}
              className="bg-white dark:bg-darkMode-card p-6 rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition-transform border border-gray-200 dark:border-gray-700"
            >
              {/* User Info */}
              <div className="flex items-center gap-4 mb-4">
                <div
                  className={`w-[50px] h-[50px] rounded-full overflow-hidden ring-2 ${
                    user.isAdmin
                      ? "ring-blue-500 dark:ring-blue-400"
                      : "ring-transparent"
                  }`}
                >
                  <Image
                    src={user.profilePhoto?.url || "/default-profile.png"}
                    alt={user.username}
                    width={50}
                    height={50}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <p className="font-bold text-lg text-lightMode-text2 dark:text-darkMode-text2">
                    {user.username}
                  </p>
                  <p className="text-sm text-gray-500">{user.profileName}</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="flex flex-col items-center justify-center p-2 hover:bg-gray-100 dark:hover:bg-darkMode-hover rounded-lg transition">
                  <span>📄</span>
                  <p className="font-bold">{user.posts?.length || 0}</p>
                  <p className="text-xs text-gray-500">{t("Posts")}</p>
                </div>
                <div className="flex flex-col items-center justify-center p-2 hover:bg-gray-100 dark:hover:bg-darkMode-hover rounded-lg transition">
                  <span>💬</span>
                  <p className="font-bold">{user.comments?.length || 0}</p>
                  <p className="text-xs text-gray-500">{t("Comments")}</p>
                </div>
                <div className="flex flex-col items-center justify-center p-2 hover:bg-gray-100 dark:hover:bg-darkMode-hover rounded-lg transition">
                  <span>👥</span>
                  <p className="font-bold">{user.followers?.length || 0}</p>
                  <p className="text-xs text-gray-500">{t("Followers")}</p>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                {user.isAdmin && (
                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full flex items-center gap-1">
                    <FiUserCheck /> {t("Admin")}
                  </span>
                )}
                {user.accountStatus === "banned" && (
                  <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full flex items-center gap-1">
                    🚫 {t("Banned")}
                  </span>
                )}
                {user.isAccountWithPremiumVerify && (
                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full flex items-center gap-1">
                    <HiBadgeCheck /> {t("Verified")}
                  </span>
                )}
                {user.isPrivate && (
                  <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                    {t("Private")}
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                {!user.isAdmin && (
                  <button
                    onClick={() => makeUserAdmin(user._id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:scale-105 hover:shadow-lg transition-transform"
                  >
                    <FiUserCheck /> {t("Make Admin")}
                  </button>
                )}
                <button
                  onClick={() =>
                    updateAccountStatus(
                      user._id,
                      user.accountStatus === "banned" ? "active" : "banned"
                    )
                  }
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-orange-400 to-yellow-500 text-white rounded-xl hover:scale-105 hover:shadow-lg transition-transform"
                >
                  <FiUserX />{" "}
                  {user.accountStatus === "banned" ? t("Unban") : t("Ban")}
                </button>
                <button
                  onClick={() => deleteUser(user._id)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:scale-105 hover:shadow-lg transition-transform"
                >
                  <FiTrash2 /> {t("Delete")}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-10">
            {t("No users found.")}
          </p>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === i + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                } hover:bg-blue-500 hover:text-white transition`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});
UserManagePresintation.displayName = 'UserManagePresintation'

export default UserManagePresintation;
