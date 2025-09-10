'use client';
import React from 'react';
import { useAuth } from '../Context/AuthContext';
import Image from 'next/image';

const MenuFriends = () => {
  const { suggestedUsers , followUser } = useAuth(); // suggestedUsers = [{ _id, username, profilePhoto }]

  return (
    <div className="w-full max-w-sm bg-white dark:bg-[#16181c] rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col max-h-[500px] overflow-hidden">
      
      {/* Header */}
      <div className="flex justify-between items-center px-5 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-gray-800 dark:text-gray-100 font-semibold text-lg">Friends Recommendations</h2>
      </div>

      {/* Friends List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-thumb-rounded-full">
        {suggestedUsers?.length > 0 ? (
          suggestedUsers.map((user) => (
            <div
              key={user._id}
              className="flex items-center justify-between px-5 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-[#1f2124] transition-all rounded-xl group"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Image
                    src={user.profilePhoto?.url || '/default-avatar.png'}
                    alt={user.username}
                    width={52}
                    height={52}
                    className="rounded-full border border-gray-300 dark:border-gray-600 group-hover:ring-2 group-hover:ring-green-500 transition-transform duration-200"
                  />
                  {/* Tooltip */}
                  <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-3 bg-gray-800 dark:bg-gray-200 text-white dark:text-black text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap z-10">
                    {user.username}
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-800 dark:text-gray-100 font-medium">{user.username}</span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">Suggested Friend</span>
                </div>
              </div>

              {/* Follow Button */}
              <button onClick={()=> followUser(user._id)} className="px-4 py-1 bg-blue-600 hover:bg-blue-700 text-white dark:text-white rounded-full text-sm font-medium shadow transition-all">
                Follow
              </button>
            </div>
          ))
        ) : (
          <div className="text-gray-400 text-sm px-5 py-3">No friends to show</div>
        )}
      </div>
    </div>
  );
};

export default MenuFriends;
