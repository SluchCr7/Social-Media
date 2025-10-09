'use client';
import Image from 'next/image';
import React from 'react';
import { FiX } from "react-icons/fi";
import { useMessage } from '../../Context/MessageContext';
import { useAuth } from '../../Context/AuthContext';

const ChatHeader = () => {
  const { selectedUser, setSelectedUser, backgroundStyle } = useMessage();
  const { onlineUsers } = useAuth();

  const isOnline = onlineUsers?.includes(selectedUser?._id);

  return (
    <div
      className="w-full flex items-center justify-between px-3 sm:px-4 py-3 sm:py-4
                 bg-white dark:bg-darkMode-menu border-b border-gray-200 dark:border-gray-700"
      // style={backgroundStyle}
    >
      {/* ✅ Left Section - User Info */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <Image
          src={selectedUser?.profilePhoto?.url || '/placeholder.png'}
          alt="Profile"
          width={40}
          height={40}
          className="rounded-full w-9 h-9 sm:w-10 sm:h-10 object-cover"
        />

        <div className="flex flex-col min-w-0">
          <span
            className="font-medium text-sm sm:text-base text-gray-800 dark:text-gray-200 truncate max-w-[120px] sm:max-w-[160px]"
            title={selectedUser?.username}
          >
            {selectedUser?.username || "Unknown"}
          </span>

          <span
            className={`text-[11px] sm:text-xs ${
              isOnline ? 'text-green-500' : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>

      {/* ✅ Right Section - Close Button */}
      <button
        onClick={() => setSelectedUser(null)}
        className="p-2 rounded-md text-gray-500 dark:text-gray-300 
                   hover:bg-gray-100 dark:hover:bg-gray-700/60 
                   transition-colors flex-shrink-0"
        title="Close chat"
      >
        <FiX size={20} />
      </button>
    </div>
  );
};

export default ChatHeader;
