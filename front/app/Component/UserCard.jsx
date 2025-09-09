'use client';
import Image from "next/image";
import { useEffect } from "react";

const UserCard = ({ user, isOnline, onSelect, unreadCount = 0 }) => {
  useEffect(() => {
    console.log('UserCard: ', user);
    console.log('isOnline: ', isOnline);
    console.log('unreadCount: ', unreadCount);
  }, [user, isOnline, unreadCount]);

  return (
    <div
      onClick={onSelect}
      className="relative flex items-center gap-3 w-full p-3 rounded-xl 
                 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-all"
    >
      {/* Avatar */}
      <div className="relative">
        <Image
          src={user?.profilePhoto?.url || '/default.jpg'}
          alt="User Profile"
          width={48}
          height={48}
          className="rounded-full w-12 h-12 object-cover"
        />
        {isOnline && (
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 
                          border-2 border-white dark:border-darkMode-bg rounded-full shadow-md"></span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-sm text-black dark:text-white truncate">
            {user.username}
          </span>
          {unreadCount > 0 && (
            <span className="bg-red-600 text-white text-[10px] min-w-[20px] min-h-[20px] 
                             flex items-center justify-center rounded-full font-bold px-1">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </div>
        <span className="text-gray-600 dark:text-gray-400 text-xs truncate block">
          {user.profileName || "Tap to chat"}
        </span>
      </div>
    </div>
  );
};

export default UserCard;
