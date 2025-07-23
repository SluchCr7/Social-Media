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
      className="relative flex items-center gap-3 w-full p-3 rounded-lg hover:bg-fg/10 cursor-pointer transition-all"
    >
      {/* Avatar */}
      <div className="relative">
        <Image
          src={user?.profilePhoto?.url || '/default.jpg'}
          alt="User Profile"
          width={40}
          height={40}
          className="rounded-full w-10 h-10 object-cover"
        />
        {isOnline && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-darkMode-bg rounded-full"></span>
        )}
      </div>

      {/* Info */}
      <div className="hidden md:flex flex-col">
        <span className="font-medium text-sm">{user.username}</span>
        <span className="text-gray-800 dark:text-gray-400 text-xs">{user.profileName}</span>
      </div>

      {/* 🔴 Unread messages badge */}
      {unreadCount > 0 && (
        <div className="absolute right-2 top-2 bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold min-w-[20px] text-center">
          {unreadCount > 99 ? '99+' : unreadCount}
        </div>
      )}
    </div>
  );
};

export default UserCard;
