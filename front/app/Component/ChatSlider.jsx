'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import { useMessage } from '../Context/MessageContext';
import { useAuth } from '../Context/AuthContext';
import UserCard from './UserCard';

const ChatSlider = () => {
  const {
    users,
    setSelectedUser,
    backgroundStyle,
    markAllAsReadBetweenUsers,
    unreadCountPerUser,
    selectedUser
  } = useMessage();

  const { user, onlineUsers } = useAuth();
  const [searchValue, setSearchValue] = useState("");

  const filteredUsers = users.filter(u =>
    u.username?.toLowerCase().includes(searchValue.toLowerCase()) ||
    u.profileName?.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <aside
      style={backgroundStyle}
      className={`w-full h-screen ${selectedUser ? "hidden lg:flex" : "flex"} flex-col border-r border-gray-300 dark:border-gray-700 bg-lightMode-bg dark:bg-darkMode-bg transition-all`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <Image
            src={user?.profilePhoto?.url || "/default.jpg"}
            width={40}
            height={40}
            alt="User"
            className="rounded-full w-10 h-10 object-cover"
          />
          <div className="flex flex-col">
            <span className="font-semibold text-dark dark:text-white text-sm">{user?.username}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{user?.profileName}</span>
          </div>
        </div>
        <BsThreeDots className="text-xl text-gray-700 dark:text-gray-300 cursor-pointer" />
      </div>

      {/* Search */}
      <div className="p-4">
        <input
          type="search"
          placeholder="Search users..."
          className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkMode-menu text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
        {filteredUsers.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-10 text-sm">No users found.</div>
        ) : (
          filteredUsers.map(u => (
            <UserCard
              key={u._id}
              user={u}
              isOnline={onlineUsers?.includes(u._id)}
              unreadCount={unreadCountPerUser[u._id] || 0}
              onSelect={() => {
                setSelectedUser(u);
                markAllAsReadBetweenUsers(u?._id);
              }}
            />
          ))
        )}
      </div>
    </aside>
  );
};

export default ChatSlider;
