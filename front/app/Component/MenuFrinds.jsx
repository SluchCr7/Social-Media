'use client';
import React from 'react';
import { useMessage } from '../Context/MessageContext';
import Image from 'next/image';
import { useAuth } from '../Context/AuthContext';

const MenuFrinds = () => {
  const { users , suggestedUsers } = useAuth(); // users = [{ _id, username, profileImage }]

  return (
    <div className="w-full bg-white dark:bg-[#16181c] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col max-h-[500px]">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-lightMode-fg/40 dark:border-darkMode-fg/40">
        <h2 className="text-lightMode-fg dark:text-darkMode-fg text-lg font-semibold">Friends Recommendations</h2>
      </div>
      {suggestedUsers?.length > 0 ? (
        suggestedUsers.map((user) => (
          <div key={user._id} className="group relative px-4 py-2 cursor-pointer">
            <Image
              src={user.profilePhoto.url || '/default-avatar.png'}
              alt={user.username}
              width={48}
              height={48}
              className="rounded-full border border-gray-300 dark:border-gray-600 hover:ring-2 hover:ring-green-500 transition"
            />
            <div className="absolute top-1/2 right-14 transform -translate-y-1/2 bg-black text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10">
              {user.username}
            </div>
          </div>
        ))
      ) : (
        <div className="text-gray-400 text-sm px-4 py-2">No friends to show</div>
      )}
    </div>
  );
};

export default MenuFrinds;
