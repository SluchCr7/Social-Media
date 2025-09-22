'use client';
import React, { useEffect } from 'react';
import { useAuth } from '@/app/Context/AuthContext';
import Image from 'next/image';
import { FiTrash2, FiUserCheck, FiUserX } from 'react-icons/fi';
import { HiBadgeCheck } from "react-icons/hi";

const AdminUsersPage = () => {
  const { users, deleteUser, blockOrUnblockUser,updateAccountStatus, makeAccountPremiumVerify,makeUserAdmin } = useAuth();

  return (
    <div className="min-h-screen p-8 bg-lightMode-bg dark:bg-darkMode-bg w-full">
      <h1 className="text-3xl font-bold mb-8 text-lightMode-text2 dark:text-darkMode-text2">
        Users Management
      </h1>

      <div className="space-y-6">
        {users.map(user => (
          <div
            key={user._id}
            className="bg-white dark:bg-darkMode-card p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center gap-4 mb-4">
                <div className="w-[50px] h-[50px] rounded-full overflow-hidden">
                    <Image
                        src={user.profilePhoto?.url || '/default-profile.png'}
                        alt={user.username}
                        width={50}
                        height={50}
                        className="w-full h-full object-cover"
                    />
                </div>

                <div>
                    <p className="font-semibold text-lightMode-text2 dark:text-darkMode-text2">{user.username}</p>
                    <p className="text-sm text-gray-500">{user.profileName}</p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <p className="font-bold">{user.posts?.length || 0}</p>
                <p className="text-xs text-gray-500">Posts</p>
              </div>
              <div className="text-center">
                <p className="font-bold">{user.comments?.length || 0}</p>
                <p className="text-xs text-gray-500">Comments</p>
              </div>
              <div className="text-center">
                <p className="font-bold">{user.followers?.length || 0}</p>
                <p className="text-xs text-gray-500">Followers</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {user.isAdmin && <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">Admin</span>}
              {user.accountStatus === 'banned' && <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full">Banned</span>}
              {user.isAccountWithPremiumVerify && <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full"><HiBadgeCheck/></span>}
              {user.isPrivate && <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">Private</span>}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              {!user.isAdmin && (
                <button
                  onClick={() => makeUserAdmin(user._id)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition"
                >
                  <FiUserCheck /> Make Admin
                </button>
              )}
              <button
                onClick={() => updateAccountStatus(user._id , "banned")}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-yellow-600 text-white rounded-xl hover:bg-yellow-500 transition"
              >
                <FiUserX /> {user.accountStatus === 'banned' ? 'Unban' : 'Ban'}
              </button>
              <button
                onClick={() => deleteUser(user._id)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-600 text-white rounded-xl hover:bg-red-500 transition"
              >
                <FiTrash2 /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminUsersPage;
