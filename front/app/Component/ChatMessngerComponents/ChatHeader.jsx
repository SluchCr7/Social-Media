'use client';
import Image from 'next/image';
import React from 'react';
import { FiX } from "react-icons/fi";
import { useMessage } from '../../Context/MessageContext';
import { useAuth } from '../../Context/AuthContext';

const ChatHeader = () => {
  const { selectedUser, setSelectedUser , backgroundStyle } = useMessage();
  const { onlineUsers } = useAuth();
  return (
    <div
      className='w-full flex items-center justify-between px-2 py-4'
      // style={backgroundStyle}
    >
      {/* Left: Profile Info */}
      <div className='flex items-center gap-3'>
        <Image
          src={selectedUser?.profilePhoto?.url || '/placeholder.png'}
          alt="Profile"
          width={40}
          height={40}
          className='rounded-full w-10 h-10 object-cover'
        />
        <div className='flex flex-col'>
          <span className='font-medium text-sm text-gray-600'>
            {selectedUser?.username}
          </span>
          <span className={`text-xs ${onlineUsers?.includes(selectedUser?._id) ? 'text-green-400' : 'text-gray-500'}`}>
            {onlineUsers?.includes(selectedUser?._id) ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>

      {/* Right: Close Chat Button */}
      <button
        onClick={() => setSelectedUser(null)}
        className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-600/40 transition-colors"
        title="Close chat"
      >
        <FiX size={18} />
      </button>
    </div>
  );
};

export default ChatHeader;
