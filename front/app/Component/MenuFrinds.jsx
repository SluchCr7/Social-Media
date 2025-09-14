'use client';
import React from 'react';
import { useAuth } from '../Context/AuthContext';
import Image from 'next/image';
import { FiUserPlus } from 'react-icons/fi';

const MenuFriends = () => {
  const { suggestedUsers, followUser, user , setShowAllSuggestedUsers } = useAuth();

  return (
    <div className="w-full max-w-sm bg-white dark:bg-[#16181c] rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col max-h-[500px] overflow-hidden">
      
      {/* Header */}
      <div className="flex justify-between items-center px-5 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-gray-800 dark:text-gray-100 font-semibold text-lg">Friends Recommendations</h2>
      </div>

      {/* Friends List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-thumb-rounded-full">
        {suggestedUsers?.length > 0 ? (
          <>
            {
              suggestedUsers.slice(0,3).map((userData) => (
                <div
                  key={userData._id}
                  className="flex items-center justify-between px-5 py-3 hover:bg-gray-100 dark:hover:bg-[#1f2124] transition-all rounded-xl group"
                >
                  {/* User Info */}
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Image
                        src={userData.profilePhoto?.url || '/default-avatar.png'}
                        alt={userData.username}
                        width={42}
                        height={42}
                        className="rounded-full border border-gray-300 dark:border-gray-600 group-hover:ring-2 group-hover:ring-green-500 transition-transform duration-200"
                      />
                      {/* Tooltip */}
                      <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-3 bg-gray-800 dark:bg-gray-200 text-white dark:text-black text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap z-10">
                        {userData.username}
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-800 dark:text-gray-100 font-medium text-sm">{userData.username}</span>
                      <span className="text-gray-500 dark:text-gray-400 text-xs">
                        {userData.following?.includes(user?._id) && userData.followers?.includes(user?._id)
                          ? "You are friends"
                          : (() => {
                              // check new user (created < 7 days ago)
                              const createdAt = userData.createdAt ? new Date(userData.createdAt) : null;
                              const isNew = createdAt ? ((Date.now() - createdAt) / (1000 * 60 * 60 * 24) < 7) : false;

                              if (isNew) return "New here – welcome!";

                              // mutual friends
                              const myFollowing = Array.isArray(user?.following) ? user.following : [];
                              const hisFollowing = Array.isArray(userData.following) ? userData.following : [];
                              const mutualFriends = myFollowing.filter((id) => hisFollowing.includes(id));

                              if (mutualFriends.length > 0) return `${mutualFriends.length} mutual friends`;

                              // active member check
                              const posts = Array.isArray(userData.posts) ? userData.posts : [];
                              if (posts.length > 50) return "Active member";

                              // fallback
                              return "Suggested for you";
                            })()
                        }

                      </span>
                    </div>
                  </div>
  
                  {/* Follow Icon Button */}
                  <button
                    onClick={() => followUser(userData._id)}
                    className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow transition"
                    aria-label="Follow"
                  >
                    <FiUserPlus size={18} />
                  </button>
                </div>
              ))
            }
            <button onClick={()=> setShowAllSuggestedUsers(true)} className='w-[90%] mx-auto p-3 font-bold text-lightMode-fg dark:text-darkMode-fg border border-lightMode-fg dark:border-darkMode-fg hover:scale-110 transition-all duration-500'>
              Show All Users
            </button>
          </>
        ) : (
          <div className="text-gray-400 text-sm px-5 py-3">No friends to show</div>
        )}
      </div>
    </div>
  );
};

export default MenuFriends;
