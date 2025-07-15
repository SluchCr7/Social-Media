'use client';
import React from 'react';
import { useMessage } from '../Context/MessageContext';
import Image from 'next/image';

const MenuFrinds = () => {
  const { users } = useMessage(); // users = [{ _id, username, profileImage }]

  return (
    <div className="fixed top-20 right-4 z-50 w-16 p-2 rounded-2xl bg-white dark:bg-darkMode-menu shadow-lg flex flex-col items-center gap-4 border dark:border-gray-700">
      {users?.length > 0 ? (
        users.map((user) => (
          <div key={user._id} className="group relative cursor-pointer">
            <Image
              src={user.profileImage || '/default-avatar.png'}
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
        <div className="text-gray-400 text-sm">No friends</div>
      )}
    </div>
  );
};

export default MenuFrinds;
