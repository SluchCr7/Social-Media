'use client';
import React from 'react';
import { useAuth } from '../../Context/AuthContext';
import Image from 'next/image';
import { FiUserPlus } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useUser } from '@/app/Context/UserContext';

const MenuFriends = () => {
  const {  user } = useAuth();
  const {suggestedUsers, followUser,setShowAllSuggestedUsers} = useUser()
  const hasSuggestions = Array.isArray(suggestedUsers) && suggestedUsers.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-sm bg-white dark:bg-[#16181c] rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 flex flex-col max-h-[500px] overflow-hidden"
    >
      {/* Header */}
      <div className="flex justify-between items-center px-5 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-500 to-indigo-500">
        <h2 className="text-white font-semibold text-lg">Friends Recommendations</h2>
      </div>

      {/* Friends List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-thumb-rounded-full">
        {hasSuggestions ? (
          <>
            {suggestedUsers.slice(0, 3).map((userData, index) => {
              // === user status logic ===
              const isFriend =
                userData.following?.includes(user?._id) &&
                userData.followers?.includes(user?._id);

              const createdAt = userData.createdAt ? new Date(userData.createdAt) : null;
              const isNew =
                createdAt &&
                (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24) < 7;

              const myFollowing = Array.isArray(user?.following) ? user.following : [];
              const hisFollowing = Array.isArray(userData.following) ? userData.following : [];
              const mutualFriends = myFollowing.filter((id) => hisFollowing.includes(id));

              const posts = Array.isArray(userData.posts) ? userData.posts : [];

              const statusMessage = isFriend
                ? 'You are friends'
                : isNew
                ? 'New here – welcome!'
                : mutualFriends.length > 0
                ? `${mutualFriends.length} mutual friends`
                : posts.length > 50
                ? 'Active member'
                : 'Suggested for you';

              return (
                <motion.div
                  key={userData._id}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between px-5 py-3 hover:bg-gray-100 dark:hover:bg-[#1f2124] transition-all rounded-xl group cursor-pointer"
                >
                  {/* User Info */}
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Image
                        src={userData.profilePhoto?.url || '/default-avatar.png'}
                        alt={userData.username}
                        width={42}
                        height={42}
                        className="rounded-full border border-gray-300 dark:border-gray-600 group-hover:scale-105 transition-transform duration-200 shadow"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-800 dark:text-gray-100 font-medium text-sm">
                        {userData.username}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 text-xs">
                        {statusMessage}
                      </span>
                    </div>
                  </div>

                  {/* Follow Button */}
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => followUser(userData._id)}
                    className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow transition"
                    aria-label="Follow"
                  >
                    <FiUserPlus size={18} />
                  </motion.button>
                </motion.div>
              );
            })}

            {/* Show All Button → يظهر بس لو أكثر من 3 */}
            {suggestedUsers.length > 3 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAllSuggestedUsers(true)}
                className="w-[90%] mx-auto my-3 py-2 font-semibold text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 rounded-lg transition-all duration-300 hover:bg-blue-600 hover:text-white"
              >
                Show All Users
              </motion.button>
            )}
          </>
        ) : (
          <div className="text-gray-400 text-sm px-5 py-6 text-center">No friends to show</div>
        )}
      </div>
    </motion.div>
  );
};

export default MenuFriends;
